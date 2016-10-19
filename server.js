/*
 * @date : 10/09/2016
 * @author : Srinivas Thungathurti
 * @description : Created Node server file for Capstone Blue Collar Hunt Project.
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passPort = require('passport');
var localStrategy = require('passport-local').Strategy;
var LinkedinStrategy = require("passport-linkedin-oauth2").Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var async = require("async");
var mailer = require("nodemailer");
var propertiesReader = require("properties-reader");
var moment = require("moment");
var path = require('path');
var templatesDir = path.resolve(__dirname + '/views/templates');
var pageDir = path.resolve(__dirname + '/views/partials');
var properties = propertiesReader('applicationResources.file');
var crypto = require("crypto");
var multer = require("multer");
var http = require("https");
var request = require("request");
//For Node Application using Express
var app = express();
var port = properties.get('process.env.port');
app.use(express.static(__dirname + '/views'));
var mongodbUrl = properties.get('mongodb.connect.url');
mongoose.connect(mongodbUrl);
// models
var userModel = require('./models/userModel.js');
var empModel = require("./models/empModel.js");
var contactModel = require("./models/contactModel.js");
var paymentModel = require("./models/paymentModel.js");
var jobInfoModel = require("./models/jobInfoModel.js")
var fs  = require('fs');
var ejs = require('ejs');
var config = require('./oauth.js');
var DIR = './uploads/';
//For Stripe payment
var stripeApiKey = "sk_test_uipgrU7ikmbLSRJVJ9vf7mgI";
var stripeApiKeyTesting = "pk_test_obXvmdYNSzC5Ou0vL9x9sI6Q";
var stripe = require('stripe')(stripeApiKey);
var MongoClient = require('mongodb').MongoClient,
GridStore = require('mongodb').GridStore,
ObjectID = require('mongodb').ObjectID;
var emailTransport = properties.get('app.email.transport');
var serviceUser = properties.get('SMTP.service.user');
var servicePasswd = properties.get('SMTP.service.passwd');
var emailFrom = properties.get('app.email.from');
var emailSubject = properties.get('app.email.subject');
var bodyText = properties.get('app.email.body.text');
var bodyHtml = properties.get('app.email.body.html');
var emailFooter = properties.get('app.email.body.footer');
var emailChangePwdSubject = properties.get('app.email.subjectChgPwd');
var regTemplate = properties.get("app.email.registrationTem");
var chgPwdTemplate = properties.get("app.email.changePwdTem");
var pwdResetSubject = properties.get("app.email.subjectResetPwd");
var resetPwdTemplate = properties.get("app.email.resetPwdTem");
var resetConfirmSubject = properties.get("app.email.subjectConfirmResetPwd");
var resetConfirmTemplate = properties.get("app.email.resetConfirmTem");
var forgotUniqueIDSubject = properties.get("app.email.subjectForgotUniqueID");
var forgotUniqueIDTemplate = properties.get("app.email.forgotUniqueIDTem");

//Function added for encrypting the passwords in the Portal.
function encrypt(pass){
	  var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
	  var crypted = cipher.update(pass,'utf8','hex')
	  crypted += cipher.final('hex');
	  return crypted;
	}

//Function added for decrypting the passwords in the Portal.
function decrypt(pass){
	  var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
	  var dec = decipher.update(pass,'hex','utf8')
	  dec += decipher.final('utf8');
	  return dec;
}

//Function added for to render the HTML email templates in the Portal.
function renderTemplate (name, data) {
	  var tpl = fs.readFileSync(path.resolve(__dirname+"/views/", 'templates', name + '.html')).toString();
	  return ejs.render(tpl, data);
}

function randomNumber() {
	var num;
	num = parseInt((Math.random() * 9 + 1) * Math.pow(10,4), 10);
	return num;
}

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cookieParser());
app.use(session({
	secret : "secret",
	resave : "",
	saveUninitialized : "",
	cookie:{maxAge:3 * 60 * 60 * 1000}
}));
app.use(passPort.initialize());
app.use(passPort.session());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
  }
});

app.use(multer({
	  storage: storage,
	  limits: { fileSize: 10 * 1024 * 1024},
	  fileFilter: function (req, file, cb) {
		 if (!file.originalname.match(/\.(doc|docx|pdf)$/)) {
		        return cb(new Error('Only DOC,DOCX and PDF files are allowed!'));
		 }
		 cb(null, true);
	  }
}).array('file'));

// passport config
passPort.use(new localStrategy({
	usernameField : 'email',
	passwordField : 'password',
	session : false,
	passReqToCallback : true
}, function(req, username, password, done) {
	// authentication method
	console.log("userType "+ req.body.userType);
	if(req.body.userType == "U") {
	console.log("User Login");
	userModel.findOne({
		email : username,
		password : encrypt(password)
	}, function (err, user) {
        if (err) return done(err);
        if (user) {
        	var date = new Date();
        	var formatDate = date.getMonth() + 1 + '/' + date.getDate() + '/' +  date.getFullYear();
            if (new Date(user.expiryDate) < new Date(formatDate)) {
            	console.log(user.email+" expired in Blue Collar Hunt Portal.Please contact Administrator.");
                return done(err+" expired");
            }
            return done(null, user)
        }
        return  done(null, false)
    })
	} else if(req.body.userType == "E") {
		console.log("Employer Login");
		empModel.findOne({
			email : username,
			password : encrypt(password),
			empUniqueID : req.body.empUniqueID
		}, function (err, user) {
	        if (err) return done(err);
	        /*
	        if (user) {
	        	var date = new Date();
	        	var formatDate = date.getMonth() + 1 + '/' + date.getDate() + '/' +  date.getFullYear();
	            if (new Date(user.expiryDate) < new Date(formatDate)) {
	            	console.log(user.email+" expired in Blue Collar Hunt Portal.Please contact Administrator.");
	                return done(err+" expired");
	            }
	            return done(null, user)
	        } */
	        console.log("Employer Info "+user);
	        return  done(null, user)
	    })
	  }
}));

