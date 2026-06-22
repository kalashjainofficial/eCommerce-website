const { Product } = require("./Productsdb");

const product_details = async (req, res) => {
  try {

    const { productid } = req.params;

    const product = await Product.findById(productid);

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    res.status(200).json({
      product,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "server error in the product details ",
    });

  }
};

module.exports = { product_details };