import React from "react";
import ReactDOM from "react-dom";
import { useModule } from "./";

// for plugin properties
import { Tooltip } from "@material-ui/core";
import { Collapse } from "@material-ui/core";
import { Zoom } from "@material-ui/core";
import { Grow } from "@material-ui/core";
import { Slide } from "@material-ui/core";
import { Fade } from "@material-ui/core";
import { ClickAwayListener } from "@material-ui/core";

// for seprated functions
import { Snackbar } from "@material-ui/core";
import { Backdrop } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";

import { makeStyles } from "@material-ui/core";

// for alert/confirm/prompt
import { Button } from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { DialogActions } from "@material-ui/core";
import { DialogContent } from "@material-ui/core";
import { DialogContentText } from "@material-ui/core";
import { DialogTitle } from "@material-ui/core";

/*
** plugin properties
*/

const map = {Collapse,Zoom,Grow,Slide,Fade};
const protectFuns = (hash, module) => {
  if(module.symbol!=="$")for( let key in hash) if(typeof(hash[key])=="function") hash[key] = ()=>{};
  return hash;
};

// 1. MUI_Tooltip: {}
useModule.enhancePlugIn("MUI_Tooltip", null, (wrap, component, props, children, ref, module, React) => {
  const title = props && props.MUI_Tooltip;
  if(title){
    const { ...props2 } = (props && props.MUI_TooltipProps) || {};
    props2.title = title;
    protectFuns(props2, module);
    return React.createElement(Tooltip, props2, wrap);
  }
});

// 2. MUI_ClickAwayListener: {}
useModule.enhancePlugIn("MUI_ClickAwayListener", null, (wrap, component, props, children, ref, module, React) => {
  const onClickAway = props && props.MUI_onClickAway;
  if(onClickAway && typeof(onClickAway)==="function"){
    const { ...props2 } = (props && props.MUI_ClickAwayListenerProps) || {};
    props2.onClickAway = onClickAway;
    protectFuns(props2, module);
    return React.createElement(ClickAwayListener, props2, wrap);
  }
});

// 3. MUI_Transition: {}
useModule.enhancePlugIn("MUI_Transition", null, (wrap, component, props, children, ref, module, React) => {
  const type = props && props.MUI_Transition;
  if(type && map[type]){
    const { ...props2 } = (props && props.MUI_TransitionProps) || {};
    delete props2.type;
    if(!props2.hasOwnProperty('in')) props2['in'] = true;
    protectFuns(props2, module);
    return React.createElement(map[type], props2, wrap);
  }
});

/*
** pseudo code
*/
const getEmptyDiv = (pid, sequence) => {
  var i=1,id,o,count=0,doc=document,
      body = (pid && doc.getElementById(pid)) || doc.body,
      init=function(o){
        o.id=id;
        o.setAttribute('style','position:absolute;overflow:visible;left:-100px;top:-100px;width:0;height:0;');
    };
  sequence=sequence || 1;
  while(1){
    id = "useModule:empty:" + i;
    if((o=doc.getElementById(id))){
        if((!o.firstChild||(o.firstChild.nodeType===3&&!o.firstChild.nodeValue)) && ++count===sequence)
            return o;
    }else{
        o=doc.createElement('div');
        init(o,id);
        body.appendChild(o);
        return o;
    }
    i++;
  }
};

const showSnackbar = (props/*message*/ = {
  message: "Snackbar",
  anchorOrigin: { vertical:"top", horizontal:"center" }
}, control) => {
  if(typeof(props)==="string")
    props = { message: props };
  props.open = true;

  const onClose = props.onClose;
  const Control = control || Snackbar;
  const div = getEmptyDiv();
  props.onClose =  e => {
    ReactDOM.unmountComponentAtNode(div);
    if(typeof(onClose)=="function")onClose();
  };
  setTimeout( ()=> {ReactDOM.render(React.createElement(Control, props), div)}  );
};

