# react-module-hook
A react module hook for real configurable app with stateful persistent module tree and peer-to-peer messaging mechanism

## Usage
### 1. Install
```javascript
npm install react-module-hook
```

### 2. Import
```javascript
import useModule from "react-module-hook";
```
### 3. Call it in a render function
```javascript
...
const ReactComponent = props => {
  const { module, auth, router, request } = useAsModule(props, {
    // the default state for this module
    state:{},
    // the default props for this module
    props:{},
    // actions for this module
    actions:{"actionName":()=>()},
    // for extra data
    tagVar:{},
    // enable router
    router: true,
    // enable auth
    auth: true,
    // the request configure
    req_url : `${useModule.resolveURL( "data/demo.json" ) }`,
    req_data : { key : "value" },
    req_method : "post",
    req_baseURL : null,
    req_AUTH_TOKEN : null,
    req_header : null,
    req_config : null,
    req_execute : true
  }); 

  // ...
  // return JSX;
};
```
### 4. Use the component
```javascript
...
const ReactComSub1 = props => {
  const module = useAsModule(props, { }); 
  return (
    <div>
      ReactComSub1
    </div>
  );
};
const ReactComSub2 = props => {
  const module = useAsModule(props, { }); 
  return (
    <div>
      ReactComSub2 - {props.name}
    </div>
  );
};
const ReactCom = props => {
  const module = useAsModule(props, {
    state:{
      items:[{"name":"v1"},{"name":"v2"}]
    }
  }); 
  const XReactComSub2 = module.enhanceCom(ReactComSub2);
  return (
    <div>
      <ReactComSub1 usemodule_alias="alias1" usemodule_uid="uid1" usemodule_parent={module}/>
      <ReactComSub2 usemodule_alias="alias2" usemodule_uid="uid2" usemodule_parent={module}/>
      <XReactComSub2 usemodule_alias="alias3" usemodule_uid="uid3" x_id="x_id1" x_iterator="items"/>
    </div>
  );
};
```
```
[root]
  │  
  └─<ReactCom >
         │  
         ├<ReactComSub1 usemodule_alias="alias1">
         │  
         ├<ReactComSub2 usemodule_alias="alias2">
         │  
         └<XReactComSub2 usemodule_uid="alias3" x_id="x_id1">
```

## API 
### For the global variable useAsModule
#### `useModule.getRootModule`
> *Gets the root useModule*
----
getRootModule( )
```javascript
  // to get the root module
  const rootModule = useAsModule.getRootModule();
  // to print the module tree in the console
  rootModule.printTree();
```
#### useModule.getModule
----
getModule (idOrAlias / * String * /)
```javascript
  // to get a module with usemodule_uid="global_uid1"
  const module1 = useAsModule.getModule("global_uid1");
  // to get a module(in the root module) with usemodule_alias="alias1"
  const module2 = useAsModule.getModule("alias1");
  // to get a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const module3 = useAsModule.getModule("alias_in_root.alias_in_level1.alias_in_level2");  
```
#### useModule.sendMessageTo
----
sendMessageTo (receiver / * String, or Object * /, message / * Any * /) 
```javascript
  // to sent a message to module1
  const result1 = useAsModule.sendMessageTo(module1, "message");
  // to sent a message to a module with usemodule_uid="global_uid1"
  const resul2 = useAsModule.sendMessageTo("global_uid1", "message");
  // to sent a message to a module(in the root module) with usemodule_alias="alias1"
  const resul3 = useAsModule.sendMessageTo("alias1", "message");
  // to sent a message to a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useAsModule.sendMessageTo("alias_in_root.alias_in_level1.alias_in_level2", "message");  
```

