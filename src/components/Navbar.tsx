"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { AnimatedLogo } from "./AnimatedLogo";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  return (
    <header className="relative z-50 w-full select-none">
      {/* Container across full width - perfectly centered horizontal axis */}
      <div className="w-full flex items-center justify-between h-14 sm:h-16 lg:h-[58px]">
        {/* Brand Logo - commanding presence, luxury proportions, animated on fresh */}
        <div className="h-full flex items-center pl-6 sm:pl-10 lg:pl-14 shrink-0 z-20">
          <Link
            href="/"
            className="group flex items-center focus:outline-none"
            aria-label="Fittee Home"
          >
            <AnimatedLogo className="h-11 sm:h-12 lg:h-[48px] xl:h-[52px] w-auto" />
          </Link>
        </div>

        {/* Desktop Asymmetric Scooped Ivory Header Bar */}
        <div className="hidden lg:block relative flex-1 max-w-[82%] xl:max-w-[78%] 2xl:max-w-[75%] h-full">
          {/* SVG Background with organic curved scoop on left */}
          <svg
            className="absolute inset-0 w-full h-full drop-shadow-[0_4px_24px_rgba(0,0,0,0.18)] pointer-events-none"
            viewBox="0 0 1000 58"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M 0,0 C 28,0 38,58 66,58 L 984,58 C 994,58 1000,46 1000,26 L 1000,0 Z"
              fill="#EDE6DE"
            />
          </svg>

          {/* Navigation Content inside the ivory container */}
          <div className="relative z-10 w-full h-full pl-16 xl:pl-20 pr-6 xl:pr-8 flex items-center justify-between text-[#1E1C1A]">
            {/* Primary Nav Links */}
            <nav className="flex items-center gap-5 xl:gap-7 text-[13px] xl:text-[13.5px] font-medium tracking-normal">
              {/* Shop with dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-[#9B6A1A] transition-colors py-1 cursor-pointer focus:outline-none"
                >
                  <span>Shop</span>
                  <ChevronDown className="w-3 h-3 text-[#1E1C1A]/80 transition-transform duration-200" />
                </button>

                {shopOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-[#FAF7F2] rounded-xl shadow-xl border border-[#DFD7CA] p-3 text-[#1E1B17] z-50">
                    <Link
                      href="#oversized"
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#EAE3D6] transition-colors"
                    >
                      Oversized Graphic Tees
                    </Link>
                    <Link
                      href="#regular"
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#EAE3D6] transition-colors"
                    >
                      Classic Cotton Fits
                    </Link>
                    <Link
                      href="#sohrai"
                      className="block px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#EAE3D6] transition-colors"
                    >
                      Sohrai Art Collection
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="#collections"
                className="hover:text-[#9B6A1A] transition-colors py-1"
              >
                Collections
              </Link>
              <Link
                href="#customization"
                className="hover:text-[#9B6A1A] transition-colors py-1"
              >
                Customization
              </Link>
              <Link
                href="#our-story"
                className="hover:text-[#9B6A1A] transition-colors py-1"
              >
                Our Story
              </Link>
              <Link
                href="#journal"
                className="hover:text-[#9B6A1A] transition-colors py-1"
              >
                Journal
              </Link>
            </nav>

            {/* Right cluster: Search input + Actions */}
            <div className="flex items-center gap-4 xl:gap-5">
              {/* Search Pill Input */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search for designs, collections..."
                  className="w-44 xl:w-56 pl-3.5 pr-8 py-1.5 text-[11.5px] rounded-full bg-[#E0D9CF]/75 placeholder:text-[#827A6E] text-[#1E1C1A] border-none focus:outline-none focus:ring-1 focus:ring-[#9B6A1A]"
                />
                <Search className="w-3.5 h-3.5 text-[#5C5348] absolute right-2.5 pointer-events-none" />
              </div>

              {/* Utility Icons */}
              <div className="flex items-center gap-3 xl:gap-3.5 text-[#1E1C1A]">
                {/* User Account */}
                <button
                  type="button"
                  className="hover:text-[#9B6A1A] transition-colors focus:outline-none cursor-pointer p-0.5"
                  aria-label="Account"
                >
                  <User className="w-[17px] h-[17px] stroke-[1.6]" />
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  className="hover:text-[#9B6A1A] transition-colors focus:outline-none cursor-pointer p-0.5"
                  aria-label="Wishlist"
                >
                  <Heart className="w-[17px] h-[17px] stroke-[1.6]" />
                </button>

                {/* Cart with Orange Badge */}
                <button
                  type="button"
                  className="relative hover:text-[#9B6A1A] transition-colors focus:outline-none cursor-pointer p-0.5"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-[18px] h-[18px] stroke-[1.6]" />
                  <span className="absolute -top-1.5 -right-2 bg-[#E5A93C] text-[#1A1612] text-[9.5px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm">
                    0
                  </span>
                </button>

                {/* Hamburger Menu (3 horizontal lines) */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="hover:text-[#9B6A1A] transition-colors focus:outline-none cursor-pointer p-0.5 ml-0.5"
                  aria-label="Menu"
                >
                  <Menu className="w-[19px] h-[19px] stroke-[1.8]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Header Bar */}
        <div className="lg:hidden flex items-center gap-3 pr-4 sm:pr-6 h-full">
          <button
            type="button"
            className="relative p-2 bg-[#EDE6DE] text-[#1E1C1A] rounded-full shadow-md"
            aria-label="Cart"
          >
            <ShoppingCart className="w-4 h-4 stroke-[1.8]" />
            <span className="absolute -top-1 -right-1 bg-[#E5A93C] text-[#1A1612] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              0
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-[#EDE6DE] text-[#1E1C1A] rounded-full shadow-md"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 stroke-[2]" />
            ) : (
              <Menu className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/85 backdrop-blur-md flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <AnimatedLogo className="h-9 w-auto" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-white/80 hover:text-white rounded-full bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-6 space-y-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for designs, collections..."
                className="w-full px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 text-sm focus:outline-none focus:border-[#E5A93C]"
              />
              <Search className="w-4 h-4 text-white/60 absolute right-4 top-3" />
            </div>

            <ul className="space-y-4 text-lg font-medium text-white/90">
              <li>
                <Link
                  href="#shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-[#E5A93C]"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="#collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-[#E5A93C]"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="#customization"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-[#E5A93C]"
                >
                  Customization
                </Link>
              </li>
              <li>
                <Link
                  href="#our-story"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-[#E5A93C]"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="#journal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-[#E5A93C]"
                >
                  Journal
                </Link>
              </li>
            </ul>
          </div>

          <div className="border-t border-white/15 pt-4 flex items-center justify-around text-white/80">
            <div className="flex flex-col items-center text-xs gap-1">
              <User className="w-5 h-5" />
              <span>Account</span>
            </div>
            <div className="flex flex-col items-center text-xs gap-1">
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
            </div>
            <div className="flex flex-col items-center text-xs gap-1">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart (0)</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
