require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require("cookie-parser");

const {
    User,
    login,
    signup,
    forgotpass,
    sendotp,
    logout,
    handleGoogleLogin
} = require('./src/userData');


const {
    AuthMiddleware,
    if_user_exist
} = require('./src/middlewares/Auth_middleware');

const {
    Product,
    connectDB
} = require("./src/Productsdb");

const fetchProducts = require("./src/Fetch");
const {add_to_cart , getcart , delete_cart, remove_one_item} = require("./src/add_to_cart")
const {order , all_orders} = require("./src/orders");
const {product_details} = require("./src/product_details")


const login_route = require ("./router/login_router")

const signup_route = require("./router/signup_route")

const sendotp_route = require("./router/sendotp_router")

const forgotpass_router = require("./router/forgootpass_router")

const googlelogin_router = require("./router/googlelogin_route")

const home_router = require("./router/homepage_route")

const logout_router = require("./router/logout_router")

// MIDDLEWARES
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// insert data in mongoDB
// const seedProducts = async () => {
//     try {
       

//         const data = await fetchProducts();

        
        

//         await Product.insertMany(data.products);

//         console.log("Products inserted successfully!");
//     } catch (error) {
//         console.log("Seeding error:", error.message);
//     }
// };








// LOGIN ROUTES
// app.get('/login', (req, res) => {
//     res.send("login route");
// });

// app.post('/login',if_user_exist ,login);

app.use(login_route);

// SIGNUP ROUTES
// app.get('/signup', (req, res) => {
//     res.send("signup route");
// });

// app.post('/signup',if_user_exist ,signup);

app.use(signup_route)


// SEND OTP
// app.post('/sendotp',if_user_exist ,sendotp);

app.use(sendotp_route)



// FORGOT PASSWORD
// app.get('/forgotpass', (req, res) => {
//     res.send("forgotpass");
// });

// app.post('/forgotpass', if_user_exist,forgotpass);

app.use(forgotpass_router);


// login with google 
// app.post('/googlelogin' , handleGoogleLogin )

app.use(googlelogin_router)

// HOME ROUTE
// app.get('/home', AuthMiddleware, async (req, res) => {

//     try {

//         const products = await Product.find().sort({ id: 1 });

//         res.json(
//             products.map(product => ({
//                 id: product._id,
//                 title: product.title,
//                 description: product.description,   
//                 category: product.category,
//                 price: product.price,
//                 rating: product.rating,
//                 thumbnail: product.thumbnail

//             }))
//         );

//     } catch (error) {

//         console.log(error);

//         res.status(500).json({
//             message: "Error fetching products",
//             error: error.message
//         });

//     }

// });

// app.get('/cart' , getcart)
// app.post('/cart' , add_to_cart);
// app.delete('/cart' , delete_cart )
// app.delete('/cart/removeone', remove_one_item); // remove one occurrence

// app.get('/order' , all_orders )
// app.post('/order' , order )

// app.get("/product/:productid",AuthMiddleware,product_details)

app.use(home_router)

// app.post("/logout", logout); 
app.use(logout_router)  


// START SERVER
const startserver = async () => {

    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("Connected to MongoDB successfully!");

    // await seedProducts();

    console.log("Starting the server...");

    app.listen(process.env.PORT || 3000, () => {

        console.log(
            `Server is running on port ${process.env.PORT || 3000}`
        );

    });

};

startserver();