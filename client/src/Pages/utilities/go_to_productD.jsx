export const slugify = (title) => {
  return title.toLowerCase().replace(/\s+/g, "-");
};

export const productdetails = (
  navigate,
  productname,
  productid
) => {
  navigate(
    `/home/product/${slugify(productname)}/${productid}`
  );
};