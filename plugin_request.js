import React from "react";
import axios from "axios";
import { useModule, utils } from "./";

let GLOBAL_BASE_URL = "";
let FETCH_MOCKER = null;
const setGlobalBaseURL = baseURL => (GLOBAL_BASE_URL = baseURL);
const setFetchMocker = mocker => (FETCH_MOCKER = mocker);
const mergeConf = ( url, params, data, method, baseURL, AUTH_TOKEN, header, config ) =>{
  let source;
  let conf = Object.assign({}, config);
  url && (conf.url = url);
  method && (conf.method = method);
  conf.baseURL = ((baseURL || GLOBAL_BASE_URL || "") + "") || undefined;
  params && (conf.params = params);
  data && (conf.data = data);
  conf.header = Object.assign({}, header, conf.header);
  AUTH_TOKEN && (conf.header['Authorization'] = AUTH_TOKEN);
  if(!conf.cancelToken){
    source = axios.CancelToken.source();
    conf.cancelToken = source.token;
  }
  return conf;
};
const useRequest = ( url, params="", data="", method="get", baseURL="", AUTH_TOKEN="", header={}, config = {}, execute=false ) => {
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState(null);
  const [response, setResponse] = React.useState(null);

  // eslint-disable-next-line
  React.useEffect(() => execute && fetch(), []);

  let conf = mergeConf(url, params, data, method, baseURL, AUTH_TOKEN, header, config);

  const fetch = (config = null) => {
    if(config && utils.isObject(config)){
      conf = Object.assign({}, conf, config);
    }
    if(conf.url) {
      setStatus("loading");
      (FETCH_MOCKER || axios)(conf).then(response => {
        setResponse(response);
        setStatus("success");
      }).catch(error => {
        setError(error);
        setStatus(axios.isCancel(error)?"cancel":"error");
      });
    }else{
      setError(new Error('No url!'));
    }
  };
  const cancel = message => source && source.cancel(message);
  return { status, response, error, execute, fetch, cancel };
};

useModule.refPlugIn("request", module => {
  return {
    request: async ( url, params="", data="", method="get", baseURL="", AUTH_TOKEN="", header={}, config = {} ) => {
      return await (FETCH_MOCKER || axios)( mergeConf(url, params, data, method, baseURL, AUTH_TOKEN, header, config) );
    }
  };
});

useModule.statePlugIn("request", module => {
  const opt = module.options, props = opt && opt.props;
    return  opt._usemodule_in_design
    ? { status:"idle", params:{}, data:{}, response:{}, error:null, execute: props && props.req_execute || false, fetch:()=>{}, cancel:()=>{} }
    : (props && (props.enableRequest || props.req_url))
        ? useRequest( props.req_url, props.req_params, props.req_data, props.req_method, props.req_baseURL, props.req_AUTH_TOKEN, props.req_header, props.req_config, 
          props.req_execute===true ? true:props.req_execute===false ? false: !!props.req_url
        ) : {};
});

export { useRequest, axios, setGlobalBaseURL, setFetchMocker };