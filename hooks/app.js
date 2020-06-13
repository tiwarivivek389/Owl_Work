
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  // In this example, we show how hooks can be used or defined.
  const {useState, onMounted, onWillUnmount} = owl.hooks;

  // We define here a custom behaviour: this hook tracks the state of the mouse
  // position
  function useMouse() {
      const position = useState({x:0, y: 0});

      function update(e) {
          position.x = e.clientX;
          position.y = e.clientY;
      }
      onMounted(() => {
          window.addEventListener('mousemove', update);
      });
      onWillUnmount(() => {
          window.removeEventListener('mousemove', update);
      });

      return position;
  }


  // Main root component
  class App extends owl.Component {
      constructor() {
          super(...arguments);
          // simple state hook (reactive object)
          this.counter = useState({ value: 0 });

          // this hooks is bound to the 'mouse' property.
          this.mouse = useMouse();
      }

      increment() {
          this.counter.value++;
      }
  }

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
