(function() {
  const vscode = acquireVsCodeApi();
  const originState = {
    loading: false,
    channel: 'community',
  };

  const state = new Proxy(originState, {
    set: (obj, prop, value) => {
      obj[prop] = value;
      handleLoading();
      return true;
    },
  });

  const main = () => {
    bindChannel();
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
  };

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

  const insertHTML = (selector, html) => {
    const target = document.querySelector(selector);
    target.insertAdjacentHTML('beforeend', html);
  };

  main();
})();
