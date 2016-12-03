var express = require('express');
var mongoose = require('mongoose');

var countersSchema = new mongoose.Schema({
    name: String,
    seqNum: Number
});

module.exports = mongoose.model('counters', countersSchema);