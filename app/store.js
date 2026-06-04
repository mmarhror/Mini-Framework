import { createRouter } from "../framework/router.js";
import { createState } from "../framework/state.js";

const actions = {
  setFilter(state, filter) {
    return { ...state, filter: filter };
  },

  addTodo(state, title) {
    return {
      ...state,
      todos: [
        ...state.todos,
        { id: Date.now(), title: title, completed: false },
      ],
    };
  },

  toggleTodo(state, todoId) {
    return {
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    };
  },

  removeTodo(state, todoId) {
    return {
      ...state,
      todos: state.todos.filter((todo) => todo.id !== todoId),
    };
  },

  startEditing(state, todoId) {
    return { ...state, editingId: todoId };
  },

  clearCompletedTodos(state) {
    return { ...state, todos: state.todos.filter((todo) => !todo.completed) };
  },
};

export const store = createState(
  {
    todos: [],
    filter: "all",
    editingId: null,
  },
  actions,
);

export const router = createRouter();
