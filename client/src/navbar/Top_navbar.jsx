import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Top_navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef(null);

  // cart item count & search bar value
  const { cartCount, setCartCount, searchTerm, setSearchTerm } = useApp();

  // fetch cart count
  useEffect(() => {
    const getCartCount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (response.ok) {
          setCartCount(result.cart.length || 0);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCartCount();
  }, [setCartCount]);

  // close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // Nav Link Styles
  const linkClass = ({ isActive }) =>
    `relative block rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-amber-100 text-slate-900 shadow-md"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {/* Navbar */}
      <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-700 bg-[#1e293b]/95 text-white shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div
            className="flex shrink-0 items-center gap-1 md:gap-2 cursor-pointer"
            onClick={() => {
              navigate("/home");
              setMenuOpen(false);
              setShowUserMenu(false);
            }}
          >
            <span className="text-sm sm:text-3xl md:text-4xl">🛒</span>

            <h1 className="whitespace-nowrap text-sm font-bold tracking-wide text-white sm:text-xl md:text-2xl">
              eCommerce
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className=" min-w-0 flex-1 flex max-w-xl mx-4 lg:mx-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
              className="
                min-w-0
                flex-1
                rounded-l-xl
                border
                border-slate-600
                bg-slate-800/70
                px-4
                py-2.5
                text-white
                placeholder:text-slate-400
                outline-none
                transition-all
                duration-300
                focus:border-amber-400
                focus:ring-2
                focus:ring-amber-400/20
              "
            />

            <button
              type="button"
              aria-label="Search"
              className="
                rounded-r-xl
                bg-amber-400
                px-5
                text-slate-900
                transition-all
                duration-300
                hover:bg-amber-500
                
              "
            >
              🔍
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 lg:flex">
            <NavLink to="/home" end className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/home/cart" className={linkClass}>
              Cart
              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-2
                    -top-2
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-amber-400
                    text-xs
                    font-bold
                    text-slate-900
                    shadow-md
                  "
                >
                  {cartCount}
                </span>
              )}
            </NavLink>

            <NavLink to="/home/orders" className={linkClass}>
              Orders
            </NavLink>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-amber-400
                  bg-amber-400
                  text-lg
                  font-bold
                  text-slate-900
                  shadow-md
                  transition-all
                  duration-300
                  hover:bg-amber-500
                  hover:scale-105
                  cursor-pointer
                "
                aria-label="User menu"
              >
                👤
              </button>

              {showUserMenu && (
                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-56
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-700
                    bg-slate-800
                    shadow-2xl
                  "
                >
                  <div className="border-b border-slate-700 px-4 py-3">
                    <p className="text-sm font-semibold text-white">
                      My Account
                    </p>
                    <p className="text-xs text-slate-400">
                      Manage your profile
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      text-slate-300
                      transition-all
                      duration-200
                      hover:bg-red-500/10
                      hover:text-red-400
                      cursor-pointer
                    "
                  >
                    <span>🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              setShowUserMenu(false);
            }}
            className="flex flex-col gap-1 rounded-md p-2 lg:hidden"
            aria-label="Toggle Menu"
          >
            <span
              className={`h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="flex flex-col gap-3 border-t border-slate-700 bg-[#1e293b] px-4 py-5 lg:hidden">
            {/* Mobile Search Bar */}
            

            <NavLink
              to="/home"
              end
              className={linkClass}
              onClick={() => {
                setMenuOpen(false);
                setShowUserMenu(false);
              }}
            >
              Home
            </NavLink>

            <NavLink
              to="/home/cart"
              className={linkClass}
              onClick={() => {
                setMenuOpen(false);
                setShowUserMenu(false);
              }}
            >
              Cart
              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    h-6
                    w-6
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    bg-amber-400
                    text-xs
                    font-bold
                    text-slate-900
                  "
                >
                  {cartCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/home/orders"
              className={linkClass}
              onClick={() => {
                setMenuOpen(false);
                setShowUserMenu(false);
              }}
            >
              Orders
            </NavLink>

            {/* Mobile Account Box */}
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-900">
                  👤
                </div>

                <div>
                  <p className="font-semibold text-white">My Account</p>
                  <p className="text-xs text-slate-400">Manage your profile</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="
                rounded-xl
                bg-amber-400
                px-5
                py-2.5
                text-sm
                font-semibold
                text-slate-900
                transition-all
                duration-300
                hover:bg-amber-500
              "
            >
              Logout
            </button>
          </nav>
        )}
      </header>

      {/* Page Content */}
      <main className="pt-20">
        <Outlet />
      </main>
    </>
  );
};

export default Top_navbar;