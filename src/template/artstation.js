(function() {
  const vscode = acquireVsCodeApi();
  const originState = {
    loading: false,
    channel: 'community',
    projectVisible: false,
    projectLoading: false,
    projectID: '',
  };

  const state = new Proxy(originState, {
    set: (obj, prop, value) => {
      obj[prop] = value;
      handleLoading();
      handleProjectVisible();
      handleProjectLoading();
      return true;
    },
  });

  const main = () => {
    bindChannel();
    bindProject();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('message', handleMessage);
  };

  const handleLoading = () => {
    const loading = document.querySelector('.loading-wrapper');
    if (state.loading) {
      loading.classList.add('active');
    } else {
      loading.classList.remove('active');
    }
  };

  const handleProjectVisible = () => {
    const overlay = document.querySelector('.project-overlay');
    if (state.projectVisible) {
      overlay.classList.add('visible');
    } else {
      overlay.classList.remove('visible');
    }
  };

  const handleProjectLoading = () => {
    const overlay = document.querySelector('.project-overlay');
    if (state.projectLoading) {
      overlay.classList.remove('loaded');
    } else {
      overlay.classList.add('loaded');
    }
  };

  /** DOM EVENTS: START **/
  const bindChannel = () => {
    const dom = document.querySelector('.channels-sorting-wrap');
    dom.addEventListener('click', (e) => {
      const li = e.target.parentElement;
      if (li.classList.value.includes('active')) {
        return;
      }
      const channel = li.getAttribute('data-channel');
      state.channel = channel;
      const list = document.querySelectorAll('.channels-sorting-item');
      for (const target of list) {
        target.classList.remove('active');
      }
      li.classList.add('active');
      state.loading = true;
      const gallery = document.querySelector('#gallery-grid-artstation');
      gallery.innerHTML = '';
      vscode.postMessage({
        command: 'channel',
        payload: channel,
      });
    });
  };

  const bindProject = () => {
    const projects = document.querySelector('#gallery-grid-artstation');
    projects.addEventListener('click', e => {
      const target = e.target.parentElement;
      const hashID = target.getAttribute('hash-id');
      vscode.postMessage({
        command: 'project',
        payload: hashID,
      });
      state.projectID = hashID;
      state.projectLoading = true;
      state.projectVisible = true;
    });
  };
   /** DOM EVENTS: END **/

  const handleScroll = () => {
    if (state.loading) {
      return;
    }
    const bottom = document.body.scrollHeight - (document.body.clientHeight + (window.scrollY || window.pageYOffset));
    if (bottom > 1) {
      return;
    }
    state.loading = true;
    vscode.postMessage({
      command: 'load-more',
      payload: state.channel,
    });
  };

  const handleMessage = event => {
    const message = event.data;
    messageLoadMore(message);
    messageChannel(message);
    messageProject(message);
  };

  /** MESSAGE CALLBACK: START */
  const messageLoadMore = message => {
    if (message.command !== 'load-more'
    || message.payload.channel !== state.channel) {
      return;
    }
    insertHTML('#gallery-grid-artstation', message.payload.html);
    state.loading = false;
  };

  const messageChannel = message => {
    if (message.command !== 'channel'
    || message.payload.channel !== state.channel) {
      return;
    }
    insertHTML('#gallery-grid-artstation', message.payload.html);
    state.loading = false;
  };

  const messageProject = message => {
    if (message.command !== 'project'
    || message.payload.hashID !== state.projectID) {
      return;
    }
    const wrapper = document.querySelector('.project-overlay-content');
    wrapper.innerHTML = message.payload.html;
    state.projectLoading = false;
  };
  /** MESSAGE CALLBACK: END */

  const insertHTML = (selector, html) => {
    const target = document.querySelector(selector);
    target.insertAdjacentHTML('beforeend', html);
  };

  main();
})();
