import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// getProducts
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});

    res.status(200).json({
        success: true,
        count: products.length,
        products,
    });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("brand", "name");

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// createProduct
const createProduct = asyncHandler(async (req, res) => {
    const { 
        name, 
        description,
        price,
        category,
        brand,
        image,
        discountPercentage,
        stock,
     } = req.body;

     // check if product with same name exists
     const productExists = await Product.findOne({name});
     if(productExists){
        res.status(400);
        throw new Error("Product with this name already exists");
     }


     // upload image to cloudinary


     // create the product
     const product = await Product.create({
        name,
        description,
        price,
        category,
        brand,
        image,
        discountPercentage: discountPercentage || 0,
        stock: stock || 0,
     });

     if(product){
        res.status(201).json({
            success: true,
            product,
        })
     } else {
        res.status(400);
        throw new Error("Invalid product data");
     }

});
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    brand,
    image,
    discountPercentage,
    stock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if new name is already taken by another product
    if (name !== product.name) {
      const productExists = await Product.findOne({ name });
      if (productExists) {
        res.status(400);
        throw new Error("Product with this name already exists");
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.discountPercentage =
      discountPercentage || product.discountPercentage;
    product.stock = stock || product.stock;

    // Update image if provided
    if (image && image !== product.image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "admin-dashboard/products",
      });
      product.image = result.secure_url;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});


// @desc    Rate a product
// @route   POST /api/products/:id/rate
// @access  Private
const rateProduct = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyRated = product.ratings.find(
      (r) => r.userId.toString() === req.user._id.toString()
    );

    if (alreadyRated) {
      // Update existing rating
      alreadyRated.rating = rating;
    } else {
      // Add new rating
      product.ratings.push({
        userId: req.user._id,
        rating,
      });
    }

    await product.save();
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});


export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    rateProduct,
    deleteProduct,
}