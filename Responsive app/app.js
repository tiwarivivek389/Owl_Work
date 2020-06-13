
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  // In this example, we show how we can modify keys in the global environment to
  // make a responsive application.
  //
  // The main idea is to have a "isMobile" key in the environment, then listen
  // to resize events and update the env if needed.  Then, the whole interface
  // will be updated, creating and destroying components as needed.
  //
  // To see this in action, try resizing the window.  The application will switch
  // to mobile mode whenever it has less than 768px.

  //------------------------------------------------------------------------------
  // Components
  //------------------------------------------------------------------------------
  class Navbar extends owl.Component {}

  class MobileSearchView extends owl.Component {}

  class ControlPanel extends owl.Component {}
  ControlPanel.components = { MobileSearchView };

  class AdvancedComponent extends owl.Component {}

  class FormView extends owl.Component {}
  FormView.components = { AdvancedComponent };

  class Chatter extends owl.Component {
      constructor() {
          super(...arguments);
          this.messages = Array.from(Array(100).keys());
      }
  }

  class App extends owl.Component {}
  App.components = { Navbar, ControlPanel, FormView, Chatter };

  //------------------------------------------------------------------------------
  // Responsive plugin
  //------------------------------------------------------------------------------
  function setupResponsivePlugin(env) {
      const isMobile = () => window.innerWidth <= 768;
      env.isMobile = isMobile();
      const updateEnv = owl.utils.debounce(() => {
          if (env.isMobile !== isMobile()) {
              env.isMobile = !env.isMobile;
              env.qweb.forceUpdate();
          }
      }, 15);
      window.addEventListener("resize", updateEnv);
  }

  //------------------------------------------------------------------------------
  // Application Startup
  //------------------------------------------------------------------------------
  setupResponsivePlugin(App.env);

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
