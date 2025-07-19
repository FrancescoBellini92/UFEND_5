
import WebComponent from "../web.component";
import { NodeTypes, Binder, NodeBoundsDescriptor } from "./Binder";
import { HTMLElementBinder } from "./HTMLElementBinder";


import { TextNodeBinder } from "./TextNodeBinder";


export const bindersByNodeType: Record<NodeTypes, Binder> = {
  [NodeTypes.HTML_ELEMENT]: new HTMLElementBinder(NodeTypes.HTML_ELEMENT, this),
  [NodeTypes.TEXT_NODE]: new TextNodeBinder(NodeTypes.TEXT_NODE)
}

export const binderAdapter = {
  doBind(node: Node, instance: object) {
    const binderForCurrentNode = bindersByNodeType[node.nodeType];
    const hasBindings: boolean = binderForCurrentNode?.hasBoundNode(node)|| Binder.checkIfAnyBindings(node);
    let boundDescriptor: NodeBoundsDescriptor;
    if (hasBindings) {

        if (binderForCurrentNode) {
          return boundDescriptor = binderForCurrentNode.bind(node, instance);
      }
      console.error(`Cannot bind to node ${node.nodeName} of type ${node.nodeType}`);
    }
  }
};


