var express = require('express');
var mongoose = require('mongoose');

var jobArchiveSchema = new mongoose.Schema({
    id: Number,
    jobID: String,
    employerID : String,
    title: String,
    location: String,
    companyName: String,
    responsibilities: String,
    requirement: String,
    rate: Number,
    salaryType: String,
    referEmail: String,
    jobExpiryDate: String,
    origPostDate: Date,
    archivedDate: Date,
    lastUpdatedBy: String
});

module.exports = mongoose.model('jobArchiveModel', jobArchiveSchema);