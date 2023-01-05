import React from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { AddressDetailsFragment, CheckoutError, CountryCode } from "@/saleor/api";

import { messages } from "../translations";

export interface AddressFormData {
  firstName: string;
  lastName: string;
  phone: string;
  country: CountryCode;
  streetAddress1: string;
  city: string;
  postalCode: string;
}

export interface AddressFormProps {
  existingAddressData?: AddressDetailsFragment;
  toggleEdit: () => void;
  updateAddressMutation: (address: AddressFormData) => Promise<CheckoutError[]>;
}

export function AddressForm({
  existingAddressData,
  toggleEdit,
  updateAddressMutation,
}: AddressFormProps) {
  const t = useIntl();
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: errorsAddress },
    setError: setErrorAddress,
  } = useForm<AddressFormData>({
    defaultValues: {
      firstName: existingAddressData?.firstName || "",
      lastName: existingAddressData?.lastName || "",
      phone: existingAddressData?.phone || "",
      country: "PL",
      streetAddress1: existingAddressData?.streetAddress1 || "",
      city: existingAddressData?.city || "",
      postalCode: existingAddressData?.postalCode || "",
    },
  });

  const onAddressFormSubmit = handleSubmitAddress(async (formData: AddressFormData) => {
    const errors = await updateAddressMutation(formData);

    // Assign errors to the form fields
    if (errors.length > 0) {
      errors.forEach((e) =>
        setErrorAddress(e.field as keyof AddressFormData, {
          message: e.message || "",
        })
      );
      return;
    }

    // Address updated, we can exit the edit mode
    toggleEdit();
  });
  return (
    <form method="post" onSubmit={onAddressFormSubmit}>
      <div className="grid grid-cols-12 gap-4 w-full">
        <div className="col-span-full">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            {t.formatMessage(messages.phoneField)}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="phone"
              className="w-full border-gray-300 rounded-md shadow-sm text-base"
              spellCheck={false}
              {...registerAddress("phone", {
                required: true,
                pattern: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i,
              })}
            />
            {!!errorsAddress.phone && <p>{errorsAddress.phone.message}</p>}
          </div>
        </div>

        <div className="col-span-full sm:col-span-6">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            {t.formatMessage(messages.firstNameField)}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="province"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
              spellCheck={false}
              {...registerAddress("firstName", {
                required: true,
              })}
            />
            {!!errorsAddress.firstName && <p>{errorsAddress.firstName.message}</p>}
          </div>
        </div>

        <div className="col-span-full sm:col-span-6">
          <label htmlFor="province" className="block text-sm font-medium text-gray-700">
            {t.formatMessage(messages.lastNameField)}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="lastName"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
              spellCheck={false}
              {...registerAddress("lastName", {
                required: true,
              })}
            />
            {!!errorsAddress.lastName && <p>{errorsAddress.lastName.message}</p>}
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            {t.formatMessage(messages.addressField)}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="streetAddress1"
              className="w-full border-gray-300 rounded-md shadow-sm text-base"
              spellCheck={false}
              {...registerAddress("streetAddress1", {
                required: true,
              })}
            />
            {!!errorsAddress.streetAddress1 && <p>{errorsAddress.streetAddress1.message}</p>}
          </div>
        </div>

        <div className="col-span-full sm:col-span-6">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            {t.formatMessage(messages.cityField)}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="city"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
              spellCheck={false}
              {...registerAddress("city", { required: true })}
            />
            {!!errorsAddress.city && <p>{errorsAddress.city.message}</p>}
          </div>
        </div>

        {/* <div className="col-span-full sm:col-span-4">
        <label
          htmlFor="province"
          className="block text-sm font-medium text-gray-700"
        >
          Province
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="province"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            spellCheck={false}
          />
        </div>
      </div> */}

        <div className="col-span-full sm:col-span-6">
          <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
            {t.formatMessage(messages.postalCodeField)}
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="postal-code"
              autoComplete="postal-code"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
              spellCheck={false}
              {...registerAddress("postalCode", {
                required: true,
              })}
            />
            {!!errorsAddress.postalCode && <p>{errorsAddress.postalCode.message}</p>}
          </div>
        </div>

        <div className="col-span-full">
          <button type="button" className="btn-checkout-section" onClick={onAddressFormSubmit}>
            {t.formatMessage(messages.saveButton)}
          </button>
        </div>
      </div>
    </form>
  );
}
