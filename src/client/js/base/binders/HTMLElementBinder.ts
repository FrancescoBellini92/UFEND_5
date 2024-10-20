import WebComponent from "../web.component";
import { Binder, NodeBoundsDescriptor, NodeTypes } from "./Binder";
import { binderAdapter } from "./bindersByNodeType";
import { MasterBinder } from "./MasterBinder";

export interface AttributeWithPropBindings<T extends Node = Node> {
  attributeName: string;
  value: any;
  instancePropertyName: string;
  setter: any;
  node: T,
  instance: object
}


export class HTMLElementBinder extends Binder<HTMLElement, Attr[]> {

  constructor(public targetNodeType: NodeTypes, private masterBinder: MasterBinder) {
    super(targetNodeType)
  }

  private _bindCurrentForBound({node, value}: Pick<AttributeWithPropBindings, 'node' | 'value' >): void {

    binderAdapter.doBind(node, {[Binder.CURRENT_FOR_BINDING]: value} )
    if (node.hasChildNodes()) {
      Array.from(node.childNodes).forEach(node => this._bindCurrentForBound({node, value}))

    }
  }

  private _bindForBound(bindings: AttributeWithPropBindings): void {
    const {node, value} = bindings;

    const isNotIterable = !(value && !!value[Symbol.iterator] );
    if (isNotIterable)  {
      return;
    }

    let anchor = node;

    if ((node as any).clones?.length > 0) {
      const [cloneAnchor, ...rest] = (node as any).clones;
      anchor = cloneAnchor;
      rest.forEach(n => n.parentElement.removeChild(n as HTMLElement));
    }

    const fragment = document.createDocumentFragment();
    const clones = value.map( v => {
      const clone = node.cloneNode(true);
      if (clone instanceof HTMLElement) {
        clone.removeAttribute(bindings.attributeName);
      }

      this._bindCurrentForBound({node: clone, value: v})
      return clone
    });

    (node as any).clones = clones
    clones.forEach(c => fragment.append(c));



    (anchor as HTMLElement).replaceWith(fragment);

  }

  private _attributeBinders: Record<string, (bindings: AttributeWithPropBindings) => void> = {
    value: this._bindValue.bind(this),
    name: this._bindName.bind(this),
    class: this._bindClass.bind(this),
    style: this._bindStyle.bind(this),
    event: this._bindEvent.bind(this),
    [Binder.IF_BINDING]: this._bindIfBound.bind(this),
    [Binder.FOR_BINDING]: this._bindForBound.bind(this),

  };

  private _eventHandlersNodeMap: WeakMap<Node, Record<HTMLElementEventMap & string, (e: Event) => void>> = new WeakMap()



  protected _bind(node: HTMLElement, attributesNodeToBind: Attr[], instance: object): NodeBoundsDescriptor<HTMLElement> {
    const attributesWithProps: AttributeWithPropBindings[] = attributesNodeToBind.map(attr => this._mergeAttributesWithProps(node, instance, attr));

    attributesWithProps.forEach((binding) => {
      const {attributeName: name, value} = binding;
      const isEventHandler = name.startsWith('on');
      const attributeBinder = isEventHandler ? this._attributeBinders['event'] : this._attributeBinders[name];
      if (attributeBinder) {
        attributeBinder(binding)
      } else {
        node.setAttribute(name, String(value))
      }
    });

    return {
      node,
      boundProperties: attributesWithProps.map(({instancePropertyName: propName}) => propName.split('.')[0]),
      isHidden: !!attributesWithProps.find(binding => binding.attributeName === Binder.IF_BINDING && !binding.value),
      isForBound: !!attributesWithProps.find(binding => binding.attributeName === Binder.FOR_BINDING)
    }
  }


  protected _getNodeStateForBinding(node: HTMLElement): Attr[] {
    const attributes = node.getAttributeNames();
    const attributesToBind = attributes.filter(attr => node.getAttribute(attr).includes(MasterBinder.PARSED_ATTRIBUTE_KEY_START));
    const attributesNodeToBind = attributesToBind.map(attr => node.getAttributeNode(attr).cloneNode() as Attr);
    return attributesNodeToBind
  }

  private _mergeAttributesWithProps(node: HTMLElement, instance: object, attr: Attr): AttributeWithPropBindings {
      const bindedPropName = attr.value
      .replace(MasterBinder.PARSED_ATTRIBUTE_KEY_START, '')
      .replace(MasterBinder.PARSED_ATTRIBUTE_KEY_END, '');

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
      return { attributeName: attr.name, value: propToBind, instancePropertyName: clearedPropName, setter, node, instance };
  }

  private _bindName({attributeName: name, instancePropertyName: propName, value, setter, node}: AttributeWithPropBindings<HTMLInputElement | HTMLFormElement>): void {
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

  private _bindValue({attributeName: name, value, setter, node}: AttributeWithPropBindings<HTMLInputElement>) {
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

  private _bindEvent({attributeName: name, value, node, instance}: AttributeWithPropBindings<HTMLInputElement>) : void {
    node.removeAttribute(name)
    node.addEventListener(name.replace('on', ''), value.bind(instance))
  }

  private _bindIfBound({attributeName: name, value, node}: AttributeWithPropBindings<HTMLInputElement>): void {
    node.setAttribute(name,value)

    const nodeWithParentRef: typeof node & { placeholderNode?: Node} = node;
    if (!value) {
      nodeWithParentRef.placeholderNode = nodeWithParentRef.placeholderNode ?? document.createComment(`${nodeWithParentRef.outerHTML}`);
      nodeWithParentRef.parentElement?.replaceChild(nodeWithParentRef.placeholderNode, nodeWithParentRef);
    } else {
      nodeWithParentRef.placeholderNode?.parentElement?.replaceChild(nodeWithParentRef, nodeWithParentRef.placeholderNode);
    }
  }
}

