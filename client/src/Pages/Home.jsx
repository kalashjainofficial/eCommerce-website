import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Banner images used in the home page carousel
import eCommerce_beaty_banner from "../images/banner_images/beauty1.png";
import eCommerce_fragrance_banner from "../images/banner_images/fragrance.png";
import eCommerce_furniture_banner from "../images/banner_images/furniture.png";
import eCommerce_grocery_banner from "../images/banner_images/grocery.png";

// Utility functions for product navigation/details
import {
  slugify,
  productdetails,
} from ".//utilities/go_to_productD";
import { goToCategory } from "./utilities/go_to_catagory";

// Carousel library
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// Toast notifications
import toast, { Toaster } from "react-hot-toast";


// total cart value
import { useApp } from "../context/AppContext";

// 
// main function ==========================================================
// 
const Home = () => {
  // Stores all products fetched from the backend
  const [data, setData] = useState([]);

  // Stores any error message from the fetch request
  const [error, setError] = useState("");

  // stores the selected filter of fiter data
  const [filter, setFilter] = useState("apply filter");


  // stotes the status of catagory bar for phone
  const [smCatagory, setsmCatagory] = useState(false)

  // stores the status of filter 
  const [filteron, setfilteron] = useState(false)

  // stores the value of filter 0-> no filter
  // 1-> price l to h 2-> price h to l
  // 3-> rating h to l
  const [filtervalue, setfiltervalue] = useState(0);


  // css for filter button to glow 
  const active_filter_button = `
  bg-gradient-to-r
  from-amber-300
  to-amber-400

  text-slate-800



  shadow-lg
  shadow-amber-200/60

  

  

  font-semibold
`;


  // css catagory navbar button color
  const catagory_button_color = `
      mr-3
      rounded-full
bg-gradient-to-r from-amber-100 to-amber-200
text-amber-900
shadow-sm
hover:from-amber-200 hover:to-amber-300
hover:shadow-md-50 px-5 py-2 text-sm font-medium text-amber-900 ring-1 ring-amber-200 transition-all duration-300 hover:scale-105 hover:bg-amber-100 cursor-pointer`;


  // Function to show a success toast popup
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

  // React Router navigation function
  const navigate = useNavigate();

  // Stores references to each category slider so we can scroll them horizontally
  const sliderRefs = useRef({});

  // List of banner images shown in the top carousel
  const banner_images = [
    eCommerce_beaty_banner,
    eCommerce_fragrance_banner,
    eCommerce_furniture_banner,
    eCommerce_grocery_banner,
  ];

  // Embla carousel setup with autoplay enabled
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
      }),
    ]
  );

  // Fetch products from the backend when the component loads
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("http://localhost:3000/home", {
          credentials: "include",
        });

        const result = await response.json();

        // If server returns an error, display it
        if (!response.ok) {
          setError(result.message || "Failed to load products");
          return;
        }

        // Save products into state
        setData(result);
      } catch (error) {
        console.log(error);
        setError("Could not connect to server");
      }
    };

    getData();
  }, []);

  // total number of cart 
  const { setCartCount ,searchTerm } = useApp();

  // Add a product to the shopping cart
  const add_to_cart = async (product) => {
    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productid: product.id,
        }),
      });

      const result = await response.json();

      console.log(result);

      // Show confirmation if product was added successfully
      if (response.ok) {
        setCartCount(prev => prev + 1);
        popup("Added to cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Place an order for a product
  const place_order = async (product) => {
    try {
      const response = await fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productid: product.id,
        }),
      });

      const result = await response.json();

      // Show confirmation if order was successful
      if (response.ok) {
        popup("Order placed successfully");
      }

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  // Group products by their category name
  const groupProduct = (products) => {
    return products.reduce((acc, product) => {
      const category = product.category;

      // Create category array if it doesn't exist yet
      if (!acc[category]) {
        acc[category] = [];
      }

      // Add the product to its category group
      acc[category].push(product);

      return acc;
    }, {});
  };

  // Scroll the category product slider left or right
  const scroll = (category, direction) => {
    const container = sliderRefs.current[category];

    if (container) {
      container.scrollBy({
        left: direction === "left" ? -500 : 500,
        behavior: "smooth",
      });
    }
  };

