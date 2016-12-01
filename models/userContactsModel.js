var express = require('express');
var mongoose = require('mongoose');

var userContactsSchema = new mongoose.Schema({
    email: String,
    contactEmail: String,
    contactStatus: String,
    requestDate: Date,
    approvedDate: Date
});

module.exports = mongoose.model('userContactsModel', userContactsSchema);