passPort.serializeUser(function(user, done) {
	done(null, user);
});

passPort.deserializeUser(function(user, done) {
	done(null, user);
});

app.get('/auth/facebook', passPort.authenticate('facebook',{ scope : 'email' }), function(req, res, next){
	var user = req.user;
	res.json(user);
});

app.get('/auth/facebook/callback',
	passPort.authenticate('facebook', { failureRedirect: '/' , successRedirect : '/home', scope: 'email' }),function(req, res, next) {
	var user = req.user;
	res.json(user);
});

app.get('/auth/google',
		  passPort.authenticate('google', { scope: [
		    'https://www.googleapis.com/auth/plus.login',
		    'https://www.googleapis.com/auth/plus.profile.emails.read'
		  ] }),function(req, res) {
		    	var user = req.user;
		    	res.json(user);
});

app.get('/auth/google/callback',
		  passPort.authenticate('google', { failureRedirect: '/', successRedirect : '/home' }),
		  function(req, res) {
		    var user = req.user;
		    res.json(user);
});

app.get('/auth/linkedin',
		  passPort.authenticate('linkedin',{state:'CA'}),
		  function(req, res){
			var user = req.user;
			res.json(user);
});
		
app.get('/auth/linkedin/callback',
		  passPort.authenticate('linkedin', { failureRedirect: '/' , successRedirect : '/home' }),
		  function(req, res) {
			var user = req.user;
			res.json(user);
});


//Linkedin Social login
passPort.use(new LinkedinStrategy({
	  clientID: config.linkedin.consumerKey,
	  clientSecret: config.linkedin.consumerSecret,
	  callbackURL: config.linkedin.callbackURL,
	  scope: config.linkedin.scope
	  },
	  function(accessToken, refreshToken, profile, done) {
	    userModel.findOne({ email: profile.emails[0].value }, function(err, user) {
	      if(err) {
	        console.log(err);  // handle errors!
	      }
	      if (!err && user !== null) {
	        done(null, user);
	      } else {
	    	// if there is no user found with that facebook id, create them
              var newUser = new userModel();
              // set all of the facebook information in our user model
              //newUser._id  = profile.id;                
              newUser.firstName  = profile.name.givenName;
              newUser.lastName = profile.name.familyName; 
              newUser.email = profile.emails[0].value;
              newUser.role = "user";
              newUser.activeIn = "Y";
              newUser.subscriber = "No";
              newUser.authType = "linkedin";
              // save our user to the database
              newUser.save(function(err) {
	          if(err) {
	            console.log(err);  // handle errors!
	          } else {
	            console.log("saving user ...");
	            done(null, user);
	          }
	        });
		   console.log(profile.id);
	      }
	    });
	  }
));

