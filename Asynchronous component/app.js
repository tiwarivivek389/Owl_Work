
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  // This example will not work if your browser does not support ESNext class fields

  // In this example, we have 2 sub components, one of them being async (slow).
  // However, we don't want renderings of the other sub component to be delayed
  // because of the slow component. We use the AsyncRoot component for this
  // purpose. Try removing it to see the difference.
  const { Component, useState } = owl;
  const { AsyncRoot } = owl.misc;

  class SlowComponent extends Component {
      willUpdateProps() {
          // simulate a component that needs to perform async stuff (e.g. an RPC)
          // with the updated props before re-rendering itself
          return new Promise(resolve => setTimeout(resolve, 1500));
      }
  }

  class NotificationList extends Component {}

  class App extends Component {
      constructor() {
          super(...arguments);
          this.state = useState({ value: 0, notifs: [] });
      }

      increment() {
          this.state.value++;
          const notif = "Value will be set to " + this.state.value;
          this.state.notifs.push(notif);
          setTimeout(() => {
              var index = this.state.notifs.indexOf(notif);
              this.state.notifs.splice(index, 1);
          }, 3000);
      }
  }
  App.components = {SlowComponent, NotificationList, AsyncRoot};

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
