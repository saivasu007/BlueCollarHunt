// smtp set
exports.smtp = {
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  },
  secure: false,
  debug: true
};

// expiration time，ms
exports.registerMaxAge = 3600000 * 24;
