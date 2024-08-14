import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
    email: {
        type : String,
        required : true,
        unique : true,
    },
    password: {
        type : String,
        required : true,
    },
    name: {
        type : String,
        required : true,
    },
    lastLogin: {
        type : Date,
        default : Date.now,
    },
    isVerified: {
        type : Boolean,
        default : false,
    },
    resetPasswordToken: {
        type : String,
    },
    resetPasswordExpiresAt: {
        type : Date,
    },
    verificationToken: {
        type : String,
    },
    verifitcationTokenExpiresAt: {
        type : Date,
    },
}, {
    timestamps: true
});

export const User = mongoose.model('User', userScheme);