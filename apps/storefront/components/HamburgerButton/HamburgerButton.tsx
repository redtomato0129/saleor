import clsx from "clsx";
import React from "react";

export interface HamburgerButtonProps {
  onClick: (ev: React.FormEvent) => void;
  active?: boolean;
}
export function HamburgerButton({ active, onClick }: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={(ev) => onClick(ev)}
      aria-label="Open main menu"
      className={clsx(
        "flex-shrink-0 h-6 w-6 cursor-pointer",
        active && "bg-gray-100 rounded-md border-1 shadow-inner"
      )}
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}