#### useModule.dispatchActionTo
----
dispatchActionTo (receiver / * String, or Object * /, message / * Any * /) 
```javascript
  // to dispatch an action of module1
  const result1 = useAsModule.dispatchActionTo(module1, "actionName", [/*parameters*/]);
  // to dispatch an action of a module with usemodule_uid="global_uid1"
  const resul2 = useAsModule.dispatchActionTo("global_uid1", "actionName", [/*parameters*/]);
  // to dispatch an action of a module (in the root module) with usemodule_alias="alias1"
  const resul3 = useAsModule.dispatchActionTo("alias1", "actionName", [/*parameters*/]);
  // to dispatch an action of a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useAsModule.dispatchActionTo("alias_in_root.alias_in_level1.alias_in_level2", "actionName", [/*parameters*/]);
```
#### useModule.dispatchAsyncActionTo
----
dispatchAsyncActionTo (receiver / * String, or Object * /, message / * Any * /) 
```javascript
  // to dispatch an action of module1, asynchronously
  const result1 = useAsModule.dispatchAsyncActionTo(module1, "actionName", [/*parameters*/]);
  // to dispatch an action of a module with usemodule_uid="global_uid1"
  const resul2 = useAsModule.dispatchAsyncActionTo("global_uid1", "actionName", [/*parameters*/]);
  // to dispatch an action of a module (in the root module) with usemodule_alias="alias1"
  const resul3 = useAsModule.dispatchAsyncActionTo("alias1", "actionName", [/*parameters*/]);
  // to dispatch an action of a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useAsModule.dispatchAsyncActionTo("alias_in_root.alias_in_level1.alias_in_level2", "actionName", [/*parameters*/]);
```
#### useModule.updateStateFor
----
updateStateFor (target / * String, or Object * /, path / * Object, or [String...] * /, state / * Any * /, force / * Booelan * /) 
```javascript
  // to update state for module1
  useAsModule.updateStateFor(module1, { key:"value" });
  // to update state for a module with usemodule_uid="global_uid1"
  useAsModule.updateStateFor("global_uid1", "key", "value");
  // to update state for a module (in the root module) with usemodule_alias="alias1"
  useAsModule.updateStateFor("alias1", "keylevel1.keylevel2.keylevel3", "any");
  // to update state for a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  useAsModule.updateStateFor("alias_in_root.alias_in_level1.alias_in_level2", "key", "value");
```
#### useModule.fireEventFor
----
fireEventFor (target / * String, or Object * /, eventName/ * String * /, params / * Array * /) 
```javascript
  // to fire an event for module1
  const result1 = useAsModule.fireEventFor(module1, "eventName", [/*parameters*/]);
  // to dispatch an action for a module with usemodule_uid="global_uid1"
  const resul2 = useAsModule.fireEventFor("global_uid1", "eventName", [/*parameters*/]);
  // to dispatch an action for a module (in the root module) with usemodule_alias="alias1"
  const resul3 = useAsModule.fireEventFor("alias1", "eventName", [/*parameters*/]);
  // to dispatch an action for a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useAsModule.fireEventFor("alias_in_root.alias_in_level1.alias_in_level2", "eventName", [/*parameters*/]);
```
#### useModule.broadcast
----
broadcast (message / * Any * /) 
```javascript
  // to broadcast an message to all modules
  useAsModule.broadcast("message");
```
#### useModule.printModulesTree
----
printModulesTree ( )
```javascript
  // to print the module tree onto the console
  useAsModule.printModulesTree( );
```
#### useModule.resolveURL
----
resolveURL (relPath / * String * /) 
```javascript
  // to resolve a relative path for the resource url
  useAsModule.resolveURL("./img/pic.png");
```
#### useModule.getDataFromStore
----
getDataFromStore (path / * String, or [String...] * /)
```javascript
  // to get data from the global store
  useAsModule.getDataFromStore("path_level1.path_level2");
```
#### useModule.setDataToStore
----
setDataToStore (path / * String, or [String...] * /, value / * Any * /, clonePath / * Boolean * /) 
```javascript
  // to get data from the global store
  useAsModule.setDataToStore("path_level1.path_level2", {data:"value"}, false);
```

