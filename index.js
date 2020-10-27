import React from "react";

let _index = 0;
const getRand = (a) => (a || "") + parseInt(10e8 * Math.random(), 10).toString(36),
  getNo = (a) => (a || "") + (++_index).toString(36),
  asyncExecute = (fun, defer=0, key=getRand(), args=[], scope=null, resolve, reject) => {
    var task, cache =
    asyncExecute.$cache ||
        ((asyncExecute.get = asyncExecute.exists = function (k) {
          return this.$cache[k];
        }) &&
          (asyncExecute.run = function (k, c) {
            c = this.$cache[k];
            if (c) {
              clearTimeout(c.id);
              c.task();
              delete this.$cache[k];
            }
          }) &&
          (asyncExecute.cancel = function (k) {
            asyncExecute(k);
          }) &&
          (asyncExecute.$cache = {}));
    key = key || (key=getRand());
    if (cache[key]) clearTimeout(cache[key].id);
    if (typeof fun === "function") {
      task = function () {
        delete cache[key];
        try{
          var rst = fun.apply(scope || null, args);
          if(isFunction(resolve))resolve(rst);
        }catch(e){
          if(isFunction(reject))reject(e);
        }
      };
      return (cache[key] = { id: setTimeout(task, defer), task: task });
    } else delete cache[key];
  },
  promise = (fun, defer=0, key=getRand(), args=[], scope=null) => {
    return new Promise((resolve, reject) => {
      asyncExecute(fun, defer, key, args, scope, resolve, reject);
    });
  },

  _to = Object.prototype.toString,
  isBoolean = value => value === true || value === false,
  isString = value => typeof(value) === 'string',
  isNumber = value => typeof(value) === 'number' && !isNaN(value),
  isNumeric = value => (typeof(value) === 'number' || (typeof(value) === "string" && value.trim() !== '')) && !isNaN(value),
  isDate = value => !!value && _to.call(value) === '[object Date]' && isFinite(+value),
  isFunction = value => !!value && _to.call(value) === '[object Function]',
  isAsyncFunction = value => !!value && _to.call(value) === '[object AsyncFunction]',
  isRegexp = value => !!value && _to.call(value) === '[object RegExp]',
  isObject = value => !!value && _to.call(value) === "[object Object]",
  isArray = value => !!value && _to.call(value) === "[object Array]",
  isEmptyArray = value => isArray(value) && value.length===0,
  isEmptyObject = value => isObject(value) && value.keys.length===0,

  isDomElem = value =>  typeof HTMLElement === "object" ? value instanceof HTMLElement : value && typeof value === "object" && (value.nodeType === 1||value.nodeType === 11) && typeof value.nodeName==="string",
  isEvent = value => value instanceof Event,

  isReactClassCom = value =>  typeof value === 'function' && value.prototype && !!value.prototype.isReactComponent,
  isReactFunCom = value =>  typeof value === 'function' && !(value.prototype && !!value.prototype.isReactComponent) && React.isValidElement(value()),
  isReactCom = value => isReactClassCom(value) || isReactFunCom(value),
  isUseModuleCom = value => isReactFunCom(value) && (value._$enhancedUseModule|| /(const|let|var)\s+[{)}[\]$,\s\w]+\s*=\s*useModule\s*\(/.test(value+"")),

  isReactElem = value => React.isValidElement(value),
  isReactHTMLElem = value => isReactElem(value) && typeof value.type === 'string',
  isReactObjElem = value => isReactElem(value) && typeof value.type === 'function',
  isUseModuleElem = value => isReactObjElem(value) && value._useModuleSymbol === USE_MODULE_SYMBOL,

  hashForEach = (hash, action) => {
    for (let i in hash) if (false === action(hash[i], i)) break;
    return hash;
  },
  deepGet = (hash, path) => {
    if (!path) return hash;
    if (typeof path === "string") path = path.split(".");
    for (let i = 0, l = path.length; i < l; i++) {
      if (!hash) return;
      hash = hash[path[i]];
    }
    return hash;
  },
  deepSet = (hash, path, value, clonePath) => {
    if (clonePath)
      hash = isObject(hash)
        ? Object.assign({}, hash)
        : isArray(hash)
        ? hash.concat()
        : hash;
    if (typeof path === "string") path = path.split(".");
    let obj = hash,
      sub,
      last = path.pop();
    for (let i = 0, l = path.length; i < l; i++) {
      if (obj) {
        sub = obj[path[i]];
        if (clonePath)
          sub = isObject(sub)
            ? Object.assign({}, sub)
            : isArray(sub)
            ? sub.concat()
            : sub;
        obj[path[i]] = sub;
        obj = sub;
      }
    }
    obj[last] = value;
    return hash;
  },
  deepEquals = (x, y, layer, ignore, _curLayer) => {
    if (!_curLayer) _curLayer = 1;
    if (x === y) return true;
    if (!(x instanceof Object) || !(y instanceof Object)) return false;
    if (x.constructor !== y.constructor) return false;
    for (let p in x) {
      if (ignore && ignore(p)) continue;
      if (!x.hasOwnProperty(p)) continue;
      if (!y.hasOwnProperty(p)) return false;
      if (x[p] === y[p]) continue;
      if (typeof x[p] !== "object") return false;
      if (
        isObject(x[p]) &&
        isObject(y[p]) &&
        Object.keys(x[p]).length === 0 &&
        Object.keys(y[p]).length === 0
      )
        continue;
      if (
        isArray(x[p]) &&
        isArray(y[p]) &&
        x[p].length === 0 &&
        y[p].length === 0
      )
        continue;
      if (layer && _curLayer >= layer) {
        if (x[p] !== y[p]) return false;
        continue;
      } else if (!deepEquals(x[p], y[p], layer, ignore, _curLayer + 1))
        return false;
    }
    for (let p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
    }
    return true;
  },
  deepClone = (value) => {
    const exits = [],
      canClone = (value) => isObject(value) || isArray(value),
      hasExistObject = (value) => !!exits.find((obj) => obj === value),
      cloneArray = (value) =>
        value.map((item) => (canClone(item) ? deepClone(item) : item)),
      cloneObject = (value) => {
        let obj = {};
        for (let item in value) {
          if (canClone(value[item])) {
            obj[item] = deepClone(value[item]);
          } else {
            if (value.hasOwnProperty(item)) {
              obj[item] = value[item];
            }
          }
        }
        return obj;
      };
    if (!canClone(value) || hasExistObject(value)) return value;
    exits.push(value);
    return isArray(value)
      ? cloneArray(value)
      : isObject(value)
      ? cloneObject(value)
      : value;
  },

  getCookie = name => {
    let match = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)'),
        value = match ? match[2] : "";
    try { value = value ? JSON.parse(value): value }catch (e) { }
    return value;
  },
  setCookie = (key, value, options) => {
    value = isArray(value) || isObject(value) ? JSON.stringify(value) : value;
    let cookie = `${key}=${value}`;

    options = Object.assign({ expires: 0, domain: '', path: '', secure: false, httpOnly: false, maxAge: 0, sameSite: '' }, options);
    if (options.expires) {
        let date = new Date();
        date.setTime(date.getTime() + 1000 * options.expires);
        cookie += `; Expires=${date.toUTCString()}`;
    }
    document.cookie = cookie
      + (options.path?`; Path=${options.path}`:'')
      + (options.domain?`; Domain=${options.domain}`:'')
      + (options.maxAge?`; Max-Age=${options.maxAge}`:'')
      + (options.sameSite?`; SameSite=${options.sameSite}`:'')
      + (options.secure?'; Secure':'')
      + (options.httpOnly?'; HttpOnly':'');
  },
  removeCookie = key => setCookie(key, '', { expires: -3600 }),
  clearCookie = () => document.cookie.split(";").forEach( key => removeCookie(key.split("=")[0].trim()) ),
  setLocalStorage = (key, value) => {
    value = isArray(value) || isObject(value) ? JSON.stringify(value) : value;
    window.localStorage.setItem(key, value);
  },
  getLocalStorage = key => {
    let value = window.localStorage.getItem(key);
    try { value = value ? JSON.parse(value): value }catch (e) { }
    return value;
  },
  removeLocalStorage = key => window.localStorage.removeItem(key),
  clearLocalStorage = key => window.localStorage.clear(),
  postH5ChannelMessage = (channelName, message) => {
    const channel = new BroadcastChannel(channelName);
    channel.postMessage(message);
    channel.close();
  },
  // eslint-disable-next-line
  toUTF8 = str =>  str.replace(/[^\x00-\xff]/g, (a,b) => ('\\u' + ((b=a.charCodeAt())<16?'000':b<256?'00':b<4096?'0':'')+b.toString(16))),
  fromUTF8 = str => str.replace(/\\u([0-9a-f]{3})([0-9a-f])/g, (a,b,c) => String.fromCharCode((parseInt(b,16)*16+parseInt(c,16)))),
  makeURLQueryString = hash => {
    if(!isObject(hash))return '';

    let a=[], b=[], i, c, o;
    for(i in hash){
        a[(c = a.length)] = b[b.length] = encodeURIComponent(i);
        if((o=hash[i]) || o===0) a[c] += '='+encodeURIComponent(typeof o=='string'?o:JSON.toString(o));
    }
    return a.join('&');
  },
  getURLParams = (queryStr, key) => {
      if(!queryStr)
        return key?'':{};
      var arr, hash={}, a=queryStr.split('&');
      for(var i=0,l=a.length;i<l;i++){
          arr = a[i].split('=');
          try{
              hash[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1]||'');
          }catch(e){
              hash[arr[0]]=arr[1]||'';
          }
      }
      return key?hash[key]:hash;
  },
  selectLocalFiles = (contentType, multiple) => {
    return new Promise(resolve => {
      let input = document.createElement('input');
      input.type = 'file';
      input.multiple = multiple || false;
      input.accept = contentType || "";
      input.onchange = () => resolve(Array.from(input.files));
      if (!!window.ActiveXObject || "ActiveXObject" in window)  {
        var label=document.createElement( "div" );
        input.appendChild(label);
        label.click();
        input.removeChild(label);
      }else{
        input.click();
      }
    });
  },
  idleExecute = (fun, args, scope) => window.requestIdleCallback(()=>fun.apply(scope,args||[])),
  utils = {
    isBoolean, isString, isNumber, isNumeric, isDate, isFunction, isRegexp, isObject, isArray, isEmptyArray, isEmptyObject, isReactCom, isUseModuleCom, isEvent, isDomElem, isReactClassCom, isReactFunCom, isReactElem, isReactHTMLElem, isReactObjElem, isUseModuleElem,
    deepGet, deepSet, deepEquals, deepClone, getRand, getNo, promise, asyncExecute,
    getCookie, setCookie, removeCookie, clearCookie, getLocalStorage, setLocalStorage, removeLocalStorage, clearLocalStorage, 
    toUTF8, fromUTF8, idleExecute, makeURLQueryString, getURLParams, selectLocalFiles, postH5ChannelMessage
  },
  REPO = {},
  STATE_SYMBOL = Symbol('useModule state plugin'),
  REF_SYMBOL = Symbol('useModule ref plugin'),
  USE_MODULE_SYMBOL = Symbol('This is an useModule Component'),
  ReactError = error => Object.assign(error, { name: "Invariant Violation" }),
  arrProp = ["children"],
  hashProp = "options,_childrenMap,_uidMapAlias,_aliasMapUid,dftProps,dftState,props,refs,tagVar,actions,_enhancedComs,_CACHE".split(","),
  all_events = Object.freeze({
    beforeMergeState: "stateToMerge/*Object*/, force/*Boolean*/",
    onStateChanged: "state/*Object*/, force/*Boolean*/",
    onMessage: "message/*Object*/, sender/*Object*/",
    onChannelMessage: "message/*Object*/, channelName/*String*/, sender/*Object*/",
    onH5ChannelMessage: "message/*Object*/, channelName/*String*/",
    onHotKey: "event/*Event*/, key/*String*/, handler/*Object*/",
    onRender: "",
    onUpdate: "",
    onDestroy: ""
  }),
  stateKeepWords = ["$_replace_$","$_before_$","$_after_$"],
  RefPlugins = {},
  StatePlugins = {},
  EnhanceComPlugins_b = {},
  EnhanceComPlugins_a = {};