//Facebook Social Login
passPort.use(new facebookStrategy({
	  clientID: config.facebook.clientID,
	  clientSecret: config.facebook.clientSecret,
	  callbackURL: config.facebook.callbackURL,
	  profileFields: ['id', 'displayName', 'photos', 'email','name']
  },function(token, refreshToken, profile, done) {
          userModel.findOne({email:profile.emails[0].value}, function(err, user) {
              if (err) {
            	  console.debug("err"+err);
            	  console.log(err);
            	  console.error(err);
                  return done(err);
              }
              if (user) {
            	  console.log("User exists in application");
            	  console.log(user);
                  return done(null, user); // If user found then return the same user.
              } else {
                  // if there is no user found in the application with that facebook user-id then create them.
                  var newUser = new userModel();
                  // Set all of the facebook information in application user model.        
                  newUser.firstName  = profile.name.givenName;
                  newUser.lastName = profile.name.familyName; 
                  newUser.email = profile.emails[0].value;
                  newUser.role = "user";
                  newUser.activeIn = "Y";
                  newUser.subscriber = "No";
                  newUser.authType = "facebook";
                  newUser.accessToken = token;
                  console.log("Before saving user info");
                  // save our user to the database
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      	return done(null, user);
                  });
              }
          });
  }));

//Google Social Login
passPort.use(new GoogleStrategy({
	  clientID: config.google.clientID,
	  clientSecret: config.google.clientSecret,
	  callbackURL: config.google.returnURL
	  },
	  function(request, accessToken, refreshToken, profile, done) {
	    userModel.findOne({email: profile.email }, function(err, user) {
	      if(err) {
	        console.log(err);  // handle errors!
	      }
	      if (!err && user !== null) {
	        done(null, user);
	      } else {
	        var user = new userModel();
              	// set all of the facebook information in our user model
              	//newUser._id  = profile.id;                
              	user.firstName  = profile.name.givenName;
              	user.lastName = profile.name.familyName; 
              	user.email = profile.emails[0].value;
              	user.role = "user";
              	user.activeIn = "Y";
              	user.subscriber = "No";
              	user.authType = "google";
	        user.save(function(err) {
	          if(err) {
	            console.log(err);  // handle errors!
	          } else {
	            console.log("saving user ...");
	            done(null, user);
	          }
	        });
	      }
	    });
	  }
));

//For Profile Picture
app.get('/uploadPic', function(req, res) {
	picture.find (err, pictures,function() {
		if(err) res.send(err);
		else res.send(pictures);
	});
});

app.post('/uploadPic', function(req, res) {
	console.log(req.body);
	picture = new Picture({ title: req.body.title });
	picture.set('photo.file', req.files.photo);
	picture.save(err,function(){
		if(err) res.send(err);
		else res.sendStatus(200);
	})
	
});

