const { Product } = require("./Productsdb");
const { User } = require("./userData");
const jwt = require("jsonwebtoken");


// PLACE ORDER
const order = async (req, res) => {

    try {

        const { productid } = req.body;

        console.log(req.body);

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "token not found"
            });
        }

        const product = await Product.findById(productid);

        if (!product) {
            return res.status(404).json({
                message: "product not found"
            });
        }

        const decoded = jwt.verify(token, "secret");

        const email = decoded.email;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        // PUSH ORDER
        existingUser.orders.push({
            productid: product._id
        });

        await existingUser.save();

        console.log(existingUser.orders);

        res.status(200).json({
            message: "ordered successfully",
            orders: existingUser.orders
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


// GET ALL ORDERS
const all_orders = async (req, res) => {

    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "token not found"
            });
        }

        const decoded = jwt.verify(token, "secret");

        const email = decoded.email;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        const orderproducts = [];

        for (const item of existingUser.orders) {

            console.log(item.productid);

            const product = await Product.findById(item.productid);

            if (product) {

                orderproducts.push({
                    _id: product._id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail
                });

            }

        }

        res.status(200).json({
            orders: orderproducts
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {
    order,
    all_orders
};