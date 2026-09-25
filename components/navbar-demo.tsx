"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";

export function NavbarDemo() {
  const navItems = [
    {
      name: "FinTech Analytics",
      link: "#fintech",
    },
    {
      name: "B2B Platform",
      link: "#b2b",
    },
    {
      name: "Sasso SaaS",
      link: "#sasso",
    },
    {
      name: "Headless Shop",
      link: "#ecommerce",
    },
    {
      name: "Cases Hub",
      link: "#portfolio",
    },
    {
      name: "Full-Stack Core",
      link: "#fullstack",
    },
    {
      name: "AI Engine",
      link: "#aihub",
    },
  ];

  const [activeItem, setActiveItem] = useState("FinTech Analytics");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full py-8">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={navItems}
            activeItem={activeItem}
            onItemClick={(item) => setActiveItem(item.name)}
          />
          <div className="flex items-center gap-3">
            <NavbarButton variant="secondary">View Demo</NavbarButton>
            <NavbarButton variant="primary">Explore Cases</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsMobileMenuOpen(false);
                }}
                className={`relative py-1 text-sm font-medium ${
                  activeItem === item.name
                    ? "text-[#DCF247] font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-3 pt-2">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full"
              >
                View Demo
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Explore Cases
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

export default NavbarDemo;
