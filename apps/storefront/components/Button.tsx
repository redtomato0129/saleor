import clsx from "clsx";
import React from "react";

const styles = `bg-blue-100 border border-blue-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium hover:bg-blue-200`;

interface Props {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const Button = ({ onClick, className, children }: Props) => {
  return (
    <button className={clsx(styles, className)} onClick={onClick}>
      {children}
    </button>
  );
};
