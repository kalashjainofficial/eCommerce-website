const express = require("express");

const {add_to_cart , getcart , delete_cart, remove_one_item} = require("../src/add_to_cart")
const {order , all_orders} = require("../src/orders");
const {product_details} = require("../src/product_details")
const {AuthMiddleware} = require("../src/middlewares/Auth_middleware")
const {Product} = require("../src/Productsdb")

const router = express.Router();


router.get('/home', AuthMiddleware, async (req, res) => {

    try {

        const products = await Product.find().sort({ id: 1 });

        res.json(
            products.map(product => ({
                id: product._id,
                title: product.title,
                description: product.description,   
                category: product.category,
                price: product.price,
                rating: product.rating,
                thumbnail: product.thumbnail

            }))
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error fetching products",
            error: error.message
        });

    }

});

router.get('/cart' , getcart)
router.post('/cart' , add_to_cart);
router.delete('/cart' , delete_cart )
router.delete('/cart/removeone', remove_one_item); // remove one occurrence

router.get('/order' , all_orders )
router.post('/order' , order )

router.get("/product/:productid",AuthMiddleware,product_details)

module.exports = router;
