import WebComponent from "./web.component";


export class TemplateParser {

  static PARSED_ATTRIBUTE_KEY_START = '__data-bind:';
  static PARSED_ATTRIBUTE_KEY_END = ':data-bind__';

  private _binders: Record<NodeTypes, Binder> = {
    [NodeTypes.HTML_ELEMENT]: new HTMLElementBinder(NodeTypes.HTML_ELEMENT),
    [NodeTypes.TEXT_NODE]: new TextNodeBinder(NodeTypes.TEXT_NODE)
  }

  async parse(instance: WebComponent): Promise<HTMLTemplateElement>{
    const parsedHtml = instance.html.replaceAll('{{', TemplateParser.PARSED_ATTRIBUTE_KEY_START).replaceAll('}}', TemplateParser.PARSED_ATTRIBUTE_KEY_END);
    const isolatedDomTree = document.createElement('template')
    isolatedDomTree.innerHTML = parsedHtml;

    const recursiveTraversal = async (node: Node, instance: WebComponent) => {
      const hasBindings = Binder.checkIfAnyBindings(node);
      if (hasBindings) {
        const binderForCurrentNode = this._binders[node.nodeType];
        if (binderForCurrentNode) {
          binderForCurrentNode.bind(node, instance);
        } else {
          console.error(`Cannot bind to node ${node.nodeName} of type ${node.nodeType}`);
        }
      }

      node.childNodes && [...node.childNodes].forEach(n => recursiveTraversal(n, instance));
    };

    recursiveTraversal(isolatedDomTree.content, instance);
    return isolatedDomTree;
  }
}
export enum NodeTypes {
  HTML_ELEMENT = Node.ELEMENT_NODE,
  TEXT_NODE = Node.TEXT_NODE
}

abstract class Binder<T extends Node = Node> {

  public static checkIfAnyBindings(node: Node) {
    switch (node.nodeType) {
      case NodeTypes.HTML_ELEMENT:
        {
          let nodeAsHTMLEl = node as HTMLElement;
          return nodeAsHTMLEl.getAttributeNames().filter(attr =>  nodeAsHTMLEl.getAttribute(attr).includes('__data-bind:'));
        }
      case NodeTypes.TEXT_NODE: {
        return node.textContent.includes('__data-bind:')
      }
      default:
        return false;
    }
  }

  constructor(public targetNodeType: NodeTypes) {}

  public bind(node: T, instance: WebComponent): void {

    if (node.nodeType !== this.targetNodeType) {
      throw new Error(`
        Binder for node type ${this.targetNodeType} has been fed with incorrect node type ${node.nodeType}
      `)
    }

    this._bind(node, instance)
  }

  protected abstract _bind(node: T, instance: WebComponent): void
}

interface AttributeWithPropBindings<T extends Node = Node> {
  name: string;
  value: any;
  propName: string;
  setter: any;
  node: T,
  instance: WebComponent
}

export class TextNodeBinder extends Binder {
  protected _bind(node: Node, instance: WebComponent): void {
    const matcher = new RegExp(`${TemplateParser.PARSED_ATTRIBUTE_KEY_START}(.*)${TemplateParser.PARSED_ATTRIBUTE_KEY_END}`, 'g');
    const propNames: Record<string, any> = Array.from(node.textContent.matchAll(matcher))
    .reduce((acc, [_, bindedPropName]) => {
      const bindedPropNameNodesTraversal = bindedPropName.split('.');
      const bindedPropValue = bindedPropNameNodesTraversal.reduce((acc, curr) => acc[curr], instance)
      acc[bindedPropName] = bindedPropValue;
      return acc;
    }, {})

    const clearedFromBindFlags = node.textContent.replaceAll(TemplateParser.PARSED_ATTRIBUTE_KEY_START, '').replaceAll(TemplateParser.PARSED_ATTRIBUTE_KEY_END, '');
    const hydratedContent = Array.from(Object.entries(propNames)).reduce((acc, [key, val]) => acc.replace(key, val.toString()), clearedFromBindFlags)
    node.textContent = hydratedContent;
    console.log(node.textContent)
  }
}

