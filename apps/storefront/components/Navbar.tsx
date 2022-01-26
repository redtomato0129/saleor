import { useApolloClient } from "@apollo/client";
import {
  SearchIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import { useAuth, useAuthState } from "@saleor/sdk";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useLocalStorage } from "react-use";

import { MainMenu } from "@/components/MainMenu";
import { CHECKOUT_TOKEN } from "@/lib/const";
import { usePaths } from "@/lib/paths";
import { useCheckoutByTokenQuery } from "@/saleor/api";

import { RegionDialog } from "./RegionDialog";
import { useRegions } from "./RegionsProvider";
import { messages } from "./translations";

export const Navbar = () => {
  const paths = usePaths();
  const [isRegionDialogOpen, setRegionDialogOpen] = useState(false);
  const { currentChannel } = useRegions();
  const t = useIntl();

  const [checkoutToken, setCheckoutToken] = useLocalStorage(CHECKOUT_TOKEN);
  const { logout } = useAuth();
  const router = useRouter();
  const client = useApolloClient();
  const { authenticated, user } = useAuthState();
  const { query } = useRegions();

  const { data } = useCheckoutByTokenQuery({
    variables: { checkoutToken, locale: query.locale },
    skip: !checkoutToken || !process.browser,
  });

  const onLogout = async () => {
    // clear all the user data on logout
    await logout();
    await setCheckoutToken("");
    await client.resetStore();
    router.push(paths.$url());
  };
  const counter = data?.checkout?.lines?.length || 0;

  return (
    <>
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex justify-between items-center">
              <MainMenu />
              <Link href={paths.$url()}>
                <a>
                  <div className="mt-px group block h-16 w-28 relative">
                    <Image src="/saleor.svg" alt="Saleor logo" layout="fill" />
                  </div>
                </a>
              </Link>
            </div>
            <div className="flex space-x-px md:space-x-8 items-center">
              <Link href={paths.search.$url()}>
                <a className="-m-2 p-2 flex items-center" aria-label="Search">
                  <SearchIcon
                    className={
                      "flex-shrink-0 h-6 w-6 text-gray-400 hover:text-gray-500"
                    }
                  />
                </a>
              </Link>
              <div className="flex space-x-8">
                <a
                  href='#'
                  className="group -m-2 p-2 flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-800"
                  onClick={() => setRegionDialogOpen(true)}
                >
                  {currentChannel.currencyCode}
                </a>
              </div>
              <Link href={paths.cart.$url()}>
                <a className="group -m-2 p-2 flex items-center">
                  <ShoppingBagIcon
                    className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    {counter}
                  </span>
                </a>
              </Link>
              {!authenticated && (
                <Link href={paths.account.login.$url()}>
                  <a className="group -m-2 p-2 flex items-center">
                    <UserCircleIcon
                      className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {t.formatMessage(messages.logIn)}
                    </span>
                  </a>
                </Link>
              )}

              {authenticated && (
                <div className="group -m-2 p-2  text-left dropdown flex items-center z-40">
                  <span className="rounded-md shadow-sm">
                    <button
                      className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                      type="button"
                      aria-haspopup="true"
                      aria-expanded="true"
                      aria-controls="headlessui-menu-items-117"
                    >
                      <a className="group -m-2 p-2 flex items-center">
                        <UserCircleIcon
                          className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                          {user?.firstName}
                        </span>
                      </a>
                      <svg
                        className="w-5 h-5 ml-2 -mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </span>
                  <div className="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
                    <div
                      className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none z-40"
                      aria-labelledby="headlessui-menu-button-1"
                      id="headlessui-menu-items-117"
                      role="menu"
                    >
                      <div className="py-1">
                        <Link href={paths.account.preferences.$url()}>
                          <a
                            tabIndex={0}
                            className="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                            role="menuitem"
                          >
                            {t.formatMessage(messages.menuAccountPreferences)}
                          </a>
                        </Link>
                      </div>
                      <div className="py-1">
                        <a
                          onClick={onLogout}
                          tabIndex={3}
                          className="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                          role="menuitem"
                        >
                          {t.formatMessage(messages.logOut)}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <RegionDialog
        isOpen={isRegionDialogOpen}
        onClose={() => setRegionDialogOpen(false)}
      />
    </>
  );
};
