var express = require('express');
var mongoose = require('mongoose');

var userAuditSchema = new mongoose.Schema({
    email: String,
    createDate: String,
    updateDate: String,
    loginTime: String,
    logoutTime: String
});


module.exports = mongoose.model('userAuditModel', userAuditSchema);