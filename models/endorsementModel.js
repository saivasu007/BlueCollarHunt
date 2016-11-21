var express = require('express');
var mongoose = require('mongoose');

var endorsementSchema = new mongoose.Schema({
    id: Number,
    email: String,
    fromEmail: String,
    message: String,
    origPostDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('endorsementModel', endorsementSchema);