import Observable from "../observable";
import WebComponent from "../web.component";
import { binderAdapter, } from "./bindersByNodeType";
import { TemplateParser } from "./TemplareParser";


export class MasterBinder {

  static PARSED_ATTRIBUTE_KEY_START = '__data-bind:';
  static PARSED_ATTRIBUTE_KEY_END = ':data-bind__';
  static msForDigestingBeforeYelding = 50;

  private _attributeNodeMap: Map<string, Set<Node>> = new Map();

  private _nodeToHydrateQueue = [];
  private _isBusyDigestingQueue = false;



  constructor(private _instance: WebComponent) {
    const boundChangeObs$: Observable<Record<string, any>, Record<string, any>> = this._instance.boundPropertiesChange$;
    boundChangeObs$.subscribe(data => {
      Object.entries(data).forEach(([k,v]) => {
        const nodesBoundToK = this._attributeNodeMap.get(k);
        if (nodesBoundToK) {
          Array.from(nodesBoundToK).forEach(n => this._recursiveEnqueNodeHydration(n))
        }
      })
      if (!this._isBusyDigestingQueue) {
        this._digestQueue();
      }
    })
  }

  parseAndDigest(): HTMLTemplateElement {
    this._nodeToHydrateQueue = [];

    const parsedDomTree = TemplateParser.parse(this._instance.html)

    this._recursiveEnqueNodeHydration(parsedDomTree.content);
    if (!this._isBusyDigestingQueue) {
      this._digestQueue()
    }
    return parsedDomTree;
  }

  private _digestQueue() {
    this._isBusyDigestingQueue = true;
    const start = performance.now();
    while (this._nodeToHydrateQueue.length > 0) {
      const hydrate = this._nodeToHydrateQueue.pop();
      hydrate();
      const elapsedMs = performance.now() - start;
      const shouldYeldAndScheduleNewTask = elapsedMs > MasterBinder.msForDigestingBeforeYelding;
      if (shouldYeldAndScheduleNewTask) {
        break;
      }
    }

    const stillNodeToHydrate = this._nodeToHydrateQueue.length > 0;
    this._isBusyDigestingQueue = stillNodeToHydrate;
    if (stillNodeToHydrate) {
      requestAnimationFrame(() => this._digestQueue())
    }
  }

  _recursiveEnqueNodeHydration(node: Node, skipRecording?: boolean) {
    const doBindLogic = () => {
      const boundDescriptor = binderAdapter.doBind(node, this._instance);
      boundDescriptor?.boundProperties.forEach((propKey) => {
        this._attributeNodeMap.set(propKey, (this._attributeNodeMap.get(propKey) || new Set()).add(node))
      })

      const isHidden = boundDescriptor?.isHidden ?? false;
      if (isHidden || !node.hasChildNodes()) {
        return;
      }

      const traverseChildren = () => [...node.childNodes].forEach(n => this._recursiveEnqueNodeHydration(n));
      traverseChildren();
    };

    this._nodeToHydrateQueue.push(doBindLogic);
  };
}



