import {
  ChangeHandler,
  FormDataBase,
  FormDataField,
  FormProps,
  UseFormReturn,
} from "@/checkout-storefront/hooks/useForm/types";
import { useFormik, useFormikContext } from "formik";
import { isEqual } from "lodash-es";
import { useCallback, useState } from "react";

export const useForm = <TData extends FormDataBase>({
  initialDirty = false,
  ...formProps
}: FormProps<TData>): UseFormReturn<TData> => {
  const form = useFormik<TData>(formProps);
  // we do this because in some cases it's not updated properly
  // https://github.com/jaredpalmer/formik/issues/3165
  const [dirty, setDirty] = useState(initialDirty);
  const [values, setValues] = useState(formProps.initialValues);

  const {
    handleSubmit: handleFormikSubmit,
    handleChange: formikHandleChange,
    setFieldValue: setFormikFieldValue,
  } = form;

  const handleSubmit = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      // we do it here because formik doesn't pass props like dirty to onSubmit
      if (dirty) {
        handleFormikSubmit(event);
      }
    },
    [dirty, handleFormikSubmit]
  );

  const handleChange: ChangeHandler = useCallback(
    (event) => {
      const { name, value } = event.target;

      const updatedValues = { ...values, [name]: value };

      setDirty(!isEqual(values, updatedValues));
      setValues(updatedValues);
      formikHandleChange(event);
    },
    [formikHandleChange, values]
  );

  const setFieldValue = async (field: FormDataField<TData>, value: TData[FormDataField<TData>]) => {
    if (values[field] === value) {
      return;
    }

    await setFormikFieldValue(field, value);
    setValues({ ...values, [field]: value });
  };

  return { ...form, handleSubmit, handleChange, values, dirty, setFieldValue };
};

export const useFormContext = useFormikContext;