### For the module instance
#### getRootModule
----
getRootModule ()
```javascript
  // to get the root module
  const rootModule = module.getRootModule();
  // to print the module tree in the console
  rootModule.printTree();
```
#### getModule
----
getModule (idOrAlias / * String * /) 
```javascript
  // to get a module with usemodule_uid="global_uid1"
  const module1 = module.getModule("global_uid1");
  // to get a module(in the current module) with usemodule_alias="alias1"
  const module2 = module.getModule("alias1");
  // to get a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const module3 = module.getModule("alias_in_root.alias_in_level1.alias_in_level2");  
```
#### getModuleByAlias
----
getModuleByAlias (alias / * String * /) 
```javascript
  // to get a module(in the current module) with usemodule_alias="alias1"
  const module2 = module.getModuleByAlias("alias1");
```
#### sendMessageTo
----
sendMessageTo (receiver / * String, or Object * /, message / * Any * /) 
```javascript
  // to sent a message to module1
  const result1 = module.sendMessageTo(module1, "message");
  // to sent a message to a module with usemodule_uid="global_uid1"
  const resul2 = module.sendMessageTo("global_uid1", "message");
  // to sent a message to a module(in the current module) with usemodule_alias="alias1"
  const resul3 = module.sendMessageTo("alias1", "message");
  // to sent a message to a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = module.sendMessageTo("alias_in_root.alias_in_level1.alias_in_level2", "message");  
```
#### dispatchActionTo
----
dispatchActionTo (receiver / * String, or Object * /, message / * Any * /) 
```javascript
  // to dispatch an action of module1
  const result1 = module.dispatchActionTo(module1, "actionName", [/*parameters*/]);
  // to dispatch an action of a module with usemodule_uid="global_uid1"
  const resul2 = module.dispatchActionTo("global_uid1", "actionName", [/*parameters*/]);
  // to dispatch an action of a module (in the current module) with usemodule_alias="alias1"
  const resul3 = module.dispatchActionTo("alias1", "actionName", [/*parameters*/]);
  // to dispatch an action of a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = module.dispatchActionTo("alias_in_root.alias_in_level1.alias_in_level2", "actionName", [/*parameters*/]);
```
#### dispatchAsyncAction
----
dispatchAsyncAction (receiver / * String, or Object * /, message / * Any * /) 
```javascript
  // to dispatch an action of module1, asynchronously
  const result1 = module.dispatchAsyncAction(module1, "actionName", [/*parameters*/]);
  // to dispatch an action of a module with usemodule_uid="global_uid1"
  const resul2 = module.dispatchAsyncAction("global_uid1", "actionName", [/*parameters*/]);
  // to dispatch an action of a module (in the current module) with usemodule_alias="alias1"
  const resul3 = module.dispatchAsyncAction("alias1", "actionName", [/*parameters*/]);
  // to dispatch an action of a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = module.dispatchAsyncAction("alias_in_root.alias_in_level1.alias_in_level2", "actionName", [/*parameters*/]);
```
#### updateStateFor
----
updateStateFor (target / * String, or Object * /, path / * Object, or [String...] * /, state / * Any * /, force / * Booelan * /) 
```javascript
  // to update state for module1
  module.updateStateFor(module1, { key:"value" });
  // to update state for a module with usemodule_uid="global_uid1"
  module.updateStateFor("global_uid1", "key", "value");
  // to update state for a module (in the current module) with usemodule_alias="alias1"
  module.updateStateFor("alias1", "keylevel1.keylevel2.keylevel3", "any");
  // to update state for a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  module.updateStateFor("alias_in_root.alias_in_level1.alias_in_level2", "key", "value");
```
#### fireEventFor
----
fireEventFor (target / * String, or Object * /, eventName / * String * /, params / * Array * /) 
```javascript
  // to fire an event for module1
  const result1 = module.fireEventFor(module1, "eventName", [/*parameters*/]);
  // to dispatch an action for a module with usemodule_uid="global_uid1"
  const resul2 = module.fireEventFor("global_uid1", "eventName", [/*parameters*/]);
  // to dispatch an action for a module (in the current module) with usemodule_alias="alias1"
  const resul3 = module.fireEventFor("alias1", "eventName", [/*parameters*/]);
  // to dispatch an action for a module with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = module.fireEventFor("alias_in_root.alias_in_level1.alias_in_level2", "eventName", [/*parameters*/]);
```
#### broadcast
----
broadcast (message / * Any * /) 
```javascript
  // to broadcast an message to all modules
  module.broadcast("message");
```

#### sendMessage
----
sendMessage (essage / * Any * /) 
```javascript
  // to sent a message
  const result = module.sendMessage("message");
```
#### dispatchAction
----
dispatchAction (actionName / * String * /, params / * Array * /) 
```javascript
  // to dispatch an action
  const result = module.dispatchAction("actionName", [/*parameters*/]);
```
#### updateState
----
updateState (path / * Object, or [String...] * /, state / * Any * /, force / * Booelan * /) 
```javascript
  // to update state
  module.updateState({ key:"value" });
  module.updateState("key", "value");
  module.updateState("keylevel1.keylevel2.keylevel3", "any");
```
#### fireEvent
----
fireEvent (eventName / * String * /, params / * Array * /) 
```javascript
  // to fire an event
  const result = module.fireEvent("eventName", [/*parameters*/]);
```
#### useRef
----
useRef (refName / * String * /, value / * Any * /) 
```javascript
  // to use a ref
  module.useModuleRef("refName", "init vaule");
  // to get the ref
  const ref = module.refs["refName"];
```
#### getRef
----
getRef (refName / * String * / ) 
```javascript
  // to get the ref
  const ref = module.refs["refName"];
```

