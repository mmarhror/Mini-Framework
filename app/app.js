import { createVnode, mount } from "../framework/dom.js";
import { createState } from "../framework/state.js";

import { store, router } from "./store.js";

import Header from "./components/header.js";
import TodoList from "./components/todo-list.js";
import Footer from "./components/footer.js";

function getFilteredTodos(filter, todos) {
  let filtered = todos;

  switch (filter) {
    case "active":
      filtered = todos.filter((todo) => !todo.completed);
      break;

    case "completed":
      filtered = todos.filter((todo) => todo.completed);
      break;
  }

  return filtered;
}

function App() {
  const { todos, filter, editingId } = store.getState();

  const filtered = getFilteredTodos(filter, todos);

  return createVnode(
    "section",
    { class: "todoapp", id: "root" },
    Header(store.dispatch),
    filtered.length > 0 && TodoList(store.dispatch, filtered, editingId),
    todos.length > 0 && Footer(store.dispatch, todos),
  );
}

router.register("/", store.dispatch("setFilter", "all"));
router.register("/active", store.dispatch("setFilter", "active"));
router.register("/completed", store.dispatch("setFilter", "completed"));
router.init();

function renderApp() {
  mount(App(), "root");

  setTimeout(() => {
    document.getElementById("todo-input").focus();
  }, 0);
}

store.subscribe(renderApp);

renderApp();
