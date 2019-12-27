import Vue from 'vue';

export const initLoading = (isLoad = true) => {
  if (isLoad) {
    if (window.initLoading) {
      return;
    }
    window.initLoading = document.createElement('div');
    window.initLoading.className = 'init-loading';
    window.initLoading.innerHTML = `
              <div class="init-loading-warp">
                <div class="init-loading-main">
                <div class="init-loading-com" id="init-loading-three"></div>
                <div class="init-loading-com" id="init-loading-two"></div>
                <div class="init-loading-com" id="init-loading-one"></div>
                 </div>
                 </div>`;
    document.body.appendChild(window.initLoading);
  } else {
    if (!window.initLoading) {
      return;
    }
    try {
      document.body.removeChild(window.initLoading);
    } catch (e) {
      window.initLoading = undefined;
    } finally {
      window.initLoading = undefined;
    }
  }
};
export const loadInFull = (t = '正在加载...') => {
  if (window.$load) {
    return;
  }
  window.$load = document.createElement('div');
  window.$load.className = 'load-block';
  window.$load.innerHTML = `<div class="load"><i></i><span>${t}</span></div>`;
  document.body.appendChild(window.$load);
  window.$load.onclick = function(event) {
    document.body.removeChild(window.$load);
    window.$load = undefined;
	}

};
export const messageAlert =  {
  success(info) {
    if (window.$load) {
      return;
    }
    window.$load = document.createElement('div');
    window.$load.className = 'load-block';
    window.$load.innerHTML = `<div class="successLoad"><span>${info}</span></div>`;
    document.body.appendChild(window.$load);
    window.$load.onclick = function() {
      document.body.removeChild(window.$load);
      window.$load = undefined;
    }
  },
  warning(info) {
    if (window.$load) {
      return;
    }
    window.$load = document.createElement('div');
    window.$load.className = 'load-block';
    window.$load.innerHTML = `<div class="warningLoad"><span>${info}</span></div>`;
    document.body.appendChild(window.$load);
    window.$load.onclick = function() {
      document.body.removeChild(window.$load);
      window.$load = undefined;
    }
  },
  error(info) {
    if (window.$load) {
      return;
    }
    window.$load = document.createElement('div');
    window.$load.className = 'load-block';
    window.$load.innerHTML = `<div class="errorLoad"><span>${info}</span></div>`;
    document.body.appendChild(window.$load);
    window.$load.onclick = function() {
      document.body.removeChild(window.$load);
      window.$load = undefined;
    }
  },
  info(info) {
    if (window.$load) {
      return;
    }
    window.$load = document.createElement('div');
    window.$load.className = 'load-block';
    window.$load.innerHTML = `<div class="warningLoad"><span>${info}</span></div>`;
    document.body.appendChild(window.$load);
    window.$load.onclick = function() {
      document.body.removeChild(window.$load);
      window.$load = undefined;
    }
  },
  warn(info) {
    if (window.$load) {
      return;
    }
    window.$load = document.createElement('div');
    window.$load.className = 'load-block';
    window.$load.innerHTML = `<div class="warningLoad"><span>${info}</span></div>`;
    document.body.appendChild(window.$load);
    window.$load.onclick = function() {
      document.body.removeChild(window.$load);
      window.$load = undefined;
    }
  },
  loading(info) {
    if (window.$load) {
      return;
    }
    window.$load = document.createElement('div');
    window.$load.className = 'load-block';
    window.$load.innerHTML = `<div class="warningLoad"><span>${info}</span></div>`;
    document.body.appendChild(window.$load);
    window.$load.onclick = function() {
      document.body.removeChild(window.$load);
      window.$load = undefined;
    }
  }, 
};
// 数据加载中动画类zeplin
export const loadIn = () => {
  if (window.$loading) {
    return;
  }
  window.$loading = document.createElement('div');
  window.$loading.id = 'loading';
  window.$loading.innerHTML = `<div class="ripple ripple1"></div>
  <divclass="ripple ripple2"></div>
  <div class="ripple ripple3"></div>
  <div class="ripple ripple4"></div>`;
  document.body.appendChild(window.$loading);
};
export const loadOut = (name = 'loading') => {
  console.log('1')
  name = `$${name}`;
  const target = window[name];
  if (!target) return;
  target.classList.add('fade-out');
  setTimeout(() => {
    try {
      document.body.removeChild(window[name]);
    } catch (e) {
      window[name] = undefined;
    } finally {
      window[name] = undefined;
    }
  }, 250);
};
Vue.prototype.$initLoading = initLoading;
Vue.prototype.$loadIn = loadIn;
Vue.prototype.$loadInFull = loadInFull;
Vue.prototype.$loadOut = loadOut;
Vue.prototype.$messageAlert = messageAlert;
