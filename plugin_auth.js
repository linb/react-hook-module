import React from "react";
import { useModule } from "./";

const authContext = React.createContext();
const ProvideAuth = ({ signIn, signOut, signUp, authInit, authClean, children }) => {
  return React.createElement(authContext.Provider, {
      value: useProvideAuth(signIn, signOut, signUp, authInit, authClean)
    }, children);
}
const useAuth = () => {
  return React.useContext(authContext);
};

function useProvideAuth(signIn, signOut, signUp, authInit, authClean) {
  const [user, setUser] = React.useState(null);
  const [token, setToken] = React.useState(null);

  // initial & cleanup
  React.useEffect(() => {
    const handler = typeof(authInit)==="function" && authInit.call({setUser,setToken},setUser,setToken);
    return () => {
      typeof(handler)==="function" && handler();
      typeof(authClean)==="function" && authClean.call({setUser,setToken});
    }
  //eslint-disable-next-line
  }, []); 

  return { user, setUser, token, setToken, signIn, signOut, signUp };
}

useModule.statePlugIn("auth", module => {
  const opt = module.options;
  if(opt.props && opt.props.auth){
    return opt._usemodule_in_design
    ? {user:{token:"auth_token", name:"auth_name"}, signIn:()=>{}, signUp:()=>{}, signOut:()=>{}}
    : useAuth();
  }
});

export { ProvideAuth, useAuth };