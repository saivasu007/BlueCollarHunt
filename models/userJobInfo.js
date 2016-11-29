var express = require('express');
var mongoose = require('mongoose');

var userJobInfoSchema = new mongoose.Schema({
    jobID: String,
    email: String,
    companyName: String,
    employerEmail: String,
    dateApplied: Date,
    files_id: Object
});

module.exports = mongoose.model('userJobInfoModel', userJobInfoSchema);