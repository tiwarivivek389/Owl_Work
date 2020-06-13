
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  // This example illustrates how Owl enables single file components,
  // which include code, template and style.
  //
  // This is very useful in some situations, such as testing or quick prototyping.
  // Note that this example has no external xml or css file, everything is
  // contained in a single js file.

  const { Component, useState, tags } = owl;
  const { xml, css } = tags;

  // Counter component
  const COUNTER_TEMPLATE = xml`
    <button t-on-click="state.value++">
      Click! [<t t-esc="state.value"/>]
    </button>`;

  const COUNTER_STYLE = css`
    button {
      color: blue;
    }`;

  class Counter extends Component {
    state = useState({ value: 0})
  }
  Counter.template = COUNTER_TEMPLATE;
  Counter.style = COUNTER_STYLE;

  // App
  const APP_TEMPLATE = xml`
    <div>
      <Counter/>
      <Counter/>
    </div>`;

  class App extends Component {}
  App.template = APP_TEMPLATE;
  App.components = { Counter };

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