export class HTMLElementBinder extends Binder<HTMLElement> {

  private _attributeBinders: Record<string, (bindings: AttributeWithPropBindings) => void> = {
    value: this._bindValue,
    name: this._bindName,
  };


  protected _bind(node: HTMLElement, instance: WebComponent) {
    const attributes = node.getAttributeNames();
    const attributesToBind = attributes.filter(attr =>  node.getAttribute(attr).includes(TemplateParser.PARSED_ATTRIBUTE_KEY_START));

    const attributesWithProps: AttributeWithPropBindings[] = attributesToBind.map(attr => this._mergeAttributesWithProps(node, instance, attr));

    attributesWithProps.forEach((bindings) => {
      const {name, value} = bindings;
      const attributeBinder = this._attributeBinders[name];
      if (attributeBinder) {
        attributeBinder(bindings)
      } else {
        node.setAttribute(name, value)
      }
    });
  }

  private _mergeAttributesWithProps(node: HTMLElement, instance: WebComponent, attr: string): AttributeWithPropBindings {
      const bindedPropName = node.getAttribute(attr)
      .replace(TemplateParser.PARSED_ATTRIBUTE_KEY_START, '')
      .replace(TemplateParser.PARSED_ATTRIBUTE_KEY_END, '');

      const regex = /[^a-z.A-Z0-9]/g;
      const clearedPropName = bindedPropName.replaceAll(regex, '');
      const bindedPropNameNodesTraversal = clearedPropName.split('.');
      let setter = (value) => {
        const rootKey = bindedPropNameNodesTraversal[0];
        if (typeof instance[rootKey] === 'object' && bindedPropNameNodesTraversal.length > 1) {
          const rootObjectClone = {...instance[rootKey]};
          const lastKey = bindedPropNameNodesTraversal[bindedPropNameNodesTraversal.length - 1];
          const traversalWithNoRootAndLeaf = [...bindedPropNameNodesTraversal].slice(1, -1);
          const lastNode = traversalWithNoRootAndLeaf.reduce((acc, curr) => acc[curr], rootObjectClone)
          lastNode[lastKey] = value;
          instance[rootKey] = rootObjectClone;
        } else {
          instance[rootKey] = value;
        }
      };

      const propToBind = bindedPropNameNodesTraversal.reduce((currentNode, nextNode) => {
        return currentNode[nextNode];
      }, instance);
      return { name: attr, value: propToBind, propName: clearedPropName, setter, node, instance };
  }

  private _bindName({name, propName, value, setter, node}: AttributeWithPropBindings<HTMLInputElement | HTMLFormElement>): void {
    const isRadio = node.getAttribute('type') === 'radio';
    const isCheckbox = node.getAttribute('type') === 'checkbox';
    if (isRadio) {
      node.checked = node.value === value;
      node.addEventListener('click', e => {
        //@ts-ignore
        setter(e.target.value);
      });
    } else if (isCheckbox) {
      const notArray = !Array.isArray(value);
      if (notArray) {
        throw new Error('Checkox binded value must be an array');
      }
      node.checked = value.includes(node.value);
      node.addEventListener('click', e => {
        //@ts-ignore
        node.checked;
        //@ts-ignore
        setter(node.checked ? value.concat(e.target.value) : value.filter(v => v !== e.target.value));
      });
    }

    node.setAttribute(name, propName);
  }

  private _bindValue({name, value, setter, node}: AttributeWithPropBindings<HTMLInputElement>) {
    const setValue = (e: Event) => {
      const newValue = (e.target as HTMLInputElement).value;
      setter(newValue);
    };
    const isValue = name === 'value';
    if (isValue) {
      node.addEventListener('keyup', setValue);
      node.addEventListener('change', setValue);

      const isDate = node.getAttribute('type') === 'date';
      if (isDate) {
        node.valueAsDate = value;
      }
    }
    node.setAttribute(name, value)
  }
}

export const parser = new TemplateParser()