// routes
app.post('/register', function(req, res) {
	/*
	if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
	    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
	  }
	  // Put your secret key here.
	  var secretKey = "6Lf_kQkUAAAAAGtjR-_m4rQiGE1qbYE2eqrRHCvt";
	  // req.connection.remoteAddress will provide IP address of connected user.
	  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
	  // Hitting GET request to the URL, Google will respond with success or error scenario.
	  request(verificationUrl,function(error,response,body) {
	    body = JSON.parse(body);
	    // Success will be true or false depending upon captcha validation.
	    if(body.success !== undefined && !body.success) {
	      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
	    }
	    res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
	  });
	*/
	var password = encrypt(req.body.password);
	req.body.password = password;
	var email = req.body.email;
	console.log("email "+email);
	userModel.findOne({
		email : req.body.email
	}, function(err, result) {
		if (result) {
			res.send("0");
		} else {
			var newUser = new userModel(req.body);
			newUser.save(function(err, user) {
				console.log("req.body.email "+req.body.email);
				if(req.body.imageName != "") {
					console.log("Start profile picture upload process");
					console.log(req.body);
					MongoClient.connect(mongodbUrl, function(err, db) {
						  var gridStore = new GridStore(db, new ObjectID(),req.body.imageName, "w",{
							  "email": email,
							  "content_type": req.body.imageContentType,
							  "metadata":{
							      "author": req.user.lastName,
							      "email": email
							  }
							  });
						  gridStore.open(function(err, gridStore) {
							var stream = gridStore.stream(true);
						    gridStore.write(req.body.imageContents, function(err, gridStore) {
						      gridStore.close(function(err, result) {
						      });
						      stream.on("end", function(err) {
						    	  db.close();
						      });
						   });
						  });
						  console.log("Finished profile picture upload to MongoDB");
				});
				}
				req.login(user, function() {
					res.json(user);
				});
				
				//send email after successful registration.
				var smtpTransport = mailer.createTransport(emailTransport, {
					service : "Gmail",
					auth : {
						user : serviceUser,
						pass : servicePasswd
					}
				});
				var data = {
						email: user.email,
			            password: decrypt(user.password),
			            url: "http://"+req.headers.host+"/login",
			            name: user.firstName
				}
				var mail = {
					from : emailFrom,
					to : req.body.email,
					subject : emailSubject,
					html: renderTemplate(regTemplate,data)
				}

				smtpTransport.sendMail(mail, function(error, response) {
					if (error) {
						console.log(error);
					} else {
						console.log("Message sent: " + response.message);
					}
				   smtpTransport.close();
				});
			    //End email communication here.
				
			});
		}
	});
	
});

app.post('/uploadProfile', function(req, res) {
	console.log("uploading file to MongoDB");
	MongoClient.connect(mongodbUrl, function(err, db) {
		  var gridStore = new GridStore(db, new ObjectID(),req.user.firstName+"_"+req.body.name, "w",{
			  "content_type": "video/webm",
			  "metadata":{
			      "author": req.user.lastName
			  }
			  });
		  gridStore.open(function(err, gridStore) {
			var stream = gridStore.stream(true);
		    gridStore.write(req.body.contents, function(err, gridStore) {
		      gridStore.close(function(err, result) {
		      });
		      stream.on("end", function(err) {
		    	  db.close();
		      });
		   });
		  });
		  console.log("Finished resume upload to MongoDB");
		});
	res.sendStatus(200);
});

app.post('/uploadVideo', function(req, res) {
	console.log("uploading stream to MongoDB");
	MongoClient.connect(mongodbUrl, function(err, db) {
		  var gridStore = new GridStore(db, new ObjectID(),req.user.firstName+"_"+req.body.name, "w",{
			  "content_type": "video/webm",
			  "metadata":{
				  "email": req.body.email,
			      "author": req.user.lastName
			  }
			  });
		  gridStore.open(function(err, gridStore) {
			var stream = gridStore.stream(true);
		    gridStore.write(req.body.contents, function(err, gridStore) {
		      gridStore.close(function(err, result) {
		      });
		      stream.on("end", function(err) {
		    	  db.close();
		      });
		   });
		  });
		  console.log("Finished stream upload to MongoDB");
		});
	res.sendStatus(200);
});



app.post('/saveContactMessage', function(req, res) {
		var newUser = new contactModel(req.body);
		newUser.save(function(err, result) {
			if(result) {
				res.send("0");
			} else {
				res.send("ERROR "+err);
			}
		});
});

app.post('/login', passPort.authenticate('local'),function(req, res) {
	var user = req.user;
	res.json(user);
});

app.post('/empSignIn', passPort.authenticate('local'),function(req, res) {
	console.log("After empSignIn "+req.user);
	var user = req.user;
	res.json(user);
});


app.post('/logout', function(req, res) {
	console.log(req.user.email + " has logged out.")
	req.logout();
	res.sendStatus(200);
});

app.get('/loggedin', function(req, res) {
	//Display the pages after successful logout.
	if(req.user != undefined) {
	userModel.find({
		email : req.user.email
	}, function(err, result) {
		res.send(req.isAuthenticated() ? result[0] : "0")
	});
	} else {
		res.send("0");
	}
});

