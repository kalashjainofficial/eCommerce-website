require('dotenv').config();
const { Product } = require("./Productsdb")
const { User } = require("./userData")
const jwt = require("jsonwebtoken");




const add_to_cart = async (req, res) => {

    try {

        const { productid } = req.body;

        const product = await Product.findById(productid);

        const token = req.cookies.token;

        if (!token) {

            return res.status(401).json({
                message: "token not found"
            });

        }

        if (!product) {

            return res.status(404).json({
                message: "product not found"
            });

        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const email = decoded.email;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {

            return res.status(404).json({
                message: "user not found"
            });

        }

        existingUser.cart.push({
            productId: product._id
        });

        await existingUser.save();

        res.status(200).json({
            message: "saved at cart successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "server error"
        });

    }

}


const getcart = async (req, res) => {

    try {

        const token = req.cookies.token;

        if (!token) {

            return res.status(401).json({
                message: "token not found"
            });

        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const email = decoded.email;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {

            return res.status(404).json({
                message: "user not found"
            });

        }

        const cartProducts = [];

        console.log(existingUser.cart);

        for (const item of existingUser.cart) {

            console.log(item.productId);

            const product = await Product.findById(item.productId);

            if (product) {

                cartProducts.push({
                    _id: product._id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail,
                    availabilityStatus: product.availabilityStatus,
                    rating: product.rating
                });

            }

            

        }

        res.status(200).json({
            cart: cartProducts
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "server error"
        });

    }

};

const delete_cart = async (req, res) => {
    try {
        const { productid } = req.body;

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "token not found",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const email = decoded.email;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: "user not found",
            });
        }

        // remove product from cart
        existingUser.cart = existingUser.cart.filter(
            (item) => item.productId && item.productId.toString() !== productid
        );

        await existingUser.save();

        res.status(200).json({
            message: "product removed from cart",
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "server error",
        });
    }
};

const remove_one_item = async (req, res) => {
    try {
        const { productid } = req.body;

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "token not found",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const email = decoded.email;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: "user not found",
            });
        }

        const index = existingUser.cart.findIndex(
            (item) => item.productId && item.productId.toString() === productid
        );

        if (index === -1) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        existingUser.cart.splice(index, 1);

        await existingUser.save();

        return res.status(200).json({
            message: "One item removed from cart",
            cart: existingUser.cart
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};
module.exports = { add_to_cart, getcart, delete_cart , remove_one_item };