import React from "react";
import { utils } from "./";
import { useForm  } from "react-hook-form";
export * from "react-hook-form";

const Form = ({ _usemodule_in_design, children, onSubmit, onReset, onError, onInit, onWatch, onFormState, defaultValues, rules, formOptions, ...props }) => {
  const id = React.useRef( utils.getRand() ),
    ref = React.useRef(),
    instance = useForm( formOptions ),
    { handleSubmit, register, watch, formState, reset } = instance;
  formOptions = formOptions || {};
  formOptions.defaultValues = defaultValues;    
  if ( typeof onWatch === "function") utils.asyncExecute(onWatch, 0, "react-hook-form_" + id, [ watch() ]);
  if ( typeof onFormState === "function") {
    // isValid is only applicable with formOptions.mode=onChange or formOptions.mode=onBlur.
    const { isDirty, isValid, dirtyFields, isSubmitting, isSubmitted, touched, submitCount, errors } = formState;
    onFormState({ isDirty, isValid, dirtyFields, isSubmitting, isSubmitted, touched, submitCount, errors }, formState);
  }
  React.useEffect(() => {
      if(!_usemodule_in_design){
      for ( let name, field, elements = ref.current.elements, i = 0, l = elements.length; i < l; i++ ) {
        field = elements[i];
        name = field.name;
        if (name) {
          register( field, rules && rules.hasOwnProperty(name) ? rules[name] : null );
        }
      }
      if (onInit && typeof onInit === "function") onInit(ref.current, instance);
      }
  }, [register, instance, onInit, rules]);

  return React.useMemo( () => {
    return React.createElement((_usemodule_in_design?"div":"form"),{ ...props, ref,
      onSubmit: handleSubmit(onSubmit, onError),
      onReset: () => {
        return reset(Object.assign({}, defaultValues));
      }
    }, children);
  }, [children, handleSubmit, onSubmit, onError, reset, props, ref, defaultValues]);
}
export { Form as RHForm };
