import React, { useEffect, useState } from 'react'
import {
  slugify,
  productdetails,
} from "./utilities/go_to_productD";



function Orders() {
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
const [orders, setOrders] = useState([]);
const [error, setError] = useState("");

    useEffect(() => {
      const getOrder = async () => {
        try {
          const response = await fetch("http://localhost:3000/order", {
            method: "GET",
            credentials: "include",
          });
    
          const result = await response.json();

          console.log(result);
    
          if (!response.ok) {
            setError(result.message);
            return;
          }
    console.log(result.orders)
          setOrders(result.orders);

        } catch (error) {
          console.log(error);
        }
      };
    


      getOrder();
    }, []);



 return (
  <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-stone-100 via-[#f8f6f2] to-slate-100 p-4 sm:p-6">

    {/* Heading */}
    <div className="mx-auto mb-10 max-w-6xl">
      <h1 className="text-3xl font-bold tracking-wide text-slate-800 sm:text-4xl">
        My Orders
      </h1>

      <p className="mt-2 text-sm text-slate-500 sm:text-base">
        Track all your purchased products here.
      </p>
    </div>

    {/* Empty Orders */}
    {orders.length === 0 ? (
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-[32px] border border-stone-200 bg-white/80 p-10 text-center shadow-xl backdrop-blur-sm">

        <div className="text-6xl">📦</div>

        <h2 className="mt-5 text-2xl font-bold text-slate-800">
          No Orders Yet
        </h2>

        <p className="mt-3 text-slate-500">
          Looks like you haven’t purchased anything yet.
        </p>

      </div>
    ) : (

      /* Orders List */
      <div className="mx-auto flex max-w-6xl flex-col gap-8">

        {orders.map((item) => (

          <div
            key={item._id}
            onClick={() =>
              productdetails(
                navigate,
                item.title,
                item._id
              )
            }
            className="group cursor-pointer overflow-hidden rounded-[32px] border border-stone-200 bg-white/90 shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >

            <div className="flex flex-col sm:flex-row">

              {/* Product Image */}
              <div className="overflow-hidden bg-stone-100 sm:w-[320px]">

                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-[250px] w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-full"
                />

              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">

                {/* Title */}
                <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  {item.title}
                </h2>

                {/* Price */}
                <p className="mt-4 text-3xl font-extrabold text-amber-700">
                  ${item.price}
                </p>

                {/* Status */}
                <div className="mt-5 flex flex-wrap gap-3">

                  <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                    Ordered Successfully
                  </span>

                  {item.rating && (
                    <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                      ⭐ {item.rating}
                    </span>
                  )}

                </div>

                {/* Small Info */}
                <p className="mt-6 text-sm leading-relaxed text-slate-500">
                  Thank you for shopping with us. Your order has been placed successfully.
                </p>

              </div>
            </div>
          </div>

        ))}

      </div>
    )}
  </div>
);
}

export default Orders