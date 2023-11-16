import WebComponent from "./web.component";


export class TemplateParser {

  private _binders: Record<NodeTypes, Binder> = {
    [NodeTypes.HTMLELEMENT]: new HTMLELEMENTBinder(NodeTypes.HTMLELEMENT)
  }

  async parse(instance: WebComponent): Promise<HTMLTemplateElement>{
    const parsedHtml = instance.html.replaceAll('{{', '__data-bind:').replaceAll('}}', '');
    const isolatedDomTree = document.createElement('template')
    isolatedDomTree.innerHTML = parsedHtml;

    const recursiveTraversal = async (node: Node, instance: WebComponent) => {
      const binderForCurrentNode = this._binders[node.nodeType];
      if (binderForCurrentNode) {
        binderForCurrentNode.bind(node, instance);
      } else {
        console.warn(`Cannot bind to node ${node.nodeName} of type ${node.nodeType}`);
      }
      node.childNodes && [...node.childNodes].forEach(n => recursiveTraversal(n, instance));
    };

    recursiveTraversal(isolatedDomTree.content, instance);
    return isolatedDomTree;
  }
}
export enum NodeTypes {
  HTMLELEMENT = Node.ELEMENT_NODE,
  FRAGMENT = Node.DOCUMENT_FRAGMENT_NODE,
}

abstract class Binder<T extends Node = Node> {

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

export class HTMLELEMENTBinder extends Binder<HTMLElement>{

  protected _bind(node: HTMLElement, instance: WebComponent) {
    const attributes = node.getAttributeNames();
    const attributesToBind = attributes.filter(attr =>  node.getAttribute(attr).includes('__data-bind:'));

    const attributesWithProps = attributesToBind.map(attr => {
      const bindedPropName = node.getAttribute(attr).replace('__data-bind:', '');
      const regex = /[^a-z.A-Z0-9]/g
      const clearedPropName = bindedPropName.replaceAll(regex, '')
      const bindedPropNameNodesTraversal = clearedPropName.split('.');
      let setter;
      const propToBind = bindedPropNameNodesTraversal.reduce((currentNode, nextNode) => {
        setter = value => currentNode[nextNode] = value;
        return currentNode[nextNode];
      }, instance);
      return {name: attr, value: propToBind, propName: clearedPropName, setter}
    });

    attributesWithProps.forEach(({name, value, propName, setter}) => {
      if (node instanceof HTMLInputElement) {
        let inputNode = node as HTMLInputElement;

        const isValue = name === 'value';
        if (isValue) {
          inputNode.addEventListener('keyup', e => {
            const newValue = (e.target as HTMLInputElement).value;
            setter(newValue);
          })
          inputNode.addEventListener('change', e => {
            const newValue = (e.target as HTMLInputElement).value;
            setter(newValue);
          })

          const isDate = inputNode.getAttribute('type') === 'date';
          if (isDate) {
            inputNode.valueAsDate = value;
          }
        }

        const isName = name === 'name'
        if (isName) {
          const isRadio = node.getAttribute('type') === 'radio';
          const isCheckbox = node.getAttribute('type') === 'checkbox';
          if (isRadio) {
            inputNode.checked = node.value === value;
            inputNode.addEventListener('click', e => {
              //@ts-ignore
              setter(e.target.value)
            })
          } else if (isCheckbox) {
            const notArray = !Array.isArray(value);
            if (notArray) {
              throw new Error('Checkox binded value must be an array')
            }
            inputNode.checked = value.includes(inputNode.value);
            inputNode.addEventListener('click', e => {
              //@ts-ignore
              inputNode.checked
              //@ts-ignore
              setter(inputNode.checked ? value.concat(e.target.value) : value.filter(v => v !== e.target.value))
            })

          }
          node.setAttribute(name, propName);
          return;
        }
      }

      node.setAttribute(name, value)
    });
  }
}

export const parser = new TemplateParser()
