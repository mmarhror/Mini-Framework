import { createVnode } from "../../framework/dom.js";

export default function ToggleAllContainer(dispatch, allCompleted) {
  return createVnode(
    "div",
    { class: "toggle-all-container" },
    createVnode("input", {
      class: "toggle-all",
      type: "checkbox",
      id: "toggle-all",
      checked: allCompleted,
      onClick: () => dispatch("toggleAll", allCompleted),
    }),
    createVnode(
      "label",
      { class: "toggle-all-label", for: "toggle-all" },
      "Toggle All Input",
    ),
  );
}
