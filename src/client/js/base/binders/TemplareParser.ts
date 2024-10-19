
export class TemplateParser {

  static PARSED_ATTRIBUTE_KEY_START = '__data-bind:';
  static PARSED_ATTRIBUTE_KEY_END = ':data-bind__';
  static msForDigestingBeforeYelding = 50;


  static  parse(html: string): HTMLTemplateElement {
    const parsedHtml = html.replaceAll('{{', TemplateParser.PARSED_ATTRIBUTE_KEY_START).replaceAll('}}', TemplateParser.PARSED_ATTRIBUTE_KEY_END);
    const isolatedDomTree = document.createElement('template')
    isolatedDomTree.innerHTML = parsedHtml;

    return isolatedDomTree;
  }


}