## Quickstart
### Basic Demo
```javascript
import React from "react";
import useModule from "react-module-hook";

export default (props) => {  
  const { module } = useModule(props, {
    actions: {
      callback: (msg) => module.updateState({ msg })
    }
  });
  return (
    <div style={{ border: "1px dashed", padding: "1em" }}>
      <h2>useModule demo {">"} modules interaction</h2>
      <div><strong>{"<"}Module1{">"}</strong></div>{" "} <p />
      <button onClick={(e) => module.updateStateFor("alias_in_parent", { value: "Value updated by updateState" }) }>
        updateState for Module2
      </button>{" | "}
      <button onClick={(e) => module.sendMessageTo("alias_in_parent", "Value updated by sendMessage") }>
        sendMessage to Module2
      </button>{" | "}
      <button onClick={(e) => useModule.dispatchActionTo("global_uid", "updValue", [ "Value updated by dispatchAction" ]) }>
        dispatchAction to Module2
      </button><p />
      <div> Callback Message: "{module.state.msg || "No callback yet"}"</div><p />
      <Module2 usemodule_alias="alias_in_parent" usemodule_parent={module}/>
      <Module2 usemodule_uid="global_uid"/> 
    </div>
  );
};

export const Module2 = (props) => {
  const { module } = useModule(props, {
    props: {
      onMessage: (value) => {
        module.updateState({ value });
        module.parent.dispatchAction("callback", ["Message received"]);
      }
    },
    actions: {
      updValue: (value) => {
        module.updateState({ value });
      }
    }
  });
  return (
    <div style={{ border: "1px dashed", padding: "1em" }}>
      <div><strong>{"<"}Module2{">"}</strong> ( {props.usemodule_alias?("alias='" + props.usemodule_alias+"'"):""} {props.usemodule_uid?("uid='" + props.usemodule_uid+"'"):""} )</div>{" "}<p />
      value = "<strong>{module.state.value}</strong>"
    </div>
  );
};
```
#### Screenshot
<img src="https://raw.githubusercontent.com/linb/react-module-hook/master/image/demo1.png"  width="600">

#### Module Tree
```
[root]
  │  
  ├─<Module1>
  │     │  
  │     └<Module2 usemodule_alias="alias_in_parent">
  │      
  └<Module2 usemodule_uid="global_uid">
 ```
