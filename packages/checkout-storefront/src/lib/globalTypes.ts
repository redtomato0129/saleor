import { ReactNode } from "react";
import { TaxedMoney } from "@/checkout-storefront/graphql";

export interface Classes {
  className?: string;
}

export interface Children {
  children: ReactNode | ReactNode[];
}

export type GrossMoney = Pick<TaxedMoney, "gross">;
export type GrossMoneyWithTax = Pick<TaxedMoney, "gross" | "tax">;

export interface AriaLabel {
  ariaLabel: string;
}

export type GenericErrorCode = "invalid" | "required" | "unique";

export type ErrorCode =
  | GenericErrorCode
  | "quantityGreaterThanLimit"
  | "insufficientStock"
  | "invalidCredentials"
  | PasswordErrorCode
  | CheckoutFinalizeErrorCode;

export type PasswordErrorCode =
  | "passwordTooShort"
  | "passwordTooSimilar"
  | "passwordTooCommon"
  | "passwordInvalid";

export type CheckoutFinalizeErrorCode = "missingFields";

export interface ValidationError<TFormData> {
  type: ErrorCode;
  path: keyof TFormData;
  message: string;
}

export type AddressField =
  | "city"
  | "firstName"
  | "lastName"
  | "countryArea"
  | "cityArea"
  | "postalCode"
  | "countryCode"
  | "companyName"
  | "streetAddress1"
  | "streetAddress2"
  | "phone";

export type ApiAddressField = AddressField | "name";

export interface CommonSectionProps {
  collapsed: boolean;
}

export type FormDataBase = Record<string, any>;
