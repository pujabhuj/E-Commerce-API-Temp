const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const path = require('path');

const createProduct = async (req,res) =>{
    req.body.user = req.user.userId;
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product}) 
}
const getAllProduct = async (req,res) =>{
    const products = await Product.find({});

    res.status(StatusCodes.OK).send({products,count:products.length}) 
}
const getSingleProduct = async (req,res) =>{
    const {id:productId} = req.params;
    //setting virtualproperty for reviews
    const product = await Product.findOne({_id:productId}).populate('reviews')

    if(!product){
        throw new CustomError.NotFoundError(`No Product with id ${productId} `);
    }
    res.status(StatusCodes.OK).send({product}) 
}
const updateProduct = async (req,res) =>{
    const {id:productId} = req.params;
    const product = await Product.findOneAndUpdate({_id:productId},req.body,{new:true,runValidators:true})
    if(!product){
        throw new CustomError.NotFoundError(`No Product with id ${productId} `);
    }
    res.status(StatusCodes.OK).send({product}) 
}
const deleteProduct = async (req,res) =>{
    const {id:productId} = req.params;
    const product = await Product.findOne({_id:productId})
    if(!product){
        throw new CustomError.NotFoundError(`No Product with id ${productId} `);
    }
    await product.deleteOne();
    res.status(StatusCodes.OK).json({msg:'Sucess!product removed'})
 

}
const uploadImage = async (req,res) =>{

    //console.log(req.files)
    if(!req.files){
       throw new CustomError.BadRequestError('No File Uploaded') 
    }
    const productImage = req.files.image;
    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('Please Select Image File') 
    }
    const maxSize = 1024 * 1024
    if(productImage.size > maxSize){
        throw new CustomError.BadRequestError('Please Select image with 1 MB') 
 
    }
    const imagePath = path.join(__dirname,'../public/uploads.' + `${productImage.name}`);
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` }); 
  }

module.exports = { 
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}