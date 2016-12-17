var express = require('express');
var mongoose = require('mongoose');

var userContactStatusSchema = new mongoose.Schema({
    email: String,
    contactEmail: String,
    contactFName: String,
    contactLName: String,
    contactZipcode: String,
    avtiveIn: String,
    contactStatus: String
});

module.exports = mongoose.model('userContactStatusModel', userContactStatusSchema);