
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  // In this example, we show how components can use the Context and 'useContext'
  // hook to share information between them.
  const { Component, Context } = owl;
  const { useContext } = owl.hooks;

  class ToolbarButton extends Component {
      constructor() {
          super(...arguments);
          this.theme = useContext(this.env.themeContext);
      }

      get style () {
          const theme = this.theme;
          return `background-color: ${theme.background}; color: ${theme.foreground}`;
      }
  }

  class Toolbar extends Component {}
  Toolbar.components = { ToolbarButton };

  // Main root component
  class App extends Component {
      toggleTheme() {
          const { background, foreground } = this.env.themeContext.state;
          this.env.themeContext.state.background = foreground;
          this.env.themeContext.state.foreground = background;
      }
  }
  App.components = { Toolbar };

  // Application setup
  const themeContext = new Context({
     background: '#000',
     foreground: '#fff',
  });
  // Add the themeContext the environment to make it available to all components
  App.env.themeContext = themeContext;
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
