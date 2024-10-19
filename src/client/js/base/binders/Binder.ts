import Observable from "../observable";
import WebComponent from "../web.component";

export enum NodeTypes {
  HTML_ELEMENT = Node.ELEMENT_NODE,
  TEXT_NODE = Node.TEXT_NODE
}


export interface NodeBoundsDescriptor<T extends Node = Node> {
  node: T;
  boundProperties: string[];
  isHidden?: boolean;
}


export abstract class Binder<T extends Node = Node, D = any> {

  public static IF_BINDING = 'if-bound';
  static FOR_BINDING = 'for-bound';
  static CURRENT_FOR_BINDING = 'currentForBound';

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

  public bind(node: T, instance: object): NodeBoundsDescriptor<T> {

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

  protected abstract _bind(node: T, nodeStateForBinding: D, instance: object): NodeBoundsDescriptor<T>
}



