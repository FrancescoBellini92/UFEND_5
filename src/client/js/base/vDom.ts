import WebComponent from "./web.component";

export const vDom = {
  recursiveVDom(nodes: (Node & WebComponent)[]): void {
    [...nodes].filter(n => [Node.COMMENT_NODE, Node.ELEMENT_NODE, Node.TEXT_NODE].includes(n.nodeType)).map(n => ({type: n.nodeType, children: n.render ? null : this.recursiveVDom(n.childNodes), instance: n}))
  },
  recursiveRender(vNodes: vNode[]): void  {
    vNodes.forEach(vNode => {
      vNode.instance?.render?.();
      this.recursiveRender(vNode.children);
      })
  }
}

export interface vNode {
  type: typeof Node.COMMENT_NODE | typeof Node.ELEMENT_NODE | typeof Node.TEXT_NODE,
  children: vNode[],
  instance: Node & WebComponent
}