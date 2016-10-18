// smtp set
exports.smtp = {
  service: 'gmail',
  auth: {
    user: 'bluecollarhuntsearch@gmail.com',
    pass: 'Helloworld123!'
  },
  secure: false,
  debug: true
};

// expiration time，ms
exports.registerMaxAge = 3600000 * 24;
