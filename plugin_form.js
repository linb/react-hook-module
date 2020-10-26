import React from "react";
import { utils } from "./";
import { useForm  } from "react-hook-form";
export * from "react-hook-form";

const Form = ({ children, onSubmit, onReset, onError, onInit, onWatch, onFormState, defaultValues, rules, ...props }) => {
  const id = React.useRef( utils.getRand() ),
    ref = React.useRef(),
    instance = useForm({ defaultValues }),
    { handleSubmit, register, watch, formState, reset } = instance;
  if ( typeof onWatch === "function") utils.asyncExecute(onWatch, 0, "react-hook-form_" + id, [ watch() ]);
  if ( typeof onFormState === "function") {
    const { isDirty,isValid, dirtyFields, isSubmitting, isSubmitted, touched, submitCount, errors } = formState;
    onFormState({ isDirty,isValid, dirtyFields, isSubmitting, isSubmitted, touched, submitCount, errors });
  }
  React.useEffect(() => {
      for ( let name, field, elements = ref.current.elements, i = 0, l = elements.length; i < l; i++ ) {
        field = elements[i];
        name = field.name;
        if (name) {
          register( field, rules && rules.hasOwnProperty(name) ? rules[name] : null );
        }
      }
      if (onInit && typeof onInit === "function") onInit(ref.current, instance);
  }, [register, instance, onInit, rules]);

  return React.useMemo( () => {
    return React.createElement("form",{ ...props, ref,
      onSubmit: handleSubmit(onSubmit, onError),
      onReset: () => {
        return reset(Object.assign({}, defaultValues));
      }
    }, children);
  }, [children, handleSubmit, onSubmit, onError, reset, props, ref, defaultValues]);
}
export { Form as UMForm };
