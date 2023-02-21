import React, { FC, useCallback, useEffect } from "react";
import { useState } from "react";
import { SignedInUser } from "../SignedInUser/SignedInUser";
import { ResetPassword } from "../ResetPassword/ResetPassword";
import { useCustomerAttach } from "@/checkout-storefront/hooks/useCustomerAttach";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";
import { SignIn } from "@/checkout-storefront/sections/SignIn/SignIn";
import { GuestUser } from "@/checkout-storefront/sections/GuestUser/GuestUser";
import { useUser } from "@/checkout-storefront/hooks/useUser";

type Section = "signedInUser" | "guestUser" | "signIn" | "resetPassword";

const onlyContactShownSections: Section[] = ["signIn", "resetPassword"];

interface ContactProps {
  setShowOnlyContact: (value: boolean) => void;
}

export const Contact: FC<ContactProps> = ({ setShowOnlyContact }) => {
  useCustomerAttach();
  const { user, authenticated } = useUser();
  const [email, setEmail] = useState(user?.email || "");

  const [passwordResetShown, setPasswordResetShown] = useState(false);

  const selectInitialSection = (): Section => {
    const shouldShowPasswordReset = passwordResetToken && !passwordResetShown;

    if (shouldShowPasswordReset) {
      return "resetPassword";
    }

    return user ? "signedInUser" : "guestUser";
  };

  const passwordResetToken = getQueryParams().passwordResetToken;
  const [currentSection, setCurrentSection] = useState<Section>(selectInitialSection());

  const handleChangeSection = (section: Section) => () => {
    if (onlyContactShownSections.includes(section)) {
      setShowOnlyContact(true);
    }
    setCurrentSection(section);
  };

  const isCurrentSection = useCallback(
    (section: Section) => currentSection === section,
    [currentSection]
  );

  const shouldShowOnlyContact = onlyContactShownSections.includes(currentSection);

  useEffect(() => {
    if (isCurrentSection("resetPassword")) {
      setPasswordResetShown(true);
    }
  }, [isCurrentSection]);

  useEffect(() => {
    setShowOnlyContact(shouldShowOnlyContact);
  }, [currentSection, setShowOnlyContact, shouldShowOnlyContact]);

  useEffect(() => {
    if (authenticated && currentSection !== "signedInUser") {
      setCurrentSection("signedInUser");
    } else if (!authenticated && currentSection === "signedInUser") {
      setCurrentSection("guestUser");
    }
  }, [authenticated, currentSection]);

  return (
    <div>
      {isCurrentSection("guestUser") && (
        <GuestUser
          onSectionChange={handleChangeSection("signIn")}
          onEmailChange={setEmail}
          email={email}
        />
      )}

      {isCurrentSection("signIn") && (
        <SignIn
          onSectionChange={handleChangeSection("guestUser")}
          onSignInSuccess={handleChangeSection("signedInUser")}
          onEmailChange={setEmail}
          email={email}
        />
      )}

      {isCurrentSection("signedInUser") && (
        <SignedInUser
          onSectionChange={handleChangeSection("guestUser")}
          onSignOutSuccess={handleChangeSection("guestUser")}
        />
      )}

      {isCurrentSection("resetPassword") && (
        <ResetPassword
          onSectionChange={handleChangeSection("signIn")}
          onResetPasswordSuccess={handleChangeSection("signedInUser")}
        />
      )}
    </div>
  );
};
