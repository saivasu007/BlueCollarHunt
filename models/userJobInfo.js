var express = require('express');
var mongoose = require('mongoose');

var userJobInfoSchema = new mongoose.Schema({
    id: Number,
    jobID: Number,
    email: String
    companyName: String,
    dateApplied: Date
});

module.exports = mongoose.model('userJobInfoModel', userJobInfoSchema);