[Open the demo in CodeSandbox](https://codesandbox.io/s/thirsty-swirles-4iomy "react-module-hook basic demo")


### Meterial UI Demo
```javascript
import React from "react";
import useModule from "react-module-hook";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles4basic = makeStyles(theme => ({ item: { margin: theme.spacing(1) }, container: { padding: theme.spacing(1) } }));
const useStyles4Modal = makeStyles(theme => ({ root: { display: 'flex', alignItems: 'center', justifyContent: 'center' }, paper: { backgroundColor: theme.palette.background.paper, border: '2px solid #000', boxShadow: theme.shadows[5], padding: theme.spacing(2, 4, 3) } }));

const Module_Dialog = props => {
    const { module } = useModule(props, { });
    const styles_basic = useStyles4basic(props || {});

    return (
      <React.Fragment>
          <Button variant="contained" color="primary" className={ styles_basic.item } key="cyenksua" onClick={ ( e ) => {module.updateStateFor("Alert_1", { open: true });} }>Alert</Button>
          <Button variant="contained" color="secondary" className={ styles_basic.item } onClick={ e => {module.dispatchActionTo("Confirm_1", "open"); } }>Confirm</Button>
          <Button variant="contained" color="default" className={ styles_basic.item } onClick={ e => {module.sendMessageTo("Prompt_1", "open");} }>Prompt</Button>

          <Alert  open={ false } usemodule_alias="Alert_1" usemodule_parent="{module}" title="Alert" description="Description" onOK={ () => alert("OK") }></Alert>
          <Confirm  open={ false } usemodule_alias="Confirm_1" usemodule_parent="{module}" title="Confirm" description="Description" onOK={ () => alert("OK") } onCancel={ () => alert("onCancel") } ></Confirm>
          <Prompt  open={ false } usemodule_alias="Prompt_1" usemodule_parent="{module}" title="Prompt" description="Description" onOK={ txt => alert("Result: " + txt) }  onCancel={ () => { alert("onCancel"); } }></Prompt>
      </React.Fragment>
    );
};

export default Module_Dialog;

export const Alert = props => {
    const style_modal = useStyles4Modal();
    const { module } = useModule(props, {
        props: {
            open: true,
            title: "Title",
            description: "Description",
            onOK: () => {}
        },
        state: {
            open: false
        },
        "actions": {
            "open": function () {
                this.updateState({ open: true });
            },
            "close": function () {
                this.updateState({ open: false });
            }
        }
    });
    const [defaultState, setDefaultState] = React.useState({
        "open": false
    });

    return  <React.Fragment>
        <Dialog open={module.props.open || module.state.open} onClose={() => module.dispatchAction("close")} fullWidth aria-labelledby="alert_9za5tayt_title" aria-describedby="alert_9za5tayt_description" key="7e8gz5b3">
            <DialogTitle id="alert_9za5tayt_title"> {module.props.title} </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert_9za5tayt_description">{module.props.description}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { module.props.onOK();module.dispatchAction("close");}}  color="primary"> OK </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
    ;
};

export const Confirm = props => {
    const style_modal = useStyles4Modal();
    const { module } = useModule(props, {
        props: {
            open: true,
            title: "Title",
            description: "Description",
            onOK: () => {},
            onCancel: () => {}
        },
        state: {
            open: false
        },
        "actions": {
            "open": function () {
                this.updateState({ open: true });
            },
            "close": function () {
                this.updateState({ open: false });
            }
        }
    });
    const [defaultState, setDefaultState] = React.useState({
        "open": false
    });

    return <React.Fragment>
            <Dialog open={module.props.open || module.state.open} onClose={() => module.dispatchAction("close")} fullWidth aria-labelledby="confirm_jlh80pil_title" aria-describedby="confirm_jlh80pil_description" key="2h6e3jqi">
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{props.description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                      module.props.onCancel();module.dispatchAction("close");
                    }} color="secondary">Cancel</Button>
                    <Button onClick={() => {module.props.onOK();module.dispatchAction("close");}} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    ;
};

export const Prompt = props => {
    const style_modal = useStyles4Modal();
    const { module } = useModule(props, {
        "props": {
            "open": true,
            "title": "Title",
            "description": "Description",
            "onOK": () => {},
            "onCancel": () => alert(9),
            "onMessage": msg => {
                if (msg == "open") {
                    module.updateState({
                        open: true
                    });
                }
            }
        },
        "state": {
            "open": false
        },
        "actions": {
            "open": function () {
                this.updateState({
                    open: true
                });
            },
            "close": function () {
                this.updateState({
                    open: false
                });
            }
        }
    });
    const [defaultState, setDefaultState] = React.useState({
        "open": false
    });

    return <React.Fragment>
            <Dialog open={module.props.open || module.state.open} onClose={() => module.dispatchAction("close")} fullWidth aria-labelledby="prompt_fn69vqpc_title" aria-describedby="prompt_fn69vqpc_description" key="blg87o2c">
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{props.description}</DialogContentText>
                    <TextField autoFocus margin="dense" defaultValue="" fullWidth onChange={e => 
                      setDefaultState(Object.assign({}, defaultState, { text: e.target.value }))
                    }></TextField>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={() => props.onCancel()}>Cancel</Button>
                    <Button onClick={() => {
                      props.onOK(defaultState.text);module.dispatchAction("close");
                    }} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    ;
};
```
#### Screenshot
<img src="https://raw.githubusercontent.com/linb/react-module-hook/master/image/demo2.png"  width="600">

#### Module Tree
```
[root]
  │  
  └─<Module_Dialog >
         │  
         ├<Alert usemodule_alias="Alert_1">
         │  
         ├<Confirm usemodule_alias="Confirm_1">
         │  
         └<Prompt usemodule_uid="Prompt_uid">
```

[Open the demo in CodeSandbox](https://codesandbox.io/s/strange-thompson-g4op5 "react-module-hook Materail-UI demo")
 
## npm
[npm link](https://www.npmjs.com/package/react-module-hook "react-module-hook NPM")

