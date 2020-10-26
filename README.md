
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
----
> **getRootModule( )**  
> &emsp;&emsp;*Gets the root useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The root useModule element*  
```javascript
  // to get the root useModule element
  const rootModule = useAsModule.getRootModule();
  // to print the useModule tree in the console
  rootModule.printTree();
```
#### `useModule.getModule`
----
> **getModule ( idOrAlias )**  
> &emsp;&emsp;*Gets the useModule element according to it's uid or alias (if it's an useModule component added as an element in the root useModule element )*  
> **[return]**  
> &emsp;&emsp;*Object, The target useModule element*  
> **[parameters]**  
> * **idOrAlias**: *String, The target useModule element's uid or alias*  
```javascript
  // to get an useModule element with usemodule_uid="global_uid1"
  const module1 = useAsModule.getModule("global_uid1");
  // to get an useModule element(in the root an useModule element) with usemodule_alias="alias1"
  const module2 = useAsModule.getModule("alias1");
  // to get an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const module3 = useAsModule.getModule("alias_in_root.alias_in_level1.alias_in_level2");  
```
#### `useModule.sendMessageTo`
----
> **sendMessageTo ( receiver, message )**  
> &emsp;&emsp;*Sends a message to the target useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The return value of target useModule element's onMessage event*  
> **[parameters]**  
> * **receiver**: *String or Object, The target useModule element, which can be an useModule object, useModule uid or alias (if it's an useModule element added as an element in the root useModule element ).*  
> * **message**: *Object / Any, The message object, can be any value* 
```javascript
  // to sent a message to module1
  const result1 = useAsModule.sendMessageTo(module1, "message");
  // to sent a message to an useModule element with usemodule_uid="global_uid1"
  const resul2 = useAsModule.sendMessageTo("global_uid1", "message");
  // to sent a message to an useModule element(in the root module) with usemodule_alias="alias1"
  const resul3 = useAsModule.sendMessageTo("alias1", "message");
  // to sent a message to an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useAsModule.sendMessageTo("alias_in_root.alias_in_level1.alias_in_level2", "message");  
```

#### `useModule.dispatchActionTo`
----
> **dispatchActionTo ( receiver, actionName, params, from)**  
> &emsp;&emsp;*Dispatches an action for the target useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The target action's return value*  
> **[parameters]**  
> * **receiver**: *String or Object, The target useModule, which can be an useModule object, useModule uid or alias (if it's an useModule component added as an element in the root useModule element ).*  
> * **actionName**: *String, The action name to be dispatched* 
> * **params**: *Array, The parameters for the given action* 
> * **from**: *Object/Any, The from info that indicate who dispatch the action or can be other info* 
```javascript
  // to dispatch an action of module1
  const result1 = useAsModule.dispatchActionTo(module1, "actionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with usemodule_uid="global_uid1"
  const resul2 = useAsModule.dispatchActionTo("global_uid1", "actionName", [/*parameters*/]);
  // to dispatch an action of an useModule element(in the root module) with usemodule_alias="alias1"
  const resul3 = useAsModule.dispatchActionTo("alias1", "actionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useAsModule.dispatchActionTo("alias_in_root.alias_in_level1.alias_in_level2", "actionName", [/*parameters*/]);
```
#### `useModule.dispatchAsyncActionTo`
----
> **dispatchAsyncActionTo ( receiver, actionName, params, from)**  
> &emsp;&emsp;*Dispatches an asynchronous action for the target useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The target action's return value*  
> **[parameters]**  
> * **receiver**: *String or Object, The target useModule, which can be an useModule object, useModule uid or alias (if it's an useModule component added as an element in the root useModule element ).*  
> * **actionName**: *String, The action name to be dispatched* 
> * **params**: *Array, The parameters for the given action* 
> * **from**: *Object/Any, The from info that indicate who dispatch the action or can be other info* 
```javascript
  // to dispatch an action of module1, 
  const result1 = useAsModule.dispatchAsyncActionTo(module1, "asyncActionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with usemodule_uid="global_uid1"
  const resul2 = useAsModule.dispatchAsyncActionTo("global_uid1", "asyncActionName", [/*parameters*/]);
  // to dispatch an action of an useModule element (in the root module) with usemodule_alias="alias1"
  const resul3 = useAsModule.dispatchAsyncActionTo("alias1", "asyncActionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useAsModule.dispatchAsyncActionTo("alias_in_root.alias_in_level1.alias_in_level2", "asyncActionName", [/*parameters*/]);
```
#### `useModule.updateStateFor`
----
> **updateStateFor ( target, path, state, force )**  
> &emsp;&emsp;*Updates the module state for the target useModule element*  
> **[parameters]**  
> * **target**: *String or Object, The target useModule element, which can be an useModule element object, useModule uid or alias (if it's an useModule component added as an element in the root useModule element ).*  
> * **path**: *Object / Array< String > / String, **If it's an Array< String >: to** specify the path for updating the state; **If it's a string**: the string can be convert into an Array< String > after splitting by '.'; **If it's an object**: to specify the whole object to update the state, ignore the the 2nd parameter - state in this case.* 
> * **state**: *Object/Any, The object to update the state in the given path* 
> * **force**: *Boolean, Indicates whether force to update the state* 
```javascript
  // to update state for module1
  useAsModule.updateStateFor(module1, { key:"value" });
  // to update state for an useModule element with usemodule_uid="global_uid1"
  useAsModule.updateStateFor("global_uid1", "key", "value");
  // to update state for an useModule element (in the root module) with usemodule_alias="alias1"
  useAsModule.updateStateFor("alias1", "keylevel1.keylevel2.keylevel3", "value");
  // to update state for an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  useAsModule.updateStateFor("alias_in_root.alias_in_level1.alias_in_level2", "key", "value");
```
#### `useModule.fireEventTo`
 ----
> **fireEventTo ( target, eventName, params, from)**  
> &emsp;&emsp;*Fires an event for the target useModule element*  
>  **[return]**  
> &emsp;&emsp;*Object, The return value of the target event*  
> **[parameters]**  
> * **target**: *String or Object, The target useModule element, which can be an useModule element object, useModule uid or alias (if it's an useModule component added as an element in the root useModule element ).*  
> * **eventName**: *String, The action name to be dispatched* 
> * **params**: *Array, The parameters for the given action* 
> * **from**: *Object/Any, The from info that indicate who dispatch the action or can be other info* 
```javascript
  // to fire an event for module1
  const result1 = useAsModule.fireEventFor(module1, "eventName", [/*parameters*/]);
  // to fire an event for an useModule element with usemodule_uid="global_uid1"
  const resul2 = useAsModule.fireEventFor("global_uid1", "eventName", [/*parameters*/]);
  // to fire an event for an useModule element (in the root module) with usemodule_alias="alias1"
  const resul3 = useAsModule.fireEventFor("alias1", "eventName", [/*parameters*/]);
  // to fire an evnt for an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useAsModule.fireEventFor("alias_in_root.alias_in_level1.alias_in_level2", "eventName", [/*parameters*/]);
```
#### `useModule.broadcast`
 ----
> **broadcast ( channelName, message)**  
> &emsp;&emsp;*Broadcasts message to all useModule elements via a specified channel*  
>  **[return]**  
> &emsp;&emsp;*Object, The return value of the target event*  
> **[parameters]**  
> * **channelName**: *String, The channel name*  
> * **message**: *Object / Any, The message object, can be any value* 
```javascript
  // to broadcast an message to all useModule elements
  useAsModule.broadcast("message");
```
#### `useModule.printModulesTree`
 ----
> **printModulesTree ( )**  
> &emsp;&emsp;*Prints the useModule element tree to the console window*  
```javascript
  // to print the useModule element tree onto the console
  useAsModule.printModulesTree( );
```
#### `useModule.resolveURL`
----
> **resolveURL ( relPath )**  
> &emsp;&emsp;*Resolves an url from a relative path. You must use this to get the right url in the designer*  
>  **[return]**  
> &emsp;&emsp;*String, The resolved url*  
> **[parameters]**  
> * **relPath**: *String, The relative path for an url* 
```javascript
  // to resolve a relative path for the resource url
  useAsModule.resolveURL("./img/pic.png");
```
#### `useModule.getDataFromStore`
 ----
> **getDataFromStore ( path )**  
> &emsp;&emsp;*Gets data from the global store according to the path*  
>  **[return]**  
> &emsp;&emsp;*Object, The result data*  
> **[parameters]**  
> * **path**: *Array< String > /  String, **If it's an Array< String >**: to specify the path for the data; **If it's a String**: the string can be convert into an Array< String > after splitting by '.'* 
```javascript
  // to get data from the global store
  useAsModule.getDataFromStore("path_level1.path_level2");
```
#### `useModule.setDataToStore`
 ----
> **setDataToStore ( path, value, clonePath )**  
> &emsp;&emsp;*Sets data to the global store according to the path*    
> **[parameters]**  
> * **path**: *Array< String > /  String, **If it's an Array< String >**: to specify the path for the data; **If it's a String**: the string can be convert into an Array< String > after splitting by '.'* 
> * **value**: *Object / Any, The object to set* 
>  * **clonePath**: *Boolean,  Determines whether to clone the path or not* 
```javascript
  // to get data from the global store
  useAsModule.setDataToStore("path_level1.path_level2", {data:"value"}, false);
```

### For the module instance
#### `getRootModule`
----
> **getRootModule ( )**  
> &emsp;&emsp;*Gets the root useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The root useModule element*  
```javascript
  // to get the root useModule element
  const rootModule = module.getRootModule();
  // to print the useModule elements tree in the console
  rootModule.printTree();
```
#### `getModule`
----
> **getModule ( idOrAlias )**  
> &emsp;&emsp;*Gets the useModule element according to it's uid or alias (if it's an useModule component added as an element in the current module )*  
> **[return]**  
> &emsp;&emsp;*Object, The target module element*  
> **[parameters]**  
> * **idOrAlias**: *String, The target useModule element's uid or alias*  
```javascript
  // to get an useModule element with usemodule_uid="global_uid1"
  const module1 = module.getModule("global_uid1");
  // to get an useModule element(in the current module) with usemodule_alias="alias1"
  const module2 = module.getModule("alias1");
  // to get an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const module3 = module.getModule("alias_in_root.alias_in_level1.alias_in_level2");  
```
#### getModuleByAlias
 ----
> **getModuleByAlias ( alias )**  
> &emsp;&emsp;*Gets an useModule  element by the given alias in the current module, which must be an useModule element and has an alias (usemodule_alias)*  
> **[return]**  
> &emsp;&emsp;*Object, The returned element*  
> **[parameters]**  
> * **alias**: *String, The alias of the element* 
```javascript
  // to get a module(in the current module) with usemodule_alias="alias1"
  const module2 = module.getModuleByAlias("alias1");
```
#### `sendMessageTo`
----
> **sendMessageTo ( message )**  
> &emsp;&emsp;*Sends a message to the current useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The return value of the module's onMessage event*  
> **[parameters]**  
> * **message**: *Object / Any, The message object, can be any value* 
```javascript
  // to sent a message to module1
  const result1 = module.sendMessageTo(module1, "message");
  // to sent a message to an useModule element with usemodule_uid="global_uid1"
  const resul2 = module.sendMessageTo("global_uid1", "message");
  // to sent a message to an useModule element(in the current module) with usemodule_alias="alias1"
  const resul3 = module.sendMessageTo("alias1", "message");
  // to sent a message to an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = module.sendMessageTo("alias_in_root.alias_in_level1.alias_in_level2", "message");  
```
#### `dispatchAction`
----
> **dispatchAction ( actionName, params, from)**  
> &emsp;&emsp;*Dispatches an action for the target useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The target action's return value*  
> **[parameters]**  
> * **actionName**: *String, The action name to be dispatched* 
> * **params**: *Array, The parameters for the given action* 
> * **from**: *Object/Any, The from info that indicate who dispatch the action or can be other info* 
```javascript
  // to dispatch an action
  const result1 = module.dispatchAction("actionName", [/*parameters*/]);
```
#### `dispatchAsyncAction`
----
> **dispatchAsyncAction ( actionName, params, from)**  
> &emsp;&emsp;*Dispatches an asynchronous action for the target useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The target action's return value*  
> **[parameters]**  
> * **actionName**: *String, The action name to be dispatched* 
> * **params**: *Array, The parameters for the given action* 
> * **from**: *Object/Any, The from info that indicate who dispatch the action or can be other info* 
```javascript
  // to dispatch an async action
  const result1 = module.dispatchAsyncAction("asyncActionName", [/*parameters*/]);
``` 
#### `updateState`
----
> **updateState ( path, state, force )**  
> &emsp;&emsp;*Updates the module state for the current useModule element*  
> **[parameters]**  
> * **path**: *Object / Array< String > / String, **If it's an Array< String >: to** specify the path for updating the state; **If it's a string**: the string can be convert into an Array< String > after splitting by '.'; **If it's an object**: to specify the whole object to update the state, ignore the the 2nd parameter - state in this case.* 
> * **state**: *Object/Any, The object to update the state in the given path* 
> * **force**: *Boolean, Indicates whether force to update the state*
```javascript
  // If the old state is {key:'ovalue',key1:{key2:'ovalue'}}
  // the new state will be {key:'nvalue',key1:{key2:'ovalue'}}
  module.updateState({ "key":"nvalue" });
  // the new state will be {key:'nvalue',key1:{key2:'nvalue'}}
  module.updateState("key1,key2", "nvalue");
```
#### `fireEvent`
----
> **fireEvent ( eventName, params, from  )**  
> &emsp;&emsp;*Fires a specified event for the current useModule element*  
>  **[return]**  
> &emsp;&emsp;*Object, The return value of the target event*  
> **[parameters]**  
> * **eventName**: *String, The action name to be dispatched* 
> * **params**: *Array, The parameters for the given action* 
> * **from**: *Object/Any, The from info that indicate who dispatch the action or can be other info* 
```javascript
  // to fire an event 
  const result1 = module.fireEvent("eventName", [/*parameters*/]);
```
#### broadcast
 ----
> **broadcast ( channelName, message)**  
> &emsp;&emsp;*Broadcasts message to all useModule elements via a specified channel*  
>  **[return]**  
> &emsp;&emsp;*Object, The return value of the target event*  
```javascript
  // to broadcast an message to all useModule elements
  module.broadcast("message");
```
#### useRef
 ----
> **useRef ( refName, value )**  
> &emsp;&emsp;*Triggers a React.useRef to create a ref, which initialial value is 'value' , and can be retrieved by module.getRef('refName') .*  
>  **[return]**  
> &emsp;&emsp;*Object, The ref*  
> **[parameters]**  
> * **refName**: *String, The ref name* 
> * **value**: *Object/Any, The given initialial value* 
```javascript
  // to use a ref
  module.useRef("refName", "init vaule");
  // to get the ref
  const ref = module.refs["refName"];
  // or
  const ref = module.getRef("refName");  
```
#### getRef
 ----
> **useRef ( refName, value )**  
> &emsp;&emsp;*Gets a specified ref by the given name, this ref was created by module.useRef('refName', 'value').*  
>  **[return]**  
> &emsp;&emsp;*Object, The ref*  
> **[parameters]**  
> * **refName**: *String, The ref name* 
```javascript
  // to get the ref
  const ref = module.getRef("refName");
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

