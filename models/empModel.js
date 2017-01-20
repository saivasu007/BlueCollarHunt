var express = require('express');
var mongoose = require('mongoose');

var empSchema = new mongoose.Schema({
	uid: String,
	name: String,
    email: String,
    password: String,
    contactNum: String,
    address: String,
    zipcode: String,
    empUniqueID: String,
    activeIn: String,
    expiryDate: String,
    saveCC: String,
    userType: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    tempPassword: String,
    tempPassYN: String,
    updatedDate: Date,
    lastUpdatedBy: String
});

empSchema.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};


module.exports = mongoose.model('empModel', empSchema);