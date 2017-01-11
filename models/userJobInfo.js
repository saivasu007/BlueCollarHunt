var express = require('express');
var mongoose = require('mongoose');

var userJobInfoSchema = new mongoose.Schema({
    jobID: String,
    title: String,
    email: String,
    name: String,
    companyName: String,
    employerEmail: String,
    filename: String,
    dateApplied: Date,
    applicationStatus: String,
    files_id: Object
});

module.exports = mongoose.model('userJobInfoModel', userJobInfoSchema);