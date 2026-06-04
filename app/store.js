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

  cancelEditing(state) {
    return { ...state, editingId: null };
  },

  editTodo(state, { todoId, title }) {
    return {
      ...state,
      todos: state.todos.map((todo) =>
        todoId === todo.id ? { ...todo, title: title } : todo,
      ),
      editingId: null,
    };
  },

  clearCompletedTodos(state) {
    return { ...state, todos: state.todos.filter((todo) => !todo.completed) };
  },

  toggleAll(state, allCompleted) {
    return {
      ...state,
      todos: state.todos.map((todo) => ({ ...todo, completed: !allCompleted })),
    };
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
