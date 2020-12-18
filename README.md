# react-hook-module - version 0.3
A react module hook for real configurable app with stateful persistent module tree and peer-to-peer messaging mechanism

Created for https://crossui.com/ReactBuilder, but can power any React project.

## 1. Usage
### 1.1. Install
```javascript
npm install react-hook-module
```

### 1.2. Import
```javascript
import { useModule } from "react-hook-module";
```
### 1.3. Call it in a render function
```javascript
...
const ReactComponent = props => {
  const { module, auth, router, request } = useModule(props, {
    // the default state for this module
    state:{},
    // the default props for this module
    props:{
        // enable HotKeys
        enableHotKeys: true,
        // enable router
        enableRouter: true,
        // enable auth
        enableAuth: true,
        // the request configure
        enableRequest: true,
        req_url : `${useModule.resolveURL( "data/demo.json" ) }`,
        req_data : { key : "value" },
        req_method : "post",
        req_baseURL : null,
        req_AUTH_TOKEN : null,
        req_header : null,
        req_config : null,
        req_execute : true
    },
    // actions for this module
    actions:{"actionName":()=>()},
    // for extra data
    tagVar:{}    
  }); 

  // ...
  // return JSX;
};
```
### 1.4. Use the component
```javascript
...
const ReactComSub1 = props => {
  const { module } = useModule(props, { }); 
  return (
    <div>
      ReactComSub1
    </div>
  );
};
const ReactComSub2 = props => {
  const { module } = useModule(props, { }); 
  return (
    <div>
      ReactComSub2 - {props.name}
    </div>
  );
};
const ReactCom = props => {
  const { module } = useModule(props, {
    state:{
      items:[{"name":"v1"},{"name":"v2"}]
    }
  }); 
  const XReactComSub2 = module.enhanceCom(ReactComSub2);
  return (
    <div>
      <ReactComSub1 usemodule_alias="alias1" usemodule_uid="uid1" usemodule_parent={module}/>
      <ReactComSub2 usemodule_alias="alias2" usemodule_uid="uid2" usemodule_parent={module}/>
      <XReactComSub2 usemodule_alias="alias3" usemodule_uid="uid3" x_id="x_id1" x_iterator={module.state.items}/>
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

## 2. API 
### 2.1. useModule static functions
#### `useModule.getRootModule`
----
> **useModule.getRootModule( )**  
> &emsp;&emsp;*Gets the root useModule element.*  
> **[return]**  
> &emsp;&emsp;*Object, The root useModule element.*  
```javascript
  // to get the root useModule element
  const rootModule = useModule.getRootModule();
```
#### `useModule.getModule`
----
> **useModule.getModule ( idOrAlias )**  
> &emsp;&emsp;*Gets the useModule element by uid (usemodule_uid) or alias (usemodule_alias). Getting from alias is only for the child elements in the root useModule element )*  
> **[return]**  
> &emsp;&emsp;*Object, The result useModule element*  
> **[parameters]**  
> * **idOrAlias** [required] : *String, The target useModule element's uid or alias*  
```javascript
  // to get an useModule element with usemodule_uid="global_uid1"
  const module1 = useModule.getModule("global_uid1");
  // to get an useModule element (It's a child element in the root useModule element) with usemodule_alias="alias1"
  const module2 = useModule.getModule("alias1");
  // to get an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const module3 = useModule.getModule("alias_in_root.alias_in_level1.alias_in_level2");  
```
#### `useModule.sendMessageTo`
----
> **useModule.sendMessageTo ( receiver, message )**  
> &emsp;&emsp;*Sends a message to the target useModule element, which can  be received in it's onMessage event*  
> **[return]**  
> &emsp;&emsp;*Object, The return value of target useModule element's onMessage event*  
> **[parameters]**  
> * **receiver** [required] : *String or Object, The target useModule element, which can be an useModule object, useModule uid or alias (if it's a child  element in the root useModule element ).*  
> * **message** [required] : *Object / Any, The message, can be any value* 
```javascript
  // to sent a message to module1
  const result1 = useModule.sendMessageTo(module1, "message");
  // to sent a message to an useModule element with usemodule_uid="global_uid1"
  const resul2 = useModule.sendMessageTo("global_uid1", "message");
  // to sent a message to an useModule element ( a child element in the root useModule element) with usemodule_alias="alias1"
  const resul3 = useModule.sendMessageTo("alias1", "message");
  // to sent a message to an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useModule.sendMessageTo("alias_in_root.alias_in_level1.alias_in_level2", "message");  