const alert = async (title, description, okCaption) =>{
  return new Promise( resolve => {
    const div = getEmptyDiv();
    const onClose =  e => {
      ReactDOM.unmountComponentAtNode(div);
      resolve();
    };
    ReactDOM.render(React.createElement(Dialog, {
        key:"alert", open:true, onClose:() => onClose(false), fullWidth:true, 'aria-labelledby':"alert_9za5tayt_title", 'aria-describedby':"alert_9za5tayt_description"
    },[
        React.createElement(DialogTitle, { key:"alert_title", id:"alert_9za5tayt_title"}, title),
        React.createElement(DialogContent, {key:"alert_con"} , [
          React.createElement(DialogContentText, { key:"alert_contxt", id:"alert_9za5tayt_description" }, description)
        ]),
        React.createElement(DialogActions, {key:"alert_actions" }, [
          React.createElement(Button, { key:"alert_btn", onClick:() => onClose(true), color:"primary" }, okCaption || "O K")
        ])
    ]), div);
  });
}
const confirm = async (title, description, okCaption, cancelCaption) =>{
  return new Promise( resolve => {
    const div = getEmptyDiv();
    const onClose =  result => {
      ReactDOM.unmountComponentAtNode(div);
      resolve(result);
    };
    ReactDOM.render(React.createElement(Dialog, {
        key:"confirm", open:true, onClose:() => onClose(false), fullWidth:true, 'aria-labelledby':"confirm_jlh80pil_title", 'aria-describedby':"confirm_jlh80pil_description"
    },[
        React.createElement(DialogTitle, { key:"confirm_title", id:"confirm_jlh80pil_title"}, title),
        React.createElement(DialogContent, {key:"confirm_con" } , [
          React.createElement(DialogContentText, { key:"confirm_contxt", id:"confirm_jlh80pil_description" }, description)
        ]),
        React.createElement(DialogActions, {key:"confirm_act" }, [
          React.createElement(Button, { key:"confirm_btn1", onClick:() => onClose(false), color:"secondary" }, cancelCaption || "Cancel"),
          React.createElement(Button, { key:"confirm_btn2", onClick:() => onClose(true), color:"primary" }, okCaption || "O K")
        ])
    ]), div);
  });
}
const prompt = async (title, description, defaultValue, okCaption, cancelCaption) =>{
  return new Promise( resolve => {
    let input = "";
    const div = getEmptyDiv();
    const onClose =  result => {
      ReactDOM.unmountComponentAtNode(div);
      resolve(result);
    };
    ReactDOM.render(React.createElement(Dialog, {
        key:"prompt", open:true, onClose:() => onClose(null), fullWidth:true, 'aria-labelledby':"prompt_fn69vqpc_title", 'aria-describedby':"prompt_fn69vqpc_description"
    },[
        React.createElement(DialogTitle, { key:"prompt_tt", id:"prompt_fn69vqpc_title"}, title),
        React.createElement(DialogContent, {key:"prompt_con"} , [
          React.createElement(DialogContentText, { key:"prompt_contxt", id:"prompt_fn69vqpc_description" }, description),
          React.createElement(TextField, { key:"prompt_txtf", autoFocus:true, margin:"dense", fullWidth:true, defaultValue:defaultValue, onChange:(e) => {input = e.target.value} })
        ]),
        React.createElement(DialogActions, {key:"prompt_act"}, [
          React.createElement(Button, { key:"confirm_btn1", onClick:() => onClose(null), color:"secondary" }, cancelCaption || "Cancel"),
          React.createElement(Button, { key:"confirm_btn2", onClick:() => onClose(input), color:"primary" }, okCaption || "O K")
        ])
    ]), div);
  });
}

const showBackdrop = (id="default", clickAway = true, style={}, transitionDuration = 300, children = true) => {
  if(useModule._CACHE["backdrop:"+id]){
    return;
  }
  const div = getEmptyDiv();
  const theme = useTheme();
  if(!style.hasOwnProperty("zIndex")){
      style.zIndex = theme.zIndex.drawer + 1;
  }
  if(!style.hasOwnProperty("color")){
    style.color = "#fff"
  }

  const close = ()=>{
    ReactDOM.unmountComponentAtNode(div);
    delete useModule._CACHE["backdrop:"+id];
  }

  ReactDOM.render(React.createElement(Backdrop, {
      style:style, open:true, onClick:()=>{clickAway && close()}, transitionDuration:transitionDuration
    },
    ( children===true ? React.createElement(CircularProgress, {color:"inherit"}) : children ) || null
  ), div);

  useModule._CACHE["backdrop:"+id] = {
    hide: ()=>{
      close();
    }
  };
}
const hideBackdrop = (id="default") => {
  const cache = useModule._CACHE["backdrop:"+id];
  if(cache && cache.hide && useModule.utils.isFunction(cache.hide)){
    cache.hide();
  }
}

useModule.refPlugIn("mui", module => {
  return { getEmptyDiv, showSnackbar, showBackdrop, hideBackdrop, alert, confirm, prompt };
});

export default { getEmptyDiv, showSnackbar, showBackdrop, hideBackdrop, alert, confirm, prompt };
