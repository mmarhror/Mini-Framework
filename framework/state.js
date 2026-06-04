class State {
  constructor(initialState, actions) {
    this.state = initialState;
    this.actions = actions;
    this.listeners = [];
    
    this.dispatch = this.dispatch.bind(this);
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = newState;
    this.listeners.forEach((fn) => fn());
  }

  dispatch(action, data) {
    const fn = this.actions[action];
    if (!fn) return;

    const state = fn(this.state, data);
    this.setState(state);
  }

  subscribe(handler) {
    this.listeners.push(handler);

    return () => {
      const index = this.listeners.indexOf(handler);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export function createState(initialState, actions) {
  return new State(initialState, actions);
}