//For Stripe payments.
app.post("/plans/bluecollarhunt_dev", function(req, res) {
	  //Create user in the Database
	//var password = encrypt(req.body.password);
	//req.body.password = password;
	console.log(req.body.uid);
	var empUniqueID = req.body.empUniqueID+randomNumber();
	req.body.empUniqueID = empUniqueID;
	var password = encrypt(req.body.password);
	req.body.password = password;
	empModel.findOne({
		email : req.body.email
	}, function(err, result) {
		if (result) {
			res.send("0");
		} else {
			var newUser = new empModel(req.body);
			newUser.save(function(err, user) {
				req.login(user, function() {
					res.json(user);
				});
				/*
				//send email after successful registration.
				var smtpTransport = mailer.createTransport(emailTransport, {
					service : "Gmail",
					auth : {
						user : serviceUser,
						pass : servicePasswd
					}
				});
				var data = {
						email: user.email,
			            password: decrypt(user.password),
			            url: "http://"+req.headers.host+"/login",
			            name: user.firstName
				}
				var mail = {
					from : emailFrom,
					to : req.body.email,
					subject : emailSubject,
					html: renderTemplate(regTemplate,data)
				}

				smtpTransport.sendMail(mail, function(error, response) {
					if (error) {
						console.log(error);
					} else {
						console.log("Message sent: " + response.message);
					}
				   smtpTransport.close();
				});
			    //End email communication here.
			    */
			});
			if(req.body.saveCC == "Y" && req.body.amount != 0) { 
			var newPayment = new paymentModel(req.body.card);
			newPayment.save(function(err, user) {
				if(err) console.log("ERROR:paymet "+err);
				console.log("Payment Source added successfully");
			});
			}
	  } 
	});
	
	 //Process the payment information.
	  stripe.customers.create({
	    card : req.body.stripeToken,
	    email : req.body.email, // customer's email
	    plan : "bluecollarhunt_dev"
	  }, function (err, customer) {
	    if (err) {
	      //var msg = customer.error.message || "Unknown";
	      var msg = err.message;
	      console.log("msg: "+msg);
	      console.log("err: "+err);
	      //res.send(msg);
	    }
	    else {
	      var id = customer.id;
	      console.log('Success! Customer with Stripe ID ' + id + ' just signed up!');
	      // save this customer to your database here!
	      res.send('success');
	    }
	  });
	});

//For Free Employer Registrations.
app.post("/empFreeRegister", function(req, res) {
	var empUniqueID = req.body.empUniqueID+randomNumber();
	req.body.empUniqueID = empUniqueID;
	var password = encrypt(req.body.password);
	req.body.password = password;
	empModel.findOne({
		email : req.body.email
	}, function(err, result) {
		if (result) {
			res.send("0");
		} else {
			var newUser = new empModel(req.body);
			newUser.save(function(err, user) {
				req.login(user, function() {
					res.json(user);
				});
			});
	  } 
	});
});

app.post('/uploadResume', function(req, res) {
	var fileRootName = req.body.name.split('.').shift(),
    fileExtension = req.body.name.split('.').pop(),
    filePathBase = './uploads' + '/',
    fileRootNameWithBase = filePathBase + fileRootName,
    filePath = fileRootNameWithBase + '.' + fileExtension,
    fileID = 2,
    fileBuffer;
	
    while (fs.existsSync(filePath)) {
        filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
        fileID += 1;
    }
    
    var file = fs.createWriteStream(filePath);
    console.log("From Dropbox "+ file);
    console.log("Writing file contents to buffer");
    console.log("Contents "+req.body.contents)
    var request = http.get(req.body.contents, function(response) {
      response.pipe(file);
    });
    res.sendStatus(200);
});

app.get('/convertStream', function(req, res) {
    console.log("Converting file destination to stream");
    console.log(req.query.filePath);
    console.log(req.query.contents+'&export=download');
	var file = fs.createWriteStream(req.query.filePath);
	download(req.query.contents+'&export=download');
	var request = http.get(req.query.contents+'&export=download', function(response) {
	      response.pipe(file);
	});
	res.sendStatus(200);
});

