import Observable from "./observable";
import WebComponent from "./web.component";


export class TemplateParser {


  static PARSED_ATTRIBUTE_KEY_START = '__data-bind:';
  static PARSED_ATTRIBUTE_KEY_END = ':data-bind__';

  private _binders: Record<NodeTypes, Binder> = {
    [NodeTypes.HTML_ELEMENT]: new HTMLElementBinder(NodeTypes.HTML_ELEMENT),
    [NodeTypes.TEXT_NODE]: new TextNodeBinder(NodeTypes.TEXT_NODE)
  }

  private _attributeNodeMap: Map<string, Set<Node>> = new Map();

  constructor(private _instance: WebComponent) {
    const boundChangeObs$: Observable<Record<string, any>, Record<string, any>> = this._instance.boundPropertiesChange$;
    boundChangeObs$.subscribe(data => {
      Object.entries(data).forEach(([k,v]) => {
        const nodesBoundToK = this._attributeNodeMap.get(k);
        if (nodesBoundToK) {
          Array.from(nodesBoundToK).forEach(n => this._recursiveTraversal(n))
        }
      })
    })

  }

  async parse(): Promise<HTMLTemplateElement>{
    const parsedHtml = this._instance.html.replaceAll('{{', TemplateParser.PARSED_ATTRIBUTE_KEY_START).replaceAll('}}', TemplateParser.PARSED_ATTRIBUTE_KEY_END);
    const isolatedDomTree = document.createElement('template')
    isolatedDomTree.innerHTML = parsedHtml;
    this._recursiveTraversal(isolatedDomTree.content);
    return isolatedDomTree;
  }

  private _recursiveTraversal(node: Node) {
    const binderForCurrentNode = this._binders[node.nodeType];
    const hasBindings: boolean = binderForCurrentNode?.hasBoundNode(node) || Binder.checkIfAnyBindings(node);
    if (hasBindings) {
      if (binderForCurrentNode) {
        const boundDescriptor = binderForCurrentNode.bind(node, this._instance);
        boundDescriptor.boundProperties.forEach((propKey) => {
          this._attributeNodeMap.set(propKey, (this._attributeNodeMap.get(propKey) || new Set()).add(node))
        })
      } else {
        console.error(`Cannot bind to node ${node.nodeName} of type ${node.nodeType}`);
      }
    }

    node.childNodes && [...node.childNodes].forEach(n => requestAnimationFrame(() => this._recursiveTraversal(n)));
  };
}
export enum NodeTypes {
  HTML_ELEMENT = Node.ELEMENT_NODE,
  TEXT_NODE = Node.TEXT_NODE
}

interface NodeBoundsDescriptors<T extends Node = Node> {
  node: T;
  boundProperties: string[];
}

abstract class Binder<T extends Node = Node, D = any> {

  public static checkIfAnyBindings(node: Node): boolean {
    switch (node.nodeType) {
      case NodeTypes.HTML_ELEMENT:
        {
          let nodeAsHTMLEl = node as HTMLElement;
          return nodeAsHTMLEl.getAttributeNames().filter(attr =>  nodeAsHTMLEl.getAttribute(attr).includes('__data-bind:')).length > 0;
        }
      case NodeTypes.TEXT_NODE: {
        return node.textContent.includes('__data-bind:')
      }
      default:
        return false;
    }
  }

  public static traverseTree(namespaceToTraverse: string[], root: object | WebComponent): any {
    return namespaceToTraverse.reduce((acc, curr) => acc ? acc[curr] : acc, root)

  }

  protected _nodeOriginalTemplateMap: WeakMap<T, D> = new WeakMap();

  constructor(public targetNodeType: NodeTypes) {}

  public bind(node: T, instance: WebComponent): NodeBoundsDescriptors<T> {

    if (node.nodeType !== this.targetNodeType) {
      throw new Error(`
        Binder for node type ${this.targetNodeType} has been fed with incorrect node type ${node.nodeType}
      `)
    }
    if (!this._nodeOriginalTemplateMap.has(node)) {
      this._nodeOriginalTemplateMap.set(node, this._getNodeStateForBinding(node))
    }
    const nodeStateForBinding = this._nodeOriginalTemplateMap.get(node);

    return this._bind(node, nodeStateForBinding, instance)
  }

