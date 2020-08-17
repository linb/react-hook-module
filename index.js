import React from "react";

let _index = 0;
const resetRun = (key, fun, defer, args, scope) => {
    var task, cache =
        resetRun.$cache ||
        ((resetRun.get = resetRun.exists = function (k) {
          return this.$cache[k];
        }) &&
          (resetRun.run = function (k, c) {
            c = this.$cache[k];
            if (c) {
              clearTimeout(c.id);
              c.task();
              delete this.$cache[k];
            }
          }) &&
          (resetRun.cancel = function (k) {
            resetRun(k);
          }) &&
          (resetRun.$cache = {}));
    if (cache[key]) clearTimeout(cache[key].id);
    if (typeof fun === "function") {
      task = function () {
        delete cache[key];
        fun.apply(scope || null, args || []);
      };
      cache[key] = { id: setTimeout(task, defer), task: task };
    } else delete cache[key];
  },
  hashForEach = (hash, action) => {
    for (let i in hash) if (false === action(hash[i], i)) break;
  },
  deepGet = (hash, path) => {
    if (!path) return hash;
    if (typeof path === "string") return hash[path];
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
  isObject = (value) => Object.prototype.toString.call(value) === "[object Object]",
  isArray = (value) => Object.prototype.toString.call(value) === "[object Array]",
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
  getRand = (a) => (a || "") + parseInt(10e8 * Math.random(), 10).toString(36),
  getNo = (a) => (a || "") + (++_index).toString(36),
  utils = { deepGet, deepSet, deepEquals, deepClone, getRand, getNo, resetRun, isObject, isArray },
  REPO = {},
  USE_MODULE_MARK = () => { return "This is an useModule Component"; },
  ReactError = function (error) { return Object.assign(error, { name: "Invariant Violation" }); },
  arrProp = "children".split(","),
  hashProp = "moduleStore,_childrenMap,_uidMapalias,_aliasMapuid,dftProps,dftState,props,refs,tagVar,actions".split("," ),
  all_events = Object.freeze({
    beforeMergeState: "stateToMerge/*object*/, force/*boolean*/",
    onStateChanged: "state/*object*/, force/*boolean*/",
    onMessage: "message/*object*/, sender/*object*/",
    onGlobalMessage: "message/*object*/, sender/*object*/",
    onRender: "",
    onUpdate: "",
    onDestroy: ""
  });

class Module {
  constructor(pwd) {
    if (pwd !== "*")
      throw new ReactError(new Error("Cant use new to create Module!"));
    var ns = this;
    ns._destroyed = false;
    ns.realState = [(ns._oldState = {}), (ns._initFun = function () {})];
    ns.domRef = null;
    ns._useModuleMark = USE_MODULE_MARK;
    ns._SN_ = getRand("SN_");
    hashProp.forEach((key) => (ns[key] = {}));
    arrProp.forEach((key) => (ns[key] = []));
  }
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
    delete mdl._aliasMapuid[old];

    mdl._childrenMap[alias] = child;
    mdl._aliasMapuid[alias] = child._uid;
  }
  updateUid(uid) {
    var child = this, old = child._uid,mdl = child.parent, root=mdl.getRootModule();

    child._uid = uid;

    delete root._uidMapalias[old];
    delete root._globalChildrenMap[old];
    delete mdl._uidMapalias[old];

    root._uidMapalias[uid] = child.alias;
    root._globalChildrenMap[uid] = child;
    mdl._uidMapalias[uid] = child.alias;

    mdl._aliasMapuid[child.alias] = uid;
  }
  getRootModule() {
    return REPO[this.symbol];
  }
  _log(...params) {
    if (this.getRootModule().debug) console.log.apply(console, params);
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
    // must be here, not in _useComState
    ns.realState = React.useState(ns.dftState);
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
        return () => {
          ns._destroy("unmounted");
        };
      },
      // only once
      [] // eslint-disable-line
    );

    // to manage children
    React.useEffect(() => {
      if (ns.onceUpdate) {
        let once = ns.onceUpdate;
        delete ns.onceUpdate;
        once();
      }
      ns.$onUpdate && ns.$onUpdate();
      ns.fireEvent("onUpdate");
    });

    ns.$onReady && ns.$onReady();
    ns.fireEvent("onReady");
  }
  destroy(deep) {
    let ns = this, root = ns.getRootModule();
    if (ns._destroyed) return;
    ns.fireEvent("onDestroy");

    if(ns._checkSameAlias)clearTimeout(ns._checkSameAlias);
    if(ns._checkSameUid)clearTimeout(ns._checkSameUid);

    ns._log("%c[Destroy]", "background:#666;color:#fff", `[${ns.symbol} > ${ns._uid}]`, ns.ref, ns);

    if (deep) ns.children.forEach((child) => child.destroy(true));

    ns._destroyed = true;

    const index = root.sequence_ref.indexOf(ns.ref);
    if (index !== -1) {
      root.sequence_ref.splice(index, 1);
      root.sequence_mdl.splice(index, 1);
      root.sequence_props.splice(index, 1);
    }
    // if the same one
    if(deepGet(root._globalChildrenMap, [ns._uid,'ref']) === ns.ref){
      delete root._uidMapalias[ns._uid];
      delete root._globalChildrenMap[ns._uid];
    }
    const parent = ns.parent;
    if(parent){
      parent.children.splice(parent.children.findIndex((i) => i === ns),1);
      // if the same one
      if(deepGet(parent._childrenMap, [ns.alias, 'ref']) === ns.ref){
        delete parent._childrenMap[ns.alias];
        delete parent._uidMapalias[ns._uid];
        delete parent._aliasMapuid[ns.alias];
      }
    }

    ns.domRef = ns.parent = ns._useModuleMark = ns.ref = null;
    ns.rendered = 0;
    ns.realState = [(ns._oldState = {}), (ns._initFun = function () {})];
    hashProp.forEach(key => (ns[key] = {}));
    arrProp.forEach(key => (ns[key].length = 0));
  }
  _addChild(uid, alias, ref, props) {
    const ns = this, root = ns.getRootModule();
    let mdl = root._globalChildrenMap[uid], msg;
    if (mdl) {
      // clear old
      delete root._uidMapalias[mdl._uid];
      delete root._globalChildrenMap[mdl._uid];
      msg = `The same uid '${uid}' already exists in useModule REPO [${mdl.symbol}]!`;
      mdl._checkSameUid = setTimeout(function () { console.error(msg) });
    }
    mdl = ns._childrenMap[alias];
    if (mdl) {
      //clear old
      delete ns._childrenMap[mdl.alias];
      delete ns._uidMapalias[mdl._uid];
      delete ns._aliasMapuid[mdl.alias];
      msg = `The same alias '${alias}' already exists in parent module [${mdl.symbol} > ${mdl._uid}]!`;
      mdl._checkSameAlias = setTimeout(function () { console.error(msg) });
    }

    const child = new Module("*");
    child.alias = alias || uid;
    child._uid = uid;
    child.parent = ns;
    child.ref = ref;
    Object.defineProperty(child, "symbol", {
      value: ns.symbol
    });

    root._globalChildrenMap[child._uid] = child;
    root._uidMapalias[child._uid] = child.alias;

    ns._childrenMap[child.alias] = child;
    ns._uidMapalias[child._uid] = child.alias;
    ns._aliasMapuid[child.alias] = child._uid;
    ns.children.push(child);

    root.sequence_ref.push(ref);
    root.sequence_mdl.push(child);
    root.sequence_props.push(props);

    return child;
  }
  getModuleByAlias(alias) {
    let child = this._childrenMap[alias];
    // if destroyed by react lsit mechanism, dont return
    return child && !child._destroyed ? child : null;
  }
  getModuleByAliasPath(aliasPath) {
    let child = this.getRootModule();
    aliasPath = isArray(aliasPath) ? aliasPath : (aliasPath + "").split(".").map((s) => s.trim());
    aliasPath.forEach(alias => (child = child ? child.getModuleByAlias(alias) : null));
    return child;
  }
  getModuleByUID(uid) {
    return this.getRootModule()._globalChildrenMap[uid];
  }
  getModule(idOrAlias) {
    return this.getModuleByUID(idOrAlias) || this.getModuleByAlias(idOrAlias) || this.getModuleByAliasPath(idOrAlias);
  }
  get state() {
    return this.realState[0];
  }
  reRender() {
    this.setState(Object.assign({}, this.state), true);
  }
  setState(state, force) {
    let ns = this;
    if (force || !deepEquals(state, this.realState[0])) {
      ns.realState[1](state);
      ns.fireEvent("onStateChanged", [state, force]);
    }
  }
  _mergeState(state, force) {
    let ns = this;
    if(false !== ns.fireEvent("beforeMergeState", [state, force])){
      ns._oldState = { ...ns.state };
      ns.setState({ ...ns.state, ...state }, force);
    }
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
    if (path && path.length > 0) {
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
  broadcast(message) {
    var from = this;
    for (let k in REPO) {
      if (k !== "_") {
        let root = REPO[k];
        root.props.onGlobalMessage && root.fireEvent("onGlobalMessage", [message], from);
        hashForEach(
          root._globalChildrenMap,
          (v) => v.props.onGlobalMessage && v.fireEvent("onGlobalMessage", [message], from)
        );
      }
    }
  }
  // actions
  addActions(actions, force) {
    let ns = this;
    hashForEach(actions, (v, i) => {
      if (force || !ns.actions.hasOwnProperty(i)) {
        if (typeof v === "function") {
          ns.actions[i] = v.bind(ns);
        } else if (v && isArray(v.tasks)) {
          let tasks;
          ns.actions[i] = {
            tasks: (tasks = v.tasks.concat())
          };
          tasks.forEach((f, j) => {
            if (typeof f === "function") {
              tasks[j] = f.bind(ns);
            } else {
              // TODO: action config
            }
          });
        }
      }
    });
  }
  removeActions(actionList) {
    actionList.forEach((i) => delete this.actions[i]);
  }
  dispatchAction(name, params, from) {
    let ns = this, action = ns.actions[name];
    params = isArray(params) ? params : params !== undefined ? [params] : [];
    params.push(from || ns);
    if (action) {
      if (typeof action === "function") {
        return action.apply(ns, params);
      } else if (isArray(action.tasks) && action.tasks[0]) {
        let rtn;
        action.tasks.forEach((task) => {
          if (typeof task === "function") {
            rtn = task.apply(ns, params);
          } else if (
            typeof task === "object" &&
            typeof task.method === "string"
          ) {
            // TODO: pseudo code
          }
        });
        return rtn;
      }
    }
  }
  dispatchActionTo(target, name, params) {
    const receiver = target;
    target = typeof target === "object" ? target : this.getModule(target);
    if(!target)this._log(`Can't find any module by "${receiver}", dispatch failed!`);
    return target && target.dispatchAction(name, params, this);
  }
  // event handlers
  fireEvent(eventName, params, from) {
    let ns = this, handler = ns.props && ns.props[eventName];
    params = isArray(params) ? params : params !== undefined ? [params] : [];
    params.push(from || ns);
    return handler && handler.apply(ns, params);
  }
  fireEventFor(target, eventName, params) {
    const receiver = target;
    target = typeof target === "object" ? target : this.getModule(target);
    if(!target)this._log(`Can't find any module by "${receiver}", fireEvent failed!`);
    return target && target.fireEvent(eventName, params, this);
  }
  useModuleRef(refName, value) {
    return (this.refs[refName] = React.useRef(value));
  }
}

const pickBranch = (symbol, debug) => {
  const root = REPO[symbol] || (REPO[symbol] = Object.assign(new Module("*"), {
      alias: symbol,
      _uid: symbol,
      _globalChildrenMap: {},
      debug: !!debug,

      sequence_mdl: [],
      sequence_props: [],
      sequence_ref: []
    }));
  Object.defineProperty(root, "symbol", {
    value: symbol
  });
  return root;
};

// config: dftState, actions
const useModule = (props, moduleStore, branch) => {
  const ref = React.useRef( );
  let module = null, index = -1, msg,
    root = REPO[(branch = branch && typeof branch === "string" ? branch : "_")];
  if (!root) root = useModule.useModule(branch);

  index = root.sequence_ref.indexOf(ref);
  if (index !== -1) {
    module = root.sequence_mdl[index];
    if(module)msg = `Got by ref`;
  }
  if (!module && props) {
    // serve side, will be re-rendered again for hook function
    index = root.sequence_props.indexOf(props);
    if (index !== -1) {
      module = root.sequence_mdl[index];
      ref.current = module.ref.current;
      root.sequence_ref[index] = module.ref = ref;
      if(module)msg = `Got by props`;
    }
  }

  if (!module) {
    let parent = props && props.usemodule_parent;
    if (!parent || parent._useModuleMark !== USE_MODULE_MARK)
      parent = null;
    const uid = ref.current = (props && props.usemodule_uid) || getRand("UID_");
    module = (parent || root)._addChild( uid, props && props.usemodule_alias, ref, props );

    msg = `Create`;

    if (moduleStore) module.moduleStore = moduleStore;
    // merge default conf
    if (moduleStore) {
      let t = moduleStore.state;
      t && Object.assign(module.dftState, t);
      Object.assign(module.realState[0], module.dftState);

      t = moduleStore.props;
      t && Object.assign(module.dftProps, t);
      t = moduleStore.actions;
      t && module.addActions(t);
      t = moduleStore.tagVar;
      t && Object.assign(module.tagVar, Object.assign({}, t, module.tagVar));

      Object.assign(module.props, module.dftProps);
    }
  }
  // merge props
  Object.assign(module.props, props);
  module._useModuleState();
  module._log(`%c[useModule] ${msg}`, "background:#000;color:#fff", `[${root.symbol} > ${module._uid}]`, ref, props, module);
  return module;
};
Object.freeze(Object.assign(useModule, {
  sharedStore: {},
  useBranch: (symbol, debug) => (REPO._ = pickBranch(symbol || "$", debug)),
  removeBranch: symbol => {
    // protect the current one
    if (symbol !== "_" && REPO[symbol]) {
      REPO[symbol].destroy(true);
      delete REPO[symbol];
    }
    useModule.useBranch();
  },
  printTree: branch => {
    const root = REPO[branch||'_'], print = (item, level) => {
      level = level || 0;
      console.log('%c' + ' '.repeat(4*level) + '|-> [uid: "'+item._uid+'"] [aias: "'+item.alias+'"]', "background:#000;color:#fff", item);
      level++;
      item.children.forEach( child => print(child, level) );
    };
    hashForEach(root._globalChildrenMap, item => {
      if(item.parent === root){
        print(item);
      }
    })
  },

  getRootModule: () => REPO._,
  getModule: idOrAlias => REPO._ && REPO._.getModule(idOrAlias),
  broadcast: message => REPO._ && REPO._broadcast(message),
  dispatchActionTo: (receiver, name, params) => REPO._ && REPO._.dispatchActionTo(receiver, name, params),
  sendMessageTo: (receiver, message) => REPO._ && REPO._.sendMessageTo(receiver, message),
  updateStateFor: (target, path, state, force) => REPO._ && REPO._.updateStateFor(target, path, state, force),
  fireEventFor: (target, eventName, params) => REPO._ && REPO._.fireEventFor(target, eventName, params),
  REPO, utils
}));

useModule.useBranch("$", true);
window && (window.useModule = useModule);

export default useModule;