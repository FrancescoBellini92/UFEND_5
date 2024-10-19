
import WebComponent from "../web.component";
import { NodeTypes, Binder, NodeBoundsDescriptor } from "./Binder";
import { HTMLElementBinder } from "./HTMLElementBinder";


import { TextNodeBinder } from "./TextNodeBinder";


const bindersByNodeType: Record<NodeTypes, Binder> = {
  [NodeTypes.HTML_ELEMENT]: new HTMLElementBinder(NodeTypes.HTML_ELEMENT, this),
  [NodeTypes.TEXT_NODE]: new TextNodeBinder(NodeTypes.TEXT_NODE)
}

export const binderAdapter = {
  doBind(node: Node, instance: object) {
    const hasBindings: boolean = Binder.checkIfAnyBindings(node);
      let boundDescriptor: NodeBoundsDescriptor;
      if (hasBindings) {
        const binderForCurrentNode = bindersByNodeType[node.nodeType];
        if (binderForCurrentNode) {
          return boundDescriptor = binderForCurrentNode.bind(node, instance);
      }
      console.error(`Cannot bind to node ${node.nodeName} of type ${node.nodeType}`);
    }
  }
};


