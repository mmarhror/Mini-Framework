import { createVnode, mount } from "../framework/dom.js";
import { createState } from "../framework/state.js";

import { store, router } from "./store.js";

import Header from "./components/header.js";
import Main from "./components/main.js";
import Footer from "./components/footer.js";

function App() {
  const state = store.getState();
  const { todos, filter, editingId } = state;

  return createVnode(
    "section",
    { class: "todoapp", id: "root" },
    Header(store.dispatch),
    Main(store.dispatch, state),
    todos.length > 0 && Footer(store.dispatch, todos),
  );
}

function renderApp() {
  console.log("renderApp called");
  mount(App(), "root");
}

store.subscribe(renderApp);

router.register("/", () => store.dispatch("setFilter", "all"));
router.register("/active", () => store.dispatch("setFilter", "active"));
router.register("/completed", () => store.dispatch("setFilter", "completed"));
router.init();
