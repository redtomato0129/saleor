import { createGetCountryNames, getParsedLocaleData } from "@/checkout-storefront/lib/utils/locale";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import {
  AddressFragment,
  AddressInput,
  CheckoutAddressValidationRules,
  CountryCode,
  CountryDisplay,
} from "@/checkout-storefront/graphql";
import { isEqual, omit, pick, reduce, uniq } from "lodash-es";
import {
  OptionalAddress,
  AddressField,
  AddressFormData,
  ApiAddressField,
} from "../../components/AddressForm/types";

export const getEmptyAddressFormData = (): AddressFormData => ({
  firstName: "",
  lastName: "",
  streetAddress1: "",
  streetAddress2: "",
  companyName: "",
  city: "",
  cityArea: "",
  countryArea: "",
  postalCode: "",
  phone: "",
  countryCode: getParsedLocaleData(getQueryParams().locale).countryCode,
});

export const getEmptyAddress = (): AddressFragment => {
  const getCountryName = createGetCountryNames();

  const { countryCode, ...emptyAddressRest } = getEmptyAddressFormData();

  return {
    ...emptyAddressRest,
    id: "",
    country: {
      code: countryCode,
      country: getCountryName(countryCode),
    },
  };
};

export const getAllAddressFieldKeys = () => Object.keys(getEmptyAddressFormData());

export const getAddressInputData = ({
  countryCode,
  country,
  ...rest
}: Partial<
  AddressFormData & {
    countryCode?: CountryCode;
    country: CountryDisplay;
  }
>): AddressInput => ({
  ...pick(rest, getAllAddressFieldKeys()),
  country: countryCode || (country?.code as CountryCode),
});

export const getAddressInputDataFromAddress = (
  address: OptionalAddress | Partial<AddressFragment>
): AddressInput => {
  if (!address) {
    return {};
  }

  const { country, phone, ...rest } = address;

  return {
    ...pick(rest, getAllAddressFieldKeys()),
    country: country?.code as CountryCode,
    // cause in api phone can be null
    phone: phone || "",
  };
};

export const getAddressFormDataFromAddress = (address: OptionalAddress): AddressFormData => {
  if (!address) {
    return {
      ...getEmptyAddressFormData(),
      countryCode: getParsedLocaleData(getQueryParams().locale).countryCode,
    };
  }

  const { country, ...rest } = address;

  const parsedAddressBase = reduce(
    rest,
    (result, val, key) => ({ ...result, [key]: val || "" }),
    {}
  ) as Omit<AddressFormData, "countryCode">;

  return pick(
    {
      ...parsedAddressBase,
      countryCode: country.code as CountryCode,
    },
    getAllAddressFieldKeys()
  ) as AddressFormData;
};

// checks for address related data and id
export const isMatchingAddress = (
  address?: Partial<AddressFragment> | null,
  addressToMatch?: Partial<AddressFragment> | null
) => {
  const isTheSameAddressById =
    typeof address?.id === "string" &&
    typeof addressToMatch?.id === "string" &&
    address.id === addressToMatch.id;

  if (isTheSameAddressById) {
    return true;
  }

  return isMatchingAddressData(address, addressToMatch);
};

// checks only for address related data
export const isMatchingAddressData = (
  address?: Partial<AddressFragment> | null,
  addressToMatch?: Partial<AddressFragment> | null
) =>
  isEqual(pick(address, getAllAddressFieldKeys()), pick(addressToMatch, getAllAddressFieldKeys()));

export const getByMatchingAddress =
  (addressToMatch: Partial<AddressFragment> | undefined | null) => (address: AddressFragment) =>
    isMatchingAddress(address, addressToMatch);

export const isMatchingAddressFormData = (
  address?: Partial<AddressFormData> | null,
  addressToMatch?: Partial<AddressFormData> | null
) => {
  const propsToOmit = ["id", "autoSave", "__typename"];

  return isEqual(omit(address, propsToOmit), omit(addressToMatch, propsToOmit));
};

export const getAddressValidationRulesVariables = (
  { autoSave }: { autoSave: boolean } = { autoSave: false }
): CheckoutAddressValidationRules =>
  autoSave
    ? {
        checkRequiredFields: false,
      }
    : {};

export const addressFieldsOrder: AddressField[] = [
  "firstName",
  "lastName",
  "companyName",
  "streetAddress1",
  "streetAddress2",
  "city",
  "countryCode",
  "postalCode",
  "cityArea",
  "countryArea",
  "phone",
];

// api doesn't order the fields but we want to
export const getOrderedAddressFields = (addressFields: AddressField[] = []): AddressField[] => {
  const filteredAddressFields = getFilteredAddressFields(addressFields);

  return addressFieldsOrder.filter((orderedAddressField) =>
    filteredAddressFields.includes(orderedAddressField)
  );
};

export const getRequiredAddressFields = (requiredFields: AddressField[] = []): AddressField[] => [
  ...requiredFields,
  "firstName",
  "lastName",
];

// api doesn't approve of "name" so we replace it with "firstName"
// and "lastName"
export const getFilteredAddressFields = (addressFields: ApiAddressField[]): AddressField[] => {
  const filteredAddressFields = addressFields.filter(
    (addressField: ApiAddressField) => addressField !== "name"
  ) as AddressField[];

  return uniq([...filteredAddressFields, "firstName", "lastName", "phone"]);
};
