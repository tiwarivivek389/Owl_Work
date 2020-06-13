
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  // This example shows all the possible lifecycle hooks
  //
  // The root component controls a sub component (DemoComponent). It logs all its lifecycle
  // methods in the console.  Try modifying its state by clicking on it, or by
  // clicking on the two main buttons, and look into the console to see what
  // happens.
  const { Component, useState } = owl;

  class DemoComponent extends Component {
      constructor() {
          super(...arguments);
          this.state = useState({ n: 0 });
          console.log("constructor");
      }
      async willStart() {
          console.log("willstart");
      }
      mounted() {
          console.log("mounted");
      }
      async willUpdateProps(nextProps) {
          console.log("willUpdateProps", nextProps);
      }
      willPatch() {
          console.log("willPatch");
      }
      patched() {
          console.log("patched");
      }
      willUnmount() {
          console.log("willUnmount");
      }
      increment() {
          this.state.n++;
      }
  }

  class App extends Component {
      constructor() {
          super(...arguments);
          this.state = useState({ n: 0, flag: true });
      }

      increment() {
          this.state.n++;
      }

      toggleSubComponent() {
          this.state.flag = !this.state.flag;
      }
  }
  App.components = { DemoComponent };

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
