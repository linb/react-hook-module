

# react-module-hook
A react module hook for real configurable app with stateful persistent module tree and peer-to-peer messaging mechanism

## Usage
### 1. Install
```javascript
npm install react-module-hook
```

### 2. Import
```javascript
import { useModule } from "react-module-hook";
```
### 3. Call it in a render function
```javascript
...
const ReactComponent = props => {
  const { module, auth, router, request } = useModule(props, {
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
  const module = useModule(props, { }); 
  return (
    <div>
      ReactComSub1
    </div>
  );
};
const ReactComSub2 = props => {
  const module = useModule(props, { }); 
  return (
    <div>
      ReactComSub2 - {props.name}
    </div>
  );
};
const ReactCom = props => {
  const module = useModule(props, {
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
### useModule static functions
#### `useModule.getRootModule`
----
> **useModule.getRootModule( )**  
> &emsp;&emsp;*Gets the root useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The root useModule element*  
```javascript
  // to get the root useModule element
  const rootModule = useModule.getRootModule();
  // to print the useModule tree in the console
  rootModule.printTree();
```
#### `useModule.getModule`
----
> **useModule.getModule ( idOrAlias )**  
> &emsp;&emsp;*Gets the useModule element according to it's uid or alias (if it's an useModule component added as an element in the root useModule element )*  
> **[return]**  
> &emsp;&emsp;*Object, The target useModule element*  
> **[parameters]**  
> * **idOrAlias** [required] : *String, The target useModule element's uid or alias*  
```javascript
  // to get an useModule element with usemodule_uid="global_uid1"
  const module1 = useModule.getModule("global_uid1");
  // to get an useModule element(in the root useModule element) with usemodule_alias="alias1"
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
> * **receiver** [required] : *String or Object, The target useModule element, which can be an useModule object, useModule uid or alias (if it's an useModule component added as an element in the root useModule element ).*  
> * **message** [required] : *Object / Any, The message object, can be any value* 
```javascript
  // to sent a message to module1
  const result1 = useModule.sendMessageTo(module1, "message");
  // to sent a message to an useModule element with usemodule_uid="global_uid1"
  const resul2 = useModule.sendMessageTo("global_uid1", "message");
  // to sent a message to an useModule element(in the root useModule element) with usemodule_alias="alias1"
  const resul3 = useModule.sendMessageTo("alias1", "message");
  // to sent a message to an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useModule.sendMessageTo("alias_in_root.alias_in_level1.alias_in_level2", "message");  
```

#### `useModule.dispatchActionTo`
----
> **useModule.dispatchActionTo ( receiver, actionName, params, from)**  
> &emsp;&emsp;*Dispatches an action for the target useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The target action's return value*  
> **[parameters]**  
> * **receiver** [required] : *String or Object, The target useModule, which can be an useModule object, useModule uid or alias (if it's an useModule component added as an element in the root useModule element ).*  
> * **actionName** [required] : *String, The action name to be dispatched* 
> * **params** [optional] : *Array, The parameters for the given action* 
> * **from** [optional] : *Object/Any, The from info that indicate who dispatch the action or can be other info* 
```javascript
  // to dispatch an action of module1
  const result1 = useModule.dispatchActionTo(module1, "actionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with usemodule_uid="global_uid1"
  const resul2 = useModule.dispatchActionTo("global_uid1", "actionName", [/*parameters*/]);
  // to dispatch an action of an useModule element(in the root useModule element) with usemodule_alias="alias1"
  const resul3 = useModule.dispatchActionTo("alias1", "actionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useModule.dispatchActionTo("alias_in_root.alias_in_level1.alias_in_level2", "actionName", [/*parameters*/]);
```
#### `useModule.dispatchAsyncActionTo`
----
> **useModule.dispatchAsyncActionTo ( receiver, actionName, params, from)**  
> &emsp;&emsp;*Dispatches an asynchronous action for the target useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The target action's return value*  
> **[parameters]**  
> * **receiver** [required] : *String or Object, The target useModule, which can be an useModule object, useModule uid or alias (if it's an useModule component added as an element in the root useModule element ).*  
> * **actionName** [required] : *String, The action name to be dispatched* 
> * **params** [optional] : *Array, The parameters for the given action* 
> * **from** [optional] : *Object/Any, The from info that indicate who dispatch the action or can be other info* 
```javascript
  // to dispatch an action of module1, 
  const result1 = useModule.dispatchAsyncActionTo(module1, "asyncActionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with usemodule_uid="global_uid1"
  const resul2 = useModule.dispatchAsyncActionTo("global_uid1", "asyncActionName", [/*parameters*/]);
  // to dispatch an action of an useModule element (in the root useModule element) with usemodule_alias="alias1"
  const resul3 = useModule.dispatchAsyncActionTo("alias1", "asyncActionName", [/*parameters*/]);
  // to dispatch an action of an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useModule.dispatchAsyncActionTo("alias_in_root.alias_in_level1.alias_in_level2", "asyncActionName", [/*parameters*/]);
```
#### `useModule.updateStateFor`
----
> **useModule.updateStateFor ( target, path, state, force )**  
> &emsp;&emsp;*Updates the module state for the target useModule element*  
> **[parameters]**  
> * **target** [required] : *String or Object, The target useModule element, which can be an useModule element object, useModule uid or alias (if it's an useModule component added as an element in the root useModule element ).*  
> * **path** [required] : *Object / Array< String > / String, **If it's an Array< String >: to** specify the path for updating the state; **If it's a string**: the string can be convert into an Array< String > after splitting by '.'; **If it's an object**: to specify the whole object to update the state, ignore the the 2nd parameter - state in this case.* 
> * **state** [optional] : *Object/Any, The object to update the state in the given path* 
> * **force** [optional] : *Boolean, Indicates whether force to update the state. Default is false.* 
```javascript
  // to update state for module1
  useModule.updateStateFor(module1, { key:"value" });
  // to update state for an useModule element with usemodule_uid="global_uid1"
  useModule.updateStateFor("global_uid1", "key", "value");
  // to update state for an useModule element (in the root useModule element) with usemodule_alias="alias1"
  useModule.updateStateFor("alias1", "keylevel1.keylevel2.keylevel3", "value");
  // to update state for an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  useModule.updateStateFor("alias_in_root.alias_in_level1.alias_in_level2", "key", "value");
```
#### `useModule.fireEventTo`
 ----
> **useModule.fireEventTo ( target, eventName, params, from)**  
> &emsp;&emsp;*Fires an event for the target useModule element*  
>  **[return]**  
> &emsp;&emsp;*Object, The return value of the target event*  
> **[parameters]**  
> * **target** [required] : *String or Object, The target useModule element, which can be an useModule element object, useModule uid or alias (if it's an useModule component added as an element in the root useModule element ).*  
> * **eventName** [required] : *String, The action name to be dispatched* 
> * **params** [optional] : *Array, The parameters for the given action* 
> * **from** [optional] : *Object/Any, The from info that indicate who dispatch the action or can be other info* 
```javascript
  // to fire an event for module1
  const result1 = useModule.fireEventFor(module1, "eventName", [/*parameters*/]);
  // to fire an event for an useModule element with usemodule_uid="global_uid1"
  const resul2 = useModule.fireEventFor("global_uid1", "eventName", [/*parameters*/]);
  // to fire an event for an useModule element (in the root useModule element) with usemodule_alias="alias1"
  const resul3 = useModule.fireEventFor("alias1", "eventName", [/*parameters*/]);
  // to fire an evnt for an useModule element with alias path: ["alias_in_root", "alias_in_level1", "alias_in_level2"]
  const resul4 = useModule.fireEventFor("alias_in_root.alias_in_level1.alias_in_level2", "eventName", [/*parameters*/]);
```
#### `useModule.broadcast`
 ----
> **useModule.broadcast ( channelName, message)**  
> &emsp;&emsp;*Broadcasts message to all useModule elements via a specified channel, which can be received in all useModule components' onChannelMessage event*  
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
  // to print the useModule element tree onto the console
  useModule.printModulesTree( );
```
#### `useModule.resolveURL`
----
> **useModule.resolveURL ( relPath )**  
> &emsp;&emsp;*Resolves an url from a relative path. You must use this to get the right url in the designer*  
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
> &emsp;&emsp;*Gets data from the global store according to the path*  
>  **[return]**  
> &emsp;&emsp;*Object, The result data*  
> **[parameters]**  
> * **path** [required] : *Array< String > /  String, **If it's an Array< String >**: to specify the path for the data; **If it's a String**: the string can be convert into an Array< String > after splitting by '.'* 
```javascript
  // to get data from the global store
  useModule.getDataFromStore("path_level1.path_level2");
```
#### `useModule.setDataToStore`
 ----
> **useModule.setDataToStore ( path, value, clonePath )**  
> &emsp;&emsp;*Sets data to the global store according to the path*    
> **[parameters]**  
> * **path** [required] : *Array< String > /  String, **If it's an Array< String >**: to specify the path for the data; **If it's a String**: the string can be convert into an Array< String > after splitting by '.'* 
> * **value** [required] : *Object / Any, The object to set* 
>  * **clonePath** [optional] : *Boolean,  Determines whether to clone the path or not. Defalt is false.* 
```javascript
  // to get data from the global store
  useModule.setDataToStore("path_level1.path_level2", {data:"value"}, false);
```
### useModule utils functions
#### `useModule.utils.getRand`
 ----
> **useModule.utils.getRand ( preTag )**  
> &emsp;&emsp;*Gets a random string. The result like 'ca1gis'.*    
>  **[return]**  
> &emsp;&emsp;*String, The random string.*  
> **[parameters]**  
> * **preTag** [optional] : *String, The previous tag for the random string. Default is empty string.* 
```javascript
  // to get a random string
  useModule.getRand( );
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
  // to get a No. string
  useModule.utils.getNo();
```
#### `useModule.utils.deepGet`
 ----
> **useModule.utils.deepGet ( object, path )**  
> &emsp;&emsp;*Gets data from the given object according to the path.*    
>  **[return]**  
> &emsp;&emsp;*Object/Any, The result data.*  
> **[parameters]**  
> * **object** [required] : *Object, The target object.* 
> * **path** [required] : *Array< String > / String, The path. **If it's an array**: to specify the path for the data; **If it's a string**: the string can be convert into an Array< String > after splitting by '.'* 
```javascript
  // return 1
  useModule.utils.deepGet({a:{b:{c:1}}},'a.b.c');
  // return 1
  useModule.utils.deepGet({a:{b:{c:1}}},["a","b","c"]);
```
#### `useModule.utils.deepSet`
 ----
> **useModule.utils.deepSet ( object, path )**  
> &emsp;&emsp;*Sets data to the given object according to the path.*    
>  **[return]**  
> &emsp;&emsp;*Object/Any, The target object.*  
> **[parameters]**  
> * **object** [required] : *Object, The target object.* 
> * **path** [required] : *Array< String > / String, The path. **If it's an array**: to specify the path for the data; **If it's a string**: the string can be convert into an Array< String > after splitting by '.'* 
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
```javascript
  const source = '漢字';
  // "\u6f22\u5b57"
  const utf8 = useModule.utils.toUTF8(source);
  // source === back
  const back = useModule.utils.fromUTF8(utf8 );
  console.log(utf8, back);
```
#### `useModule.utils.fromUTF8`
 ----
> **useModule.utils.fromUTF8 ( utf8string )**  
> &emsp;&emsp;*Converts an UTF-8 string back.*    
>  **[return]**  
> &emsp;&emsp;*String, The result string .*  
> **[parameters]**  
> * **utf8string** [required] : *String, The target string to be converted.*
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
```javascript
  const hash = {k1:"v1",k2:"v2"};
  // "k1=v1&k2=v2"
  const qs= useModule.utils.makeURLQueryString(hash);
  // {k1:"v1",k2:"v2"}
  const back = useModule.utils.getURLParams(utf8 );
  // "v2"
  const value = useModule.utils.getURLParams(utf8, "k2" );
  console.log(qs, back, value );
```
#### `useModule.utils.getURLParams`
 ----
> **useModule.utils.getURLParams ( querystring )**  
> &emsp;&emsp;*Converts an object into an url query string.*    
>  **[return]**  
> &emsp;&emsp;*String, The result query string.*  
> **[parameters]**  
> * **querystring** [required] : *Object, The target querystring.*
> * **parameter** [optional] : *String, The parameter key string. If don't specify this, will return an object that presents all parameters.*
```javascript
  const hash = {k1:"v1",k2:"v2"};
  // "k1=v1&k2=v2"
  const qs= useModule.utils.makeURLQueryString(hash);
  // {k1:"v1",k2:"v2"}
  const back = useModule.utils.getURLParams(utf8 );
  // "v2"
  const value = useModule.utils.getURLParams(utf8, "k2" );
  console.log(qs, back, value );
```
#### `useModule.utils.getCookie`
 ----
> **useModule.utils.getCookie ( name )**  
> &emsp;&emsp;*Gets a specified cookie with the given name.*    
>  **[return]**  
> &emsp;&emsp;*String/Object/Array, The result cookie for the given name. If it's a stringified object or array, it will return the object or array.*  
> **[parameters]**  
> * **name** [required] : *String, The cookie name.*
#### `useModule.utils.setCookie`
 ----
> **useModule.utils.setCookie ( name, value, options )**  
> &emsp;&emsp;*Creates a cookie with the given name, value, and other options.*    
> **[parameters]**  
> * **name** [required] : *String, The cookie name.*
> * **value** [required] : *String/Object/Array, The value of cookie. If it's an Object or Array, a stringified string will be saved into Cookie.*
> * **options** [options] : *Object, The cookie options. { expires: Number for seconds, path: String, domain: String, maxAge: String, sameSite: Boolean, secure: Boolean, httpOnly: Boolean }.*
#### `useModule.utils.removeCookie`
 ----
> **useModule.utils.removeCookie ( name )**  
> &emsp;&emsp;*Remove a specified cookie with the given name.*    
> **[parameters]**  
> * **name** [required] : *String, The cookie name.*
#### `useModule.utils.clearCookie`
 ----
> **useModule.utils.clearCookie ( )**  
> &emsp;&emsp;*Clears all cookies.*    
```javascript
  useModule.utils.setCookie("c1", "v1");
  useModule.utils.setCookie("c2", {k1:"v1",k2:"v2"});
  // "v1"
  const cookie1 = useModule.utils.getCookie( "c1" );
  // {k1:"v1",k2:"v2"}
  const cookie2 = useModule.utils.getCookie( "c2" );
  console.log( cookie1, cookie2 );
  useModule.utils.removeCookie( "c1" );
  useModule.utils.clearCookie( );
```
#### `useModule.utils.getLocalStorage`
 ----
> **useModule.utils.getLocalStorage ( name )**  
> &emsp;&emsp;*Gets a specified local storage with the given name.*    
>  **[return]**  
> &emsp;&emsp;*String/Object/Array, The result local storage for the given name. If it's a stringified object or array, it will return the object or array.*  
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
> &emsp;&emsp;*Removes a specified local storage with the given name.*    
> **[parameters]**  
> * **name** [required] : *String, The local storage name.*
#### `useModule.utils.clearLocalStorage`
 ----
> **useModule.utils.clearLocalStorage (  )**  
> &emsp;&emsp;*Clears all local storage.*    
```javascript
  useModule.utils.setLocalStorage ("c1", "v1");
  useModule.utils.setLocalStorage ("c2", {k1:"v1",k2:"v2"});
  // "v1"
  const sto1 = useModule.utils.getLocalStorage( "c1" );
  // {k1:"v1",k2:"v2"}
  const sto2 = useModule.utils.getLocalStorage( "c2" );
  console.log( sto1, sto2);
  useModule.utils.removeLocalStorage( "c1" );
  useModule.utils.clearLocalStorage( );
```
#### `useModule.utils.postH5ChannelMessage`
 ----
> **useModule.utils.postH5ChannelMessage ( channelName, message)**  
> &emsp;&emsp;*Posts HTML5 message to all browser windows via a specified channel, via window.BroadcastChannel object, which can be received in all useModule components' onH5ChannelMessage event*  
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
> &emsp;&emsp;*To show an browser's file dialog for selecting files. You must use 'await' to call it, and it must be called in an async function.*  
>  **[return]**  
> &emsp;&emsp;*Array < File >, The result files.*  
> **[parameters]**  
> * **contentType** [optional] : *String, The content type. e.g. 'image/png', 'image/\*'*  
> * **multiple** [optional] : *Boolean, The message object, can be any value. Default is false* 
```javascript
  import { useModule } from "react-module-hook";
  //...
  const App = props => {
      const { module } = useModule(props, { }); 
      return (
        <div>
          <button onClick={async () => {
            const files = await useModule.utils.selectLocalFiles();
            console.log(files);
          }}>module.request</button>
        </div>
      );
  };
```
### useModule instance - module functions
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
> * **idOrAlias** [required] : *String, The target useModule element's uid or alias*  
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
> * **alias** [required] : *String, The alias of the element* 
```javascript
  // to get a module(in the current module) with usemodule_alias="alias1"
  const module2 = module.getModuleByAlias("alias1");
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
> **dispatchAction ( actionName, params, from)**  
> &emsp;&emsp;*Dispatches an action for the target useModule element*  
> **[return]**  
> &emsp;&emsp;*Object, The target action's return value*  
> **[parameters]**  
> * **actionName** [required] : *String, The action name to be dispatched* 
> * **params** [optional] : *Array, The parameters for the given action* 
> * **from** [optional] : *Object/Any, The from info that indicate who dispatch the action or can be other info* 
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
> * **actionName** [required] : *String, The action name to be dispatched* 
> * **params** [optional] : *Array, The parameters for the given action* 
> * **from** [optional] : *Object/Any, The from info that indicate who dispatch the action or can be other info* 
```javascript
  // to dispatch an async action
  const result1 = module.dispatchAsyncAction("asyncActionName", [/*parameters*/]);
``` 
#### `updateState`
----
> **updateState ( path, state, force )**  
> &emsp;&emsp;*Updates the module state for the current useModule*  
> **[parameters]**  
> * **path** [required] : *Object / Array< String > / String, **If it's an Array< String >: to** specify the path for updating the state; **If it's a string**: the string can be convert into an Array< String > after splitting by '.'; **If it's an object**: to specify the whole object to update the state, ignore the the 2nd parameter - state in this case.* 
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
> * **eventName** [required] : *String, The action name to be dispatched* 
> * **params** [optional] : *Array, The parameters for the given action* 
> * **from** [optional] : *Object/Any, The from info that indicate who dispatch the action or can be other info* 
```javascript
  // to fire an event 
  const result1 = module.fireEvent("eventName", [/*parameters*/]);
```
#### `broadcast`
 ----
> **broadcast ( channelName, message)**  
> &emsp;&emsp;*Broadcasts message to all useModule elements via a specified channel, which can be received in all useModule components' onChannelMessage event*  
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
> &emsp;&emsp;*Triggers a React.useRef to create a ref, which initialial value is 'value' , and can be retrieved by module.getRef('refName') .*  
>  **[return]**  
> &emsp;&emsp;*Object, The ref*  
> **[parameters]**  
> * **refName** [required] : *String, The ref name* 
> * **value** [optional] : *Object/Any, The given initialial value* 
```javascript
  // to use a ref
  module.useRef("refName", "init vaule");
  // to get the ref
  const ref = module.refs["refName"];
  // or
  const ref = module.getRef("refName");  
```
#### `getRef`
 ----
> **useRef ( refName, value )**  
> &emsp;&emsp;*Gets a specified ref by the given name, this ref was created by module.useRef('refName', 'value').*  
>  **[return]**  
> &emsp;&emsp;*Object, The ref*  
> **[parameters]**  
> * **refName** [required] : *String, The ref name* 
```javascript
  // to get the ref
  const ref = module.getRef("refName");
```
#### `renderComAs`
 ----
> **renderComAs ( x_id, replace, beforeNodes, afterNodes )**  
> &emsp;&emsp;*Renders an enhanced component (with a specified 'x_id') as a different  component or a set of components, which can be used as element replacement, or inserting additional elements before or after the element.*  
> **[parameters]**  
> * **x_id** [required] : *String, The target element's x_id. The target element must be an enhanced component which powered by module.enhanceCom()* 
> * **replace** [optional] : *Object/Array,  A React element or React elements array. The React element(s) to replace the current element. If specified [false], this replacement function will be ignored. If specified [null], the original element will be restored. Default is null.* 
> * **beforeNodes** [optional] : *Object/Array,  A React element or React elements array. The React element(s) to be inserted before the target element. If specified [false], the 'inserting before function' will be ignored. If specified [null], all beforeNodes will be removed. Default is null.* 
> * **afterNodes** [optional] : *Object/Array,  A React element or React elements array. The React element(s) to be inserted after the target element. If specified [false], the 'inserting after function' will be ignored. If specified [null], all afterNodes will be removed. Default is null.* 
```javascript
  // to get the ref
  const ref = module.getRef("refName");
```
### For useModule instance with material-UI plugin
#### `showSnackbar`
 ----
> **showSnackbar ( refName, value )**  
> &emsp;&emsp;*To show a material-UI snackbar. An advanced function in material-UI plugin ( react-module-hook/plugin_mui )*  
>  **[return]**  
> &emsp;&emsp;*Object, The ref*  
> **[parameters]**  
> * **message** [required] : *String/Object, The message (String), or the properties (Object) of the [Snackbar]( https://material-ui.com/api/snackbar )* 
```javascript
  import { useModule } from "react-module-hook";
  // must import material-UI plugin
  import "react-module-hook/plugin_mui";
  //...
  // to show a snack bar
  module.showSnackbar("snack message");
```
#### `alert`
 ----
> **alert ( title, description, okCaption )**  
> &emsp;&emsp;*To show an material-UI alert window. An advanced function in material-UI plugin ( react-module-hook/plugin_mui ). You must use 'await' to call it, and it must be called in an async function.*  
> **[parameters]**  
> * **title** [required] : *String, The title text* 
> * **description** [required] : *String, The description text* 
> * **okCaption** [optional] : *String, The caption text for OK button. Default is "OK".* 
```javascript
  import { useModule } from "react-module-hook";
  // must import material-UI plugin
  import "react-module-hook/plugin_mui";
  //...
  (async()=>{
      // to show an alert dialog
      await module.alert("title", "desc", "O K");
  })();
```
#### `confirm`
 ----
> **confirm ( title, description, okCaption, cancelCaption )**  
> &emsp;&emsp;*To show an material-UI confirm window. An advanced function in material-UI plugin ( react-module-hook/plugin_mui ). You must use 'await' to call it, and it must be called in an async function.*  
>  **[return]**  
> &emsp;&emsp;*Boolean, the confirm result.*  
> **[parameters]**  
> * **title** [required] : *String, The title text* 
> * **description** [required] : *String, The description text* 
> * **okCaption** [optional] : *String, The caption text for OK button. Default is "OK".* 
> * **cancelCaption** [optional] : *String, The caption text for cancel button. Default is "Cancel".* 
```javascript
  import { useModule } from "react-module-hook";
  // must import material-UI plugin
  import "react-module-hook/plugin_mui";
  //...
  (async()=>{
      // to show an confirm dialog
      const result = await module.cofirm("title", "desc");
  })();
```
#### `prompt`
 ----
> **prompt ( title, description, defaultValue, okCaption, cancelCaption )**  
> &emsp;&emsp;*To show an material-UI prompt window. An advanced function in material-UI plugin ( react-module-hook/plugin_mui ). You must use 'await' to call it, and it must be called in an async function.*  
>  **[return]**  
> &emsp;&emsp;*String, the input result.*  
> **[parameters]**  
> * **title** [required] : *String, The title text* 
> * **description** [required] : *String, The description text* 
> * **defaultValue** [optional] : *String, The default value text. Default is empty string.* 
> * **okCaption** [optional] : *String, The caption text for OK button. Default is "OK".* 
> * **cancelCaption** [optional] : *String, The caption text for cancel button). Default is "Cancel".* 
```javascript
  import { useModule } from "react-module-hook";
  // must import material-UI plugin
  import "react-module-hook/plugin_mui";
  //...
  (async()=>{
      // to show an confirm dialog
      const result = await module.prompt("title", "desc");
  })();
```
#### `showBackdrop`
 ----
> **showBackdrop ( id, clickAway, style, transitionDuration, children)**  
> &emsp;&emsp;*To show a backdrop for a given id. An advanced function in material-UI plugin ( react-module-hook/plugin_mui ).*  
> **[parameters]**  
> * **id** [optional] : *String, The backdrop id, default is 'default'* 
> * **clickAway** [optional] : *Boolean, To determine whether 'click' to hide the backdrop or not, default is true.* 
> * **style** [optional] : *Object, To determine the backdrop's style, default is {}.*   
> * **transitionDuration** [optional] : *Number, The transition duration in ms. Default is 300.* 
> * **children** [optional] : *Array/Boolean, The children elements in the backdrop. Default is true > there'll be an CircularProgress in the backdrop. Default is true.* 
```javascript
  import { useModule } from "react-module-hook";
  // must import material-UI plugin
  import "react-module-hook/plugin_mui";
  //...
  module.showBackdrop( );
```
#### `hideBackdrop`
 ----
> **hideBackdrop ( id )**  
> &emsp;&emsp;*To hide a backdrop for a given id. An advanced function in material-UI plugin ( react-module-hook/plugin_mui ).*  
> **[parameters]**  
> * **id** [optional] : *String, The backdrop id, default is 'default'.* 
```javascript
  import { useModule } from "react-module-hook";
  // must import material-UI plugin
  import "react-module-hook/plugin_mui";
  //...
  module.hideBackdrop( );
```
### For useModule instance with request plugin
#### `request`
 ----
> **request ( url, data, method, baseURL, AUTH_TOKEN, header, config )**  
> &emsp;&emsp;*To request data from an remote service service endpoint, by [axios](https://github.com/axios/axios). An advanced function in material-UI plugin ( react-module-hook/plugin_request ). You must use 'await' to call it, and it must be called in an async function.*  
>  **[return]**  
> &emsp;&emsp;*Object, the request result.*  
> **[parameters]**  
> * **url** [required] : *String, The url for an [axios reqeust](https://github.com/axios/axios#request-config)* 
> * **data** [optional] : *Object/String, The data (ArrayBuffer, ArrayBufferView, URLSearchParams, FormData, File, Blob, or queryString) for an  [axios reqeust](https://github.com/axios/axios#request-config) Default is null.* 
> * **method** [optional] : *String, The method (get/post/put/delete/patch/head/options) for an  [axios reqeust](https://github.com/axios/axios#request-config). Default is 'get'.*   
> * **baseURL** [optional] : *String, The base URL for an  [axios reqeust](https://github.com/axios/axios#request-config). Default is empty string.*  
> * **AUTH_TOKEN** [optional] : *String, The AUTH_TOKEN for an  [axios reqeust](https://github.com/axios/axios#request-config). Default is null.*  
> * **header** [optional] : *Object, The header for an  [axios reqeust](https://github.com/axios/axios#request-config). Default is {}.*  
> * **config** [optional] : *Object, The config object for an  [axios reqeust](https://github.com/axios/axios#request-config).Default is {}.*  
```javascript
  import { useModule } from "react-module-hook";
  // must import request plugin for 
  import "react-module-hook/plugin_request";
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
> &emsp;&emsp;*[for useModule request plugin] To fetch data for the useModule's default request, only for the props with req_execute=false. You must use 'await' to call it, and it must be called in an async function.*  
>  **[return]**  
> &emsp;&emsp;*Object, the request result.*  
```javascript
  import { useModule } from "react-module-hook";
  import { If } from "react-module-hook";
  // must import request plugin
  import "react-module-hook/plugin_request";
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
          }}>request.fetch()</button>
        </div>
      );
  };
```
#### `request.cancel`
 ----
> **request.cancel(  )**  
> &emsp;&emsp;*[for useModule request plugin] To cancel the useModule's default request.*  
```javascript
  import { useModule } from "react-module-hook";
  // must import request plugin
  import "react-module-hook/plugin_request";
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
### For useModule instance with router plugin
#### `router.navigate`
 ----
> **router.navigate ( route, state )**  
> &emsp;&emsp;*[for useModule router plugin] To navigate to target route (document). *  
> **[parameters]**  
> * **route** [required] : *String, The route path.* 
> * **state** [optional] : *Object/Any, The state. [router.navigate('/', {replace: true})] equals to [router.replace('/')] .* 
```javascript
  import { useModule } from "react-module-hook";
  // must import request plugin
  import "react-module-hook/plugin_router";
  //...
  const App = props => {
      // If no 'router' in props, or 'props.router' is false, the router will be undefined 
      const { module, router } = useModule(props, {
        props:{
          router : true
        }
      }); 
      return (
        <div>
          <button onClick={() => {
            router.navigate('/about');
          }}>Route to "/about"</button>
        </div>
      );
  };
```
#### `router.replace`
 ----
> **router.replace( route )**  
> &emsp;&emsp;*[for useModule router plugin] To replace to target route (document). *  
> **[parameters]**  
> * **route** [required] : *String, The route path.* 
```javascript
  import { useModule } from "react-module-hook";
  // must import request plugin
  import "react-module-hook/plugin_router";
  //...
  const App = props => {
      // If no 'router' in props, or 'props.router' is false, the router will be undefined 
      const { module, router } = useModule(props, {
        props:{
          router : true
        }
      }); 
      return (
        <div>
          <button onClick={() => {
            router.replace('/about');
          }}>Route to "/about", replace</button>
        </div>
      );
  };
```
#### `router.setSearchParams`
 ----
> **router.setSearchParams( params )**  
> &emsp;&emsp;*[for useModule router plugin] To update the search parameters. *  
> **[parameters]**  
> * **params** [required] : *Object/String, The search params. Object or queryString.* 
```javascript
  import { useModule } from "react-module-hook";
  // must import request plugin
  import "react-module-hook/plugin_router";
  //...
  const App = props => {
      // If no 'router' in props, or 'props.router' is false, the router will be undefined 
      const { module, router } = useModule(props, {
        props:{
          router : true
        }
      }); 
      return (
        <div>
          <button onClick={() => {
            router.setSearchParams('k1=v1&k2=v2');
          }}>setSearchParams</button>
        </div>
      );
  };
```
### For useModule instance with auth plugin
#### `auth.signIn`
 ----
> **auth.signIn (  )**  
> &emsp;&emsp;*[for useModule auth plugin] To trigger sign in action.*    
#### `auth.signOut `
 ----
> **auth.signOut (  )**  
> &emsp;&emsp;*[for useModule auth plugin] To trigger sign out action.*  
#### `auth.signUp `
 ----
> **auth.signUp(  )**  
> &emsp;&emsp;*[for useModule auth plugin] To trigger sign up action.*     

**File - auth_fake.js**
```javascript
  import {utils} from "react-module-hook";
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
  import { useModule } from "react-module-hook";
  import { ProvideAuth } from "react-module-hook/plugin_auth";
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
  import { useModule } from "react-module-hook";
  import { If } from "react-module-hook";
  const App = props => {
      // If no 'auth' in props, or 'props.auth' is false, the auth will be undefined 
      const { module, auth } = useModule(props, { auth: true });
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
## Quickstart
### Basic Demo
```javascript
import React from "react";
import { useModule } from "react-module-hook";

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
import { useModule } from "react-module-hook";
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

