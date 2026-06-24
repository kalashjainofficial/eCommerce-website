import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
// for image zoom
import { InnerImageZoom } from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// total cart value
import { useApp } from "../context/AppContext";

function Product_Details() {
  const { productid } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");

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
    const getProduct = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/product/${productid}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to load product");
          return;
        }

        setProduct(result.product);
        setActiveImage(result.product?.images[0] || "");
      } catch (err) {
        console.log(err);
        setError("Server error");
      }
    };

    getProduct();
  }, [productid]);

  const oldPrice = useMemo(() => {
    if (!product) return 0;

    const discount = Number(product.discountPercentage || 0);
    const price = Number(product.price || 0);

    if (!discount) return price;

    return price / (1 - discount / 100);
  }, [product]);

  const savedAmount = useMemo(() => {
    if (!product) return 0;

    return oldPrice - Number(product.price || 0);
  }, [product, oldPrice]);


  // total number of cart 
  const { setCartCount } = useApp();

  const addToCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productid: product._id || product.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        popup(result.message || "Could not add to cart");
        return;
      }
      setCartCount(prev => prev + 1);
      popup("Added to cart");
    } catch (err) {
      console.log(err);
      popup("Server error");
    }
  };

  const buyNow = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productid: product._id || product.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        popup(result.message || "Could not place order");
        return;
      }

      popup("Order placed successfully");
    } catch (err) {
      console.log(err);
      popup("Server error");
    }
  };

  if (error) {
    return (
      <>
        <Toaster position="bottom-right" />

        <div className="min-h-screen bg-gradient-to-br from-stone-100 via-[#f8f6f2] to-slate-100 px-4 py-10 text-slate-800">
          <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-red-600">{error}</h1>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Toaster position="bottom-right" />

        <div className="min-h-screen bg-gradient-to-br from-stone-100 via-[#f8f6f2] to-slate-100 px-4 py-10 text-slate-800">
          <div className="mx-auto flex max-w-3xl items-center justify-center rounded-3xl border border-stone-200 bg-white p-10 shadow-xl">
            <h1 className="text-2xl font-bold text-slate-700">
              Loading...
            </h1>
          </div>
        </div>
      </>
    );
  }

  const images = [
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean);

  const tags = Array.isArray(product.tags) ? product.tags : [];
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const dimensions = product.dimensions || {};

  return (
    <>
      <Toaster position="bottom-right" />

      <div className=" bg-gradient-to-br from-stone-100 via-[#f8f6f2] to-slate-100 text-slate-800">

        <div className="pt-[8px]">

          <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-2">

            {/* LEFT IMAGE SECTION */}
            <div className="border-b border-stone-200 bg-gradient-to-br from-stone-100 via-[#f8f6f2] to-stone-50 p-4 sm:p-6 lg:border-b-0 lg:border-r lg:border-stone-200 lg:p-8">

              {/* TOP BADGES */}
              <div className="mb-4 flex flex-wrap gap-2">

                <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-800 break-words">
                  {product.availabilityStatus}
                </span>

                <span className="rounded-full bg-slate-200 px-4 py-1 text-sm font-semibold capitalize text-slate-700 break-words">
                  {product.category}
                </span>

                <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700 break-words">
                  Stock: {product.stock}
                </span>

              </div>

              {/* IMAGE + THUMBNAILS */}
              <div className="flex flex-col gap-4 lg:flex-row">

                {/* THUMBNAILS */}
                {images.length > 1 && (
                  <div
                    className="
                      mt-2
                      flex
                      flex-row
                      gap-3
                      overflow-x-auto
                      pb-2

                      lg:mt-5
                      lg:flex-col
                    "
                  >
                    {images.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveImage(img)}
                        className={`shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${activeImage === img
                          ? "border-amber-400 shadow-lg"
                          : "border-transparent opacity-80 hover:opacity-100"
                          }`}
                      >
                        <img
                          src={img}
                          alt={`${product.title}-${index}`}
                          className="h-20 w-20 object-cover sm:h-24 sm:w-24"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* MAIN IMAGE */}
                <div className="w-full overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-xl">

                  <InnerImageZoom
                    src={activeImage || product.thumbnail}
                    zoomSrc={activeImage || product.thumbnail}
                    zoomType="hover"
                    zoomScale={1.8}
                    alt={product.title}
                    className="
    h-full
    w-full
    object-contain

    sm:h-full
    lg:h-full
  "
                  />

                </div>

              </div>

              {/* INFO CARDS */}
              <div className="mt-6 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-stone-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">Brand</p>

                  <p className="mt-1 font-bold text-slate-800">
                    {product.brand}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">SKU</p>

                  <p className="mt-1 font-bold text-slate-800">
                    {product.sku}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">
                    Minimum Order
                  </p>

                  <p className="mt-1 font-bold text-slate-800">
                    {product.minimumOrderQuantity}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">Weight</p>

                  <p className="mt-1 font-bold text-slate-800">
                    {product.weight}
                  </p>
                </div>

              </div>

            </div>

            {/* RIGHT CONTENT SECTION */}
            <div className="flex flex-col p-4 sm:p-6 lg:border-l lg:border-stone-200 lg:p-10">

              {/* TAGS */}
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* TITLE */}
              <h1 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {product.title}
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {product.description}
              </p>

              {/* PRICE CARD */}
              <div className="mt-8 rounded-[28px] border border-stone-200 bg-white/70 p-5 shadow-lg backdrop-blur-sm sm:p-6">

                <div className="flex flex-wrap items-end gap-4">

                  <p className="text-4xl font-extrabold text-emerald-600">
                    ${Number(product.price).toFixed(2)}
                  </p>

                  <del className="text-xl font-medium text-slate-400">
                    ${oldPrice.toFixed(2)}
                  </del>

                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-600">
                    {product.discountPercentage}% OFF
                  </span>

                </div>

                <p className="mt-3 text-lg font-semibold text-emerald-700">
                  You save ${savedAmount.toFixed(2)}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">

                  <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
                    ⭐ {product.rating} Rating
                  </span>

                  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                    {product.shippingInformation}
                  </span>

                  <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                    {product.warrantyInformation}
                  </span>

                </div>

              </div>

              {/* BUTTONS */}
              <div className="mt-8 flex flex-col gap-4 md:flex-row">

                <button
                  onClick={addToCart}
                  className="w-full rounded-2xl bg-slate-900 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-slate-700 md:w-fit"
                >
                  Add To Cart
                </button>

                <button
                  onClick={buyNow}
                  className="w-full rounded-2xl bg-amber-300 px-8 py-4 text-lg font-bold text-slate-900 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400 md:w-fit"
                >
                  Buy Now
                </button>

              </div>

              {/* EXTRA INFO */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-[24px] border border-stone-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm">

                  <h2 className="text-lg font-bold text-slate-900">
                    Dimensions
                  </h2>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>Width: {dimensions.width ?? "N/A"}</p>
                    <p>Height: {dimensions.height ?? "N/A"}</p>
                    <p>Depth: {dimensions.depth ?? "N/A"}</p>
                  </div>

                </div>

                <div className="rounded-[24px] border border-stone-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm">

                  <h2 className="text-lg font-bold text-slate-900">
                    Policies
                  </h2>

                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>Return: {product.returnPolicy}</p>
                    <p>
                      Availability: {product.availabilityStatus}
                    </p>
                    <p>Stock: {product.stock}</p>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* REVIEWS SECTION */}
          <div className="border-t border-stone-200 bg-stone-50 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">

            <div className="mb-6 flex items-center justify-between gap-4">

              <h2 className="text-2xl font-bold text-slate-900">
                Customer Reviews
              </h2>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </span>

            </div>

            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm"
                  >

                    <div className="flex items-center justify-between gap-3">

                      <p className="font-bold text-slate-900">
                        {review.reviewerName || "Anonymous"}
                      </p>

                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                        ⭐ {review.rating}
                      </span>

                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {review.comment || "No comment"}
                    </p>

                    <p className="mt-4 text-xs text-slate-400">
                      {review.date || ""}
                    </p>

                  </div>
                ))}

              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-stone-300 bg-white p-8 text-center text-slate-500">
                No reviews available for this product.
              </div>
            )}

          </div>

        </div>

      </div>
    </>
  );
}

export default Product_Details;