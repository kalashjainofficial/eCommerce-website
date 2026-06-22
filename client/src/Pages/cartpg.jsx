import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productdetails } from "./utilities/go_to_productD";
import toast, { Toaster } from "react-hot-toast";
import { useApp } from "../context/AppContext";

const Cart = () => {
  const navigate = useNavigate();
  const { setCartCount } = useApp();

  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  const popup = (message) => {
    toast.success(message, {
      duration: 1800,
      style: {
        borderRadius: "16px",
        background: "rgba(17, 24, 39, 0.95)",
        color: "#fff",
        padding: "14px 16px",
        fontSize: "14px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.08)",
      },
      iconTheme: {
        primary: "#f59e0b",
        secondary: "#111827",
      },
    });
  };

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await fetch("http://localhost:3000/cart", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to load cart");
          return;
        }

        const groupedCart = [];

        (result.cart || []).forEach((product) => {
          const existing = groupedCart.find(
            (item) => item._id === product._id
          );

          if (existing) {
            existing.quantity += 1;
            existing.totalValue = existing.quantity * existing.price;
          } else {
            groupedCart.push({
              ...product,
              quantity: 1,
              totalValue: product.price,
            });
          }
        });

        setCart(groupedCart);

        const totalItems = groupedCart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartCount(totalItems);
      } catch (error) {
        console.log(error);
        setError("Could not load cart");
      }
    };

    getCart();
  }, [setCartCount]);

  const place_order = async (product) => {
    try {
      const response = await fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productid: product._id,
          quantity: product.quantity,
        }),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        popup("Order placed successfully");
      } else {
        popup(result.message || "Order failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const add_one_item = async (product) => {
    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productid: product._id,
        }),
      });

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        popup(result.message || "Could not add item");
        return;
      }

      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem._id === product._id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
                totalValue: (cartItem.quantity + 1) * cartItem.price,
              }
            : cartItem
        )
      );

      setCartCount((prev) => prev + 1);
      popup("Added one item");
    } catch (error) {
      console.log(error);
    }
  };

  const remove_one_item = async (product) => {
    try {
      const response = await fetch("http://localhost:3000/cart/removeone", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productid: product._id,
        }),
      });

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        // popup(result.message || "Could not remove one item");
        return;
      }

      setCart((prev) =>
        prev
          .map((cartItem) =>
            cartItem._id === product._id
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity - 1,
                  totalValue: (cartItem.quantity - 1) * cartItem.price,
                }
              : cartItem
          )
          .filter((cartItem) => cartItem.quantity > 0)
      );

      setCartCount((prev) => Math.max(prev - 1, 0));
      // popup("One item removed");
    } catch (error) {
      console.log(error);
    }
  };

  const remove_from_cart = async (product) => {
    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productid: product._id,
        }),
      });

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        popup(result.message || "Could not remove item");
        return;
      }

      setCart((prev) =>
        prev.filter((cartItem) => cartItem._id !== product._id)
      );

      setCartCount((prev) => Math.max(prev - product.quantity, 0));
      popup("Removed successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const totalAmount = cart.reduce((total, item) => {
    return total + item.totalValue;
  }, 0);

  return (
    <>
      <Toaster position="bottom-right" />

      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-stone-100 via-[#f8f6f2] to-slate-100 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-14 flex items-center justify-center">
          <div className="h-[1px] w-20 bg-stone-300" />
          <h1 className="mx-6 text-center text-4xl font-bold tracking-wide text-slate-800 sm:text-5xl">
            My Cart
          </h1>
          <div className="h-[1px] w-20 bg-stone-300" />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-auto mb-8 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 shadow-md">
            {error}
          </div>
        )}

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="mx-auto mt-24 max-w-xl rounded-[32px] border border-stone-200 bg-white/80 p-10 text-center shadow-xl backdrop-blur-sm">
            <div className="mb-5 text-6xl">🛒</div>

            <h3 className="text-3xl font-bold text-slate-800">
              Your cart is empty
            </h3>

            <p className="mt-3 text-slate-500">
              Looks like you haven’t added anything yet.
            </p>

            <a
              href="/home"
              className="mt-8 inline-block rounded-2xl bg-slate-800 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-slate-700"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ul className="space-y-6">
              {cart.map((item) => (
                <li key={item._id}>
                  <div
                    onClick={() => productdetails(navigate, item.title, item._id)}
                    className="relative mx-auto flex w-full max-w-5xl flex-row gap-3 rounded-[24px] border border-stone-200 bg-white/90 p-3 shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:gap-6 sm:rounded-[32px] sm:p-6"
                  >
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove_from_cart(item);
                      }}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white transition-all duration-300 hover:scale-110 hover:bg-slate-700 sm:right-5 sm:top-5 sm:h-10 sm:w-10 sm:text-lg"
                    >
                      ✕
                    </button>

                    {/* Product Image */}
                    <div className="overflow-hidden rounded-[18px] bg-stone-100 sm:rounded-[28px]">
                      <img
                        src={item.thumbnail}
                        alt="product"
                        className="h-[110px] w-[110px] object-cover transition-transform duration-700 hover:scale-110 sm:h-[240px] sm:w-[240px]"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col justify-center overflow-hidden">
                      <h2 className="line-clamp-2 text-sm font-bold text-slate-800 sm:text-3xl">
                        {item.title}
                      </h2>

                      <p className="mt-1 text-lg font-extrabold text-amber-700 sm:mt-4 sm:text-3xl">
                        ${item.price}
                      </p>

                      <p className="text-sm font-bold text-emerald-600 sm:text-lg">
                        Total: ${item.totalValue.toFixed(2)}
                      </p>

                      {/* Tags */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700 sm:px-4 sm:text-sm">
                          {item.availabilityStatus}
                        </span>

                        <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700 sm:px-4 sm:text-sm">
                          ⭐ {item.rating}
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="mt-3 flex flex-row items-center justify-between gap-3 sm:mt-8 sm:gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            place_order(item);
                          }}
                          className="rounded-xl bg-amber-300 px-3 py-2 text-xs font-bold text-slate-800 transition-all duration-300 hover:scale-105 hover:bg-amber-400 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
                        >
                          Place Order
                        </button>

                        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 shadow-sm">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              await remove_one_item(item);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 font-bold text-white transition-all duration-200 hover:scale-110 hover:bg-slate-700 active:scale-95"
                          >
                            −
                          </button>

                          <span className="min-w-[40px] text-center text-lg font-bold text-slate-700">
                            {item.quantity}
                          </span>

                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              await add_one_item(item);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-800 transition-all duration-200 hover:scale-110 hover:bg-amber-500 active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Total Amount */}
            <div className="mx-auto mt-14 flex max-w-5xl flex-col items-center justify-between gap-4 rounded-[32px] border border-slate-700 bg-[#1e293b] px-8 py-7 text-white shadow-2xl sm:flex-row">
              <h2 className="text-2xl font-bold tracking-wide sm:text-3xl">
                Total Amount
              </h2>

              <p className="text-4xl font-extrabold text-amber-300">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;