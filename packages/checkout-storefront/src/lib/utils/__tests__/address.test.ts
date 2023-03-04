import { AddressField } from "@/checkout-storefront/components/AddressForm/types";
import {
  getAddressFormDataFromAddress,
  getAllAddressFieldKeys,
  getEmptyAddressFormData,
  getOrderedAddressFields,
  isMatchingAddress,
  isMatchingAddressFormData,
} from "@/checkout-storefront/components/AddressForm/utils";
import { AddressFragment } from "@/checkout-storefront/graphql";
import { addresses } from "@/checkout-storefront/lib/fixtures/address";

import { pick } from "lodash-es";

describe("getAddressFormDataFromAddress", () => {
  it("should return empty form data for non-existing address", () => {
    expect(getAddressFormDataFromAddress(null)).toEqual(getEmptyAddressFormData());
  });

  it("should return properly formatted form data from adress", () => {
    const address = addresses[0];
    expect(getAddressFormDataFromAddress(address)).toEqual({
      ...pick(address, getAllAddressFieldKeys()),
      countryCode: address?.country.code,
    });
  });
});

describe("isMatchingAddress", () => {
  it("should return true for addresses of same id", () => {
    const address = { ...addresses[0], id: "some-id" } as AddressFragment;
    const addressToCompare = { ...addresses[1], id: "some-id" } as AddressFragment;

    expect(isMatchingAddress(address, addressToCompare)).toEqual(true);
  });

  it("should return true for addresses of different id but same data", () => {
    const address = { ...addresses[0], id: "some-id" } as AddressFragment;
    const addressToCompare = { ...addresses[0], id: "some-other-id" } as AddressFragment;

    expect(isMatchingAddress(address, addressToCompare)).toEqual(true);
  });

  it("should return false for different addresses", () => {
    const address = addresses[0];
    const addressToCompare = addresses[1];

    expect(isMatchingAddress(address, addressToCompare)).toEqual(false);
  });
});

describe("isMatchingAddressFormData", () => {
  it("should return true for address form data with all same data", () => {
    const address = getAddressFormDataFromAddress(addresses[0]);

    expect(isMatchingAddressFormData(address, address)).toEqual(true);
  });

  it("should return true for address form data of different id but same data", () => {
    const address = getAddressFormDataFromAddress({
      ...addresses[0],
      id: "some-id",
    } as AddressFragment);
    const addressToCompare = getAddressFormDataFromAddress({
      ...addresses[0],
      id: "some-other-id",
    } as AddressFragment);

    expect(isMatchingAddressFormData(address, addressToCompare)).toEqual(true);
  });

  it("should return false for different addresses", () => {
    const address = getAddressFormDataFromAddress(addresses[0]);
    const addressToCompare = getAddressFormDataFromAddress(addresses[1]);

    expect(isMatchingAddressFormData(address, addressToCompare)).toEqual(false);
  });

  it("should return true for same addresses, one of which has an id", () => {
    const { id, ...addressRest } = addresses[0] as AddressFragment;
    const address = getAddressFormDataFromAddress({ id, ...addressRest });
    const addressToCompare = getAddressFormDataFromAddress(addressRest as AddressFragment);

    expect(isMatchingAddressFormData(address, addressToCompare)).toEqual(true);
  });
});

describe("getOrderedAddressFields", () => {
  it("should return properly ordered fields", () => {
    const unorderedAddressFields: AddressField[] = [
      "city",
      "lastName",
      "postalCode",
      "firstName",
      "companyName",
      "cityArea",
      "phone",
    ];

    expect(getOrderedAddressFields(unorderedAddressFields)).toEqual([
      "firstName",
      "lastName",
      "companyName",
      "city",
      "postalCode",
      "cityArea",
      "phone",
    ]);
  });
});
