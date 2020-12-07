import React from "react";
import axios from "axios";
import { useModule } from "./";

let BASE_URL = "";
let MOCK_FETCH = null;
const setGlobalBaseURL = url => (BASE_URL = url);
const setMockFetch = fun => (MOCK_FETCH = fun);

const useRequest = ( url, params="", data="", method="get", baseURL="", AUTH_TOKEN="", header={}, config = {}, execute=false ) => {
  let source;
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState(null);
  const [response, setResponse] = React.useState(null);

  // eslint-disable-next-line
  React.useEffect(() => execute && fetch(), []);

  config = Object.assign({}, config);
  url && (config.url = url);
  method && (config.method = method);
  config.baseURL = ((baseURL || BASE_URL || "") + "") || undefined;
  params && (config.params = params);
  data && (config.data = data);
  config.header = Object.assign({}, header, config.header);
  AUTH_TOKEN && (config.header['Authorization'] = AUTH_TOKEN);
  if(!config.cancelToken){
    source = axios.CancelToken.source();
    config.cancelToken = source.token;
  }

  const fetch = () => {
    if (config.url) {
      setStatus("loading");
      (MOCK_FETCH || axios)(config).then(response => {
        setResponse(response);
        setStatus("success");
      }).catch(error => {
        setError(error);
        setStatus(axios.isCancel(error)?"cancel":"error");
      });
    }
  };
  const cancel = message => source && source.cancel(message);
  return { status, response, error, execute, fetch, cancel };
};

useModule.refPlugIn("request", module => {
  return {
    request: async ( url, data, method="get", baseURL="", AUTH_TOKEN="", header={}, config = {} ) => {
      config = Object.assign({}, config);
      url && (config.url = url);
      method && (config.method = method);
      baseURL && (config.baseURL = baseURL);
        if(!config.method || config.method==="get"){
          data && (config.params = data);
        }else{
          data && (config.data = data);
        }
        config.header = Object.assign({}, header, config.header);
        AUTH_TOKEN && (config.header['Authorization'] = AUTH_TOKEN);
      return await axios( config );
    }
  };
});

useModule.statePlugIn("request", module => {
  const opt = module.options, props = opt && opt.props;
  if(props){
    return  opt._usemodule_in_design
        ? { status:"idle", params:{}, data:{}, response:{}, error:null, execute: props.req_execute, fetch:()=>{}, cancel:()=>{} }
        : useRequest( props.req_url, props.req_params, props.req_data, props.req_method, props.req_baseURL, props.req_AUTH_TOKEN, props.req_header, props.req_config, 
          props.req_execute===true ? true:props.req_execute===false ? false: !!props.req_url
        );
  }
});

export { useRequest, axios, setGlobalBaseURL, setMockFetch };