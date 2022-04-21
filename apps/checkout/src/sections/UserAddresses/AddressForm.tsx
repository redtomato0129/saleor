import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { CountryCode, useAddressValidationRulesQuery } from "@/graphql";
import { useErrorMessages } from "@/hooks/useErrorMessages";
import { MessageKey, useFormattedMessages } from "@/hooks/useFormattedMessages";
import { useGetInputProps } from "@/hooks/useGetInputProps";
import { AddressField } from "@/lib/globalTypes";
import {
  getRequiredAddressFields,
  getSortedAddressFields,
  useValidationResolver,
} from "@/lib/utils";
import { useErrorsContext } from "@/providers/ErrorsProvider";
import forEach from "lodash/forEach";
import { useEffect } from "react";
import {
  DefaultValues,
  Path,
  Resolver,
  SubmitHandler,
  UnpackNestedValue,
  useForm,
} from "react-hook-form";
import { object, string } from "yup";
import { AddressFormData } from "./types";

interface AddressFormProps<TFormData extends AddressFormData> {
  countryCode: CountryCode;
  defaultValues?: DefaultValues<TFormData>;
  onCancel?: () => void;
  onSave: SubmitHandler<TFormData>;
}

export const AddressForm = <TFormData extends AddressFormData>({
  countryCode,
  defaultValues,
  onCancel,
  onSave,
}: AddressFormProps<TFormData>) => {
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const {
    errors,
    hasErrors,
    clearErrors: clearContextErrors,
  } = useErrorsContext();

  const schema = object({
    firstName: string().required(errorMessages.requiredValue),
    lastName: string().required(errorMessages.requiredValue),
    streetAddress1: string().required(errorMessages.requiredValue),
    postalCode: string().required(errorMessages.requiredValue),
    city: string().required(errorMessages.requiredValue),
  });

  const resolver = useValidationResolver(schema);

  const {
    handleSubmit,
    watch,
    getValues,
    setError,
    formState,
    clearErrors,
    ...rest
  } = useForm<TFormData>({
    resolver: resolver as unknown as Resolver<TFormData, any>,
    mode: "onBlur",
    defaultValues,
  });

  useEffect(() => {
    if (hasErrors) {
      forEach(errors, ({ message }, key) => {
        setError(key as Path<TFormData>, { message });
      });
    }
  }, [errors]);

  const getInputProps = useGetInputProps({ ...rest, formState });

  const [{ data }] = useAddressValidationRulesQuery({
    variables: { countryCode },
  });

  const validationRules = data?.addressValidationRules;

  const isFieldOptional = (field: AddressField) =>
    !getRequiredAddressFields(
      validationRules?.requiredFields! as AddressField[]
    ).includes(field);

  const handleCancel = () => {
    clearErrors();
    clearContextErrors();

    if (onCancel) {
      onCancel();
    }
  };

  const handleSave = (address: UnpackNestedValue<TFormData>) => {
    clearContextErrors();
    onSave(address);
  };

  return (
    <div>
      {getSortedAddressFields(
        validationRules?.allowedFields! as AddressField[]
      )?.map((field: AddressField) => (
        <TextInput
          label={formatMessage(field as MessageKey)}
          {...getInputProps(field as Path<TFormData>)}
          optional={isFieldOptional(field)}
        />
      ))}
      <div>
        {onCancel && (
          <Button
            className="mr-4"
            ariaLabel={formatMessage("cancelLabel")}
            variant="secondary"
            onClick={handleCancel}
            title={formatMessage("cancel")}
          />
        )}
        <Button
          ariaLabel={formatMessage("saveLabel")}
          onClick={handleSubmit(handleSave)}
          title={formatMessage("saveAddress")}
        />
      </div>
    </div>
  );
};
