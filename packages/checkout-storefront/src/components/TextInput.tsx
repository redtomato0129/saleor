import React, { AllHTMLAttributes, ForwardedRef, forwardRef } from "react";
import { TextInput as UiKitTextInput } from "@saleor/ui-kit";
import { Control, FieldPath, UseFormRegisterReturn, useWatch } from "react-hook-form";
import { ControlFormData } from "@/checkout-storefront/hooks/useGetInputProps";
import { Error } from "../hooks/useErrors";
import { TextInputProps as UiKitTextInputProps } from "@saleor/ui-kit";

export interface TextInputProps<
  TControl extends Control<any, any>,
  TFormData extends ControlFormData<TControl>
> extends Omit<AllHTMLAttributes<HTMLInputElement>, "onBlur" | "onChange" | "name" | "ref">,
    Omit<UseFormRegisterReturn, "ref">,
    Pick<UiKitTextInputProps, "classNames"> {
  error: Pick<Error<TFormData>, "message"> | undefined;
  control: TControl;
  name: FieldPath<TFormData>;
  label: string;
  optional?: boolean;
  icon?: React.ReactNode;
}

const TextInputComponent = <
  TControl extends Control<any, any>,
  TFormData extends ControlFormData<TControl>
>(
  props: TextInputProps<TControl, TFormData>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const { name, control, optional, error, ...rest } = props;

  const value = useWatch({
    control,
    name,
  });

  return (
    <UiKitTextInput
      {...rest}
      error={(error as any)?.message || ""}
      ref={ref}
      name={name}
      value={value}
      required={!optional}
    />
  );
};

export const TextInput = forwardRef(TextInputComponent) as <
  TControl extends Control<any, any>,
  TFormData extends ControlFormData<TControl>
>(
  props: TextInputProps<TControl, TFormData> & {
    ref?: ForwardedRef<HTMLInputElement>;
  }
) => ReturnType<typeof TextInputComponent>;
