import clsx from "clsx";
import { Ref, InputHTMLAttributes, forwardRef } from "react";
import { ClassNames } from "../..";

import { Label } from "../Label";
import { Text } from "../Text";

import styles from "./TextInput.module.css";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "checked"> {
  label?: string;
  error?: string;
  classNames?: ClassNames<"container" | "input">;
}

export const TextInput = forwardRef(
  (
    { label, error, required, placeholder, value, classNames = {}, ...rest }: TextInputProps,
    ref: Ref<HTMLInputElement>
  ) => (
    <div className={clsx(styles["text-input-container"], classNames.container)}>
      {label && (
        <Label
          className={clsx(styles["text-input-label"], {
            [styles["text-input-filled-label"]]: value || placeholder,
          })}
        >
          {label}
          {required && "*"}
        </Label>
      )}
      <input
        ref={ref}
        className={clsx(
          styles["text-input"],
          {
            [styles["text-input-error"]]: error,
            [styles["text-input-nolabel"]]: !label,
          },
          classNames.input
        )}
        placeholder={placeholder}
        value={value}
        required={required}
        {...rest}
      />
      {error && (
        <Text size="sm" color="error" className={styles["text-input-error-caption"]}>
          {error}
        </Text>
      )}
    </div>
  )
);
