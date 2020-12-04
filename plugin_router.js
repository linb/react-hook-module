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
        routes.push({ path: child.props.path, element : React.createElement(React.Fragment,null,child.props.children) });
      }
    });
    return useRoutes(routes);
  }else{
    children = children.map(child => {
      let { children, ...others } = child.props; 
      if (others && others.path){
              if(!Array.isArray(children)) children = [children];
              children.unshift(React.createElement("div",
                {style:{'font-size':'75%',border:'dashed #444 1px',padding:"4px",margin:"4px 0",background:others._usemodule_lastsel?"#fffbd4":""}},
                "{ path : '" + (others.path||"") + "', title : '" + (others.title||"") + "', component: <"+others._usemodule_vartag+">" + (children&&children.length===1&&children[0]&&children[0].type==='usemoduletext'?children[0].props.children[0]:"...") + "</"+others._usemodule_vartag+"> }" 
              ));
              return React.createElement( "div", others, others._usemodule_lastsel ? children: children[0] );
            }else{
          return child;
      }
    });
    return React.createElement("div", null, children);
  }
};
RelativeRouter._usemodule_nostyle = 1;

const useRouter = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  return React.useMemo(() => {
    return { params, searchParams, setSearchParams, location, navigate, 
      pathname: location.pathname,
      relativePath: "/" + (params["*"]||"").split("/").pop(),
      query: {
        ...useModule.utils.getURLParams(location.search),
        ...params
      },
      push: route=>navigate(route),
      replace: route=>navigate(route, {replace: true}) 
    };
  }, [params, searchParams, setSearchParams, location, navigate ]);
};

useModule.statePlugIn("router", module => {
  const opt = module.options;
  if(opt.props && opt.props.router){
    return opt._usemodule_in_design
        ? { params:{}, searchParams:{},setSearchParams:(searchParams)=>{}, location:{hash: "",key: "default",pathname: "/",search: "",state: null}, pathname:"/", relativePath:"/", query:{"*":"/"}, navigate:(route, option)=>{}, push:(route)=>{}, replace:(route)=>{} }
      : useRouter();
  }
});

export { RelativeRouter, useRouter };