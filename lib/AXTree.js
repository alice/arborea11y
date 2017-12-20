'use strict';

class AXTree {
  constructor(rootNode) {
    this.rootNode = rootNode;
    this.tree = AXTree.buildTree(this.rootNode);
  }
  static buildTree(automationNode, opt_parent, opt_indent) {
    var RoleType = chrome.automation.RoleType;

    if (!opt_parent && automationNode.role != RoleType.ROOT_WEB_AREA)
      throw 'no parent node and not ROOT_WEB_AREA';

    var parent = opt_parent,
        indent = opt_indent || '',
        node = null;

    for (var property in automationNode) {
      var value = automationNode[property];
      if (typeof value === 'function')
        continue;
      if (value === undefined)
        continue;
    }

    var atomic = false;

    switch (automationNode.role) {
    case RoleType.ROOT_WEB_AREA:
      node = document.createDocumentFragment();
      break;

    case RoleType.BUTTON:
      atomic = true;
      node = parent.appendChild(document.createElement("button"));
      if (automationNode.name.trim() == "" && automationNode.description && automationNode.description.trim() != "")
        node.appendChild(document.createTextNode(automationNode.description));
      else
        node.appendChild(document.createTextNode(automationNode.name));
      break;

    case RoleType.LINK:
      node = parent.appendChild(document.createElement("a"));
      node.href = automationNode.url;

      if (automationNode.name.trim() == "" && automationNode.description && automationNode.description.trim() != "")
        node.appendChild(document.createTextNode(automationNode.description));
      break;



    case RoleType.CELL:
      node = parent.appendChild(document.createElement("td"));
      break;

    case RoleType.CHECK_BOX:
      atomic = true;
      node = parent.appendChild(document.createElement("input"));
      node.type = "checkbox";
      node.checked = automationNode.state.checked;
      break;

    case RoleType.DATE:
    case RoleType.DATE_TIME:
    case RoleType.TIME:
      node = parent.appendChild(document.createElement("time"));
      break;

    case RoleType.GENERIC_CONTAINER:
      node = parent.appendChild(document.createElement("div"));
      break;

    case RoleType.FIGCAPTION:
      node = parent.appendChild(document.createElement("figcaption"));
      break;

    case RoleType.FIGURE:
      node = parent.appendChild(document.createElement("figure"));
      break;

    case RoleType.HEADING:
      switch (automationNode.hierarchicalLevel) {
      case 1:
        node = parent.appendChild(document.createElement("h1"));
        break;
      case 2:
        node = parent.appendChild(document.createElement("h2"));
        break;
      case 3:
        node = parent.appendChild(document.createElement("h3"));
        break;
      case 4:
        node = parent.appendChild(document.createElement("h4"));
        break;
      case 5:
        node = parent.appendChild(document.createElement("h5"));
        break;
      case 6:
      default:
        node = parent.appendChild(document.createElement("h6"));
        break;
      }
      break;

    case RoleType.IMAGE:
      atomic = true;
      node = parent.appendChild(document.createElement("img"));
      node.src = "";
      node.alt = automationNode.name != "" ? automationNode.name : automationNode.url ? automationNode.url.split('/').pop() : '<' + automationNode.htmlTag + '>';
      break;

    case RoleType.INPUT_TIME:
      atomic = true;
      node = parent.appendChild(document.createElement("input"));
      node.type = "time"
      node.value = automationNode.value;
      break;

    case RoleType.LIST:
      node = parent.appendChild(document.createElement(automationNode.htmlTag));
      break;

    case RoleType.LIST_ITEM:
      node = parent.appendChild(document.createElement("li"));
      break;

    case RoleType.LIST_MARKER:
      atomic = true; // ignore list markers as the ul/ol will insert them
      break;

    case RoleType.PARAGRAPH:
      node = parent.appendChild(document.createElement("p"));
      break;

    case RoleType.PRE:
      node = parent.appendChild(document.createElement("pre"));
      break;

    case RoleType.RADIO_BUTTON:
      atomic = true;
      node = parent.appendChild(document.createElement("input"));
      node.type = "radio";
      node.checked = automationNode.state.checked;
      break;

    case RoleType.ROW_HEADER:
    case RoleType.COLUMN_HEADER:
      node = parent.appendChild(document.createElement("th"));
      break;

    case RoleType.ROW:
      node = parent.appendChild(document.createElement("tr"));
      break;

    case RoleType.SLIDER:
      atomic = true;
      node = parent.appendChild(document.createElement("input"));
      node.type = "range";
      node.min = automationNode.minValueForRange;
      node.max = automationNode.maxValueForRange;
      node.value = automationNode.valueForRange;
      // TODO: valuetext
      break;

    case RoleType.STATIC_TEXT:
      atomic = true;
      node = parent.appendChild(document.createTextNode(automationNode.value));
      break;

    case RoleType.TABLE:
      node = parent.appendChild(document.createElement("table"));
      break;

    case RoleType.TEXT_FIELD:
      atomic = true;
      node = parent.appendChild(document.createElement("input"));
      node.type = "text";
      node.value = automationNode.value;
      break;

    default:
      node = parent.appendChild(document.createElement("div"));
      node.setAttribute('role', automationNode.role);
      break;
    }

    if (atomic)
      return;

    for (var child of automationNode.children) {
      AXTree.buildTree(child, node, indent + "  ");
      node.appendChild(document.createTextNode("\n"));
    }
    return node;
  }
}
