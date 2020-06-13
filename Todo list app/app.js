
/**
 * This is the javascript code defined in the playground.
 * In a larger application, this code should probably be moved in different
 * sub files.
 */
function app() {
  // This example is an implementation of the TodoList application, from the
  // www.todomvc.com project.  This is a non trivial application with some
  // interesting user interactions. It uses the local storage for persistence.
  //
  // In this implementation, we use the owl Store class to manage the state.  It
  // is very similar to the VueX store.
  const { Component, useState } = owl;
  const { useRef, useStore, useDispatch, onPatched, onMounted } = owl.hooks;

  //------------------------------------------------------------------------------
  // Constants, helpers
  //------------------------------------------------------------------------------
  const ENTER_KEY = 13;
  const ESC_KEY = 27;
  const LOCALSTORAGE_KEY = "todomvc";

  function useAutofocus(name) {
    let ref = useRef(name);
    let isInDom = false;
    function updateFocus() {
      if (!isInDom && ref.el) {
        isInDom = true;
        const current = ref.el.value;
        ref.el.value = "";
        ref.el.focus();
        ref.el.value = current;
      } else if (isInDom && !ref.el) {
        isInDom = false;
      }
    }
    onPatched(updateFocus);
    onMounted(updateFocus);
  }

  //------------------------------------------------------------------------------
  // Store
  //------------------------------------------------------------------------------
  const initialState = { todos: [], nextId: 1};

  const actions = {
      addTodo({ state }, title) {
          const todo = {
              id: state.nextId++,
              title,
              completed: false
          }
          state.todos.push(todo);
      },
      removeTodo({ state }, id) {
          const index = state.todos.findIndex(t => t.id === id);
          state.todos.splice(index, 1);
      },
      updateTodo({state, dispatch}, {id, title}) {
          const value = title.trim();
          if (!value) {
              dispatch('removeTodo', id);
          } else {
              const todo = state.todos.find(t => t.id === id);
              todo.title = value;
          }
      },
      toggleTodo({ state }, id) {
          const todo = state.todos.find(t => t.id === id);
          todo.completed = !todo.completed;
      },
      clearCompleted({ state, dispatch }) {
          for (let todo of state.todos.slice()) {
              if (todo.completed) {
                  dispatch("removeTodo", todo.id);
              }
          }
      },
      toggleAll({ state, dispatch }, completed) {
          for (let todo of state.todos) {
              todo.completed = completed;
          }
      },
  };

  //------------------------------------------------------------------------------
  // TodoItem
  //------------------------------------------------------------------------------
  class TodoItem extends Component {
      constructor() {
          super(...arguments);
          useAutofocus("input");
          this.state = useState({ isEditing: false });
          this.dispatch = useDispatch();
      }

      handleKeyup(ev) {
          if (ev.keyCode === ENTER_KEY) {
              this.updateTitle(ev.target.value);
          }
          if (ev.keyCode === ESC_KEY) {
              ev.target.value = this.props.title;
              this.state.isEditing = false;
          }
      }

      handleBlur(ev) {
          this.updateTitle(ev.target.value);
      }

      updateTitle(title) {
          this.dispatch("updateTodo", {title, id: this.props.id});
          this.state.isEditing = false;
      }
  }

  //------------------------------------------------------------------------------
  // TodoApp
  //------------------------------------------------------------------------------
  class TodoApp extends Component {
      constructor() {
          super(...arguments);
          this.state = useState({ filter: "all" });
          this.todos = useStore(state => state.todos);
          this.dispatch = useDispatch();
      }

      get visibleTodos() {
          switch (this.state.filter) {
              case "active": return this.todos.filter(t => !t.completed);
              case "completed": return this.todos.filter(t => t.completed);
              case "all": return this.todos;
          }
      }

      get allChecked() {
          return this.todos.every(todo => todo.completed);
      }

      get remaining() {
          return this.todos.filter(todo => !todo.completed).length;
      }

      get remainingText() {
          const items = this.remaining < 2 ? "item" : "items";
          return ` ${items} left`;
      }

      addTodo(ev) {
          if (ev.keyCode === ENTER_KEY) {
              const title = ev.target.value;
              if (title.trim()) {
                  this.dispatch("addTodo", title);
              }
              ev.target.value = "";
          }
      }

      setFilter(filter) {
          this.state.filter = filter;
      }
  }
  TodoApp.components = { TodoItem };

  //------------------------------------------------------------------------------
  // App Initialization
  //------------------------------------------------------------------------------

  function makeStore() {
      function saveState(state) {
          const str = JSON.stringify(state);
          window.localStorage.setItem(LOCALSTORAGE_KEY, str);
      }
      function loadState() {
          const localState = window.localStorage.getItem(LOCALSTORAGE_KEY);
          return localState ? JSON.parse(localState) : initialState;
      }

      const state = loadState();
      const store = new owl.Store({ state, actions });
      store.on("update", null, () => saveState(store.state));
      return store;
  }

  TodoApp.env.store = makeStore();
  const app = new TodoApp();
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
