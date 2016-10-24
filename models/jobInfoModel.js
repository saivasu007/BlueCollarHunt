var express = require('express');
var mongoose = require('mongoose');

var jobInfoSchema = new mongoose.Schema({
    id: Number,
    jobID: String,
    employerID : String,
    title: String,
    location: String,
    companyName: String,
    responsibilities: String,
    requirement: String,
    rate: Number,
    maxNumber: Number,
    activeJob: String,
    origPostDate: Date,
    updatedDate: Date
});

module.exports = mongoose.model('jobInfoModel', jobInfoSchema);