  public hasBoundNode(node): boolean {
    return this._nodeOriginalTemplateMap.has(node);
  }

  protected abstract _getNodeStateForBinding(node: T): D

  protected abstract _bind(node: T, nodeStateForBinding: D, instance: WebComponent): NodeBoundsDescriptors<T>
}

interface AttributeWithPropBindings<T extends Node = Node> {
  name: string;
  value: any;
  propName: string;
  setter: any;
  node: T,
  instance: WebComponent
}

export class TextNodeBinder extends Binder<Node, string> {

  protected _bind(node: Node, nodeStateForBinding: string, instance: WebComponent): NodeBoundsDescriptors {
    const templateToElabeorate = nodeStateForBinding;
    const matcher = new RegExp(`${TemplateParser.PARSED_ATTRIBUTE_KEY_START}(.*)${TemplateParser.PARSED_ATTRIBUTE_KEY_END}`, 'g');
    const propNames = Array.from(templateToElabeorate.matchAll(matcher)).map(([_, propName]) => propName)
    const keysWithValyes = propNames.reduce((acc,  bindedPropName) => {
      const bindedPropNameNodesTraversal = bindedPropName.split('.');
      const bindedPropValue = Binder.traverseTree(bindedPropNameNodesTraversal, instance)
      acc[bindedPropName] = bindedPropValue;
      return acc;
    }, {})

    const clearedFromBindFlags = templateToElabeorate.replaceAll(TemplateParser.PARSED_ATTRIBUTE_KEY_START, '').replaceAll(TemplateParser.PARSED_ATTRIBUTE_KEY_END, '');
    const hydratedContent = Array.from(Object.entries(keysWithValyes)).reduce((acc, [key, val]) => acc.replace(key, String(val)), clearedFromBindFlags)
    node.textContent = hydratedContent;

    return {
      node,
      boundProperties: propNames.map(prop => prop.split('.')[0])
    }
  }

  protected _getNodeStateForBinding(node: Node): string {
    return node.textContent;
  }
}

export class HTMLElementBinder extends Binder<HTMLElement, Attr[]> {

  private _attributeBinders: Record<string, (bindings: AttributeWithPropBindings) => void> = {
    value: this._bindValue.bind(this),
    name: this._bindName.bind(this),
    class: this._bindClass.bind(this),
    style: this._bindStyle.bind(this),
  };

  private _eventHandlersNodeMap: WeakMap<Node, Record<HTMLElementEventMap & string, (e: Event) => void>> = new WeakMap()


  protected _bind(node: HTMLElement, nodeStateForBinding: Attr[], instance: WebComponent): NodeBoundsDescriptors<HTMLElement> {
    const attributesNodeToBind = nodeStateForBinding;
    const attributesWithProps: AttributeWithPropBindings[] = attributesNodeToBind.map(attr => this._mergeAttributesWithProps(node, instance, attr));

    attributesWithProps.forEach((bindings) => {
      const {name, value} = bindings;
      const attributeBinder = this._attributeBinders[name];
      if (attributeBinder) {
        attributeBinder(bindings)
      } else {
        node.setAttribute(name, String(value))
      }
    });

    return {
      node,
      boundProperties: attributesWithProps.map(({propName}) => propName.split('.')[0])
    }
  }


  protected _getNodeStateForBinding(node: HTMLElement): Attr[] {
    const attributes = node.getAttributeNames();
    const attributesToBind = attributes.filter(attr => node.getAttribute(attr).includes(TemplateParser.PARSED_ATTRIBUTE_KEY_START));
    const attributesNodeToBind = attributesToBind.map(attr => node.getAttributeNode(attr).cloneNode() as Attr);
    return attributesNodeToBind
  }

