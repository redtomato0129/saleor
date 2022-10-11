import React from "react";
import { Address, AddressFormData } from "../../components/AddressForm/types";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { getAddressFormDataFromAddress } from "@/checkout-storefront/lib/utils";
import { AutoSaveAddressForm } from "@/checkout-storefront/components/AutoSaveAddressForm";

interface GuestAddressSectionProps extends UseErrors<AddressFormData> {
  onSubmit: (address: AddressFormData) => void;
  title: string;
  defaultAddress: Address;
  checkAddressAvailability: boolean;
}

export const GuestAddressSection: React.FC<GuestAddressSectionProps> = ({
  onSubmit,
  title,
  checkAddressAvailability,
  defaultAddress,
  ...errorProps
}) => {
  const addressFormData = getAddressFormDataFromAddress(defaultAddress);

  const handleSave = (address: AddressFormData) => onSubmit({ ...address, autoSave: true });

  return (
    <AutoSaveAddressForm
      title={title}
      onSubmit={handleSave}
      defaultValues={addressFormData}
      checkAddressAvailability={checkAddressAvailability}
      {...errorProps}
    />
  );
};
