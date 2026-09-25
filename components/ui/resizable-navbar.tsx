"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  link: string;
}

export const Navbar = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <header
      className={cn(
        "sticky top-4 z-50 flex w-full justify-center px-4",
        className
      )}
    >
      {children}
    </header>
  );
};

export const NavBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "hidden md:flex items-center justify-between gap-6 px-5 py-2.5 rounded-full border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/40",
        className
      )}
    >
      {children}
    </motion.nav>
  );
};

export const NavbarLogo = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <a
      href="#home"
      className={cn("flex items-center gap-2 font-bold tracking-tight text-white", className)}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DCF247] text-black font-extrabold text-xs">
        A
      </div>
      <span className="text-sm font-semibold tracking-wide">ADI</span>
    </a>
  );
};

export const NavItems = ({
  items,
  activeItem,
  onItemClick,
  className,
}: {
  items: NavItem[];
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  className?: string;
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {items.map((item) => {
        const isActive = activeItem === item.name;
        return (
          <a
            key={item.name}
            href={item.link}
            onClick={(e) => {
              if (onItemClick) {
                e.preventDefault();
                onItemClick(item);
              }
            }}
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors",
              isActive
                ? "text-black"
                : "text-slate-300 hover:text-white"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-[#DCF247] shadow-lg shadow-[#DCF247]/30"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-black inline-block" />
              )}
              {item.name}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export const NavbarButton = ({
  children,
  variant = "primary",
  onClick,
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all duration-200",
        variant === "primary"
          ? "bg-[#DCF247] text-black hover:brightness-105 shadow-md shadow-[#DCF247]/20"
          : "border border-white/15 bg-white/5 text-white hover:bg-white/10",
        className
      )}
    >
      {children}
    </button>
  );
};

export const MobileNav = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex md:hidden w-full flex-col", className)}>
      {children}
    </div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 backdrop-blur-xl shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      className="p-1.5 text-white focus:outline-none"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isOpen ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  );
};

export const MobileNavMenu = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-2 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/95 p-6 backdrop-blur-2xl shadow-2xl"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