class Module {
  constructor(pwd) {
    if (pwd !== "*")
      throw new ReactError(new Error("Cant use new to create Module!"));
    var ns = this;
    ns._destroyed = false;
    ns.realState = [{}, ()=>{}];
    ns.domRef = ns.rendering = null;
    ns._enhancedIndex = 1;
    ns._wrapperMap = new Map();
    ns._useModuleSymbol = USE_MODULE_SYMBOL;
    ns._SN_ = getRand("SN_");
    hashProp.forEach((key) => (ns[key] = {}));
    arrProp.forEach((key) => (ns[key] = []));
  }
  isUseModule(){return true}
  _getMdlEventList() {
    return all_events;
  }
  getSupportedEvents() {
    const list = this._getModuleEventList();
    hashForEach(this.props, (v, i) => {
      if (!list.includes(i)) list.push(i);
    });
    return list;
  }
  updateAlias(alias) {
    var child = this, old = child.alias, mdl = child.parent;

    child.alias = alias;

    delete mdl._childrenMap[old];
    delete mdl._aliasMapUid[old];

    mdl._childrenMap[alias] = child;
    mdl._aliasMapUid[alias] = child._uid;
  }
  updateUid(uid) {
    var child = this, old = child._uid,mdl = child.parent;

    child._uid = uid;

    delete mdl._getRoot()._uidMapAlias[old];
    delete mdl._getRoot()._globalChildrenMap[old];
    delete mdl._uidMapAlias[old];

    mdl._getRoot()._uidMapAlias[uid] = child.alias;
    mdl._getRoot()._globalChildrenMap[uid] = child;
    mdl._uidMapAlias[uid] = child.alias;

    mdl._aliasMapUid[child.alias] = uid;
  }
  _getRoot() {
    return REPO[this.symbol];
  }
  _log(...params) {
    if (this._getRoot().debug) console.log.apply(console, params);
  }
  _destroy(type, deep) {
    let ns = this;
    if (ns._destroyed || ns._destroying) return;
    ns._destroying = 1;
    ns.destroy(deep);
    ns._log(`... to destroy [${ns.symbol} > ${ns._uid}] (${type})`);
  }
  _tryRender(force) {
    var ns = this;
    if (!ns.rendered || force) {
      ns.$onRender && ns.$onRender();
      ns.rendered = 1;
      ns.fireEvent("onRender");
    }
  }
  _useModuleState() {
    let ns = this;

    ns.domRef = React.useRef();
    ns.realState = React.useState(Object.assign((arr=>{const h={}; arr.forEach(i=>(h[i]={})); return h;})(stateKeepWords), ns.dftState));

    let timeMark;
    // for no UI case
    if (!ns.rendered) {
      timeMark = setTimeout(function () {
        if (!ns.rendered) ns._tryRender();
      }, 100);
    }
    // to handle css or other effect
    React.useEffect(
      () => {
        if (!ns.rendered) {
          if (timeMark) clearTimeout(timeMark);
          ns._tryRender();
        }
        let channel;
        const channelName = ns.props.H5BroadcastChannel;
        if(channelName){
          channel = new BroadcastChannel(channelName);
          channel.onmessage = e => ns.props.onH5ChannelMessage && ns.fireEvent("onH5ChannelMessage", [e, channelName]);
        }
        const hotKeys = ns.props.hotKeys;
        if(hotKeys && window && window.hotkeys){
          window.hotkeys(hotKeys, (e, handler) => ns.props.onHotKey && ns.fireEvent("onHotKey", [e, handler.key, handler]));
        }
        return () => {
          ns._destroy("unmounted");
          if(channel) channel.close();
          if(hotKeys && window && window.hotkeys) window.hotkeys.unbind(hotKeys);
        };
      },
      // only once
      [] // eslint-disable-line
    );

    ns.rendering = 1;
    React.useEffect(() => {
      if (ns.onceUpdate) {
        let once = ns.onceUpdate;
        delete ns.onceUpdate;
        once();
      }
      ns.$onUpdate && ns.$onUpdate();
      ns.fireEvent("onUpdate");
      ns.rendering = null;
    });

    ns.$onReady && ns.$onReady();
    ns.fireEvent("onReady");
  }
  destroy(deep) {
    let ns = this, root = ns._getRoot();
    if (ns._destroyed) return;
    ns.fireEvent("onDestroy");

    if(ns._checkSameAlias)clearTimeout(ns._checkSameAlias);
    if(ns._checkSameUid)clearTimeout(ns._checkSameUid);

    ns._log("%c[Destroy]", "background:#666;color:#fff", `[${ns.symbol} > ${ns._uid}]`, ns._ref, ns);

    if (deep) ns.children.forEach((child) => child.destroy(true));

    ns._destroyed = true;
    ns._enhancedIndex = 1;

    if (root.map_ref.has(ns._ref)) root.map_ref.delete(ns._ref);
    if (root.map_props.has(ns._props)) root.map_props.delete(ns._props);

    // if the same one
    if(deepGet(root._globalChildrenMap, [ns._uid,'_ref']) === ns._ref){
      delete root._uidMapAlias[ns._uid];
      delete root._globalChildrenMap[ns._uid];
    }
    const parent = ns.parent;
    if(parent){
      parent.children.splice(parent.children.findIndex((i) => i === ns),1);
      // if the same one
      if(deepGet(parent._childrenMap, [ns.alias, '_ref']) === ns._ref){
        delete parent._childrenMap[ns.alias];
        delete parent._uidMapAlias[ns._uid];
        delete parent._aliasMapUid[ns.alias];
      }
    }

    ns.domRef = ns.rendering = ns.parent = ns._useModuleSymbol = ns._ref = null;
    ns.rendered = 0;
    ns.realState = [{}, ()=>{}];
    hashProp.forEach(key => (ns[key] = {}));
    arrProp.forEach(key => (ns[key].length = 0));

    if(ns._wrapperMap)ns._wrapperMap.clear();
    if(ns._globalChildrenMap) ns._globalChildrenMap={};
    if(ns.map_lazy)ns.map_lazy.clear();
    if(ns.map_ref)ns.map_ref.clear();
    if(ns.map_props)ns.map_props.clear();
  }
  _addChild(uid, alias, ref, props) {
    const ns = this, root = ns._getRoot();
    let mdl = ns._childrenMap[alias], msg;
    if (mdl) {
      // clear old
      delete root._uidMapAlias[mdl._uid];
      delete root._globalChildrenMap[mdl._uid];
      msg = `The same uid '${uid}' already exists in useModule REPO [${mdl.symbol}]!`;
      mdl._checkSameUid = setTimeout(function () { console.error(msg) });
    }
    mdl = ns._childrenMap[alias];
    if (mdl) {
      //clear old
      delete ns._childrenMap[mdl.alias];
      delete ns._uidMapAlias[mdl._uid];
      delete ns._aliasMapUid[mdl.alias];
      msg = `The same alias '${alias}' already exists in parent module [${mdl.symbol} > ${mdl._uid}]!`;
      mdl._checkSameAlias = setTimeout(function () { console.error(msg) });
    }

    const child = new Module("*");
    child.alias = alias || uid;
    child._uid = uid;
    child.parent = ns;
    child._ref = ref;
    child._props = props;
    Object.defineProperty(child, "symbol", {
      value: ns.symbol
    });

    root._globalChildrenMap[child._uid] = child;
    root._uidMapAlias[child._uid] = child.alias;

    ns._childrenMap[child.alias] = child;
    ns._uidMapAlias[child._uid] = child.alias;
    ns._aliasMapUid[child.alias] = child._uid;
    ns.children.push(child);

    root.map_ref.set(ref, child);
    root.map_props.set(props, child);

    return child;
  }
  getModuleByAlias(alias) {
    let child = this._childrenMap[alias];
    // if destroyed, don't return
    return child && !child._destroyed ? child : null;
  }
  getModuleByAliasPath(aliasPath) {
    let child = this._getRoot();
    aliasPath = isArray(aliasPath) ? aliasPath : (aliasPath + "").split(".").map((s) => s.trim());
    aliasPath.forEach(alias => (child = child ? child.getModuleByAlias(alias) : null));
    return child;
  }
  getModuleByUID(uid) {
    return this._getRoot()._globalChildrenMap[uid];
  }
  getModule(idOrAlias) {
    return this.getModuleByUID(idOrAlias) || this.getModuleByAlias(idOrAlias) || this.getModuleByAliasPath(idOrAlias);
  }
  get state() {
    const state = Object.assign({}, this.realState[0]);
    stateKeepWords.forEach( w => delete state[w] );
    return state;
  }
  reRender() {
    this.realState[1](Object.assign({}, this.state));
  }
  _mergeState(state, force) {
    let ns = this;
    if(false !== ns.fireEvent("beforeMergeState", [state, force])){
      state = { ...ns.state, ...state };
      if (force || !deepEquals(state, ns.realState[0])) {
        ns.realState[1](state);
        ns.fireEvent("onStateChanged", [state, force]);
      }
    }
  }
  // replace/beforeNodes/afterNodes=false for doing nothing
  // replace=null/undefined for restore
  // beforeNodes/afterNodes=null/undefined for remove
	renderComAs(x_id, replace, beforeNodes, afterNodes){
    const ns=this,
      state = Object.assign({}, ns.realState[0]),
      self = state.$_replace_$ = Object.assign({}, state.$_replace_$),
      before = state.$_before_$ = Object.assign({}, state.$_before_$),
      after = state.$_after_$ = Object.assign({}, state.$_after_$);
    if(replace!==false)self[x_id] = replace;
    if(beforeNodes!==false)before[x_id] = [].concat(beforeNodes||[]);
    if(afterNodes!==false)after[x_id] = [].concat(afterNodes||[]);
    ns._mergeState(state);
  }
  /**
   *  update state to use module
   *
   * @param {String / Array / Object} path
   * @param {Object} state
   * @memberof Module
   */
  updateState(path, state, force) {
    if (isObject(path)) {
      state = path;
      path = null;
    } else {
      path = isArray(path) ? path : (path + "").split(".").map((s) => s.trim());
    }
    if((!path || path.length===0) && !isObject(state)){
      return;
    }
    if(!path || path.length===0){
      stateKeepWords.forEach( w => delete state[w] );
    }else{
      state = deepSet(this.state, path, state, true);
    }
    this._mergeState(state, force);
  }
  updateStateFor(target, path, state, force) {
    const receiver = target;
    target = typeof target === "object" ? target : this.getModule(target);
    if(!target)this._log(`Can't find any module by "${receiver}", updateState failed!`);
    target && target.updateState(path, state, force);
  }
  sendMessage(message, from) {
    return this.props.onMessage && this.fireEvent("onMessage", [message], from || this);
  }
  sendMessageTo(target, message) {
    const receiver = target;
    target = typeof target === "object" ? target : this.getModule(target);
    if(!target)this._log(`Can't find any module by "${receiver}", sendMessage failed!`);
    return target && target.sendMessage(message, this);
  }
  broadcast(channelName, message) {
    var from = this;
    for (let k in REPO) {
      if (k !== "_") {
        let root = REPO[k];
        root.props.broadcastChannel===channelName && root.props.onChannelMessage && root.fireEvent("onChannelMessage", [message, channelName, from]);
        hashForEach(
          root._globalChildrenMap,
          v => v.props.broadcastChannel===channelName && v.props.onChannelMessage && v.fireEvent("onChannelMessage", [message, channelName, from])
        );
      }
    }
  }
  // actions
  addActions(actions, force) {
    let ns = this;
    hashForEach(actions, (v, i) => {
      if (force || !ns.actions.hasOwnProperty(i)) {
        if (v && typeof(v)==="function") {
          ns.actions[i] = { task: v};
        } else if (v && isObject(v) && v.task && typeof(v.task)==="function") {
          ns.actions[i] = v;
        }
      }
    });
  }
  removeActions(actionList) {
    actionList.forEach((i) => delete this.actions[i]);
  }
  dispatchAction(name, params, from) {
    let ns = this, action = ns.actions[name], task=isObject(action) ? action.task : action;
    if (task && typeof(task) === "function") {
      params = isArray(params) ? params : params !== undefined ? [params] : [];
      params.push(from || ns);
      if(isAsyncFunction(task)) return (async () => {return task.apply(ns, params)} )();
      else return task.apply(ns, params);
    }
  }
  async dispatchAsyncAction(name, params, from) {
    return await this.dispatchAction(name, params, from);
  }
  dispatchActionTo(target, name, params) {
    const receiver = target;
    target = typeof target === "object" ? target : this.getModule(target);
    if(!target)this._log(`Can't find any module by "${receiver}", dispatch failed!`);
    return target && target.dispatchAction(name, params, this);
  }
  async dispatchAsyncActionTo(target, name, params) {
    return await this.dispatchActionTo(target, name, params);
  }
  // event handlers
  fireEvent(eventName, params, from) {
    let ns = this, handler = ns.props && ns.props[eventName];
    params = isArray(params) ? params : params !== undefined ? [params] : [];
    params.push(from || ns);
    if(handler && typeof(handler) === "function"){
      if(isAsyncFunction(handler)) return (async () => {return handler.apply(ns, params)} )();
      else return handler.apply(ns, params);
    }
  }
  fireEventFor(target, eventName, params) {
    const receiver = target;
    target = typeof target === "object" ? target : this.getModule(target);
    if(!target)this._log(`Can't find any module by "${receiver}", fireEvent failed!`);
    return target && target.fireEvent(eventName, params, this);
  }
  useRef(refName, value) {
    return (this.refs[refName] = React.useRef(value));
  }
  getRef(refName){
    return this.refs[refName]||null;
  }
  enhanceCom(component) {
    const module = this, map = module._wrapperMap;
    component = component || "div";
    if (map.has(component)) {
      return map.get(component);
    }
    const comDisplayName = typeof(component)=="string" ? component : (component.displayName || component.name || ("Unknown_" + module._enhancedIndex++));
    // useCallback not allowed here
    const Wrapper = React.forwardRef(function({children, ...props}, ref) {
      if(ref)props.ref=ref;

      const x_id = props.x_id;
      const realTag = isString(component)&&props.usemodule_tag&&isString(props.usemodule_tag) ? props.usemodule_tag: component;
      if(!x_id) return React.createElement(realTag, props, children);
      if(module._enhancedComs[x_id] && module.parent && module.parent.rendering){
        const msg = `The same x_id '${x_id}' already exists in the useModule`;
        setTimeout(function () { console.warn(msg) });
      }

      if(Wrapper._$enhancedUseModule) props.usemodule_parent = module;

      const realState = module.realState[0],
        replace = realState.$_replace_$[x_id],
        x_iterator = props.x_iterator;
      let iterator = x_iterator && (deepGet(module,['state',x_iterator]) || deepGet(module,['props',x_iterator]));

      if(iterator && !isArray(iterator))
        iterator = null;

      if(EnhanceComPlugins_b){
        hashForEach(EnhanceComPlugins_b, plugin => {
          plugin(component, props, children, ref, module, React);
        });
      }

      let wrap = (() => {
        return replace!==null && replace!==undefined ? replace : (
          iterator
            ? React.createElement(React.Fragment, null, iterator.map( item =>  React.createElement( realTag, Object.assign({}, props, isObject(item)?item:null, {key : item.key || getRand()}) ),children) )
            : React.createElement(realTag, props, children)
          )
        })();

      const before = realState.$_before_$, after = realState.$_after_$;
      // if has before/after nodes
      if((before && before[x_id] && before[x_id].length)||(after && after[x_id] && after[x_id].length))
        wrap = React.createElement(React.Fragment, null, [].concat((before&&before[x_id])||[], wrap, (after&&after[x_id])||[]));

      if(EnhanceComPlugins_a){
        hashForEach(EnhanceComPlugins_a, plugin => {
          let rst = plugin(wrap, component, props, children, ref, module, React);
          if(rst) wrap = rst;
        });
      }
      return module._enhancedComs[x_id] = wrap;
    });
    Wrapper.component = component;
    Wrapper._$enhancedUseModule = typeof(component)=="function" && /(const|let|var)\s+[{}[\]$,\s\w]+\s*=\s*useModule\s*\(/.test(component+"");
    Wrapper._$enhancedTagName = "X" + comDisplayName;

    map.set(component, Wrapper);
    module._log(`%c$Enhanced component "{comDisplayName}" `,"background:#666;color:#fff",` in [${module.symbol} > ${module._uid}]`);
    return Wrapper;
  };
}

const pickBranch = (symbol, debug) => {
  const root = REPO[symbol] || (REPO[symbol] = Object.assign(new Module("*"), {
      alias: symbol,
      _uid: symbol,
      _globalChildrenMap: {},
      debug: !!debug,

      map_props: new Map(),
      map_ref: new Map(),
      map_lazy: new Map()
    }));
  Object.defineProperty(root, "symbol", {
    value: symbol
  });
  return root;
};

// config: dftState, actions
const useModule = (props, options, branch) => {
  const ref = React.useRef( );
  let module = null, msg, uid, parent,
    root = REPO[(branch = branch && typeof branch === "string" ? branch : "_")];
  if (!root) root = useModule.pickBranch(branch);

  module = root.map_ref.get(ref);
  if(module){
    msg = `Got by ref`;
  }else{
    if(props){
      // serve side, will be re-rendered again for hook function
      module = root.map_props.get(props);
      if (module) {
        msg = `Got by props`;
      }
    }
  }

  if (!module) {
    parent = props && props.usemodule_parent;
    if (!parent || parent._useModuleSymbol !== USE_MODULE_SYMBOL)
      parent = null;
    uid = ref.current = (props && props.usemodule_uid) || getRand("UID_");
    // if re-rendered by React
    if(parent && !parent.rendering){
      module = root._globalChildrenMap[uid];
      if(module){
        msg = `Got by uid = ${uid}`;
      }else{
        module = props && props.usemodule_alias && parent._childrenMap[props.usemodule_alias];
        if(module){
          msg = `Got by alias - ${props.usemodule_alias}`;
        }
      }
    }
  }

  if(module){
      // sync props
      if(module._props !== props){
        root.map_props.delete(module._props);
        root.map_props.set(module._props = props, module);
        // console.log('sync props');
      }

      // sync ref
      if(module._ref !== ref){
        root.map_ref.delete(module._ref);
        ref.current = module._ref.current;
        root.map_ref.set(module._ref = ref, module);
        // console.log('sync ref');
      }
  }else{
    module = (parent || root)._addChild( uid, props && props.usemodule_alias, ref, props );

    msg = `Create`;

    if (options) module.options = options;
    // merge default conf
    if (options) {
      let t = options.state;
      t && Object.assign(module.dftState, t);
      Object.assign(module.realState[0], module.dftState);

      t = options.props;
      t && Object.assign(module.dftProps, t);
      t = options.actions;
      t && module.addActions(t);
      t = options.tagVar;
      t && Object.assign(module.tagVar, Object.assign({}, t, module.tagVar));

      Object.assign(module.props, module.dftProps);
    }
    module.module=module;
    for(let p in RefPlugins){
      const pi = RefPlugins[p](module);
      if(isObject(pi)){
        hashForEach(pi, (item,key) => {
          if(!module.hasOwnProperty(key)){
            item._useModuleSymbol = REF_SYMBOL;
            module[key]=item;
          }
        });
      }
    }
  }

  // merge props
  Object.assign(module.props, props);
  module._useModuleState();

  module._log(`%c[useModule] ${msg}`, "background:#000;color:#fff", `[${root.symbol} > ${module._uid}]`, ref, props, module);

  //return React.useMemo(()=>{
  var exp = { module };
  for(let p in StatePlugins)
    exp[p] = StatePlugins[p](module);
  return exp;
  //  },[]);
};
const STORE = {};
Object.freeze(Object.assign(useModule, {
  _CACHE:{},
  refPlugIn: (key, plugIn)=>{
    RefPlugins[key] = plugIn;
  },
  statePlugIn: (key, plugIn)=>{
    StatePlugins[key] = module => Object.assign({
      _useModuleSymbol: STATE_SYMBOL,
      _useModulePluginKey: key
    }, plugIn(module));
  },
  enhancePlugIn: (key, before, after) => {
    before && (EnhanceComPlugins_b[key] = before);
    after && (EnhanceComPlugins_a[key] = after);
  },
  hasPlugIn: (type, key) =>{
    return type==='ref' ? RefPlugins.hasOwnProperty(key) :
      type==='state' ? StatePlugins.hasOwnProperty(key) :
      (EnhanceComPlugins_a.hasOwnProperty(key) || EnhanceComPlugins_b.hasOwnProperty(key));
  },
  resolveURL: relPath => /^([\w]+:)?\/\//.test(relPath) ? relPath : ("./" + relPath.replace(/^[./]*/,"")),
  getDataFromStore: path => deepGet(STORE, path),
  setDataToStore: (path, value, clonePath) => deepSet(STORE, path, value, clonePath),
  useBranch: (symbol, debug) => (REPO._ = pickBranch(symbol || "$", debug)),
  removeBranch: symbol => {
    // protect the current one
    if (symbol !== "_" && REPO[symbol]) {
      REPO[symbol].destroy(true);
      delete REPO[symbol];
    }
    useModule.useBranch();
  },
  printModulesTree: branch => {
    const root = REPO[branch||'_'], print = (item, level) => {
      level = level || 0;
      console.log('%c' + ' '.repeat(4*level) + '|-> [uid: "'+item._uid+'"] [alias: "'+item.alias+'"]', "background:#000;color:#fff", item);
      level++;
      item.children.forEach( child => print(child, level) );
    };
    hashForEach(root._globalChildrenMap, item => {
      if(item.parent === root){
        print(item);
      }
    })
  },
  isRefPlugIn: obj => obj._useModuleSymbol === REF_SYMBOL,
  isStatePlugIn: obj => obj._useModuleSymbol === STATE_SYMBOL,

  utils,
  REPO,
  getRootModule: branch => REPO[branch||"_"],
  getModule: idOrAlias => REPO._ && REPO._.getModule(idOrAlias),
  broadcast: (channelName, message) => REPO._ && REPO._.broadcast(channelName, message),
  dispatchActionTo: (receiver, name, params) => REPO._ && REPO._.dispatchActionTo(receiver, name, params),
  dispatchAsyncActionTo: async (receiver, name, params) => REPO._ && REPO._.dispatchAsyncActionTo(receiver, name, params),
  sendMessageTo: (receiver, message) => REPO._ && REPO._.sendMessageTo(receiver, message),
  updateStateFor: (target, path, state, force) => REPO._ && REPO._.updateStateFor(target, path, state, force),
  fireEventFor: (target, eventName, params) => REPO._ && REPO._.fireEventFor(target, eventName, params)
}));
useModule.useBranch("$", true);

class LazyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error: error };
  }
  render(props) {
    if (this.state.error) {
      console.log("ERROR in ErrorBoundary", this.state.error);
      if(props.onError){
        const rst = props.onError(this.state.error);
        if(rst)return rst;
      }
      return React.createElement("span",{style:{'font-size':'75%'}}, `Error for loading "${props.url}" : ${ this.state.error}`)
    }
    return this.props.children;
  }
}
const Fallback = props => {
  React.useEffect(()=> {
    return ()=> {
      props.onSuccess && props.onSuccess()
      props._renderTrigger && props._renderTrigger()
      props._onOK && props._onOK()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if(props.onFallback){
    const rst = props.onFallback();
    if(rst)return rst;
  }
  return React.createElement("span", {style:{'font-size':'75%'}}, `"${props.url}" is loading...`);
}
const map_lazy = new Map();
const LazyComponent = React.forwardRef(({component, _usemodule_in_design, _renderTrigger, fallback, onFallback, onSuccess, onError, children, ...props}, ref) => {
  let com,url;
 if(_usemodule_in_design){
    url = /.*import\(['"](.*)['"]\)/.exec(props['data-usemodule_component']);
    url = (url && url[1]) || "";
    return React.createElement("div",{style:{border:'dashed #444 1px',padding:"4px",margin:"4px"}},
      [ React.createElement("div",{style:{'font-size':'75%'}},`<LazyComponent url='${url||''}'>`), com ]
    );
  }else{
    url = /.*import\(['"](.*)['"]\)/.exec(""+component);
    url = (url && url[1]) || "";
    if(component && typeof(component)==="function" && url){
      const branch = props._usemodule_branch, map = branch && REPO[branch] ? REPO[branch].map_lazy : map_lazy;
      if(map.has(component)){
        com = React.createElement(map.get(component), {ref, ...props}, children);
      }
      if(url && map.has(url)){
        com = React.createElement(map.get(url), {ref, ...props}, children);
      }
        const Lazy = React.lazy(component);
        com = React.createElement(LazyErrorBoundary, {branch, url, onError},
        React.createElement( React.Suspense, {
            fallback: branch ? React.createElement(Fallback, {url, _renderTrigger, _onOK:()=>{
              map.set(component, Lazy);
              map.set(url, Lazy);
            }, onFallback, onSuccess}) : null
          },
          React.createElement(Lazy, {ref, ...props}, children)
        )
      );
    }
    return com;
  }
});
const If = ({condition, exact, _usemodule_in_design, children, ...props} ) => {
  if(_usemodule_in_design){
    if(!isArray(children)) children = [children];
    children.unshift(React.createElement("div",null,`<If condition='${props['data-usemodule_condition']}'>`));
    return React.createElement("div",{style:{'font-size':'75%',border:'dashed #444 1px',padding:"4px",margin:"4px"}},children);
  }else
    return exact?condition===true:condition ? utils.isArray(children)? React.Children.map(children, child => child): (children || null) : null;
}
const Iterator = ({iterator, _usemodule_in_design, children, ...props} ) =>{
  if(_usemodule_in_design){
    if(!isArray(children)) children = [children];
    children.unshift(React.createElement("div",null,`<Iterator iterator='${props['data-usemodule_iterator']}'>`));
    return React.createElement("div",{style:{'font-size':'75%',border:'dashed #444 1px',padding:"4px",margin:"4px"}},children);
  }else
    if(isArray(iterator)){
      return iterator.map( item => isObject(item) ? React.Children.map(children, child => React.cloneElement(child, item)) : null );
    }else{
      return null;
    }
}
export { useModule, utils, LazyComponent, If, Iterator };