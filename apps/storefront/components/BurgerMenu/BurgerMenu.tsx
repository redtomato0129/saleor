import { useAuthState } from "@saleor/sdk";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

import { useLogout } from "@/lib/auth";
import { usePaths } from "@/lib/paths";
import { useMainMenuQuery } from "@/saleor/api";

import NavIconButton from "../Navbar/NavIconButton";
import { ChannelDropdown } from "../regionDropdowns/ChannelDropdown";
import { LocaleDropdown } from "../regionDropdowns/LocaleDropdown";
import { useRegions } from "../RegionsProvider";
import { messages } from "../translations";
import styles from "./BurgerMenu.module.css";
import { CollapseMenu } from "./CollapseMenu";

export interface BurgerMenuProps {
  open?: boolean;
  onCloseClick?: () => void;
}

export function BurgerMenu({ open, onCloseClick }: BurgerMenuProps) {
  const paths = usePaths();
  const { query } = useRegions();
  const t = useIntl();

  const { authenticated } = useAuthState();
  const router = useRouter();

  const { error, data } = useMainMenuQuery({
    variables: { ...query },
  });

  if (error) {
    console.error("BurgerMenu component error", error.message);
  }

  const onLogout = useLogout();

  const menu = data?.menu?.items || [];

  return (
    <div
      className={clsx(styles.container, {
        [styles["container--open"]]: open,
      })}
    >
      <div className={styles.backdrop} aria-hidden="true" onClick={onCloseClick} />
      <div className={styles.body}>
        <div className="flex justify-end w-full mb-5">
          <NavIconButton icon="close" onClick={onCloseClick} />
        </div>
        {menu.map((item) => (
          <CollapseMenu menuItem={item} key={item.id} />
        ))}
        <div className="mt-auto pt-4">
          <div className="flex flex-col">
            {authenticated ? (
              <>
                <Link href={paths.account.preferences.$url()} passHref>
                  <a tabIndex={0} className={styles["burger-link"]} href="pass">
                    {t.formatMessage(messages.menuAccountPreferences)}
                  </a>
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  tabIndex={-1}
                  className={styles["burger-link"]}
                >
                  {t.formatMessage(messages.logOut)}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => router.push(paths.account.login.$url())}
                tabIndex={-1}
                className={styles["burger-link"]}
              >
                {t.formatMessage(messages.logIn)}
              </button>
            )}
          </div>
        </div>
        <div className="flex mt-4 gap-4">
          <ChannelDropdown />
          <LocaleDropdown />
        </div>
      </div>
    </div>
  );
}

export default BurgerMenu;
