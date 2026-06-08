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

// RENDERING

// Takes the Vnode and renders it into dom. then calls the onMount function.
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
    if (key === "key" || key === "onMount") continue;

    const value = vnode.attrs[key];

    addProp(node, key, value);
  }
  // Append Children.
  vnode.children.forEach((vchild) => {
    node.appendChild(render(vchild));
  });

  vnode.dom = node;

  if (vnode.attrs.onMount) {
    const fn = vnode.attrs.onMount;
    requestAnimationFrame(() => fn(node));
  }

  return node;
}

let currentVnode = null;

export function mount(vnode, holderId) {
  if (!currentVnode) {
    const success = initMount(vnode, holderId);
    if (!success) return;
    //
  } else {
    const parent = currentVnode.dom.parentNode;
    patch(parent, currentVnode, vnode);
    //
  }

  currentVnode = vnode;
}

// INITIAL MOUNT

function initMount(vnode, holderId) {
  const holder = document.getElementById(holderId);

  if (!holder) {
    console.warn(`element #${holderId} not found`);
    return false;
  }
  const node = render(vnode);

  const parent = holder.parentNode;
  parent.replaceChild(node, holder);

  return true;
}

// PATCHING
function patch(parent, oldNode, newNode) {
  // No new node: remove element
  if (!newNode) {
    oldNode.dom.remove();
    return;
  }

  // No old node: add element
  if (!oldNode) {
    const newElem = render(newNode);
    parent.appendChild(newElem);
    newNode.dom = newElem;
    return;
  }

  const oldElem = oldNode.dom;

  // Not same kind of nodes: replace
  if (!isSameKindNodes(oldNode, newNode)) {
    const newElem = render(newNode);
    parent.replaceChild(newElem, oldElem);
    newNode.dom = newElem;
    return;
  }

  // Same kind of nodes:

  newNode.dom = oldElem;

  // Patch text.
  if (oldNode.type === "text") {
    patchText(oldElem, oldNode, newNode);
    return;
  }

  // Patch element.
  patchElement(oldElem, oldNode, newNode);
}

function isSameKindNodes(oldNode, newNode) {
  return oldNode.type === newNode.type && oldNode.tag === newNode.tag;
}

function patchText(textNode, oldNode, newNode) {
  // Change just the value in case it changed.
  if (oldNode.value !== newNode.value) {
    textNode.textContent = newNode.value;
  }
}

function patchElement(elem, oldNode, newNode) {
  const oldAttrs = oldNode.attrs;
  const newAttrs = newNode.attrs;

  // Remove deleted prop.
  for (const key in oldAttrs) {
    if (key === "key" || key === "onMount") continue;

    if (!(key in newAttrs)) {
      removeProp(elem, key, oldAttrs[key]);
    }
  }

  // Overwrite changed prop.
  for (const key in newAttrs) {
    if (key === "key" || key === "onMount") continue;

    const value = newAttrs[key];
    if (oldAttrs[key] !== newAttrs[key]) {
      removeProp(elem, key, oldAttrs[key]);
      addProp(elem, key, newAttrs[key]);
    }
  }

  const oldChildren = oldNode.children;
  const newChildren = newNode.children;

  const status = childrenKeysStatus(oldChildren, newChildren);

  if (!status) console.warn(`Missing key`);

  if (!status || status === "unkeyed") {
    patchUnkeyedChildren(elem, oldChildren, newChildren);
  } else {
    patchKeyedChildren(elem, oldChildren, newChildren);
  }
}

function childrenKeysStatus(oldChildren, newChildren) {
  const oldElems = oldChildren.filter((child) => child.type === "element");
  const newElems = newChildren.filter((child) => child.type === "element");

  const oldAllKeyed = oldElems.every((child) => child.attrs?.key !== undefined);
  const newAllKeyed = newElems.every((child) => child.attrs?.key !== undefined);

  const oldSomeKeyed = oldElems.some((child) => child.attrs?.key !== undefined);
  const newSomeKeyed = newElems.some((child) => child.attrs?.key !== undefined);

  if (oldAllKeyed && newAllKeyed) return "keyed";
  if (!oldSomeKeyed && !newSomeKeyed) return "unkeyed";
  return null;
}

function patchUnkeyedChildren(elem, oldChildren, newChildren) {
  // Patch children.
  const len = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < len; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    patch(elem, oldChild, newChild);
  }
}

function patchKeyedChildren(elem, oldChildren, newChildren) {
  const oldKeyMap = new Map();
  oldChildren.forEach((child) => {
    if (child.type === "text") return;
    oldKeyMap.set(child.attrs.key, child);
  });

  const usedKeys = new Set();

  newChildren.forEach((newChild, i) => {
    if (newChild.type === "text") return;

    const key = newChild.attrs.key;
    const oldChild = oldKeyMap.get(key);

    if (oldChild) {
      patch(elem, oldChild, newChild);
    } else {
      patch(elem, null, newChild);
    }

    usedKeys.add(key);

    const oldChildAt = elem.children[i];
    if (oldChildAt !== newChild.dom) {
      elem.insertBefore(newChild.dom, oldChildAt || null);
    }
  });

  for (const [key, child] of oldKeyMap) {
    if (!usedKeys.has(key)) {
      child.dom.remove();
    }
  }
}

const domPropTypes = {
  checked: "boolean",
  disabled: "boolean",
  selected: "boolean",
  value: "string",
};

function removeProp(elem, key, value) {
  // Events
  if (key.startsWith("on")) {
    const event = key.slice(2).toLowerCase();
    elem.removeEventListener(event, value);
    return;
  }

  const propType = domPropTypes[key];

  // String DOM Prop
  if (propType === "string") {
    elem[key] = "";
    return;
  }

  // Boolean DOM Prop
  if (propType === "boolean") {
    elem[key] = false;
    return;
  }

  // Regular Attribute
  elem.removeAttribute(key);
}

function addProp(elem, key, value) {
  // Events
  if (key.startsWith("on")) {
    const event = key.slice(2).toLowerCase();
    elem.addEventListener(event, value);
    return;
  }

  const propType = domPropTypes[key];

  // DOM Prop
  if (propType) {
    elem[key] = value;
    return;
  }

  // Regular Attribute
  elem.setAttribute(key, value);
}
