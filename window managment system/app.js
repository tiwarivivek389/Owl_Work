
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  // This example is slightly more complex than usual. We demonstrate
  // here a way to manage sub windows in Owl, declaratively. This is still just a
  // demonstration. Managing windows can be as complex as we want.  For example,
  // we could implement the following features:
  // - resizing windows
  // - minimizing windows
  // - configuration options for windows to make a window non resizeable
  // - minimal width/height
  // - better heuristic for initial window position
  // - ...
  const { Component, useState } = owl;
  const { useRef } = owl.hooks;

  class HelloWorld extends Component {}

  class Counter extends Component {
    constructor() {
      super(...arguments);
      this.state = useState({ value: 0 });
    }

    inc() {
      this.state.value++;
    }
  }

  class Window extends Component {

    get style() {
      let { width, height, top, left, zindex } = this.props.info;

      return `width: ${width}px;height: ${height}px;top:${top}px;left:${left}px;z-index:${zindex}`;
    }

    close() {
      this.trigger("close-window", { id: this.props.info.id });
    }

    startDragAndDrop(ev) {
      this.updateZIndex();
      this.el.classList.add('dragging');
      const offsetX = this.props.info.left - ev.pageX;
      const offsetY = this.props.info.top - ev.pageY;
      let left, top;

      const el = this.el;
      const self = this;
      window.addEventListener("mousemove", moveWindow);
      window.addEventListener("mouseup", stopDnD, { once: true });

      function moveWindow(ev) {
        left = Math.max(offsetX + ev.pageX, 0);
        top = Math.max(offsetY + ev.pageY, 0);
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
      }
      function stopDnD() {
        window.removeEventListener("mousemove", moveWindow);
        const options = { id: self.props.info.id, left, top };
        self.el.classList.remove('dragging');
        self.trigger("set-window-position", options);
      }
    }

    updateZIndex() {
      this.trigger("update-z-index", { id: this.props.info.id });
    }
  }

  class WindowManager extends Component {
    constructor() {
      super(...arguments);
      this.windows = [];
      this.nextId = 1;
      this.currentZindex = 1;
      this.nextLeft = 0;
      this.nextTop = 0;
    }

    addWindow(name) {
      const info = this.env.windows.find(w => w.name === name);
      this.nextLeft = this.nextLeft + 30;
      this.nextTop = this.nextTop + 30;
      this.windows.push({
        id: this.nextId++,
        title: info.title,
        width: info.defaultWidth,
        height: info.defaultHeight,
        top: this.nextTop,
        left: this.nextLeft,
        zindex: this.currentZindex++,
        component: info.component
      });
      this.render();
    }

    closeWindow(ev) {
      const id = ev.detail.id;
      delete this.constructor.components[id];
      const index = this.windows.findIndex(w => w.id === id);
      this.windows.splice(index, 1);
      this.render();
    }

    setWindowPosition(ev) {
      const id = ev.detail.id;
      const w = this.windows.find(w => w.id === id);
      w.top = ev.detail.top;
      w.left = ev.detail.left;
    }

    updateZIndex(ev) {
      const id = ev.detail.id;
      const w = this.windows.find(w => w.id === id);
      w.zindex = this.currentZindex++;
      ev.target.style["z-index"] = w.zindex;
    }
  }
  WindowManager.components = { Window };

  class App extends Component {
    constructor() {
      super(...arguments);
      this.wmRef = useRef("wm");
    }

    addWindow(name) {
      this.wmRef.comp.addWindow(name);
    }
  }
  App.components = { WindowManager };

  const windows = [
    {
      name: "Hello",
      title: "Hello",
      component: HelloWorld,
      defaultWidth: 200,
      defaultHeight: 100
    },
    {
      name: "Counter",
      title: "Click Counter",
      component: Counter,
      defaultWidth: 300,
      defaultHeight: 120
    }
  ];

  App.env.windows = windows;
  const app = new App();
  app.mount(document.body);

}

/**
 * Initialization code
 * This code load templates, and make sure everything is properly connected.
 */
async function start() {
  let templates;
  try {
    templates = await owl.utils.loadFile('app.xml');
  } catch(e) {
    console.error(`This app requires a static server.  If you have python installed, try 'python app.py'`);
    return;
  }
  const env = { qweb: new owl.QWeb({templates})};
  owl.Component.env = env;
  await owl.utils.whenReady();
  app();
}

start();
