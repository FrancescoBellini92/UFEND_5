import Observable from "../observable";
import WebComponent from "../web.component";
import { Binder, NodeBoundsDescriptor } from "./Binder";
import { MasterBinder } from "./MasterBinder";


export class TextNodeBinder extends Binder<Node, string> {

  protected _bind(node: Node, nodeStateForBinding: string, instance: WebComponent): NodeBoundsDescriptor {

    const templateToElabeorate = nodeStateForBinding;
    const matcher = new RegExp(`${MasterBinder.PARSED_ATTRIBUTE_KEY_START}(.*)${MasterBinder.PARSED_ATTRIBUTE_KEY_END}`, 'g');
    const propNames = Array.from(templateToElabeorate.matchAll(matcher)).map(([_, propName]) => propName)
    const keysWithValyes = propNames.reduce((acc,  bindedPropName) => {
      const bindedPropNameNodesTraversal = bindedPropName.split('.');
      const bindedPropValue = Binder.traverseTree(bindedPropNameNodesTraversal, instance)
      acc[bindedPropName] = bindedPropValue;
      return acc;
    }, {})

    const clearedFromBindFlags = templateToElabeorate.replaceAll(MasterBinder.PARSED_ATTRIBUTE_KEY_START, '').replaceAll(MasterBinder.PARSED_ATTRIBUTE_KEY_END, '');
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

