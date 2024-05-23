require('dotenv').config();

const express = require("express");

const path = require("path");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const BlogRoute = require("./routes/blog");
const Blog = require("./models/blog");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("MongoDB connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(express.static(path.resolve("./uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(checkForAuthenticationCookie("token"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/blog", BlogRoute);
app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
