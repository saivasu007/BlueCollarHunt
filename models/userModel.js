var express = require('express');
var mongoose = require('mongoose');

//Updated by Srinivas Thungathurti for ASQ Upgrade 2.0
var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipcode: String,
    gender: String,
    role: String,
    activeIn: String,
    expiryDate: String,
    subscriber: String,
    birthDate: String,
    contactNum: String,
    socialYN: String,
    userType: String,
    authType: String,
    primarySkill: String,
    coverPageInfo: String,
    tempPassword: String,
    tempPassYN: String,
    rating: String,
    activateHandle: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastUpdatedBy: String,
    updatedDate: Date
});

userSchema.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};

//End Changes for ASQ Upgrade 2.0 here.

module.exports = mongoose.model('userModel', userSchema);