
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  // This example illustrate how the t-model directive can be used to synchronize
  // data between html inputs (and select/textareas) and the state of a component.
  // Note that there are two controls with t-model="color": they are totally
  // synchronized.
  const { Component, useState } = owl;

  class Form extends Component {
      constructor() {
          super(...arguments);
          this.state = useState({
              text: "",
              othertext: "",
              number: 11,
              color: "",
              bool: false
          });
      }
  }

  // Application setup
  const form = new Form();
  form.mount(document.body);

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