function download(url) {
	  var data = "";
	  var request = http.get(url, function(res) {

	    res.on('data', function(chunk) {
	      data += chunk;
	    });

	    res.on('end', function() {
	      console.log(data);
	    })
	  });

	  request.on('error', function(e) {
	    console.log("Got error: " + e.message);
	  });
}

app.post('/getUserInfo', function(req, res) {
	console.log(req.body.search);
	var email = req.body.search;
	userModel.findOne({
		email : req.body.search
	}, function(err, result) {
		if(result) {
			MongoClient.connect(mongodbUrl, function(err, db) {
				db.collection('fs.files')
				  .find({ "metadata.email" : email})
				  .toArray(function(err, files) {
				    if (err) {
				    	console.log("ERROR "+err);
				    	throw err;
				    }
				    files.forEach(function(file) {
				      
				    	  var gridStore = new GridStore(db, file.filename,"r");
						  gridStore.open(function(err, gridStore) {
							var stream = gridStore.stream(true);
						    gridStore.read(function(err, dataURL) {
						    	console.log("Stream reading..");
						    	res.send(dataURL);
						   });
						   stream.on("end", function(err) {
						       db.close();
						   });
						  });
						  console.log("Finished stream retrieval from MongoDB");
				    });
				  });
			});
		}
	});
});

app.post('/getJobs', function(req, res) {
	console.log(req.body.search);
	if(req.body.search != undefined) {
	var query = req.body.search ? {
		title : {$regex: req.body.search,$options:"$i"}
	} : {
		title : {$regex: req.body.search,$options:"$i"}
	}
	jobInfoModel.find(query).exec(function(err, result) {
		res.send(result);
	})
	} else {
	jobInfoModel.find().exec(function(err, result) {
		res.send(result);
	})
	}
});

app.post('/getJobInfo', function(req, res) {
	console.log(req.body.search);
	jobInfoModel.findOne({
		jobID : req.body.search
	}, function(err, result) {
		res.send(result);
	});
});

app.post('/getJobLocList', function(req, res) {
	jobInfoModel.find().exec(function(err, result) {
		res.send(result);
	});
});

app.get('/getJobMaxNumber', function(req, res) {
	console.log("getMaxNumber");
	jobInfoModel.find().sort({"maxNumber":-1}).limit(1).exec(function(err, result) {
		res.send(result);
	})
});

app.post('/addJobDet', function(req, res) {
	var jobInfoRecord = new jobInfoModel(req.body);
	jobInfoRecord.save(function(err, result) {
		if (err) {
			res.send('error')
		} else {
			res.send(result)
		}
	})
});

//User Forgot Password functionality.
app.post('/forgot', function(req, res) {
	      crypto.randomBytes(20, function(err, buf) {
	        token = buf.toString('hex');
	        console.log("token "+token);
	    	userModel.findOne({ email: req.body.email }, function(err, user) {
	        if (!user) {
	          console.log('No account with that email address exists.');
	          return res.send('NotFound');
	        }
	        userModel.update({
				email : req.body.email
			}, {
				resetPasswordToken : token,
				resetPasswordExpires : Date.now() + 3600000
			}, false, function(err) {
				res.send(err);
			})
			//Send forgot password email
			var smtpTransport = mailer.createTransport(emailTransport, {
		        service: 'Gmail',
		        auth: {
		          user: serviceUser,
		          pass: servicePasswd
		        }
		      });
		      var data = {
				  url: "http://"+req.headers.host+"/reset/"+token+"/U",
				  name: user.firstName
			  }
		      var mailOptions = {
		        to: req.body.email,
		        from: emailFrom,
		        subject: pwdResetSubject,
		        html: renderTemplate(resetPwdTemplate,data)
		      };
		      smtpTransport.sendMail(mailOptions, function(err,response) {
		        if (err) {
					console.log(err);
					res.send(err);
				 } else {
					console.log('An e-mail has been sent to ' + req.body.email + ' with further instructions.');
					console.log("Message sent: " + response.message);
				 }
		    	 smtpTransport.close();
		    	 //res.send("success");
		      });
	      });
	   });
	});

