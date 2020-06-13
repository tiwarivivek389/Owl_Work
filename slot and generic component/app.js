
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  // We show here how slots can be used to create generic components.
  // In this example, the Card component is basically only a container. It is not
  // aware of its content. It just knows where it should be (with t-slot).
  // The parent component define the content with t-set.
  //
  // Note that the t-on-click event, defined in the App template, is executed in
  // the context of the App component, even though it is inside the Card component
  const { Component, useState } = owl;

  class Card extends Component {
      constructor() {
          super(...arguments);
          this.state = useState({ showContent: true });
      }

      toggleDisplay() {
          this.state.showContent = !this.state.showContent;
      }
  }

  class Counter extends Component {
      constructor() {
          super(...arguments);
          this.state = useState({val: 1});
      }

      inc() {
          this.state.val++;
      }
  }

  // Main root component
  class App extends Component {
      constructor() {
          super(...arguments);
          this.state = useState({a: 1, b: 3});
      }

      inc(key, delta) {
          this.state[key] += delta;
      }
  }
  App.components = {Card, Counter};

  // Application setup
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
