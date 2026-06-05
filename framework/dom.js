// Creates a Virtual node.
export function createVnode(tag, attrs = {}, ...children) {
  return {
    type: "element",
    tag: tag,
    attrs: attrs,
    children: children
      .flat(Infinity)
      .filter(
        (child) =>
          child !== null && child !== undefined && typeof child !== "boolean",
      )
      .map((child) => {
        if (typeof child === "string" || typeof child === "number") {
          return { type: "text", value: child, dom: null };
        }
        return child;
      }),
  };
}

// Takes the Vnode and renders it into dom.
function render(vnode) {
  if (vnode.type === "text") {
    const textNode = document.createTextNode(vnode.value);
    vnode.dom = textNode;

    return textNode;
  }

  // Creating the element in dom.
  const node = document.createElement(vnode.tag);

  // Set Attributes in all cases.
  for (const key in vnode.attrs) {
    const value = vnode.attrs[key];

    // Events
    if (key.startsWith("on")) {
      const event = key.slice(2).toLowerCase();
      node.addEventListener(event, value);
      continue;
    }

    // Boolean Attribute
    if (typeof value === "boolean") {
      if (value) {
        node.setAttribute(key, "");
      }
      continue;
    }

    // Regular Attribute
    node.setAttribute(key, value);
  }
  // Append Children.
  vnode.children.forEach((vchild) => {
    node.appendChild(render(vchild));
  });

  vnode.dom = node;
  return node;
}

let currentVnode = null;

export function mount(vnode, holderId) {
  if (!currentVnode) {
    initMount(vnode, holderId);
    currentVnode = vnode;
  } else {
  }
}

function initMount(vnode, holderId) {
  const holder = document.getElementById(holderId);
  const node = render(vnode);

  if (!holder) {
    console.warn(`element #${holderId} not found`);
    return;
  }

  const parent = holder.parentNode;
  parent.replaceChild(node, holder);
}

function diff(oldNode, newNode, parent) {
  if (!newNode) {
    oldNode.dom.remove();
    return;
  }

  if (!oldNode) {
    const newElem = render(newNode);
    parent.appendChild(newElem);
    newNode.dom = newElem;
    return;
  }

  const oldElem = oldNode.dom;

  if (!isSameKindNodes(oldNode, newNode)) {
    const newElem = render(newNode);
    parent.replaceChild(newElem, oldElem);
    newNode.dom = newElem;
    return;
  }

  const oldAttrs = oldNode.attrs;
  const newAttrs = newNode.attrs;

  for (const key in oldAttrs) {
    if (!newAttrs[key]) {
      oldElem.removeAttribute(key);
    }
  }

  for (const key in newAttrs) {
    const value = newAttrs[key];
    if (oldAttrs[key] !== newAttrs[key]) {
      oldElem.setAttribute(key, newAttrs[key]);
    }
  }
}

function isSameKindNodes(n1, n2) {
  return n1.type === n2.type && n1.tag === n2.tag;
}

function nodesAttrsCompare(n1, n2) {}