//Employer Forgot Password functionality.
app.post('/empForgot', function(req, res) {
	    if(req.body.type == "Pass") {
	      crypto.randomBytes(20, function(err, buf) {
	        token = buf.toString('hex');
	        console.log("token "+token);
	    	empModel.findOne({ email: req.body.email }, function(err, user) {
	        if (!user) {
	          console.log('No account with that email address exists.');
	          return res.send('NotFound');
	        }
	        empModel.update({
				email : req.body.email
			}, {
				resetPasswordToken : token,
				resetPasswordExpires : Date.now() + 3600000
			}, false, function(err) {
				res.send(err);
			})
			//Send forgot password email
			var smtpTransport = mailer.createTransport(emailTransport, {
		        service: 'Gmail',
		        auth: {
		          user: serviceUser,
		          pass: servicePasswd
		        }
		      });
		      var data = {
				  url: "http://"+req.headers.host+"/reset/"+token+"/E",
				  name: user.firstName
			  }
		      var mailOptions = {
		        to: req.body.email,
		        from: emailFrom,
		        subject: pwdResetSubject,
		        html: renderTemplate(resetPwdTemplate,data)
		      };
		      smtpTransport.sendMail(mailOptions, function(err,response) {
		        if (err) {
					console.log(err);
					res.send(err);
				 } else {
					console.log('An e-mail has been sent to ' + req.body.email + ' with further instructions.');
					console.log("Message sent: " + response.message);
				 }
		    	 smtpTransport.close();
		    	 //res.send("success");
		      });
	      });
	   });
	  } else if (req.body.type == "EmpID") {
		  console.log("EmpUniqueID reset");
		  empModel.findOne({ email: req.body.email }, function(err, user) {
	        if (!user) {
	          console.log('No account with that email address exists.');
	          return res.send('NotFound');
	        }
			//Send forgot uniqueEmpID email
			var smtpTransport = mailer.createTransport(emailTransport, {
		        service: 'Gmail',
		        auth: {
		          user: serviceUser,
		          pass: servicePasswd
		        }
		      });
		      var data = {
		    	  url: "http://"+req.headers.host+"/empSignIn",
		    	  ID: user.empUniqueID,
				  name: user.firstName
			  }
		      var mailOptions = {
		        to: req.body.email,
		        from: emailFrom,
		        subject: forgotUniqueIDSubject,
		        html: renderTemplate(forgotUniqueIDTemplate,data)
		      };
		      smtpTransport.sendMail(mailOptions, function(err,response) {
		        if (err) {
					console.log(err);
					res.send(err);
				 } else {
					console.log('An e-mail has been sent to ' + req.body.email + ' with further instructions.');
					console.log("Message sent: " + response.message);
				 }
		    	 smtpTransport.close();
		    	 //res.send("success");
		      });
	      });
		  res.send("success");
	  }
	});

app.get('/reset/:token/:userType', function(req, res) {
	if(req.params.userType == "E") {
		empModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires : { $gt: new Date() } }, function(err, user) {
		    if (!user) {
		      console.log('Employer Password reset token is invalid or has expired.');
		      return res.send('Password reset URL is invalid or has expired.');
		    }
		 res.redirect('/reset?token='+req.params.token+'&userType='+req.params.userType);
		});
	} else {
		userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires : { $gt: new Date() } }, function(err, user) {
	    if (!user) {
	      console.log('User Password reset token is invalid or has expired.');
	      return res.send('Password reset URL is invalid or has expired.');
	    }
	 res.redirect('/reset?token='+req.params.token+'&userType='+req.params.userType);
	});
	}
});

