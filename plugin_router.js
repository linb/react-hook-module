import React from "react";
import { useRoutes, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useModule } from "./";
export * from "react-router-dom";

const RelativeRouter = ({ children, _usemodule_in_design }) =>{
  if(!Array.isArray(children))children=[children];
  if(!_usemodule_in_design){
    const routes = [];
    children.forEach(child => {
      if(child.props && child.props.path && typeof(child.props.path)==="string"){
        routes.push({ path: child.props.path, element : child });
      }
    });
    return useRoutes(routes);
  }else{
    children.forEach(child => {
      if(child.props && Array.isArray(child.props.children)){
        child.props.children = child.props.children.map( c => {
            const { children, ...others } = c.props; 
            return (c.props && !/^[AB]_/.test(c.props.id) && c.props.path) ? React.createElement( "div",
              { ...others, style:{border:'dotted #444 1px',padding:"4px",margin:"4px",background:(c.props._usemodule_lastsel?"#fffbd4":"")}},
              !c.props._usemodule_lastsel
                ? "{ path : '" + (c.props.path||"") + "', title : '" + (c.props.title||"") + "', component: <"+c.props._usemodule_vartag+">" + (children&&children.length===1&&children[0]&&children[0].type==='usemoduletext'?children[0].props.children[0]:"...") + "</"+c.props._usemodule_vartag+"> }" 
                : c
            ) : c;
          })
      }
    });
    return React.createElement("div", {style:{"font-size":"75%",border:'dashed #444 1px',padding:"4px",margin:"4px"}}, children);
  }
};

const useRouter = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  return React.useMemo(() => {
    return { params, searchParams, setSearchParams, location, navigate, replace: route=>navigate(route, {replace: true}) };
  }, [params, searchParams, setSearchParams, location, navigate ]);
};

useModule.statePlugIn("router", module => {
  const opt = module.options;
  if(opt.props && opt.props.router){
    return opt._usemodule_in_design
        ? { params:{}, searchParams:{},setSearchParams:(searchParams)=>{}, location:{hash: "",key: "default",pathname: "/",search: "",state: null}, navigate:(route, option)=>{}, replace:(route)=>{} }
      : useRouter();
  }
});

export { RelativeRouter, useRouter };