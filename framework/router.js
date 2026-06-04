class Router {
  constructor() {
    this.routes = new Map();
    this.handleRoute = this.handleRoute.bind(this);
  }

  init() {
    window.addEventListener("hashchange", this.handleRoute);
    this.handleRoute();
  }

  register(path, callback) {
    this.routes.set(path, callback);
  }

  handleRoute() {
    const path = window.location.hash.slice(1) || "/";

    const callback = this.routes.get(path) || this.routes.get("/");

    callback();
  }
}

export function createRouter() {
  return new Router();
}