app.post('/reset', function(req, res) {
	if(req.body.userType == "E") {
		empModel.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires : { $gt: new Date() } }, function(err, user) {
	        if (!user) {
	          console.log('Employer Password reset token is invalid or has expired.');
	          return res.send('Password reset URL is invalid or has expired.');
	        }
	        user.password = req.body.password;
	        user.resetPasswordToken = "";
	        user.resetPasswordExpires = "";
	        empModel.update({
				email : user.email
			}, {
				password : encrypt(user.password),
				resetPasswordToken : user.resetPasswordToken,
				resetPasswordExpires : user.resetPasswordExpires
			}, false, function(err) {
				if(err) res.send(err);
				else console.log('Success! Your password has been changed.');
			})
			//Send email after succeesful password reset.
			var smtpTransport = mailer.createTransport(emailTransport, {
		        service: 'Gmail',
		        auth: {
		          user: serviceUser,
		          pass: servicePasswd
		        }
		      });
		      var data = {
		    		  email: user.email,
					  password: req.body.password,
					  name: user.firstName,
					  url: "http://"+req.headers.host+"/empSignIn"
		      }
		      var mailOptions = {
		        to: user.email,
		        from: emailFrom,
		        subject: resetConfirmSubject,
		        html: renderTemplate(resetConfirmTemplate,data)
		      };
		      smtpTransport.sendMail(mailOptions, function(err,response) {
		    	 if (err) {
					console.log(err);
					res.send(err);
				 } else {
					console.log("Message sent: " + response.message);
				 }
		    	 smtpTransport.close();
		    	 res.send("success");
		      });
	      });
	} else {
	userModel.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires : { $gt: new Date() } }, function(err, user) {
        if (!user) {
          console.log('User Password reset token is invalid or has expired.');
          return res.send('Password reset URL is invalid or has expired.');
        }
        user.password = req.body.password;
        user.resetPasswordToken = "";
        user.resetPasswordExpires = "";
        userModel.update({
			email : user.email
		}, {
			password : encrypt(user.password),
			resetPasswordToken : user.resetPasswordToken,
			resetPasswordExpires : user.resetPasswordExpires
		}, false, function(err) {
			if(err) res.send(err);
			else console.log('Success! Your password has been changed.');
		})
		//Send email after succeesful password reset.
		var smtpTransport = mailer.createTransport(emailTransport, {
	        service: 'Gmail',
	        auth: {
	          user: serviceUser,
	          pass: servicePasswd
	        }
	      });
	      var data = {
	    		  email: user.email,
				  password: req.body.password,
				  name: user.firstName,
				  url: "http://"+req.headers.host+"/login"
	      }
	      var mailOptions = {
	        to: user.email,
	        from: emailFrom,
	        subject: resetConfirmSubject,
	        html: renderTemplate(resetConfirmTemplate,data)
	      };
	      smtpTransport.sendMail(mailOptions, function(err,response) {
	    	 if (err) {
				console.log(err);
				res.send(err);
			 } else {
				console.log("Message sent: " + response.message);
			 }
	    	 smtpTransport.close();
	    	 res.send("success");
	      });
      });
	}
});
//End Forgot Password functionality here.

//Change password fields are moved from Profile and added part of new Screen (Change Password).
app.post('/changePasswd', function (req, res) {
	userModel.find({email:req.body.email, password:encrypt(req.body.oldPassword)}, function (err, result) {
        if (result && result.length != 0) {
            userModel.update({email:req.body.email},{$set:{password:encrypt(req.body.password2)}},false,function (err, num){
                if (num.ok == 1){
                	console.log('success');
                	//send email after successful registration.
    				var smtpTransport = mailer.createTransport(emailTransport, {
    					service : "Gmail",
    					auth : {
    						user : serviceUser,
    						pass : servicePasswd
    					}
    				});
    				var data = {
    			            password: req.body.password2,
    			            name: result.firstName,
    			            url: "http://"+req.headers.host+"/login"
    			            
    				}
    				var mail = {
    					from : emailFrom,
    					to : req.body.email,
    					subject : emailChangePwdSubject,
    					html: renderTemplate(chgPwdTemplate,data)
    				}

    				smtpTransport.sendMail(mail, function(error, response) {
    					if (error) {
    						console.log(error);
    					} else {
    						console.log("Message sent: " + response.message);
    					}
    				   smtpTransport.close();
    				});
    			    //End email communication here.
                    res.send('success')
                } else {
                	console.log('error');
                    res.send('error')
                }
            })
        } else {
            res.send('incorrect')
        }
    })
});

app.all('/*', function(req, res, next) {
	// Just send the index.html for other files to support HTML5Mode
	res.sendFile('index.html', {
		root : __dirname + "/views"
	});
});

app.listen(process.env.PORT || 1337,function() {
	console.log('Node server started : http://127.0.0.1:' + port + '/');
});
