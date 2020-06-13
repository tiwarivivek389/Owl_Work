
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {

  // This shows the expected use case of Portal
  // which is to implement something similar
  // to bootstrap modal
  const { Component, useState } = owl;
  const { Portal } = owl.misc;

  class Modal extends Component {}
  Modal.components = { Portal };

  class Dialog extends Component {}
  Dialog.components = { Modal };

  class Interstellar extends Component {}

  // Main root component
  class App extends Component {
      state = useState({
          name: 'Portal used for Dialog (Modal)',
          dialog: false,
          text: 'Hello !',
      });
  }
  App.components = { Dialog , Interstellar };

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