  private _mergeAttributesWithProps(node: HTMLElement, instance: WebComponent, attr: Attr): AttributeWithPropBindings {
      const bindedPropName = attr.value
      .replace(TemplateParser.PARSED_ATTRIBUTE_KEY_START, '')
      .replace(TemplateParser.PARSED_ATTRIBUTE_KEY_END, '');

      const notAlphaNumericOrPeriod = /[^a-z.A-Z0-9]/g;
      const clearedPropName = bindedPropName.replaceAll(notAlphaNumericOrPeriod, '');
      const bindedPropNameNodesTraversal = clearedPropName.split('.');
      let setter = (value) => {
        const rootKey = bindedPropNameNodesTraversal[0];
        if (typeof instance[rootKey] === 'object' && bindedPropNameNodesTraversal.length > 1) {
          const rootObjectClone = {...instance[rootKey]};
          const lastKey = bindedPropNameNodesTraversal[bindedPropNameNodesTraversal.length - 1];
          const traversalWithNoRootAndLeaf = [...bindedPropNameNodesTraversal].slice(1, -1);
          const lastNode = Binder.traverseTree(traversalWithNoRootAndLeaf, rootObjectClone)
          lastNode[lastKey] = value;
          instance[rootKey] = rootObjectClone;
        } else {
          instance[rootKey] = value;
        }
      };

      const propToBind = Binder.traverseTree(bindedPropNameNodesTraversal, instance);
      return { name: attr.name, value: propToBind, propName: clearedPropName, setter, node, instance };
  }

  private _bindName({name, propName, value, setter, node}: AttributeWithPropBindings<HTMLInputElement | HTMLFormElement>): void {
    if (value == undefined) {
      return;
    }

    const isRadio = node.getAttribute('type') === 'radio';
    const isCheckbox = node.getAttribute('type') === 'checkbox';
    if (isRadio) {
      node.checked = node.value === value;
      this._attachEventListener(node, 'click', e => {
        setter((e.target as HTMLInputElement).value);
      });
    } else if (isCheckbox) {
      const notArray = !Array.isArray(value);
      if (notArray) {
        throw new Error('Checkox binded value must be an array');
      }
      node.checked = value.includes(node.value);
      this._attachEventListener(node, 'click', e => {
        node.checked;
        const target = e.target  as HTMLInputElement;
        setter(node.checked ? value.concat(target.value) : value.filter(v => v !== target.value));
      });
    }

    node.setAttribute(name, propName);
  }

  private _bindValue({name, value, setter, node}: AttributeWithPropBindings<HTMLInputElement>) {
    const setValue = (e: Event) => {
      const newValue = (e.target as HTMLInputElement).value;
      setter(newValue);
    };
      this._attachEventListener(node, 'input', setValue);
      this._attachEventListener(node, 'change', setValue);

      const isDate = node.getAttribute('type') === 'date';
      if (isDate) {
        node.valueAsDate = value;
      } else {
        node.setAttribute(name, value);
      }
  }

  private _attachEventListener(node: HTMLElement, event: keyof HTMLElementEventMap, handler: (e: Event) => void) {
    const previousHandlers = this._eventHandlersNodeMap.get(node);
    if (previousHandlers && previousHandlers[event]) {
      return;
    }

    node.addEventListener(event, handler)
    this._eventHandlersNodeMap.set(node, {...(previousHandlers || {}), [event]: handler})
  }

  private _bindClass({value, node}: AttributeWithPropBindings<HTMLInputElement>): void {
    if (!Array.isArray(value)) {
      throw new Error('Bounded value to class attribute must be an array')
    }
    node.className = value.join(' ')
  }

  private _bindStyle({value, node}: AttributeWithPropBindings<HTMLInputElement>): void {
    const isObject = typeof value == 'object' && !Array.isArray(value);
    if (!isObject) {
      throw new Error('Bounded value to style attribute must be an object')
    }

    const keyVals = Array.from(Object.entries(value));
    node.setAttribute('style', keyVals.flatMap(pair => pair.join(':')).join(';'))
  }
}

