var express = require('express');
var mongoose = require('mongoose');

var paymentSchema = new mongoose.Schema({
	uid: Object,
	email: String,
	cardNumber: Number,
    cardMM: Number,
    cardYYYY: Number,
    cvc: String,
    cardName: String,
    type: String,
    defaultCC: String,
    lastUpdated: Date
});


module.exports = mongoose.model('paymentModel', paymentSchema);