import WebComponent from "./web.component";

export const binder = {
  async bind(instance: WebComponent): Promise<HTMLTemplateElement>{
    const parsedHtml = instance.html.replaceAll('{{', '__data-bind:').replaceAll('}}', '');
    const domTree = document.createElement('template')
    domTree.innerHTML = parsedHtml;

    const recursiveTraversal = async (node: Node, instance: WebComponent) => {
      this.bindPropToNodeAttributes(node, instance);
      node.childNodes && [...node.childNodes].forEach(n => recursiveTraversal(n, instance));
    };

    recursiveTraversal(domTree.content, instance);
    return domTree;
  },

  bindPropToNodeAttributes(node: HTMLElement, instance: WebComponent): void {
    if (node.nodeType !== Node.ELEMENT_NODE) { // TODO expand with different strategies for different node types
      return;
    }

    const attributes = node.getAttributeNames();
    const attributesToBind = attributes.filter(attr =>  node.getAttribute(attr).includes('__data-bind:'));

    const attributesWithProps = attributesToBind.map(attr => {
      const bindedPropName = node.getAttribute(attr).replace('__data-bind:', '');
      const brindedPropNameNodesTraversal = bindedPropName.split('.');
      const propToBind = brindedPropNameNodesTraversal.reduce((currentNode, nextNode) => currentNode[nextNode], instance);
      return {name: attr, value: propToBind}
    });

    attributesWithProps.forEach(({name, value}) => node.setAttribute(name, value));
  }
}
