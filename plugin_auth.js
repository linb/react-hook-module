import React from "react";
import { useModule } from "./";

const authContext = React.createContext();
const ProvideAuth = ({ signIn, signOut, signUp, user, token, authInit, authClean, children, ...tagVar }) => {
  return React.createElement(authContext.Provider, {
      value: useProvideAuth(signIn, signOut, signUp, user, token, authInit, authClean, tagVar)
    }, children);
}
const useAuth = () => {
  return React.useContext(authContext);
};

function useProvideAuth(signIn, signOut, signUp, dftUser, dftToken, authInit, authClean, tagVar) {
  const [user, setUser] = React.useState(dftUser!==undefined ? dftUser : false);
  const [token, setToken] = React.useState(dftToken!==undefined ? dftToken : false);

  // initial & cleanup
  React.useEffect(() => {
    const handler = typeof(authInit)==="function" && authInit.call({setUser,setToken},setUser,setToken);
    return () => {
      typeof(handler)==="function" && handler();
      typeof(authClean)==="function" && authClean.call({setUser,setToken});
    }
  //eslint-disable-next-line
  }, []); 

  return { user, setUser, token, setToken, signIn, signOut, signUp, ...tagVar };
}
useModule.statePlugIn("auth", module => {
  const opt = module.options;
    return opt._usemodule_in_design
      ? {user:{token:false, name:false, user:false}, signIn:()=>{}, signUp:()=>{}, signOut:()=>{}}
    : (opt.props && opt.props.enableAuth) ? useAuth() : {};
});

export { ProvideAuth, useAuth };