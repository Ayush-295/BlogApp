const express = require("express");
const multer = require("multer");
const Blog = require("../models/blog");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./public/uploads/`);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/addNew", (req, res) => {
  return res.render("addBlog.ejs", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  console.log(blog);
  return res.render("blog.ejs", {
    blog,
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  await Blog.create({
    title: req.body.title,
    body: req.body.body,
    coverImageUrl: `/uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