// to filter from search
  const searchedData = data.filter((product) =>
  product.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);


  // Group all fetched products by category
  // Apply filter before grouping
  const filteredData = [...searchedData];

  if (filtervalue === 1) {
    // Price low to high
    filteredData.sort((a, b) => a.price - b.price);
  }

  else if (filtervalue === 2) {
    // Price high to low
    filteredData.sort((a, b) => b.price - a.price);
  }

  else if (filtervalue === 3) {
    // Rating high to low
    filteredData.sort((a, b) => b.rating - a.rating);
  }

  // Group filtered products
  const groupedProducts = groupProduct(filteredData);

  return (
    <>
      {/* Toast notification container --------------------------------------------- */}
      <Toaster position="bottom-right" />

      {/* Fixed category navigation bar, filter --------------------------------------*/}

      <div className="fixed flex top-16 md:top-18  left-0 right-0 z-10 border-b border-stone-200 bg-white/70 px-4 py-3 shadow-md backdrop-blur-md">

        {/* filter dropdown pannel ------------------------------------*/}

        <div className="relative items-center md:border-r-1 md:border-stone-200 mr-3">

          {/* Filter Button */}
          <button
            onClick={() => {
              setfilteron(!filteron);
            }}
            className={`${catagory_button_color} flex items-center gap-2`}
          >
           <>
  {filtervalue === 0 && (
    <div>No filters applied</div>
  )}

  {filtervalue === 1 && (
    <div>Price low to high</div>
  )}

  {filtervalue === 2 && (
    <div>Price high to low</div>
  )}

  {filtervalue === 3 && (
    <div>Rating high to low</div>
  )}
</>
              
            {/* Arrow */}
            <span
              className={`
        transition-transform
        duration-300
        ${filteron ? "rotate-180" : ""}
      `}
            >
              ▼
            </span>
          </button>

          {/* Filter Dropdown */}
          {filteron && (
            <div
              className="
              absolute
        left-0
        mt-2
        w-44
        overflow-hidden
        z-50
      "
            >

              {/* All */}
              <div
                onClick={() => {
                  setfiltervalue(0);
                  setfilteron(false);
                }}
                className={`${catagory_button_color} mb-1.5 ${filtervalue === 0 ? active_filter_button : ""}`}
              >
                No filter
              </div>

              {/* Low Price */}
              <div
                onClick={() => {
                  setfiltervalue(1);
                  setfilteron(false);
                }}
                className={`${catagory_button_color} mb-1.5 ${filtervalue === 1 ? active_filter_button : ""}`}
              >
                Price low to high
              </div>

              {/* High Price */}
              <div
                onClick={() => {
                  setfiltervalue(2);
                  setfilteron(false);
                }}
                className={`${catagory_button_color} mb-1.5 ${filtervalue === 2 ? active_filter_button : ""}`}
              >
                Price high to low
              </div>

              {/* Rating */}
              <div
                onClick={() => {
                  setfiltervalue(3);
                  setfilteron(false);
                }}
                className={`${catagory_button_color} mb-1.5 ${filtervalue === 3 ? active_filter_button : ""}`}
              >
                Rating high to low
              </div>

            </div>
          )}

        </div>


        {/* category navbar ----------------------------------*/}

        {/* for small screen */}

        <div className="md:hidden ml-auto mr-3 relative">

          {/* Dropdown Button */}
          <button
            onClick={() => {
              setsmCatagory(!smCatagory);
            }}
            className={`${catagory_button_color} flex items-center gap-2`}
          >
            Categories

            {/* Arrow Down */}
            <span
              className={`transition-transform duration-300 ${smCatagory ? "rotate-180" : ""
                }`}
            >
              ▼
            </span>
          </button>

          {/* Dropdown Menu */}
          {smCatagory && (
            <div
              className="
        absolute
        right-0
        mt-2
        w-44
        overflow-hidden
        
        z-50
       
      "
            >

              {/* Beauty */}
              <div
                onClick={() => {
                  goToCategory("beauty");
                  setsmCatagory(false);
                }}
                className={` ${catagory_button_color} mb-1.5 `}

              >
                Beauty
              </div>

              {/* Fragrances */}
              <div
                onClick={() => {
                  goToCategory("fragrances");
                  setsmCatagory(false);
                }}
                className={` ${catagory_button_color} mb-1.5 `}
              >
                Fragrances
              </div>

              {/* Furniture */}
              <div
                onClick={() => {
                  goToCategory("furniture");
                  setsmCatagory(false);
                }}
                className={` ${catagory_button_color} mb-1.5 `}
              >
                Furniture
              </div>

              {/* Groceries */}
              <div
                onClick={() => {
                  goToCategory("groceries");
                  setsmCatagory(false);
                }}
                className={` ${catagory_button_color} mb-1.5 `}
              >
                Groceries
              </div>

            </div>
          )}

        </div>


        {/* for big screen */}
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar hidden md:block">

          {/* Scroll to Beauty section */}
          <button
            onClick={() => goToCategory("beauty")}
            className={catagory_button_color}
          >
            Beauty
          </button>

          {/* Scroll to Fragrances section */}
          <button
            onClick={() => goToCategory("fragrances")}
            className={catagory_button_color}
          >
            Fragrances
          </button>

          {/* Scroll to Furniture section */}
          <button
            onClick={() => goToCategory("furniture")}
            className={catagory_button_color}
          >
            Furniture
          </button>

          {/* Scroll to Groceries section */}
          <button
            onClick={() => goToCategory("groceries")}
            className={catagory_button_color}
          >
            Groceries
          </button>

        </div>
      </div>

      {/* Main page background and spacing ----------------------------------------------------------*/}
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-[#f8f6f2] to-slate-100 px-4 py-8 pt-17 text-slate-800 sm:px-6 lg:px-8">

        {/* Top banner slider */}

        {searchTerm.trim() === "" && (
        <div
          className="overflow-hidden rounded-[32px] border border-stone-200 shadow-xl"
          ref={emblaRef}
        >
          <div className="flex">
            {banner_images.map((img, index) => (
              <div
                key={index}
                className="min-w-full"
              >
                <img
                  src={img}
                  alt={`banner-${index}`}
                  className="h-[180px] w-full sm:h-[250px] md:h-[350px] lg:h-[450px]"
                />
              </div>
            ))}
          </div>
        </div>
        )}
        {/* Error message display */}
        {error && (
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 shadow-md">
            {error}
          </div>
        )}

        {/* Product sections only shown if there is no error */}
        {!error && (
          <div className="mx-auto mt-10 max-w-7xl">

            {/* Render each category section */}
            {Object.entries(groupedProducts).map(
              ([category, products]) => (
                <section
                  id={category}
                  key={category}
                  className="mb-20"
                >

                  {/* Category heading */}
                  <div className="mb-10 flex items-center justify-center">
                    <div className="h-[1px] w-24 bg-stone-300" />

                    <h2 className="mx-6 text-center text-3xl font-bold capitalize tracking-wide text-slate-800">
                      {category}
                    </h2>

                    <div className="h-[1px] w-24 bg-stone-300" />
                  </div>

                  <div className="relative">

                    {/* Scroll left button */}
                    <button
                      onClick={() =>
                        scroll(category, "left")
                      }
                      className="absolute -left-6 top-1/2 z-5 hidden -translate-y-1/2 rounded-full border border-stone-300 bg-white/90 p-4 text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-stone-100 md:block"
                    >
                      ❮
                    </button>

                    {/* Horizontal list of products */}
                    <div
                      ref={(el) =>
                        (sliderRefs.current[category] = el)
                      }
                      className="hide-scrollbar flex gap-8 overflow-x-auto scroll-smooth px-8 pb-4"
                    >

                      {/* Single product card */}
                      {products.map((product) => (
                        <div
                          key={product.id}
                          onClick={() =>
                            productdetails(
                              navigate,
                              product.title,
                              product.id
                            )
                          }
                          className="group min-w-[290px] max-w-[290px] cursor-pointer rounded-[30px] border border-stone-200 bg-white/90 p-5 shadow-lg backdrop-blur-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                        >

                          {/* Product thumbnail image */}
                          <div className="overflow-hidden rounded-[24px] bg-stone-100">
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="h-60 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>

                          {/* Product details like title, price, and rating */}
                          <div className="mt-5">

                            <h3 className="line-clamp-1 text-lg font-semibold text-slate-800">
                              {product.title}
                            </h3>

                            <p className="mt-2 text-2xl font-bold text-amber-700">
                              ${product.price}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              ⭐ Rating: {product.rating}
                            </p>

                          </div>

                          {/* Action buttons */}
                          <div className="mt-6 flex gap-3">

                            {/* Add selected product to cart */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                add_to_cart(product);
                              }}
                              className="flex-1 rounded-2xl bg-slate-800 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-slate-700"
                            >
                              Add to Cart
                            </button>

                            {/* Buy immediately / place order */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                place_order(product);
                              }}
                              className="flex-1 rounded-2xl bg-amber-300 px-4 py-3 font-semibold text-slate-800 transition-all duration-300 hover:scale-[1.03] hover:bg-amber-400"
                            >
                              Buy Now
                            </button>

                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Scroll right button */}
                    <button
                      onClick={() =>
                        scroll(category, "right")
                      }
                      className="absolute -right-6 top-1/2 z-5 hidden -translate-y-1/2 rounded-full border border-stone-300 bg-white/90 p-4 text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-stone-100 md:block"
                    >
                      ❯
                    </button>

                  </div>
                </section>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;