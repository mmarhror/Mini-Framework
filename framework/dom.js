export function createVnode(tag, attrs = {}, ...children) {
  return {
    tag: tag,
    attrs: attrs,
    children: children
      .flat(Infinity)
      .filter(
        (child) =>
          child !== null && child !== undefined && typeof child !== "boolean",
      ),
  };
}

// Takes the Vnode and renders it into dom.
function render(vnode) {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(vnode);
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

  vnode.children.forEach((vchild) => {
    node.appendChild(render(vchild));
  });

  return node;
}

let currentVnode = null;

export function mount(vnode, holderId) {
  if (!currentVnode) {
    initMount(vnode, holderId);
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

