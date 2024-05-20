const express = require("express");
const path = require("path");
const mongoose=require('mongoose');
const userRoute = require("./routes/user");
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/Blogify")
.then(()=>{
    console.log("MongoDB connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("home");
});

app.use('/user', userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
