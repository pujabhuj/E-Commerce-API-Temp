const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {attachCookiesToResponse} = require('../utils')

const login = async (req,res) =>{
    res.send('login user') 
}
const register = async (req,res) =>{
    const { email, name, password } = req.body;

    //check for user email exist or not
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError('Email already exists');
    }
    //first registered user is admin
    const isFirstAccount = await User.countDocuments({}) === 0;  
    const role = isFirstAccount ? 'admin': 'user';
    const user = await User.create({name,email,password,role})
    const tokenUser = {name:user.name,userId:user._id,role:user.role};
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser})

}
const logout = async (req,res) =>{
    res.send('logout user')
}

module.exports = {
    register,
    login,
    logout
}