```

#### `useModule.dispatchActionTo`
----
> **useModule.dispatchActionTo ( receiver, actionName, params, from)**  
> &emsp;&emsp;*Dispatches an action of the target useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The target action's return value*  
> **[parameters]**  
> * **receiver** [required] : *String or Object, The target useModule, which can be an useModule object, useModule uid or alias (only for those child elements in the root useModule element ).*  
> * **actionName** [required] : *String, The action name to be dispatched* 
> * **params** [optional] : *Array, The parameters for the given action* 
> * **from** [optional] : *Object/Any, The from info that indicates who dispatch the action or can be other info* 
```javascript
  // to dispatch an action of module1
  const result1 = useModule.dispatchActionTo(module1, "actionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with usemodule_uid="global_uid1"
  const resul2 = useModule.dispatchActionTo("global_uid1", "actionName", [/*parameters*/]);
  // to dispatch an action of an useModule element (a child element in the root useModule element) with usemodule_alias="alias1"
  const resul3 = useModule.dispatchActionTo("alias1", "actionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useModule.dispatchActionTo("alias_in_root.alias_in_level1.alias_in_level2", "actionName", [/*parameters*/]);
```
#### `useModule.dispatchAsyncActionTo`
----
> **useModule.dispatchAsyncActionTo ( receiver, actionName, params, from)**  
> &emsp;&emsp;*Dispatches an asynchronous action of the target useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The target action's return value*  
> **[parameters]**  
> * **receiver** [required] : *String or Object, The target useModule, which can be an useModule object, useModule uid or alias (only for the child elements in the root useModule element ).*  
> * **actionName** [required] : *String, The asynchronous action name to be dispatched* 
> * **params** [optional] : *Array, The parameters for the given action* 
> * **from** [optional] : *Object/Any, The from info that indicates who dispatch the action or can be other info* 
```javascript
  // to dispatch an action of module1, 
  const result1 = useModule.dispatchAsyncActionTo(module1, "asyncActionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with usemodule_uid="global_uid1"
  const resul2 = useModule.dispatchAsyncActionTo("global_uid1", "asyncActionName", [/*parameters*/]);
  // to dispatch an action of an useModule element (a child elemnt in the root useModule element) with usemodule_alias="alias1"
  const resul3 = useModule.dispatchAsyncActionTo("alias1", "asyncActionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useModule.dispatchAsyncActionTo("alias_in_root.alias_in_level1.alias_in_level2", "asyncActionName", [/*parameters*/]);
```
#### `useModule.updateStateFor`
----
> **useModule.updateStateFor ( target, path, state, force )**  
> &emsp;&emsp;*Updates the module state for the target useModule element*  
> **[parameters]**  
> * **target** [required] : *String or Object, The target useModule element, which can be an useModule element object, useModule uid or alias (only for those chlid elements in the root useModule element ).*  
> * **path** [required] : *Object / Array< String > / String, **If it's an Array< String >: to** specify the path for updating the state; **If it's a String**: the string can be convert into an Array< String > after splitting by '.'; **If it's an Object**: to specify the whole object to update the state, the 2nd parameter - 'state' will be ignored in this case.* 
> * **state** [optional] : *Object, The object to update the state in the given path* 
> * **force** [optional] : *Boolean, Indicates whether force to update the state. Default is false.* 
```javascript
  // to update state for module1
  useModule.updateStateFor(module1, { key:"value" });
  // to update state for an useModule element with usemodule_uid="global_uid1"
  useModule.updateStateFor("global_uid1", "key", "value");
  // to update state for an useModule element (a child element in the root useModule element) with usemodule_alias="alias1"
  useModule.updateStateFor("alias1", "keylevel1.keylevel2.keylevel3", "value");
  // to update state for an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  useModule.updateStateFor("alias_in_root.alias_in_level1.alias_in_level2", "key", "value");
```
#### `useModule.fireEventTo`
 ----
> **useModule.fireEventTo ( target, eventName, params, from)**  
> &emsp;&emsp;*Fires an event of the target useModule element*  
>  **[return]**  
> &emsp;&emsp;*Object, The return value of the target event*  
> **[parameters]**  
> * **target** [required] : *String or Object, The target useModule element, which can be an useModule element object, useModule uid or alias ( only for those child elements in the root useModule element ).*  
> * **eventName** [required] : *String, The event name* 
> * **params** [optional] : *Array, The parameters for the given event* 
> * **from** [optional] : *Object/Any, The from info that indicates who fire the event  or can be other info* 
```javascript
  // to fire an event for module1
  const result1 = useModule.fireEventFor(module1, "eventName", [/*parameters*/]);
  // to fire an event for an useModule element with usemodule_uid="global_uid1"
  const resul2 = useModule.fireEventFor("global_uid1", "eventName", [/*parameters*/]);
  // to fire an event for an useModule element (a child element in the root useModule element) with usemodule_alias="alias1"
  const resul3 = useModule.fireEventFor("alias1", "eventName", [/*parameters*/]);
  // to fire an evnt for an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useModule.fireEventFor("alias_in_root.alias_in_level1.alias_in_level2", "eventName", [/*parameters*/]);
```
#### `useModule.broadcast`
 ----
> **useModule.broadcast ( channelName, message)**  
> &emsp;&emsp;*Broadcasts message to all useModule elements via a specified channel, which can be received in all useModule elements' onChannelMessage event*  
> **[parameters]**  
> * **channelName** [required] : *String, The channel name*  
> * **message** [required] : *Object / Any, The message object, can be any value* 
```javascript
  // to broadcast an message to all useModule elements
  useModule.broadcast("channelName","message");
```
#### `useModule.printModulesTree`
 ----
> **useModule.printModulesTree ( )**  
> &emsp;&emsp;*Prints the useModule element tree to the console window*  
```javascript
  // to print the whole useModule element tree onto the console
  useModule.printModulesTree( );
```
#### `useModule.resolveURL`
----
> **useModule.resolveURL ( relPath )**  
> &emsp;&emsp;*Resolves an url from a relative path. If you want to use a relative resource path in the CrossUI Designer, it's a must*  
>  **[return]**  
> &emsp;&emsp;*String, The resolved url*  
> **[parameters]**  
> * **relPath** [required] : *String, The relative path for an url* 
```javascript
  // to resolve a relative path for the resource url
  useModule.resolveURL("./img/pic.png");
```
#### `useModule.getDataFromStore`
 ----
> **useModule.getDataFromStore ( path )**  
> &emsp;&emsp;*Gets data from the global store by the path*  
>  **[return]**  
> &emsp;&emsp;*Object, The result data*  
> **[parameters]**  
> * **path** [required] : *Array< String > /  String, **If it's an Array< String >**: to specify the path for the data; **If it's a String**: the string can be convert into an Array< String > after splitting by '.'* 
#### `useModule.setDataToStore`
 ----
> **useModule.setDataToStore ( path, value, clonePath )**  
> &emsp;&emsp;*Sets data to the global store by the path*    
> **[parameters]**  
> * **path** [required] : *Array< String > /  String, **If it's an Array< String >**: to specify the path for the data; **If it's a String**: the string can be convert into an Array< String > after splitting by '.'* 
> * **value** [required] : *Object / Any, The object to set* 
>  * **clonePath** [optional] : *Boolean,  Determines whether to clone the path or not. Default is false.* 
```javascript
  // to get data from the global store
  useModule.setDataToStore("path_level1.path_level2", {data:"value"}, false);
  // reusult: "value"
  useModule.getDataFromStore("path_level1.path_level2.data");
```
### 2.2. useModule utils functions
#### `useModule.utils.getRand`
 ----
> **useModule.utils.getRand ( preTag )**  
> &emsp;&emsp;*Gets a random string. The result like 'ca1gis'.*    
>  **[return]**  
> &emsp;&emsp;*String, The random string.*  
> **[parameters]**  
> * **preTag** [optional] : *String, The previous tag for the random string. Default is empty string.* 
```javascript
  // The result like 'ca1gis
  useModule.getRand();
  // The result like 'id_ca1gis'
  useModule.getRand("id_");
```
#### `useModule.utils.getNo`
 ----
> **useModule.utils.getNo ( preTag )**  
> &emsp;&emsp;*Gets a No. string. The result like 'a'.*    
>  **[return]**  
> &emsp;&emsp;*String, The No. string.*  
> **[parameters]**  
> * **preTag** [optional] : *String, The previous tag for the No. string. Default is empty string.* 
```javascript
  // The result like 'a'
  useModule.utils.getNo();
  // The result like 'id_a'
  useModule.utils.getNo("id_");
```
#### `useModule.utils.deepGet`
 ----
> **useModule.utils.deepGet ( object, path )**  
> &emsp;&emsp;*Gets data from the given object by the path.*    
>  **[return]**  
> &emsp;&emsp;*Object/Any, The result data.*  
> **[parameters]**  
> * **object** [required] : *Object, The target object.* 
> * **path** [required] : *Array< String > / String, The path. **If it's an Array< String >**: to specify the path for the data; **If it's a String**: the string can be convert into an Array< String > after splitting by '.'* 
```javascript
  // return 1
  useModule.utils.deepGet({a:{b:{c:1}}},'a.b.c');
  // return 1
  useModule.utils.deepGet({a:{b:{c:1}}},["a","b","c"]);
```
#### `useModule.utils.deepSet`
 ----
> **useModule.utils.deepSet ( object, path )**  
> &emsp;&emsp;*Sets data to the given object by the path.*    
>  **[return]**  
> &emsp;&emsp;*Object/Any, The target object.*  
> **[parameters]**  
> * **object** [required] : *Object, The target object.* 
> * **path** [required] : *Array< String > / String, The path. **If it's an Array< String >**: to specify the path for the data; **If it's a String**: the string can be convert into an Array< String > after splitting by '.'* 
> * **value** [required] : *Object/Any, The value to set.*  
> * **clonePath** [optional] : *Boolean, Determines whether to clone the path or not. Default is false.*  
```javascript
  // result : {a:{b:{c:2}}}
  useModule.utils.deepSet({a:{b:{c:1}}},'a.b.c', 2);
  // result : {a:{b:{c:[1,2,3]}}}
  useModule.utils.deepSet({a:{b:{c:1}}},["a","b","c"], [1,2,3]);
```
#### `useModule.utils.deepClone`
 ----
> **useModule.utils.deepClone ( object )**  
> &emsp;&emsp;*Clones the given object deeply.*    
>  **[return]**  
> &emsp;&emsp;*Object/Any, The cloned object.*  
> **[parameters]**  
> * **object** [required] : *Object, The target object to be cloned.*
```javascript
  const source = {a:{b:{c:1}}};
  // cloned : {a:{b:{c:1}}}
  // cloned.a === source.a      > false
  // cloned.a.b === source.a.b  > false
  const cloned = useModule.utils.deepClone(source);
```
#### `useModule.utils.toUTF8`
 ----
> **useModule.utils.toUTF8 ( source )**  
> &emsp;&emsp;*Converts a string to UTF-8 string.*    
>  **[return]**  
> &emsp;&emsp;*String, The result UTF-8 string .*  
> **[parameters]**  
> * **utf8string** [required] : *String, The target string to be converted.*
#### `useModule.utils.fromUTF8`
 ----
> **useModule.utils.fromUTF8 ( utf8string )**  
> &emsp;&emsp;*Converts an UTF-8 string back.*    
>  **[return]**  
> &emsp;&emsp;*String, The result string .*  
> **[parameters]**  
> * **utf8string** [required] : *String, The target UTF-8 string to be converted.*
```javascript
  const source = '漢字';
  // "\u6f22\u5b57"
  const utf8 = useModule.utils.toUTF8(source);
  // source === back
  const back = useModule.utils.fromUTF8(utf8 );
  console.log(utf8, back);
```
#### `useModule.utils.makeURLQueryString`
 ----
> **useModule.utils.makeURLQueryString ( hash )**  
> &emsp;&emsp;*Converts an object into an url query string.*    
>  **[return]**  
> &emsp;&emsp;*String, The result query string.*  
> **[parameters]**  
> * **hash** [required] : *Object, The target object to be converted.*
#### `useModule.utils.getURLParams`
 ----
> **useModule.utils.getURLParams ( querystring )**  
> &emsp;&emsp;*Converts an object into an url query string.*    
>  **[return]**  
> &emsp;&emsp;*String, The result query string.*  
> **[parameters]**  
> * **querystring** [required] : *Object, The target querystring.*
> * **parameter** [optional] : *String, The parameter key string. If don't specify this, it will return an object that presents all parameters.*
```javascript
  const hash = {k1:"v1",k2:"v2"};
  // return "k1=v1&k2=v2"
  const qs= useModule.utils.makeURLQueryString(hash);
  // return {k1:"v1",k2:"v2"}
  const back = useModule.utils.getURLParams(utf8 );
  // return "v2"
  const value = useModule.utils.getURLParams(utf8, "k2" );
  console.log(qs, back, value );
```
#### `useModule.utils.getCookie`
 ----
> **useModule.utils.getCookie ( name )**  
> &emsp;&emsp;*Gets a specified cookie with the given name.*    
>  **[return]**  
> &emsp;&emsp;*String/Object/Array, The result cookie for the given name. If it's a stringified object or array, it will return the original object or array.*  
> **[parameters]**  
> * **name** [required] : *String, The cookie name.*
#### `useModule.utils.setCookie`
 ----
> **useModule.utils.setCookie ( name, value, options )**  
> &emsp;&emsp;*Creates a cookie with the given name, value, and options.*    
> **[parameters]**  
> * **name** [required] : *String, The cookie name.*
> * **value** [required] : *String/Object/Array, The value of cookie. If it's an Object or Array, a stringified string will be saved into Cookie.*
> * **options** [options] : *Object, The cookie options. { expires: Number for seconds, path: String, domain: String, maxAge: String, sameSite: Boolean, secure: Boolean, httpOnly: Boolean }.*
#### `useModule.utils.removeCookie`
 ----
> **useModule.utils.removeCookie ( name )**  
> &emsp;&emsp;*Removes a specified cookie by the given name.*    
> **[parameters]**  
> * **name** [required] : *String, The cookie name.*
#### `useModule.utils.clearCookie`
 ----
> **useModule.utils.clearCookie ( )**  
> &emsp;&emsp;*Clears all cookies.*    
```javascript
  useModule.utils.setCookie("c1", "v1");
  useModule.utils.setCookie("c2", {k1:"v1",k2:"v2"});
  // return "v1"
  const cookie1 = useModule.utils.getCookie( "c1" );
  // return {k1:"v1",k2:"v2"}
  const cookie2 = useModule.utils.getCookie( "c2" );
  console.log( cookie1, cookie2 );
  useModule.utils.removeCookie( "c1" );
  useModule.utils.clearCookie( );
```
#### `useModule.utils.getLocalStorage`
 ----
> **useModule.utils.getLocalStorage ( name )**  
> &emsp;&emsp;*Gets a specified local storage by the given name.*    
>  **[return]**  
> &emsp;&emsp;*String/Object/Array, The result local storage for the given name. If it's a stringified object or array, it will return the original object or array.*  
> **[parameters]**  
> * **name** [required] : *String, The local storage name.*
#### `useModule.utils.setLocalStorage`
 ----
> **useModule.utils.setLocalStorage ( name, value )**  
> &emsp;&emsp;*Creates a local storage data with the given name and value.*    
> **[parameters]**  
> * **name** [required] : *String, The local storage name.*
> * **value** [required] : *String/Object/Array, The value of local storage. If it's an Object or Array, a stringified string will be saved into local storage.*
#### `useModule.utils.removeLocalStorage`
 ----
> **useModule.utils.removeLocalStorage ( name )**  
> &emsp;&emsp;*Removes a specified local storage by the given name.*    
> **[parameters]**  
> * **name** [required] : *String, The local storage name.*
#### `useModule.utils.clearLocalStorage`
 ----
> **useModule.utils.clearLocalStorage (  )**  
> &emsp;&emsp;*Clears all local storage.*    
```javascript
  useModule.utils.setLocalStorage ("c1", "v1");
  useModule.utils.setLocalStorage ("c2", {k1:"v1",k2:"v2"});
  // return "v1"
  const sto1 = useModule.utils.getLocalStorage( "c1" );
  // return {k1:"v1",k2:"v2"}
  const sto2 = useModule.utils.getLocalStorage( "c2" );
  console.log( sto1, sto2 );
  useModule.utils.removeLocalStorage( "c1" );
  useModule.utils.clearLocalStorage( );
```
#### `useModule.utils.postH5ChannelMessage`
 ----
> **useModule.utils.postH5ChannelMessage ( channelName, message)**  
> &emsp;&emsp;*Posts HTML5 message ( ref: window.BroadcastChannel ) to all browser windows via a specified channel, which can be received in all useModule components' onH5ChannelMessage event*  
> **[parameters]**  
> * **channelName** [required] : *String, The channel name*  
> * **message** [required] : *Object / Any, The message object, can be any value* 
```javascript
  // to pose HTML5 message to all browser windows via "channel1"
  useModule.utils.postH5ChannelMessage ("channel1","message");
```
#### `useModule.utils.selectLocalFiles`
 ----
> **useModule.utils.selectLocalFiles ( contentType, multiple )**  
> &emsp;&emsp;*To show an browser's file dialog for selecting files. You must use 'await' to call it, and it must be in an async function.*  
>  **[return]**  
> &emsp;&emsp;*Array < File >, The result files.*  
> **[parameters]**  
> * **contentType** [optional] : *String, The content type. e.g. 'image/png', 'image/\*'*  
> * **multiple** [optional] : *Boolean, Allows multiple files or not. Default is false* 
```javascript
  import { useModule } from "react-hook-module";
  //...
  const App = props => {
      const { module } = useModule(props, { }); 
      return (
        <div>
          <button onClick={async () => {
            const files = await useModule.utils.selectLocalFiles("image/*", true);
            console.log(files);
          }}>module.request</button>
        </div>
      );
  };
```
### 2.3. useModule instance - module functions
#### `getRootModule`
----
> **getRootModule ( )**  
> &emsp;&emsp;*Gets the root useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The root useModule element*  
```javascript
  // to get the root useModule element
  const rootModule = module.getRootModule();
```
#### `getModule`
----
> **getModule ( idOrAlias )**  
> &emsp;&emsp;*Gets the useModule element by uid (usemodule_uid) or alias (usemodule_alias). Getting from alias is only for the child elements in the root useModule element )*    
> **[return]**  
> &emsp;&emsp;*Object, The result module element*  
> **[parameters]**  
> * **idOrAlias** [required] : *String, The target useModule element's uid or alias*  
```javascript
  // to get an useModule element with usemodule_uid="global_uid1"
  const module1 = module.getModule("global_uid1");
  // to get an useModule element( a child element in the current module) with usemodule_alias="alias1"
  const module2 = module.getModule("alias1");
  // to get an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const module3 = module.getModule("alias_in_root.alias_in_level1.alias_in_level2");  
```
#### getModuleByAlias
 ----
> **getModuleByAlias ( alias )**  
> &emsp;&emsp;*Gets a useModule  element by the given alias in the current module, which must be a child element in the current module and has an alias (usemodule_alias property)*  
> **[return]**  
> &emsp;&emsp;*Object, The result module element*  
> **[parameters]**  
> * **alias** [required] : *String, The alias of the element* 
```javascript
  // to get a child module in the current module with usemodule_alias="alias1"
  const childModule = module.getModuleByAlias("alias1");
```
#### `sendMessage`
----
> **sendMessage ( message )**  
> &emsp;&emsp;*Sends a message to the current useModule, which can  be received in it's onMessage event*  
> **[return]**  
> &emsp;&emsp;*Object, The return value of the module's onMessage event*  
> **[parameters]**  
> * **message** [required] : *Object / Any, The message object, can be any value* 
```javascript
  // to sent a message
  const result1 = module.sendMessage("message");  
```
#### `dispatchAction`
----
> **dispatchAction ( actionName, params, from )**  
> &emsp;&emsp;*Dispatches an action for the current useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The target action's return value*  
> **[parameters]**  
> * **actionName** [required] : *String, The action name to be dispatched* 
> * **params** [optional] : *Array, The parameters for the given action* 
> * **from** [optional] : *Object/Any, The from info that indicates who dispatch the action or can be other info* 
```javascript
  // to dispatch an action
  const result1 = module.dispatchAction("actionName", [/*parameters*/]);
```
#### `dispatchAsyncAction`
----
> **dispatchAsyncAction ( actionName, params, from)**  
> &emsp;&emsp;*Dispatches an asynchronous action for the current useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The target action's return value*  
> **[parameters]**  
> * **actionName** [required] : *String, The asynchronous action name to be dispatched* 
> * **params** [optional] : *Array, The parameters for the given action* 
> * **from** [optional] : *Object/Any, The from info that indicates who dispatch the action or can be other info* 
```javascript
  // to dispatch an async action
  const result1 = module.dispatchAsyncAction("asyncActionName", [/*parameters*/]);
``` 
#### `updateState`
----
> **updateState ( path, state, force )**  
> &emsp;&emsp;*Updates the module state for the current useModule*  
> **[parameters]**  
> * **path** [required] : *Object / Array< String > / String, **If it's an Array< String >: ** to specify the path for updating the state; **If it's a String**: the string can be convert into an Array< String > after splitting by '.'; **If it's an Object**: to specify the whole object to update the state, the 2nd parameter - 'state' will be ignored  in this case.* 
> * **state** [optional] : *Object/Any, The object to update the state in the given path* 
> * **force** [optional] : *Boolean, Indicates whether force to update the state. Default is false.*
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
> &emsp;&emsp;*Fires a specified event for the current useModule*  
>  **[return]**  
> &emsp;&emsp;*Object, The return value of the target event*  
> **[parameters]**  
> * **eventName** [required] : *String, The event name* 
> * **params** [optional] : *Array, The parameters for the given event* 
> * **from** [optional] : *Object/Any, The from info that indicate who fire the event or can be other info* 
```javascript
  // to fire an event 
  const result1 = module.fireEvent("eventName", [/*parameters*/]);
```
#### `broadcast`
 ----
> **broadcast ( channelName, message )**  
> &emsp;&emsp;*Broadcasts message to all useModule elements via a specified channel, which can be received in all useModule components' onChannelMessage event.*  
> **[parameters]**  
> * **channelName** [required] : *String, The channel name*  
> * **message** [required] : *Object / Any, The message object, can be any value* 
```javascript
  // to broadcast an message to all useModule elements
  useModule.broadcast("channelName","message");
```
#### `useRef`
 ----
> **useRef ( refName, value )**  
> &emsp;&emsp;*Triggers a React.useRef to create a ref, which initialial value is 'value'. It can be retrieved by module.getRef('refName') .*  
>  **[return]**  
> &emsp;&emsp;*Object, The ref*  
> **[parameters]**  
> * **refName** [required] : *String, The ref name* 
> * **value** [optional] : *Object/Any, The given initialial value* 
#### `getRef`
 ----
> **getRef ( refName )**  
> &emsp;&emsp;*Gets a specified ref by the given name, this ref was created by module.useRef('refName', 'value').*  
>  **[return]**  
> &emsp;&emsp;*Object, The ref*  
> **[parameters]**  
> * **refName** [required] : *String, The ref name* 
```javascript
  // to use(create) a ref
  const ref = module.useRef("refName", "init vaule");
  // to get the ref
  const ref1 = module.getRef("refName");  
  // or
  const ref2 = module.refs["refName"];
```
#### `renderComAs`
 ----
> **renderComAs ( x_id, replace, beforeNodes, afterNodes )**  
> &emsp;&emsp;*Renders an enhanced component (with a specified 'x_id') as a different  component or a set of components, which can be used as element replacement, or inserting additional elements before or after the element.*  
> **[parameters]**  
> * **x_id** [required] : *String, The target element's x_id. The target element must be an enhanced component which powered by module.enhanceCom()* 
> * **replace** [optional] : *Object/Array/false,  A React element or React elements array, which will replace the current element in the UI. If specified [false], this parameter will be ignored. If specified [null], the original element will be restored. Default is null.* 
> * **beforeNodes** [optional] : *Object/Array/false,  A React element or React elements array, which will be inserted before the current element. If specified [false], this parameter will be ignored. If specified [null], all beforeNodes will be removed. Default is null.* 
> * **afterNodes** [optional] : *Object/Array/false,  A React element or React elements array, which will be inserted after the current element. If specified [false], this parameter will be ignored. If specified [null], all afterNodes will be removed. Default is null.* 
```javascript
  const Com1= props => {
	  const { module } = useModule(props, { });
	  const XElem = module.enchanceCom("div");
	  return (
	  <div>
		  <XElem x_id="x_id1">original</XElem>
		  <button onClick={() =>{
			  module.renderComAs("x_id", <input />, false, false);
		  }}>replace</button>
		  <button onClick={() =>{
			  module.renderComAs("x_id", false, <div>before</div>, false);		  
		  }}>insert before</button>
		  <button onClick={() =>{
			  module.renderComAs("x_id", false, false, <div>after</div>);		  
		  }}>insert after</button>		  
		  <button onClick={() =>{
			  module.renderComAs("x_id", null, null, null);
		  }}>restore</button>
	  </div>);
  };
```
### 2.4. useModule instance - material-UI plugin functions
#### `showSnackbar`
 ----
> **showSnackbar ( message )**  
> &emsp;&emsp;*To show a material-UI snackbar. It's an advanced function in material-UI plugin ( react-hook-module/plugin_mui )*  
> **[parameters]**  
> * **message** [required] : *String/Object, The message (String), or the props (Object) of the [Snackbar]( https://material-ui.com/api/snackbar )* 
```javascript
  import { useModule } from "react-hook-module";
  // must import material-UI plugin
  import "react-hook-module/plugin_mui";
  //...
  // to show a snack bar
  module.showSnackbar("snack message");
```
#### `alert`
 ----
> **alert ( title, description, okCaption )**  
> &emsp;&emsp;*To show an material-UI alert window. It's an advanced function in material-UI plugin ( react-hook-module/plugin_mui ). You must use 'await' to call it, and it must be in an async function.*  
> **[parameters]**  
> * **title** [required] : *String, The title text* 
> * **description** [required] : *String, The description text* 
> * **okCaption** [optional] : *String, The caption text for OK button. Default is "OK".* 
```javascript
  import { useModule } from "react-hook-module";
  // must import material-UI plugin
  import "react-hook-module/plugin_mui";
  //...
  (async()=>{
      // to show an alert dialog
      await module.alert("title", "desc", "O K");
  })();
```
#### `confirm`
 ----
> **confirm ( title, description, okCaption, cancelCaption )**  
> &emsp;&emsp;*To show an material-UI confirm window. It's an advanced function in material-UI plugin ( react-hook-module/plugin_mui ). You must use 'await' to call it, and it must be in an async function.*  
>  **[return]**  
> &emsp;&emsp;*Boolean, the confirm result.*  
> **[parameters]**  
> * **title** [required] : *String, The title text* 
> * **description** [required] : *String, The description text* 
> * **okCaption** [optional] : *String, The caption text for OK button. Default is "OK".* 
> * **cancelCaption** [optional] : *String, The caption text for cancel button. Default is "Cancel".* 
```javascript
  import { useModule } from "react-hook-module";
  // must import material-UI plugin
  import "react-hook-module/plugin_mui";
  //...
  (async()=>{
      // to show an confirm dialog
      const result = await module.cofirm("title", "desc");
  })();
```
#### `prompt`
 ----
> **prompt ( title, description, defaultValue, okCaption, cancelCaption )**  
> &emsp;&emsp;*To show an material-UI prompt window. It's an advanced function in material-UI plugin ( react-hook-module/plugin_mui ). You must use 'await' to call it, and it must be in an async function.*  
>  **[return]**  
> &emsp;&emsp;*String, the input text.*  
> **[parameters]**  
> * **title** [required] : *String, The title text* 
> * **description** [required] : *String, The description text* 
> * **defaultValue** [optional] : *String, The default value text. Default is empty string.* 
> * **okCaption** [optional] : *String, The caption text for OK button. Default is "OK".* 
> * **cancelCaption** [optional] : *String, The caption text for cancel button). Default is "Cancel".* 
```javascript
  import { useModule } from "react-hook-module";
  // must import material-UI plugin
  import "react-hook-module/plugin_mui";
  //...
  (async()=>{
      // to show an confirm dialog
      const result = await module.prompt("title", "desc");
  })();
```
#### `showBackdrop`
 ----
> **showBackdrop ( id, clickAway, style, transitionDuration, children)**  
> &emsp;&emsp;*To show a backdrop for a given id. It's an advanced function in material-UI plugin ( react-hook-module/plugin_mui ).*  
> **[parameters]**  
> * **id** [optional] : *String, The backdrop id, default is 'default'* 
> * **clickAway** [optional] : *Boolean, To determine whether 'click' to hide the backdrop or not, default is true.* 
> * **style** [optional] : *Object, To determine the backdrop's style, default is {}.*   
> * **transitionDuration** [optional] : *Number, The transition duration in ms. Default is 300.* 
> * **children** [optional] : *Array/Boolean, The children elements in the backdrop. Default is true > there'll be an CircularProgress in the backdrop.* 
```javascript
  import { useModule } from "react-hook-module";
  // must import material-UI plugin
  import "react-hook-module/plugin_mui";
  //...
  module.showBackdrop( );
```
#### `hideBackdrop`
 ----
> **hideBackdrop ( id )**  
> &emsp;&emsp;*To hide a backdrop for a given id. It's an advanced function in material-UI plugin ( react-hook-module/plugin_mui ).*  
> **[parameters]**  
> * **id** [optional] : *String, The backdrop id, default is 'default'.* 
```javascript
  import { useModule } from "react-hook-module";
  // must import material-UI plugin
  import "react-hook-module/plugin_mui";
  //...
  module.hideBackdrop( );
```
### 2.5. useModule instance - request  plugin functions
#### `request`
 ----
> **request ( url, data, method, baseURL, AUTH_TOKEN, header, config )**  
> &emsp;&emsp;*To request data from a remote service endpoint, by [axios](https://github.com/axios/axios). It's an advanced function in request  plugin ( react-hook-module/plugin_request ). You must use 'await' to call it, and it must be in an async function.*  
>  **[return]**  
> &emsp;&emsp;*Object, the request result.*  
> **[parameters]**  
> * **url** [required] : *String, The url option for an [axios reqeust](https://github.com/axios/axios#request-config)* 
> * **data** [optional] : *Object/String, The data (ArrayBuffer, ArrayBufferView, URLSearchParams, FormData, File, Blob, or queryString) option for an  [axios reqeust](https://github.com/axios/axios#request-config) Default is null.* 
> * **method** [optional] : *String, The method (get/post/put/delete/patch/head/options) option for an  [axios reqeust](https://github.com/axios/axios#request-config). Default is 'get'.*   
> * **baseURL** [optional] : *String, The base URL option for an  [axios reqeust](https://github.com/axios/axios#request-config). Default is empty string.*  
> * **AUTH_TOKEN** [optional] : *String, The AUTH_TOKEN option for an  [axios reqeust](https://github.com/axios/axios#request-config). Default is null.*  
> * **header** [optional] : *Object, The header option for an  [axios reqeust](https://github.com/axios/axios#request-config). Default is {}.*  
> * **config** [optional] : *Object, The config option for an  [axios reqeust](https://github.com/axios/axios#request-config).Default is {}.*  
```javascript
  import { useModule } from "react-hook-module";
  // must import request plugin for 
  import "react-hook-module/plugin_request";
  //...
  const App = props => {
      const { module } = useModule(props, { }); 
      return (
        <div>
          <button onClick={async () => {
            const result = await  module.request(useModule.resolveURL("./service/endpoint"));
            console.log( result );
          }}>module.request</button>
        </div>
      );
  };
``` 
#### `request.fetch`
 ----
> **request.fetch(  )**  
> &emsp;&emsp;*To fetch data for the useModule's default request, only for the props with req_execute=false. You must use 'await' to call it, and it must be in an async function.*  
>  **[return]**  
> &emsp;&emsp;*Object, the request result.*  
```javascript
  import { useModule } from "react-hook-module";
  import { If } from "react-hook-module";
  // must import request plugin
  import "react-hook-module/plugin_request";
  //...
  const App = props => {
      // If no 'req_url', the request will be undefined 
      const { module, request } = useModule(props, {
        props:{
          req_url: useModule.resolveUrl("./service/endpoint"),
          req_execute: false
        }
      }); 
      return (
        <div>
          <div>Status: [{request.status}]</div>
          <If condition={request.error} >
            error: {request.error && JSON.stringify(request.error)}
          </If>
          <If condition={request.response} >
            data: {request.response && JSON.stringify(request.response)}
          </If>
          <button onClick={async () => {
            const result = await request.fetch();
            console.log( result );
          }}>fetch</button>
        </div>
      );
  };
```
Normally, you don't need to set 'req_execute' to false for the default request in an useModule. The default request will be executed automatically.
```javascript
  import { useModule } from "react-hook-module";
  import { If } from "react-hook-module";
  // must import request plugin
  import "react-hook-module/plugin_request";
  //...
  const App = props => {
      // If no 'req_url', the request will be undefined 
      const { module, request } = useModule(props, {
        props:{
          req_url: useModule.resolveUrl("./service/endpoint")
        }
      }); 
      return (
        <div>
          <div>Status: [{request.status}]</div>
          <If condition={request.error} >
            error: {request.error && JSON.stringify(request.error)}
          </If>
          <If condition={request.response} >
            data: {request.response && JSON.stringify(request.response)}
          </If>
        </div>
      );
  };
```
#### `request.cancel`
 ----
> **request.cancel(  )**  
> &emsp;&emsp;*To cancel the useModule's default request.*  
```javascript
  import { useModule } from "react-hook-module";
  // must import request plugin
  import "react-hook-module/plugin_request";
  //...
  const App = props => {
    // If no 'req_url', the request will be undefined 
    const { module, request } = useModule(props, {
      props:{
        req_url: useModule.resolveUrl("./service/endpoint")
      }
    }); 
    // cancel the useModule's default request
    React.useEffect(() => request.cancel(), [request]);
      return (
        <div>
          <div>Status: [{request.status}]</div>
        </div>
      );
  };
```
### 2.6. useModule instance - router plugin functions
#### `router.navigate`
 ----
> **router.navigate ( route, state )**  
> &emsp;&emsp;*To navigate to target route (document). *  
> **[parameters]**  
> * **route** [required] : *String, The route path.* 
> * **state** [optional] : *Object, The state. [router.navigate('/', {replace: true})] equals to [router.replace('/')] .* 
#### `router.replace`
 ----
> **router.replace( route )**  
> &emsp;&emsp;*To replace the document by target route. *   
> **[parameters]**  
> * **route** [required] : *String, The route path.*   

--->`router.replace(route)` equlas to `router.navigate(route ,{replace: true})`.

#### `router.setSearchParams`
 ----
> **router.setSearchParams( params )**  
> &emsp;&emsp;*[for useModule router plugin] To update the search parameters. *  
> **[parameters]**  
> * **params** [required] : *Object/String, The search params. Object or queryString.* 
```javascript
  import { useModule } from "react-hook-module";
  // must import request plugin
  import { BrowserRouter as  Router, RelativeRouter } from  "react-hook-module/plugin_router";
  //...
  const App = props => {
      // If no 'router' in props, or 'props.router' is false, the router will be undefined 
      const { module, router } = useModule(props, {
        props:{
          enableRouter : true
        }
      }); 
      return (
        <Router>
	        <RelativeRouter>
				<div path="/path1">path1</div>
				<div path="/path2">path2</div>
				<div path="/about">about</div>
				<div path="*">Not Support</div>
	        </RelativeRouter>
	        <div>
				<button onClick={() => {
					router.navigate('/about');
				}}>Route to "/about"</button>
				<button onClick={() => {
					router.setSearchParams('k1=v1&k2=v2');
				}}>setSearchParams</button>				
	        </div>
        </Router>
      );
  };
```
### 2.7. useModule instance - auth plugin functions
#### `auth.signIn`
 ----
> **auth.signIn (  )**  
> &emsp;&emsp;*To trigger the sign in action.*    
#### `auth.signOut `
 ----
> **auth.signOut (  )**  
> &emsp;&emsp;*To trigger the sign out action.*  
#### `auth.signUp `
 ----
> **auth.signUp(  )**  
> &emsp;&emsp;*To trigger the sign up action.*     

**File - auth_fake.js**
```javascript
  import {utils} from "react-hook-module";
  // singIn function
  const signIn = function(){
    const auth = this;
    const user = {email:"fake@email.com"};
    setTimeout(() => {
      auth.setUser(user);
      utils.setCookie("user", user);
    }, 500);
  };
  // signOut function
  const signOut = function(){
    this.setUser(null);
    utils.removeCookie("user");
  };
  // signUp function
  const signUp = function(){
    console.log("signUp function");
  };  
  const authInit = function(){
    const auth = this;
    const user = utils.getCookie("user");
    user && auth.setUser(user);
    return function(){
      // nothing
    };
  };
  export default {signIn, signOut, authInit};
```
**File - index.js**
```javascript
  import React from "react";
  import ReactDOM from "react-dom";
  import { useModule } from "react-hook-module";
  import { ProvideAuth } from "react-hook-module/plugin_auth";
  import App from "./App";
  import configure from "./auth_fake.js";
  ReactDOM.render( (
    <React.StrictMode>
      <ProvideAuth {...configure} >
        <App path="/*" />
      </ProvideAuth>
    </React.StrictMode>
  ), document.getElementById("root"));
```
**File - App.js**
```javascript
  import React from "react";
  import { useModule } from "react-hook-module";
  import { If } from "react-hook-module";
  const App = props => {
      // If no 'auth' in props, or 'props.auth' is false, the auth will be undefined 
      const { module, auth } = useModule(props, { enableAuth: true });
      return (
      <React.Fragment>
        <If condition={auth && auth.user} >
          <div> Signed in successfully!</div>
          <div> User Email: {auth && auth.user && auth.user.email} </div>
          <div> <button onClick={() => auth.signOut()}>Sign Out</button> </div>
        </If>
        <If condition={!auth || !auth.user} >
          <div><button onClick={() => auth.signIn()}>Sign In</button></div>
        </If>
      </React.Fragment>
    );
  };
```
## 3. Quickstart
### 3.1. Basic Demo
```javascript
import React from "react";
import { useModule } from "react-hook-module";

export default (props) => {
  const { module } = useModule(props, {
    actions: {
      callback: (msg) => module.updateState({ msg })
    }
  });
  return (
    <div style={{ border: "1px dashed", padding: "1em" }}>
      <h2>useModule demo {">"} modules interaction</h2>
      <div>
        <strong>
          {"<"}Module1{">"}
        </strong>
      </div>{" "}
      <p />
      <button
        onClick={(e) =>
          module.updateStateFor("alias_in_parent", {
            value: "Value updated by updateState"
          })
        }
      >
        updateState for Module2
      </button>
      {" | "}
      <button
        onClick={(e) =>
          module.sendMessageTo(
            "alias_in_parent",
            "Value updated by sendMessage"
          )
        }
      >
        sendMessage to Module2
      </button>
      {" | "}
      <button
        onClick={(e) =>
          useModule.dispatchActionTo("global_uid", "updValue", [
            "Value updated by dispatchAction"
          ])
        }
      >
        dispatchAction to Module2
      </button>
      <p />
      <div> Callback Message: "{module.state.msg || "No callback yet"}"</div>
      <p />
      <Module2 usemodule_alias="alias_in_parent" usemodule_parent={module} />
      <Module2 usemodule_uid="global_uid" />
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
      <div>
        <strong>
          {"<"}Module2{">"}
        </strong>{" "}
        ( {props.usemodule_alias ? "alias='" + props.usemodule_alias + "'" : ""}{" "}
        {props.usemodule_uid ? "uid='" + props.usemodule_uid + "'" : ""} )
      </div>{" "}
      <p />
      value = "<strong>{module.state.value}</strong>"
    </div>
  );
};
```
#### Screenshot
<img src="https://raw.githubusercontent.com/linb/react-hook-module/master/image/demo1.png"  width="600">

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
[Open the demo in CodeSandbox](https://codesandbox.io/s/thirsty-swirles-4iomy "react-hook-module basic demo")


### 3.2. Meterial UI Demo
```javascript
import React from "react";
import { useModule } from "react-hook-module";
import "react-hook-module/plugin_mui";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { DialogActions } from "@material-ui/core";
import { DialogContent } from "@material-ui/core";
import { DialogContentText } from "@material-ui/core";
import { DialogTitle } from "@material-ui/core";

const useStyles4basic = makeStyles((theme) => ({
  item: { margin: theme.spacing(1) },
  container: { padding: theme.spacing(1) }
}));

const Module_Dialog = (props) => {
  const styles_basic = useStyles4basic(props || {});
  const { module } = useModule(props, {});
  return (
    <React.Fragment>
      <div>
        <Button
          variant="contained"
          color="primary"
          className={styles_basic.item}
          onClick={async (e) => {
            await module.alert("Alert 1");
          }}
        >
          Alert 1
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={styles_basic.item}
          onClick={async (e) => {
            const rst = await module.confirm("Confirm 1");
            alert(rst);
          }}
        >
          Confirm 1
        </Button>
        <Button
          variant="contained"
          color="default"
          className={styles_basic.item}
          onClick={async (e) => {
            const rst = await module.prompt("Prompt 1");
            alert(rst);
          }}
        >
          Prompt 1
        </Button>
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          className={styles_basic.item}
          key="cyenksua"
          onClick={(e) => {
            useModule.updateStateFor("Alert_1", { open: true });
          }}
        >
          Alert 2
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={styles_basic.item}
          onClick={(e) => {
            useModule.dispatchActionTo("Confirm_1", "open");
          }}
        >
          Confirm 2
        </Button>
        <Button
          variant="contained"
          color="default"
          className={styles_basic.item}
          onClick={(e) => {
            useModule.sendMessageTo("Prompt_1", "open");
          }}
        >
          Prompt 2
        </Button>
      </div>

      <Alert
        open={false}
        usemodule_alias="Alert_1"
        usemodule_parent="{module}"
        title="Alert 2"
        description="Description"
        onOK={() => alert("OK")}
      ></Alert>
      <Confirm
        open={false}
        usemodule_alias="Confirm_1"
        usemodule_parent="{module}"
        title="Confirm 2"
        description="Description"
        onOK={() => alert("OK")}
        onCancel={() => alert("onCancel")}
      ></Confirm>
      <Prompt
        open={false}
        usemodule_alias="Prompt_1"
        usemodule_parent="{module}"
        title="Prompt 2"
        description="Description"
        onOK={(txt) => alert("Result: " + txt)}
        onCancel={() => {
          alert("onCancel");
        }}
      ></Prompt>
    </React.Fragment>
  );
};

export default Module_Dialog;

export const Alert = (props) => {
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
    actions: {
      open: function () {
        this.updateState({ open: true });
      },
      close: function () {
        this.updateState({ open: false });
      }
    }
  });
  const [defaultState, setDefaultState] = React.useState({
    open: false
  });

  return (
    <Dialog
      open={
        (module.props && module.props.open) ||
        (module.state && module.state.open)
      }
      onClose={() => module.dispatchAction("close")}
      fullWidth
      aria-labelledby="alert_9za5tayt_title"
      aria-describedby="alert_9za5tayt_description"
      key="7e8gz5b3"
    >
      <DialogTitle id="alert_9za5tayt_title">
        {" "}
        {module.props && module.props.title}{" "}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert_9za5tayt_description">
          {module.props && module.props.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            module.props.onOK();
            module.dispatchAction("close");
          }}
          color="primary"
        >
          {" "}
          OK{" "}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const Confirm = (props) => {
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
    actions: {
      open: function () {
        this.updateState({ open: true });
      },
      close: function () {
        this.updateState({ open: false });
      }
    }
  });
  const [defaultState, setDefaultState] = React.useState({
    open: false
  });

  return (
    <Dialog
      open={
        (module.props && module.props.open) ||
        (module.state && module.state.open)
      }
      onClose={() => module.dispatchAction("close")}
      fullWidth
      aria-labelledby="confirm_jlh80pil_title"
      aria-describedby="confirm_jlh80pil_description"
      key="2h6e3jqi"
    >
      <DialogTitle id="confirm_jlh80pil_title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm_jlh80pil_description">
          {props.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            module.props.onCancel();
            module.dispatchAction("close");
          }}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            module.props.onOK();
            module.dispatchAction("close");
          }}
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const Prompt = (props) => {
  const { module } = useModule(props, {
    props: {
      open: true,
      title: "Title",
      description: "Description",
      onOK: () => {},
      onCancel: () => alert(9),
      onMessage: (msg) => {
        if (msg === "open") {
          module.updateState({
            open: true
          });
        }
      }
    },
    state: {
      open: false
    },
    actions: {
      open: function () {
        this.updateState({
          open: true
        });
      },
      close: function () {
        this.updateState({
          open: false
        });
      }
    }
  });
  const [defaultState, setDefaultState] = React.useState({
    open: false
  });

  return (
    <Dialog
      open={
        (module.props && module.props.open) ||
        (module.state && module.state.open)
      }
      onClose={() => module.dispatchAction("close")}
      fullWidth
      aria-labelledby="prompt_fn69vqpc_title"
      aria-describedby="prompt_fn69vqpc_description"
      key="blg87o2c"
    >
      <DialogTitle id="prompt_fn69vqpc_title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="prompt_fn69vqpc_description">
          {props.description}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          defaultValue=""
          fullWidth
          onChange={(e) =>
            setDefaultState(
              Object.assign({}, defaultState, { text: e.target.value })
            )
          }
        ></TextField>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={() => props.onCancel()}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            props.onOK(defaultState.text);
            module.dispatchAction("close");
          }}
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

```
#### Screenshot
<img src="https://raw.githubusercontent.com/linb/react-hook-module/master/image/demo2.png"  width="600">

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

[Open the demo in CodeSandbox](https://codesandbox.io/s/strange-thompson-g4op5 "react-hook-module Materail-UI demo")
 
## npm
[npm link](https://www.npmjs.com/package/react-hook-module "react-hook-module NPM")
