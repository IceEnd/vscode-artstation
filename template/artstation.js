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

  const SELECTORS = {
    loadingWrapper: '.loading-wrapper',
    projectOverlay: '.project-overlay',
    projectOverlayClose: '.project-overlay .close',
    projectOverlayContent: '.project-overlay-content',
    channels: '.channels-sorting-wrap',
    channelItem: '.channels-sorting-item',
    gallery: '#gallery-grid-artstation',
    following: '.project-overlay .btn-following',
  };

  const main = () => {
    bindChannel();
    bindProject();
    bindCloseProject();
    bindFollow();
    bindSetBackground();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('message', handleMessage);
  };

  const handleLoading = () => {
    const loading = document.querySelector(SELECTORS.loadingWrapper);
    if (state.loading) {
      loading.classList.add('active');
    } else {
      loading.classList.remove('active');
      setTimeout(() => handleResize(), 200);
    }
  };

  const handleProjectVisible = () => {
    const overlay = document.querySelector(SELECTORS.projectOverlay);
    if (state.projectVisible) {
      overlay.classList.add('visible');
      document.body.classList.add('over-hidden');
    } else {
      overlay.classList.remove('visible');
      document.body.classList.remove('over-hidden');
    }
  };

  const handleProjectLoading = () => {
    const overlay = document.querySelector(SELECTORS.projectOverlay);
    if (state.projectLoading) {
      overlay.classList.remove('loaded');
    } else {
      overlay.classList.add('loaded');
    }
  };

  /** DOM EVENTS: START **/
  const bindChannel = () => {
    const dom = document.querySelector(SELECTORS.channels);
    dom.addEventListener('click', (e) => {
      const li = e.target.parentElement;
      if (li.classList.value.includes('active')) {
        return;
      }
      const channel = li.getAttribute('data-channel');
      state.channel = channel;
      const list = document.querySelectorAll(SELECTORS.channelItem);
      for (const target of list) {
        target.classList.remove('active');
      }
      li.classList.add('active');
      state.loading = true;
      const gallery = document.querySelector(SELECTORS.gallery);
      gallery.innerHTML = '';
      vscode.postMessage({
        command: 'channel',
        payload: channel,
      });
    });
  };

  const bindProject = () => {
    const projects = document.querySelector(SELECTORS.gallery);
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

  const bindCloseProject = () => {
    const close = document.querySelector(SELECTORS.projectOverlayClose);
    close.addEventListener('click', () => {
      state.projectVisible = false;
    });
  };

  const bindFollow = () => {
    window.artstationFollow = (id) => {
      const target = document.querySelector(SELECTORS.following);
      if (target.classList.value.includes('disabled')) {
        return;
      }
      target.classList.add('disabled');
      vscode.postMessage({
        command: 'following',
        payload: {
          id: String(id),
          followed: target.classList.value.includes('followed'),
          hashID: state.projectID,
        },
      });
    };
  };

  const bindSetBackground = () => {
    const overlay = document.querySelector(SELECTORS.projectOverlay);
    overlay.addEventListener('click', e => {
      if (!e.target.classList.value.includes('asset-actions-btn-bg')) {
        return;
      }
      vscode.postMessage({
        command: 'wallpaper',
        payload: {
          url: e.target.getAttribute('data-url'),
          for: e.target.getAttribute('data-for'),
        },
      });
      console.log(e.target);
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
    messageFollowing(message);
  };

  const handleResize = () => {
    if (!state.projectVisible || state.projectLoading) {
      return;
    }
    const assetsMain = document.querySelector('.project-assets');
    if (!assetsMain) {
      return;
    }
    const videoClipIframe = document.querySelectorAll('.asset.video-clip iframe');
    const width = assetsMain.clientWidth;
    for (const iframe of videoClipIframe) {
      const w = iframe.getAttribute('width');
      const h = iframe.getAttribute('height');
      iframe.setAttribute('width', width);
      iframe.setAttribute('height', Number(h) / Number(w) * width);
    }
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
    const wrapper = document.querySelector(SELECTORS.projectOverlayContent);
    wrapper.innerHTML = message.payload.html;
    state.projectLoading = false;
  };

  const messageFollowing = message => {
    if (message.command !== 'following'
    || message.payload.hashID !== state.projectID) {
      return;
    }
    const target = document.querySelector(SELECTORS.following);
    target.classList.remove('disabled');
    if (!message.payload.success) {
      return;
    }
    if (message.payload.followed) {
      target.classList.add('followed');
    } else {
      target.classList.remove('followed');
    }
  };
  /** MESSAGE CALLBACK: END */

  const insertHTML = (selector, html) => {
    const target = document.querySelector(selector);
    target.insertAdjacentHTML('beforeend', html);
  };

  main();
})();
