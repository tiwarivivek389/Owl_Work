
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  // The goal of this component is to see how the t-transition directive can be
  // used to generate simple transition effects.
  const { Component, useState } = owl;

  class Counter extends Component {
      constructor() {
          super(...arguments);
          this.state = useState({ value: 0 });
      }

      increment() {
          this.state.value++;
      }
  }

  class App extends Component {
      constructor() {
          super(...arguments);
          this.state = useState({ flag: false, componentFlag: false, numbers: [] });
      }

      toggle(key) {
          this.state[key] = !this.state[key];
      }

      addNumber() {
          const n = this.state.numbers.length + 1;
          this.state.numbers.push(n);
      }
  }
  App.components = { Counter };

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
