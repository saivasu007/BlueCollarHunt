var express = require('express');
var mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    adminComments: String,
    status: String,
    msgDate: Date,
    responseDate: Date,
    respondedBy: String,
    lastUpdatedBy: String
});

module.exports = mongoose.model('contactModel', contactSchema);