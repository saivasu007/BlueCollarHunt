/*
 * @date : 10/08/2016
 * @author : Srinivas Thungathurti
 * @description : Created for Capstone Project Blue Collar Hunt
 */
var app = angular.module('blueCollarApp', ['ngRoute', 'toggle-switch','ui.bootstrap','ngAutocomplete','angularFileUpload','ngImageInputWithPreview','ngFlash']);


app.directive("ngFileSelect",function(){
	  return {
	    link: function($scope,el){
	      
	      el.bind("change", function(e){
	        $scope.file = (e.srcElement || e.target).files[0];
	        $scope.getFile();
	      })
	    }
	  }
});

app.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);

app.controller('indexCtrl', function($scope, ObserverService, $location, $anchorScroll) {
	$scope.gototop = function() {
		$location.hash('top');
		$anchorScroll();
	};
});

app.controller('registerCtrl', function($q, $scope, $location, $rootScope, $http,Flash) {
	$scope.error = false;
	$scope.checkEmail = false;
	$scope.passwordErr = false;
    $scope.usernameErr = false;
    $scope.passwordShort = false;
    $scope.isSocial = true;
    var socialYN = "Y";

	$scope.user = {
		email:'',
		firstName:'',
		lastName:'',
		passwd1:'',
		passwd2:'',
		zipcode:'',
		image:'',
		socialYN:'Y',
		userType:'U'
	};
	
	if($scope.emp == undefined || $scope.emp == "") {
		$scope.emp = {
			email:"",
			name:"",
			contactNum:"",
			address1:"",
			passwd2:"",
			passwd1:"",
			userType:"E",
			amount:""
		};
	}

	$scope.verify = function () {

		if ($scope.user.passwd1 !== $scope.user.passwd2) {
			$scope.error = true;
			$scope.myClass = "has-error";
		}
		else {
			$scope.error = false;
			$scope.myClass = "";
		}

	};
	
	$scope.clear = function () {
        if(confirm("Are you sure to clear the form?")) { 
        	$scope.user = {}
        	$("#profPic").val('');
        	$("#profPicDisplay").hide();
        	$scope.noImage = true;
        }
    };
    
    $scope.empClear = function () {
        if(confirm("Are you sure to clear the form?")) { 
        	$scope.emp = {}
        	$scope.selectedState = "";
        	$("#cardInfo").hide();
        }
    };
    
    //listen to keypress on first and last name input boxes.
    $('#fName, #lName').keypress(function(key) {
        //prevent user from input non-letter chars.
        if((key.charCode < 97 || key.charCode > 122) && (key.charCode < 65 || key.charCode > 90)
            && ($.inArray(key.charCode, [0, 8, 16, 20, 45, 46]))) {
            //show a tooltip to let user know why the keystroke is not working.
            $('[data-toggle="tooltip"]').tooltip('show');
            return false;
        } else {
            $('[data-toggle="tooltip"]').tooltip('hide');
        }
    });
    
    $('#zip').keypress(function(key) {
    	var re = /^(\d{5}-\d{4}|\d{5})$/;
    	if(((key.charCode < 48 && key.charCode != 45) || key.charCode > 57) && ($.inArray(key.charCode, [0, 8, 16, 20, 46]))) {
	            //show a tooltip to let user know why the keystroke is not working.
	    		$('[data-toggle="tooltip2"]').tooltip('show');
	            return false;
	    } else {
	        	$('[data-toggle="tooltip2"]').tooltip('hide');
	        	if($scope.user.zipcode != "") {
	        		$scope.zipCodeErr = !re.test($scope.user.zipcode);
	        	} else {
	        		$scope.zipCodeErr = false;
	        	}
	    }
    });
    
    $('#city').keypress(function(key) {
        //prevent user from input non-letter chars.
        if(((key.charCode < 97 && key.charCode != 32) || key.charCode > 122) && (key.charCode < 65 || key.charCode > 90)
            && ($.inArray(key.charCode, [0, 8, 16, 20, 45, 46]))) {
            //show a tooltip to let user know why the keystroke is not working.
            $('[data-toggle="tooltip3"]').tooltip('show');
            return false;
        } else {
            $('[data-toggle="tooltip3"]').tooltip('hide');
        }
    });
    

   //regex to test the email pattern, gets invoked after the blur event of email input.
    $scope.testUsername = function () {
        var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if($scope.user.email != "") {
           $scope.usernameErr = !re.test($scope.user.email);
        } else {
           $scope.usernameErr = false;
        }
    };
    
    $scope.testBirthDate = function () {
        var re = /^(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/]\d{4}$/;
        $scope.birthDateErr = !re.test($scope.user.birthDate);
        console.log($scope.user.birthDate);
    };

    //test on the length of first password.
    $scope.testPassword = function () {
        $scope.passwordShort = $scope.user.passwd1.length <= 5
    };

    //test if both passwords match.
    $scope.testPassword2 = function () {
        $scope.passwordErr = ($scope.user.passwd1 != $scope.user.passwd2);
    };

	$scope.test = function(obj) {
		var re=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		// /^\w+@[a-z0-9]+\.[a-z]+$/i;
		if(re.test(obj)) {
			$scope.checkEmail = false;
			$scope.error = false;
		}
		else {
			$scope.checkEmail = true;
			$scope.error = true;
		}
	};
	
	$scope.ClearMessages = function(flash) {
		$scope.errorMsg = false;
		Flash.clear();
	}

	if($scope.user.image == "") $scope.noImage = true;
	else $scope.noImage = false;
	
	$scope.profPicChange = function() {
		$("#profPicDisplay").show();
	}
	
	$scope.hidePassPol = function() {
		$("#PassPolicy").hide();
	}
	$scope.hidePassPol();
	$scope.showPassPol = function() {
		$("#PassPolicy").show();
	}
	
	$scope.changeStatus = function() {
		if(document.getElementById('socialFlag').checked == true) {
			isSocial = true;
			socialYN = "Y";
		} else {
			isSocial = false;
			socialYN = "N";
		}
	}
	
	$scope.register = function (user){
		
		if ($scope.user.email == "" || $scope.user.firstName == "" || $scope.user.lastName == "" || $scope.user.passwd1 == "" || $scope.user.passwd2 == "" || $scope.user.zipcode == "" || $scope.user.skill == "" || $scope.user.image == undefined) {
			$scope.errorMsg = true;
			Flash.create('Info', "Please fill in all the blanks.",0, {class: 'alert-info', id: 'custom-id'}, true);
		}
		else {
			$scope.user.password = $scope.user.passwd1;
			$scope.user.imageContents = $scope.user.image.src;
			$scope.user.imageContentType = $scope.user.image.src.substring(5,15);
			$scope.user.imageName = document.getElementById("profPic").value;
			$scope.user.socialYN = socialYN;
			$scope.user.userType = "U";
			$scope.user.activeIn = "Y";
			$scope.user.role = "user";
			$http.post('/register', user).success(function (response) {
				if (response != "0") {
					alert("Success! Please login with your registered email \"" + user.email + "\" and password you created.");
					//$rootScope.currentUser = undefined;
					//$scope.user = undefined;				
					$scope.logout();
				} else {
					alert("Sorry, the account \"" + user.email + "\" has already been registered! Please create a new one.")
				}
			})
		}
	};
	
	$scope.empRegister = function(emp) {
		if ($scope.emp.email == "" || $scope.emp.name == "" || $scope.emp.contactNum == "" || $scope.emp.address1 == "" || $scope.emp.passwd2 == "" || $scope.emp.passwd1 == "" || $scope.emp.amount == undefined) {
			$scope.errorMsg = true;
			Flash.create('Warning', "Please fill in all the blanks.",0, {class: 'alert-warning', id: 'custom-id'}, true);
		} else if($scope.emp.passwd1 != $scope.emp.passwd2) {
			$scope.errorMsg = true;
			Flash.create('Warning', "Passwords doesn't match!.",0, {class: 'alert-warning', id: 'custom-id'}, true);
		} else {
		//For Stripe card transactions.
		var amount = emp.amount;
		$scope.emp.password = $scope.emp.passwd1;
		if(amount > 0) {
		Stripe.setPublishableKey('pk_test_obXvmdYNSzC5Ou0vL9x9sI6Q');
		var saveCardInfo = emp.saveCC;
		if(saveCardInfo == true) saveCardInfo = "Y";
		if(emp.passwd1 == emp.passwd2) emp.password = emp.passwd1;
		var cardMM = emp.cardExpiry.substring(0,2);
		var cardYYYY = emp.cardExpiry.substring(5,9);
		Stripe.card.createToken({
		    number: emp.cardNumber,
		    cvc: emp.cvc,
		    exp_month: cardMM,
		    exp_year: cardYYYY
		  }, amount, function(status,response) {
			  emp.stripeToken = response.id;
				var empData = {
						email: emp.email,
						uid: emp.uid,
						password: emp.password,
						empUniqueID : emp.name.substring(0,4),
						contactNum: emp.contactNum,
						name: emp.name,
						address: emp.address1,
						activeIn: emp.activeIn,
						expiryDate: emp.expiryDate,
						subscriber: emp.subscriber,
						userType: "E",
						saveCC: saveCardInfo,
						card:{
							uid: emp.uid,
							cardNumber: emp.cardNumber,
							cardMM: cardMM,
							cardYYYY: cardYYYY,
							cardName: emp.cardName,
							cvc: emp.cvc,
							lastUpdated: moment(new Date()).format('MM/DD/YYYY, h:mm:ss a')
						}
				}
				$http.post('/plans/bluecollarhunt_dev', empData).success(function (resp) {
					if (resp != "0") {
						alert("Success! Please check your registered email for UniqueID.");					
						$location.path('/empSignIn');
					} else {
						alert("Ooops, there is a issue and Please try again!!")
					}
				}).error(function (err) {
					alert("ERROR: "+err.message);
				});
				//return;
		  });
		} else {
				var empData = {
					email: emp.email,
					uid: emp.uid,
					password: emp.password,
					empUniqueID : emp.name.substring(0,4),
					contactNum: emp.contactNum,
					name: emp.name,
					address: emp.address1,
					activeIn: emp.activeIn,
					expiryDate: emp.expiryDate,
					subscriber: emp.subscriber,
					userType: "E",
					saveCC: "NA"
				}
				$http.post('/empFreeRegister', empData).success(function (resp) {
					if (resp != "0") {
						alert("Success! Please check your registered email for UniqueID.");
						$rootScope.currentUser = null;					
						$location.path('/empSignIn');
					} else if(resp == "0"){
						alert("Employer "+emp.email+" already registered in the portal.");
					} else {
						alert("Ooops, there is an issue and Please try again!!");
					}
				}).error(function (err) {
					alert("ERROR: "+err.message);
				});
		}
	  }
	}
	
	$("#cardInfo").hide();
	
	$scope.formatCC = function() {
		var input = document.getElementById('cardNum');
		payform.cardNumberInput(input);
	}
	
	$scope.formatExpiry = function() {
		var input = document.getElementById('expiry');
		payform.expiryInput(input);
	}
	
	$scope.formatCVC = function() {
		var input = document.getElementById('cvc');
		payform.cvcInput(input);
	}
	
	$scope.disableCardInfo = function(emp) {
		if(emp.amount > 0) $("#cardInfo").show();
		else $("#cardInfo").hide();
	}
	
	$scope.formatContactNum = function(obj) {
		var numbers = obj.replace(/\D/g, ''),
        char = {0:'(',3:') ',6:' - '};
		obj = '';
		for (var i = 0; i < numbers.length; i++) {
			obj += (char[i]||'') + numbers[i];
		}
		$scope.emp.contactNum = obj;	
	}

	$scope.getFile = function () {
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
       });
    };
    
    $scope.logout = function () {
		$http.post('/logout',$rootScope.user).success(function () {
			$location.url('/login');
			$rootScope.currentUser = undefined;
			$rootScope.user = undefined;
		})
	};
});

app.controller('landingCtrl', function ($scope, $rootScope, $http, $routeParams, $location) {
	$scope.result1 = '';
    $scope.options1 = null;
    $scope.details1 = '';
    
    $scope.search = function (searchInfo) {
    	if(searchInfo == undefined) {
    		var data = {
        			name : "",
        			location: ""
        	}
    	} else if(searchInfo.search != undefined && searchInfo.location == undefined) {
    		var data = {
        			name : searchInfo.search,
        			location : ""
        	}
    	} else if(searchInfo.search == undefined && searchInfo.location != undefined) {
    		var data = {
        			name : "",
        			location : searchInfo.location
        	}
    	} else if(searchInfo.search != undefined && searchInfo.location != undefined) {
    		var data = {
        			name : searchInfo.search,
        			location : searchInfo.location
        	}
    	}
    	
    	$http.post('/getJobs',data).success(function (response){
			$scope.jobsList = response;
			if($scope.jobsList.length <= 0) {
				$scope.noJobs = true;
				$scope.searchResults = 3;
				$scope.jobResults = 3;
			} else {
				$scope.noJobs = false;
				$scope.searchResults = 1;
			}
			$location.url('/');
		}).error(function (err) {
			console.log(err);
		});
    }
    
    $scope.jobLocList = function () {
    	$http.get('/getJobLocList').success(function (response){
			$scope.jobLocList = response;
			$location.url('/');
		}).error(function (err) {
			console.log(err);
		});
    }
    
    $scope.searchByLoc = function (location) {
    	var data = {
    			search : location
    	}
    	$http.post('/getJobsByLoc',data).success(function (response){
			$scope.jobsList = response;
			if($scope.jobsList.length <= 0) $scope.noJobs = true;
			$scope.noJobs = false;
			$scope.searchResults = 1;
		}).error(function (err) {
			console.log(err);
		});
    }
    
    $scope.getJobInfo = function (jobID) {

		var postData = {
				search: jobID
		}
		$http.post('/getJobInfo',postData).success(function (response) {
			$scope.jobInfo = response;
			$rootScope.jobID = $scope.jobInfo.jobID;
			$scope.jobResults = 2;
			$location.url('/');
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.pressEnter = function (e,jobInfo) {
		if (e.keyCode == 13){
			//$scope.search(jobInfo);
		}
	};
});

app.controller('loginCtrl', function ($scope, $rootScope, $http, $routeParams, $location,Flash) {
	$scope.login = function (user){
		$scope.ClearMessages(Flash);
		if(user == undefined || user == "") { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Username or Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.email == undefined || user.email == "") { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Username.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.password == undefined || user.password == "") { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		}
		$scope.user.userType = "U";
		$http.post('/login', user).success(function (response){
			console.log(response);
			$rootScope.currentUser = response;
			if($rootScope.currentUser.role == "admin") $location.url('/admin');
			else $location.url('/home');
			
		}).error(function (err) {
			if(err == "Unauthorized") {
				$scope.errorMsg = true;
				Flash.create('warning', "Email or password does not match!.",0, {class: 'alert-warning', id: 'custom-id'}, true);
				return;
			} else if(err != "Bad Request") {
				$scope.errorMsg = true;
				Flash.create('Info', "User account disabled in portal.",0, {class: 'alert-info', id: 'custom-id'}, true);
				return;
			} else {
				$scope.errorMsg = true;
				Flash.create('Info', "Please enter valid Username or Password.",0, {class: 'alert-info', id: 'custom-id'}, true);
				return;
			}
		})
	};
	
	//Test on the length of first password.
    $scope.testPasswordLen = function () {
        if($scope.user.password.length <= 5) {
        	$scope.errorMsg = true;
        	Flash.create('warning', "Password must be at least 6 characters.",0, {class: 'alert-warning', id: 'custom-id'}, true);
        	return;
        }
    };
    
	//Test if both passwords match.
    $scope.testPassword = function () {
    	if($scope.user.password2 != "") {
    		if($scope.user.password1 != $scope.user.password2) {
            	$scope.errorMsg = true;
            	Flash.create('warning', "Both Passwords doesn't match",0, {class: 'alert-warning', id: 'custom-id'}, true);
            	return;
            }
    	}
    };
    
    //Validate the email entered is valid.
    $scope.testLoginName = function () {
        var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if($scope.user.email == undefined) $scope.user.email="";
        if($scope.user.email != "") {
           $scope.loginEmailErr = !re.test($scope.user.email);
           $scope.ClearMessages(Flash);
           if($scope.loginEmailErr) {
        	   $scope.errorMsg = true;
           		Flash.create('warning', "Invalid email address format.",0, {class: 'alert-warning', id: 'custom-id'}, true);
           		return;
           }
        }
    };

    
    if($scope.email == undefined) $scope.disable = true;

	$scope.testEmail = function() {
			var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if($scope.email != "" || $scope.email != undefined) {
				$scope.emailErr = !re.test($scope.email);
				if($scope.emailErr) {
					$scope.errorMsg = true;
					Flash.create('warning', "Please enter valid email format",0, {class: 'alert-warning', id: 'custom-id'}, true);
					return;
				}
			}
	};
	
	$scope.forgot = function (emailID){
		$scope.ClearMessages(Flash);
		if(emailID == undefined || emailID == "") { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Username or Email.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else {
			$scope.testEmail();
		}
		if(!$scope.emailErr) {
		var postData = {
			email: emailID
		}
		$http.post('/forgot', postData).success(function (response){
			if(response == "NotFound") {
				alert("Email ID not registered in Blue Collar Hunt Portal.");
				return;
			} else {
				alert("Please check the registered email for instructions.");
				$location.url('/login');
			}
		}).error(function (err) {
			if(err == "NotFound" ) {
				alert("Email ID not registered in Blue Collar Hunt Portal.");
			} else {
				alert(err);
			}
		})
	  }
	};
	
	$scope.pwReset = function (user){
		$scope.ClearMessages(Flash);
		if(user == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter New Password and Repeat Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.password1 == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter New Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.password2 == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Repeat Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.password1 != user.password2) { 
			$scope.errorMsg = true;
			Flash.create('warning', "New Password and Repeat Password doesn't match.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		}
		var postData = {
				password: user.password1,
				token: $routeParams.token,
				userType: $routeParams.userType
		}
		$http.post('/reset', postData).success(function (response){
			console.log(response);
			alert("Password Updated Successfully.");
			$location.url('/login');
		}).error(function (err) {
			if(err) {
				alert("Error while updating password.Please try again!.");
			}
		})
	};
	
	$scope.actUserAccount = function (user){
		$scope.ClearMessages(Flash);
		if(user == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter all the fields.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.email == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter username or email.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.handle == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Secret handle.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		}
		var postData = {
				email: user.email,
				activateHandle: user.handle,
				activeIn: "Y"
		}
		$http.post('/activateUser', postData).success(function (response){
			if(response == "Not Valid") {
				$scope.errorMsg = true;
				Flash.create('warning', "User not registered or still active in Portal.",0, {class: 'alert-warning', id: 'custom-id'}, true);
				return;
			}
			alert("User Account Activated. Please follow the instructions sent to your email");
			$location.url('/login');
		}).error(function (err) {
			if(err) {
				alert("Not a valid user information");
			}
		})
	};
	
	$scope.ClearMessages = function(flash) {
		$scope.errorMsg = false;
		Flash.clear();
	}

	$scope.pressEnter = function (e,user) {
		if (e.keyCode == 13){
			$scope.login(user);
		}
	};
	
	$scope.logout = function () {
		$http.post('/logout',$rootScope.user).success(function () {
			$location.url('/login');
			$rootScope.currentUser = undefined;
			$scope.user = undefined;
		})
	};
});

app.controller('empLoginCtrl', function ($scope, $rootScope, $http, $routeParams, $location,Flash) {
	
	$scope.empLogin = function (user){
		$scope.ClearMessages(Flash);
		if(user == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter all the required information.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.email == undefined && user.password != undefined && user.empUniqueID != undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Employer Email.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.email != undefined && user.password == undefined && user.empUniqueID != undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.email != undefined && user.password != undefined && user.empUniqueID == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Emp Unique ID.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.email != undefined && user.password == undefined && user.empUniqueID == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Password & Emp Unique ID.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.email == undefined && user.password != undefined && user.empUniqueID == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Employer Email & Emp Unique ID.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(user.email == undefined && user.password == undefined && user.empUniqueID != undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Employer Email & Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		}
		
		$scope.user.userType = "E";
		$http.post('/empSignIn', user).success(function (response){
			$rootScope.currentUser = response;
			$scope.user = response;
			$location.url('/empHome');
		}).error(function (err) {
			if(err == "Unauthorized") {
				$scope.errorMsg = true;
				Flash.create("warning","Email or password does not match! Please login again.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			} else if(err != "Bad Request") {
				$scope.errorMsg = true;
				Flash.create("warning","User Subscription expired in Blue Collar Hunt Portal."+"\n"+"      	    Please contact administrator.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			} else {
				$scope.errorMsg = true;
				Flash.create("warning","Please enter Username or Password or Unique Employer ID.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			}
		})
	};
	
	$scope.ClearMessages = function(flash) {
		$scope.errorMsg = false;
		Flash.clear();
	}
	
	//Test on the length of first password.
    $scope.testPasswordLen = function () {
        $scope.passwordShort = $scope.user.password1.length <= 5
    };
    
	//Test if both passwords match.
    $scope.testPassword = function () {
    	if($scope.user.password2 != "") {
           $scope.passwordErr = ($scope.user.password1 != $scope.user.password2);
    	}
    };
    
    //Validate the email entered is valid.
    $scope.testLoginName = function () {
        var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if($scope.user.email != "") {
           $scope.loginEmailErr = !re.test($scope.user.email);
        } else {
           $scope.loginEmailErr = false;
        }
    };

    //test on the length of the password entered.
    $scope.testPassword = function () {
        $scope.passwordShort = $scope.user.password.length <= 5
    };
    
    if($scope.email == undefined) $scope.disable = true;

    $scope.testEmail = function(emlID) {
		var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		$scope.emailErr = !re.test(emlID);
		if($scope.emailErr) {
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter valid email format",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		}
    };
	
	$scope.forgot = function (emailID){
		var postData = {
			email: emailID
		}
		$http.post('/forgot', postData).success(function (response){
			console.log(response);
			alert("Please check the registered email for instructions.");
			$location.url('/login');
		}).error(function (err) {
			if(err = "NotFound" ) {
				alert("Email ID not registered in Blue Collar Hunt Portal.");
			}
		})
	};
	
	$scope.empForgot = function (emp){
		
		if(emp == undefined || emp == "") { 
			$scope.errorMsg = true;
			Flash.create('warning', "Enter the required information.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(emp.recoveryType == undefined || emp.recoveryType == "") { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter recovery category.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(emp.email == undefined || emp.email == "") { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter employer Email ID.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else {
			$scope.testEmail(emp.email);
		}
		
		if(!$scope.emailErr){
			var postData = {
				email: emp.email,
				type: emp.recoveryType
			}
			$http.post('/empForgot', postData).success(function (response){
			   if(response == "NotFound") {
					$scope.errorMsg = true;
					Flash.create('warning', "Email not registered in Blue Collar.",0, {class: 'alert-warning', id: 'custom-id'}, true);
					return;
				} else {
					alert("Please check the registered email for instructions.");
					$location.url('/empSignIn');
				}
			}).error(function (err) {
				if(err == "NotFound" ) {
					alert("Email ID not registered in Blue Collar Hunt Portal.");
				} else {
					alert(err);
				}
			})
		}
	};
	
	$scope.pwReset = function (user){
		var postData = {
				password: user.password1,
				token: $routeParams.token
		}
		$http.post('/reset', postData).success(function (response){
			console.log(response);
			alert("Password Updated Successfully.");
			$location.url('/login');
		}).error(function (err) {
			if(err) {
				alert("Error while updating password.Please try again!.");
			}
		})
	};

	$scope.pressEnter = function (e,user) {
		if (e.keyCode == 13){
			$scope.login(user);
		}
	};
});

app.controller('homeCtrl', function ($q, $scope, $rootScope, $http, $location, $interval,FileUploader) {
	$rootScope.wrong = 0;
	$rootScope.report = {type:'',wrong:[]};
	var uploader = $scope.uploader = new FileUploader();
	uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.log('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
    	$scope.progress = "";
    	var ext = fileItem.file.name.substring(fileItem.file.name.indexOf(".")+1);
    	if(ext == "PDF" || ext == "pdf" || ext == "DOC" || ext == "doc" || ext == "DOCX" || ext == "docx") {
    		fileItem.upload();
    	} else {
    		alert("Please upload valid file types i.e PDF/DOC/DOCX");
    		return;
    	}
        console.log('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.log('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.log('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
    	$scope.progress = progress;
        console.log('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
    	$scope.progress = progress;
        console.log('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.log('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.log('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.log('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
    	var postData = {
                name: fileItem.file.name,
                type: fileItem.file.type,
                email: $rootScope.currentUser.email
        };
		
		$http.post('/uploadProfileResume',postData).success(function (response) {
			alert("Upload resume Success");
			$scope.listProfileResume();
			$scope.uploadCV();
		}).error(function (err) {
			if(err) {
				alert("Error while uploading resume and Please try again!.");
			}
		});
        console.log('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.log('onCompleteAll');
    };
    
    $scope.launchFilePicker = function(){
    	('#fileDialog').trigger('click');
    }
    
    $rootScope.isSelected = true;
    
    $scope.formatPhone = function(obj) {
        var numbers = obj.replace(/\D/g, ''),
            char = {0:'(',3:') ',6:' - '};
        obj = '';
        for (var i = 0; i < numbers.length; i++) {
            obj += (char[i]||'') + numbers[i];
        }
        $rootScope.currentUser.contactNum = obj;
    }
    
    $scope.search = function (searchInfo) {
    	if(searchInfo == undefined) {
    		var data = {
        			name : "",
        			location: ""
        	}
    	} else if(searchInfo.search != undefined && searchInfo.location == undefined) {
    		var data = {
        			name : searchInfo.search,
        			location : ""
        	}
    	} else if(searchInfo.search == undefined && searchInfo.location != undefined) {
    		var data = {
        			name : "",
        			location : searchInfo.location
        	}
    	} else if(searchInfo.search != undefined && searchInfo.location != undefined) {
    		var data = {
        			name : searchInfo.search,
        			location : searchInfo.location
        	}
    	}
    	
    	$http.post('/getJobs',data).success(function (response){
			$scope.jobsList = response;
			if($scope.jobsList.length <= 0) {
				$scope.noJobs = true;
				$scope.searchResults = 3;
				$scope.jobResults = 3;
			} else {
				$scope.noJobs = false;
				$scope.searchResults = 1;
			}
			$location.url('/home');
		}).error(function (err) {
			console.log(err);
		});
    }
    
    $scope.jobLocList = function () {
    	$http.get('/getJobLocList').success(function (response){
			$scope.jobLocList = response;
			$location.url('/home');
		}).error(function (err) {
			console.log(err);
		});
    }
    
    $scope.searchByLoc = function (location) {
    	var data = {
    			search : location
    	}
    	$http.post('/getJobsByLoc',data).success(function (response){
			$scope.jobsList = response;
			if($scope.jobsList.length <= 0) $scope.noJobs = true;
			$scope.noJobs = false;
			$scope.searchResults = 1;
			$location.url('/home');
		}).error(function (err) {
			console.log(err);
		});
    }
    
    $scope.getJobInfo = function (jobID) {

		var postData = {
				search: jobID
		}
		$http.post('/getJobInfo',postData).success(function (response) {
			$scope.jobInfo = response;
			$rootScope.jobDetails = $scope.jobInfo;
			$scope.jobResults = 2;
			$location.url('/home');
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.editProfileInfo = function (){
		$scope.search = $rootScope.currentUser.email;
		var postData ={
				search: $scope.search
		};
		$http.post('/getUserInfo',postData).success(function (response) {
			if($rootScope.currentUser.socialYN == "Y") $rootScope.isSocial=true;
			if(response == "NoProfilePic") $rootScope.dataUrl = undefined;
			else $rootScope.dataUrl = response;
			$location.url('/editProfile');
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.getProfilePic = function (){
		$scope.search = $rootScope.currentUser.email;
		var postData ={
				search: $scope.search
		};
		$http.post('/getUserInfo',postData).success(function (response) {
			if(response == "NoProfilePic") $rootScope.dataImgUrl = undefined;
			else $rootScope.dataImgUrl = response;
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.saveProfileInfo = function(cUser) {
		if(document.getElementById("social").checked == true) cUser.socialYN = "Y";
		else cUser.socialYN = "N";
		if(document.getElementById("active").checked == true) {
			if(confirm('Are you sure you want to Deactivate your account?')) {
				var postData = { 
						email : cUser.email,
						activateHandle : cUser.lastName,
						activeIn : "N"
				};
				
				$http.post('/deactivateProfile',postData).success(function (response){
					if (response != 0){
						alert("User Account Deactivated.Sorry and we miss you here.");
						$scope.logout();
					}
				}).error(function (err) {
						console.log(err);
				});
			}
		} else {
			var postData = { 
					firstName : cUser.firstName,
					lastName : cUser.lastName,
					zipcode : cUser.zipcode,
					email : cUser.email,
					socialYN : cUser.socialYN,
					primarySkill : cUser.primarySkill,
					contactNum : cUser.phone,
					gender : cUser.gender
			};
			
			$http.post('/updateUserProfile',postData).success(function (response){
					if (response != 0){
					alert("Success");
					$scope.currentUser.socialYN = cUser.socialYN;
					$location.url('/home');
					} else if (response == 'error') {
						alert('error')
					}
			}).error(function (err) {
					console.log(err);
			});
		}
	 };
	 
	 $scope.deleteAccount = function(cUser) {
			var postData = { 
					email : cUser.email
			};

			if(confirm('Are you sure you want you delete your account?')) {
				$http.post('/deleteAccount',postData).success(function (response){
						if (response != 0){
							alert("Done.Sorry, We miss you here!");
							$scope.logout();
						}
				}).error(function (err) {
						console.log(err);
				});
			}
		};
	

	$scope.logout = function () {
		$http.post('/logout',$rootScope.user).success(function () {
			$location.url('/');
			$rootScope.currentUser = undefined;
			$rootScope.user = undefined;
		})
	};
	
	/* Connect Dropbox for Resume Upload Functionality. */
	
	$scope.dropbox = function() {
		var fileType;
		var options = {
			    // Required. Called when a user selects an item in the Chooser.
			    success: function(files) {
			    	alert(files[0].toSource());
			        if(files[0].name.substring(files[0].name.indexOf(".") == "PDF")) fileType = "application/pdf";
			        else if(files[0].name.substring(files[0].name.indexOf(".") == "DOC")) fileType = "application/msword";
			        else if(files[0].name.substring(files[0].name.indexOf(".") == "DOCX")) fileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
			        var files = {
                        name: files[0].name,
                        type: fileType,
                        contents: files[0].link,
                        email: $scope.currentUser.email
			        };
			        
			        $http.post('/uploadResume',files).success(function (response) {
			        	$location.url('/upload');
			        }).error(function (err) {
			        	if(err) {
			        		alert("Error while uploading file to server and Please try again!.");
			        	}
			        });
			    },

			    // Optional. Called when the user closes the dialog without selecting a file
			    // and does not include any parameters.
			    cancel: function() {

			    },

			    // Optional. "preview" (default) is a preview link to the document for sharing,
			    // "direct" is an expiring link to download the contents of the file. For more
			    // information about link types, see Link types below.
			    linkType: "direct", // or "direct"

			    // Optional. A value of false (default) limits selection to a single file, while
			    // true enables multiple file selection.
			    multiselect: false, // or true

			    // Optional. This is a list of file extensions. If specified, the user will
			    // only be able to select files with these extensions. You may also specify
			    // file types, such as "video" or "images" in the list. For more information,
			    // see File types below. By default, all extensions are allowed.
			    extensions: ['.pdf', '.doc', '.docx'],
			};
		//Make sure the browser support the Dropbox Chooser by checking the compatability.
		if(Dropbox.isBrowserSupported()) {
			Dropbox.choose(options);
		} else {
			var button = Dropbox.createChooseButton(options);
			document.getElementById("dropboxChooser").appendChild(button);
		}
	}
	
	/* Connect Google Drive for Resume Upload Functionality. */
	
	// The Browser API key obtained from the Google API Console.
    // Replace with your own Browser API key, or your own key.
    var developerKey = 'AIzaSyDQGmR4Lvd89tAhrPvnn1OjV2zwECRCDP4';

    // The Client ID obtained from the Google API Console. Replace with your own Client ID.
    var clientId = "8146498752-hdommt7s414bmhlpocl3euaklqsqriel.apps.googleusercontent.com";

    // Replace with your own App ID. (Its the first number in your Client ID)
    var appId = "8146498752";

    // Scope to use to access user's Drive items.
    var scope = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file','https://www.googleapis.com/auth/drive.metadata'];

    var pickerApiLoaded = false;
    var oauthToken;

    // Use the Google API Loader script to load the google.picker script.
    $scope.loadPicker = function() {
      gapi.load('auth', {'callback': $scope.onAuthApiLoad()});
      gapi.load('picker', {'callback': $scope.onPickerApiLoad()});
      gapi.load('client', function() {
    	  
      });
      gapi.client.load('drive', 'v3', function() {
    	 
      });
    }

    $scope.onAuthApiLoad = function() {
      window.gapi.auth.authorize(
          {
            'client_id': clientId,
            'scope': scope,
            'immediate': false
          }, function() {
        	  oauthToken = gapi.auth.getToken().access_token;
        	  pickerApiLoaded = true;
              $scope.createPicker();
          });
    }

    $scope.onPickerApiLoad = function() {
      pickerApiLoaded = true;
    }

    // Create and render a Picker object for searching images.
    $scope.createPicker = function() {
      if (pickerApiLoaded && oauthToken) {
        var view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("image/png,application/pdf,application/msword");
        var picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(appId)
            .setOAuthToken(oauthToken)
            .addView(view)
            .addView(new google.picker.DocsUploadView())
            .setDeveloperKey(developerKey)
            .setCallback(function(data) {
            	      if (data.action == google.picker.Action.PICKED) {
            	        var fileId = data.docs[0].id;
            	        var fileRootName = data.docs[0].name.split('.').shift(),
            	        fileExtension = data.docs[0].name.split('.').pop(),
            	        filePathBase = './uploads' + '/',
            	        fileRootNameWithBase = filePathBase + fileRootName,
            	        filePath = fileRootNameWithBase + '.' + fileExtension;

			        	var restRequest = gapi.client.request({
			                    path: '/drive/v2/files/' + fileId
			            });
			        	restRequest.then(function(resp) {
			        		var fileDownloadUrl = resp.result.webContentLink;
			        		$http.get('/convertStream?filePath='+filePath+'&contents='+fileDownloadUrl).success(function (response) {
	    			        	 alert("Uploaded Successfully!");
	    			        }).error(function (err) {
	    			        	if(err) {
	    			        		alert("Error while uploading file to server and Please try again!.");
	    			        	}
	    			        });
			        		}, function(reason) {
			        		  alert('Error: ' + reason.result.error.message);
			        	});
            	      }
            	    })
            .build();
         picker.setVisible(true);
      }
    }

    // A simple callback implementation.
    $scope.pickerCallback = function(data) {
      if (data.action == google.picker.Action.PICKED) {
        var fileId = data.docs[0].id;
      }
    }
    
    $scope.listProfileResume = function() {
		var postData = {
				email: $rootScope.currentUser.email
		};
		
		$http.post('/getProfileResumes',postData).success(function (response) {
			$rootScope.resumeList = response;
		}).error(function (err) {
			console.log(err);
		});
	}
    
    $scope.deleteResume = function (filename){
		var resInfo = { 
				name:filename
		}
	if(confirm('Are you sure you want you delete this document?')) {
		$http.post('/delResume', resInfo).success(function (response){
			alert("Delete Resume :: Success");
			$scope.listProfileResume();
			$location.url('/upload');
		}).error(function (err) {
			console.log(err);
		})
	  }
    }; 
    
    $scope.uploadCV = function() {
    	$rootScope.isLinkToJob = false;
    	$location.path("/upload");
    }
    
    $scope.uploadAndApply = function() {
    	var postData = { 
        		jobID : $rootScope.jobDetails.jobID,
    			email : $rootScope.currentUser.email
    	};
        
        $http.post('/checkJobPost',postData).success(function (response){
			if (response == "true"){
				alert("You have already applied for this Job.");
				$location.path("/jobHistory");
			} else {
				$rootScope.isLinkToJob = true;
				$location.path("/upload");
			}
		}).error(function (err) {
			console.log(err);
		})
    }
    
    $scope.setResumeID = function(file) {
    	//if($('#resume').prop('checked') == true) alert($('#resume').val());
    	//if(resume.selection == true) $scope.isSelected = false;
    	//else $scope.isSelected = true;
    	$scope.isSelected = false;
    	$rootScope.resumeID = file._id;
    	$rootScope.resumeName = file.filename;
    }
    
    $scope.getJobStatus = function (jobID){
		$scope.search = jobID;
		if(jobID != undefined) {
			var postData ={
					search: $scope.search,
					email: $rootScope.currentUser.email
			};
			$http.post('/getUserJobStatus',postData).success(function (response) {
				if(response == "applied") $rootScope.applyLabel = "APPLIED";
				else if(response == "notYetApplied") $rootScope.applyLabel = "APPLY";
				else $rootScope.applyLabel = "N/A";
			}).error(function (err) {
				console.log(err);
			})
		}
	};
    
    $scope.applyJob = function() {
 
    	var postData = { 
        		jobID : $rootScope.jobDetails.jobID,
        		title : $rootScope.jobDetails.title,
    			employerEmail : $rootScope.jobDetails.employerID,
    			companyName : $rootScope.jobDetails.companyName,
    			email : $rootScope.currentUser.email,
    			filename : $rootScope.resumeName,
    			dateApplied : new Date(),
    			files_id: $rootScope.resumeID,
    			name: $rootScope.currentUser.firstName+" "+$rootScope.currentUser.lastName
    	};
        
        $http.post('/applyJobPosting',postData).success(function (response){
			if (response != 0){
				alert("Job application subimitted successfully.");
				$rootScope.isLinkToJob = false;
				$rootScope.jobDetails = undefined;
				$location.url("/home");
			}
		}).error(function (err) {
			console.log(err);
		})
    }
});

app.controller('empHomeCtrl', function ($q, $scope, $rootScope, $http, $location, $interval) {
	$scope.result1 = '';
	$scope.options1 = null;
	$scope.details1 = '';
	$rootScope.wrong = 0;
	$rootScope.report = {type:'',wrong:[]};
	$scope.isJobQueue = false;
	$scope.currentPage = 1;
	$scope.numPerPage = 10;
	$scope.maxSize = 5;
	var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    , end = begin + $scope.numPerPage;
	
	
	$scope.addJobInfo = function (jobInfo){
		if(document.getElementById("publish").checked == true) jobInfo.activeJob = "Y";
		else jobInfo.activeJob = "N";
		var postData = { 
			title : jobInfo.title,
			location : jobInfo.location,
			employerID : $scope.currentUser.email,
			companyName : $scope.companyName,
			responsibilities : jobInfo.responsibilities,
			requirement : jobInfo.requirement,
			rate : jobInfo.rate,
			jobID : "BCJOB-",
			activeJob : jobInfo.activeJob,
			origPostDate : new Date(),
			salaryType : jobInfo.salaryType
		};
		$http.post('/addJobDet',postData).success(function (response){
			if (response != 0){
				if(!confirm('Post Success.You want to post another job?')) {
					$scope.isJobQueue = true;
					$scope.isPostJob = false;
					$scope.isJobTrack = false;
					$scope.getJobQueue($scope.currentUser.email);
					$location.url('/empHome');
				} else {
					$scope.job.title = "";
					$scope.job.location = "";
					$scope.job.requirement = "";
					$scope.job.responsibilities = "";
					$scope.job.rate = "";
					$scope.job.salaryType = "";
				}
			}
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.displayJobEntry = function (jobInfo){
		$scope.isPostJob = true;
		$scope.isJobQueue = false;
		$scope.isJobTrack = false;
		$scope.isUpdate = false;
		$scope.job = undefined;
		$scope.companyName = $rootScope.currentUser.name;
		//document.getElementById("active").checked = true;
		document.getElementById("publish").checked = true;
		$location.url('/empHome');
	};
	
	$scope.updateJobInfo = function (jobInfo){
		$scope.job = jobInfo;
		$scope.isPostJob = true;
		$scope.isJobQueue = false;
		$scope.isJobTrack = false;
		$scope.isUpdate = true;
		$scope.companyName = $scope.job.companyName;
		if(jobInfo.activeJob == "Y") document.getElementById("publish").checked = true;
		else document.getElementById("publish").checked = false;
		$location.url('/empHome');
	};
	
	$scope.updateDetailJobInfo = function (jobInfo){
		if(jobInfo.activeJob == 1) jobInfo.activeJob = "Y";
		else jobInfo.activeJob = "N";
		var postData = { 
				title : jobInfo.title,
				location : jobInfo.location,
				companyName : $scope.companyName,
				responsibilities : jobInfo.responsibilities,
				requirement : jobInfo.requirement,
				rate : jobInfo.rate,
				activeJob : jobInfo.activeJob,
				salaryType : jobInfo.salaryType,
				jobID : jobInfo.jobID
		};

		$http.post('/updateJobDet',postData).success(function (response){
				if (response != 0){
				alert("Success");
				$scope.isJobQueue = true;
				$scope.isPostJob = false;
				$scope.isJobTrack = false;
				$scope.getJobQueue($scope.currentUser.email);
				$location.url('/empHome');
				} else if (response == 'error') {
					alert('error')
				}
		}).error(function (err) {
				console.log(err);
		})
	};
	
	$scope.getJobQueue = function (emailID){
		if(emailID == undefined) emailID = "NA";
		var postData = { 
				email : emailID
		};
		$http.post('/getEmpJobs',postData).success(function (response){
			if (response != 0){
				$scope.partialJobs = [];
				$scope.allEmpJobs = [];
				$scope.allJobs = response;
				  for(i=0;i<=$scope.allJobs.length-1;i++) {
						$scope.allEmpJobs.push($scope.allJobs[i]);
				  }
				$scope.partialJobs = $scope.allEmpJobs.slice(begin, end);	
				$scope.isJobQueue = true;
				$scope.isPostJob = false;
				$scope.isJobTrack = false;
				$location.url('/empHome');
			} else if (response == "") {
				$scope.allJobs = response;
				$scope.isJobQueue = true;
				$scope.isPostJob = false;
				$scope.isJobTrack = false;
				$location.url('/empHome');
			} else if (response == 'error') {
				alert(err);
			}
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.$watch('currentPage + numPerPage', function() {
	    begin = (($scope.currentPage - 1) * $scope.numPerPage);
	    end = begin + $scope.numPerPage;
	    $scope.partialUsers = $scope.allUsers.slice(begin, end);
	  });
	//End Pagination changes here.
	
	$scope.searchEmpJobs = function (searchInfo){
		if(searchInfo == undefined) searchInfo = "";
		var postData = { 
				title : searchInfo,
				email : $rootScope.currentUser.email,
				relativeSearch : searchInfo.indexOf("BCJOB-") != -1
		};
		$http.post('/getEmpJobs',postData).success(function (response){
			if (response != 0){
				$scope.partialJobs = [];
				$scope.allEmpJobs = [];
				$scope.allJobs = response;
				  for(i=0;i<=$scope.allJobs.length-1;i++) {
						$scope.allEmpJobs.push($scope.allJobs[i]);
				  }
				$scope.partialJobs = $scope.allEmpJobs.slice(begin, end);	
				$scope.isJobQueue = true;
				$scope.isPostJob = false;
				$location.url('/empHome');
			} else if (response == "") {
				$scope.allJobs = response;
				$scope.isJobQueue = true;
				$scope.isPostJob = false;
				$location.url('/empHome');
			} else if (response == 'error') {
				alert(err);
			}
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.getJobTracking = function (emailID){
		
		if(emailID == undefined) emailID = "NA";
		var postData = { 
				email : emailID
		};

		$http.post('/getJobTrackInfo',postData).success(function (response){
			if (response != 0){
				$scope.jobTrackList = response;
				$scope.isJobQueue = false;
				$scope.isPostJob = false;
				$scope.isJobTrack = true;
			} 
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.publish = function (jobID){
		var postData = { 
				activeJob : "Y",
				jobID : jobID
		};

		$http.post('/updatePublishStat',postData).success(function (response){
				console.log("Updated Publish Flag");
				$scope.getJobQueue($scope.currentUser.email);
				if (response == 'error') {
					alert('error')
				}
		}).error(function (err) {
				console.log(err);
		})
	};
	
	$scope.getCandidateList = function (jobID){
		var postData = { 
				jobID : jobID
		};

		$http.post('/getCandidateList',postData).success(function (response){
			if (response != 0){
				$scope.jobSeekerList = response;
				$scope.isJobQueue = false;
				$scope.isPostJob = false;
				$scope.isJobTrack = true;
			} 
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.displayCandidateProfile = function(emailID) {
		$rootScope.candidateEmail = emailID;
		$location.url('reviewProfile');
	}
	
	$scope.unPublish = function (jobID){
		var postData = { 
				activeJob : "N",
				jobID : jobID
		};

		$http.post('/updatePublishStat',postData).success(function (response){
				console.log("Updated Publish Flag");
				$scope.getJobQueue($scope.currentUser.email);
				if (response == 'error') {
					alert('error')
				}
		}).error(function (err) {
				console.log(err);
		})
	};
	
	$scope.delete = function (jobNumber){
		var postData ={
				jobID: jobNumber
		};
		if(confirm('Are you sure you want you delete this job info?')) {
			$http.post('/deleteJobInfo',postData).success(function (response) {
				if (response == 'success'){
					alert("Job removed from the portal successfully.");
					console.log("Job"+ jobNumber +" removed from application");
					$scope.isJobQueue = true;
					$scope.getJobQueue($scope.currentUser.email);
					$location.url('/empHome');
				}
			}).error(function (err) {
				console.log(err);
			})
		}
	};
	
	$scope.jobInfoClear = function () {
        if(confirm("Are you sure to clear the form?")) { 
        	$scope.job = {}
        	//$scope.selectedState = "";
        }
    };
    
    $scope.clear = function () {
    	if($scope.emp.search != undefined) {
	        if(confirm("Are you sure to clear the form?")) { 
	        	$scope.emp.search = "";
	        	$scope.searchEmpJobs();
	        }
    	}
    };

	$scope.logout = function () {
		alert("Logout of application");
		$http.post('/logout',$rootScope.user).success(function () {
			$location.url('/');
			$rootScope.currentUser = undefined;
			$rootScope.user = undefined;
		})
	};
});

app.controller('empProfileCtrl', function ($q, $scope, $rootScope, $http, $location,Flash) {
		
		$http.get('/loggedin').success(function (user) {
				if(user != undefined) {
					$scope.contact = user;
					$scope.contact.name = user.firstName+" "+user.lastName;
				}
		});
		
		$scope.ClearMessages = function(flash) {
			$scope.errorMsg = false;
			Flash.clear();
		}
		
		if($rootScope.currentUser.saveCC == "Y") $rootScope.currentUser.amount = "1999";
		else $rootScope.currentUser.amount = "0";
		
		if($rootScope.currentUser.saveCC == "Y") $("#cardInfo").show();
		else $("#cardInfo").hide();
		
		$scope.saveProfileInfo = function(cUser) {
			
			$scope.ClearMessages(Flash);
			if(cUser == undefined) { 
				$scope.errorMsg = true;
				Flash.create('warning', "Please enter all the required fields.",0, {class: 'alert-warning', id: 'custom-id'}, true);
				return;
			} else if(cUser.name == undefined || cUser.name == "") { 
				$scope.errorMsg = true;
				Flash.create('warning', "Please enter name.",0, {class: 'alert-warning', id: 'custom-id'}, true);
				return;
			} else if(cUser.contactNum == undefined || cUser.contactNum == "") { 
				$scope.errorMsg = true;
				Flash.create('warning', "Please enter Phone Number.",0, {class: 'alert-warning', id: 'custom-id'}, true);
				return;
			} else if(cUser.address == undefined || cUser.address == "") { 
				$scope.errorMsg = true;
				Flash.create('warning', "Please enter Address.",0, {class: 'alert-warning', id: 'custom-id'}, true);
				return;
			} 
			
			var postData = { 
						name : cUser.name,
						contactNum : cUser.contactNum,
						address1 : cUser.address,
						email : cUser.email
			};
				
			$http.post('/updateEmpProfile',postData).success(function (response){
						if (response != 0){
							alert("Success");
							$location.url('/empHome');
						}
			}).error(function (err) {
						console.log(err);
			});
		}
		
		//Candidate Profile review related information.
		$scope.checkCandidateProfileVideo = function (){
	    	$scope.email = $rootScope.candidateEmail;
	    	var postData ={
					email: $scope.email
			};
	    	$http.post('/checkProfileVideoCount',postData).success(function (response) {
				if(response == 'success') $rootScope.showVideo = true;
				else $rootScope.showVideo = false;
			}).error(function (err) {
				console.log(err);
			})
	    }
		
		$scope.candidateProfileInfo = function (){
			$scope.search = $rootScope.candidateEmail;
			var postData ={
					search: $scope.search
			};
			$http.post('/getUserInfo',postData).success(function (response) {
				$rootScope.dataUrl = response;
				$location.url('/reviewProfile');
			}).error(function (err) {
				console.log(err);
			})
		};
		
		$scope.candidateProfileDetails = function (){
			$scope.search = $rootScope.candidateEmail;
			var postData ={
					search: $scope.search
			};
			$http.post('/getUserDetails',postData).success(function (response) {
				$rootScope.candidate = response;
			}).error(function (err) {
				console.log(err);
			})
		};
		
		$scope.getProfileVideo = function() {
			
			var postData = {
					email: $rootScope.candidateEmail
			};
			
			$http.post('/getProfileVideo',postData).success(function (response) {
				if(response == "NoVideo") $rootScope.showVideo = false;
				else {
					$rootScope.videoSrc = response;
					$rootScope.showVideo = true;
				}
			}).error(function (err) {
				alert(err);
				console.log(err);
			});
		}
		
		$scope.listEndorsements = function (){
			$scope.email = $rootScope.candidateEmail;
			var postData ={
					email: $scope.email
			};
			$http.post('/getEndorsements',postData).success(function (response) {
				$scope.endorseList = response;
				//$location.url('/profile#listEndorses');
			}).error(function (err) {
				console.log(err);
			})
		};
		
		$scope.getJobTracking = function (emailID){
			
			if(emailID == undefined) emailID = "NA";
			var postData = { 
					email : emailID
			};

			$http.post('/getJobTrackInfo',postData).success(function (response){
				if (response != 0){
					$rootScope.jobTrackList = response;
					$rootScope.isJobQueue = false;
					$rootScope.isPostJob = false;
					$rootScope.isJobTrack = true;
					$location.url('/empHome')
				} 
			}).error(function (err) {
				console.log(err);
			})
		};
		
		$scope.formatCC = function() {
			var input = document.getElementById('cardNum');
			payform.cardNumberInput(input);
		}
		
		$scope.formatExpiry = function() {
			var input = document.getElementById('expiry');
			payform.expiryInput(input);
		}
		
		$scope.formatCVC = function() {
			var input = document.getElementById('cvc');
			payform.cvcInput(input);
		}
		
		$scope.logout = function () {
			$http.post('/logout',$rootScope.user).success(function () {
				$location.url('/');
				$rootScope.currentUser = undefined;
				$rootScope.user = undefined;
			})
		};
});


app.controller('contactCtrl', function ($q, $scope, $rootScope, $http, $location,Flash) {
		$scope.result1 = '';
		$scope.options1 = null;
		$scope.details1 = '';
			
		/*$http.get('/loggedin').success(function (user) {
				if(user != undefined) {
					$scope.contact = user;
					$scope.contact.name = user.firstName+" "+user.lastName;
				}
		});*/
		if($rootScope.currentUser != undefined) {
			if($rootScope.currentUser.userType == "U") {
					$scope.contact = $rootScope.currentUser;
					$scope.contact.name = $rootScope.currentUser.firstName+" "+$rootScope.currentUser.lastName;
			} else if($rootScope.currentUser.userType == "E") {
				$scope.contact = $rootScope.currentUser;
				$scope.contact.name = $rootScope.currentUser.name.toUpperCase();
			}
		}
		
		$scope.ClearMessages = function(flash) {
			$scope.errorMsg = false;
			Flash.clear();
		}
	    
		$scope.saveMessage = function(contact) {
			if(contact == undefined) { 
				$scope.errorMsg = true;
				Flash.create('warning', "Please enter all the required fields.",0, {class: 'alert-warning', id: 'custom-id'}, true);
				return;
			} else if(contact.name == undefined) { 
				$scope.errorMsg = true;
				Flash.create('warning', "Please enter name.",0, {class: 'alert-warning', id: 'custom-id'}, true);
				return;
			} else if(contact.email == undefined) { 
				$scope.errorMsg = true;
				Flash.create('warning', "Please enter email.",0, {class: 'alert-warning', id: 'custom-id'}, true);
				return;
			} else if(contact.subject == undefined) { 
				$scope.errorMsg = true;
				Flash.create('warning', "Please select subject.",0, {class: 'alert-warning', id: 'custom-id'}, true);
				return;
			} else if(contact.message == undefined) { 
				$scope.errorMsg = true;
				Flash.create('warning', "Please enter message.",0, {class: 'alert-warning', id: 'custom-id'}, true);
				return;
			}
			var postData = { 
					name: contact.name,
					email: contact.email,
					subject: contact.subject,
					message: contact.message,
					msgDate: new Date()
				};
			$http.post('/saveContactMessage',postData).success(function (response){
				if(response == "0") {
				   $scope.errorMsg = true;
				   Flash.create("success","Message sent successfully!",0, {class: 'alert-info', id: 'custom-id'}, true);
				   $scope.contact = "";
				   $location.url('/contact');
				}
			}).error(function (err) {
				console.log(err);
			});
	}
		
		$scope.logout = function () {
			var path = "";
			if($rootScope.currentUser.userType == "E") path = "/empSignIn";
			else path = "/login";
			$http.post('/logout',$rootScope.user).success(function () {				
				$rootScope.currentUser = undefined;
				$rootScope.user = undefined;
				$location.url(path);
			})
		};
		
});


app.controller('profileCtrl', function ($q, $scope, $rootScope, $http, $location, $timeout, FileUploader, Flash) {
	
	/* To enable and disable the Endorse button */
	$scope.isCandidateProfile = false;
	var uploader = $scope.uploader = new FileUploader();
	uploader.onWhenAddingFileFailed = function(item, filter, options) {
        console.log('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
    	$scope.progress = "";
    	var ext = fileItem.file.name.substring(fileItem.file.name.indexOf(".")+1);
    	if(ext == "MP4" || ext == "mp4" || ext == "WMV" || ext == "wmv" || ext == "AVI" || ext == "avi") {
    		fileItem.upload();
    	} else {
    		alert("Please upload valid file types i.e MP4/WMV/AVI");
    		return;
    	}
        console.log('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.log('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.log('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
    	$scope.progress = progress;
        console.log('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
    	$scope.progress = progress;
        console.log('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.log('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.log('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.log('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
    	
    		var postData = {
                    name: fileItem.file.name,
                    type: fileItem.file.type,
                    email: $rootScope.currentUser.email
            };
    		
    		$http.post('/uploadStream',postData).success(function (response) {
    			alert("Upload stream to MongoDB :: Success");
		    	//$rootScope.videoSrc = response;
		    	$rootScope.showVideo = true;
    		}).error(function (err) {
    			if(err) {
    				alert("Error while uploading to MongoDB and Please try again!.");
    			}
    		});
        console.log('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.log('onCompleteAll');
    };
    
    $scope.checkProfileVideo = function (){
    	$scope.email = $rootScope.currentUser.email;
    	var postData ={
				email: $scope.email
		};
    	$http.post('/checkProfileVideoCount',postData).success(function (response) {
			if(response == 'success') $rootScope.showVideo = true;
			else $rootScope.showVideo = false;
		}).error(function (err) {
			console.log(err);
		})
    }
	
	$scope.userInfo = function (){
		$scope.search = $rootScope.currentUser.email;
		var postData ={
				search: $scope.search
		};
		$http.post('/getUserInfo',postData).success(function (response) {
			$rootScope.dataUrl = response;
			$location.url('/profile');
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.changeProfilePic = function() {
		$('#imgupload').trigger('click');
		$scope.user = {
				imageContents : "",
				imageContentType : "",
				imageName : ""
		}
		$('#imgupload').change(function(e){
			var filename = document.getElementById('imgupload').files[0];
			if ( !window.FileReader ) {
				alert( 'FileReader API is not supported by your browser.' );
			}
			var fr = new FileReader();
			fr.readAsDataURL(filename);
			fr.onload = function(e) {
	            $scope.user.imageContents = e.target.result;
	            $scope.user.imageContentType = e.target.result.substring(5,15);
	            $scope.user.imageName = filename.name;
				$scope.user.email = $scope.currentUser.email;
				$scope.user.lastName = $scope.currentUser.lastName;

				
				$http.post('/ClearCurrentProfile',$scope.user).success(function (response) {
	    			if(response != 0) console.log("Current Profile Picture deleted from dataStore.");
	    		}).error(function (err) {
	    			console.log(err);
	    		})
				
				$http.post('/changeProfilePic',$scope.user).success(function (response) {
	    			$rootScope.dataUrl = response;
	    			location.reload();
	    		}).error(function (err) {
	    			console.log(err);
	    		});
	        };
		});
		return false;
	}
	
	$scope.profPicChange = function() {
		alert("Hello");
	}
	
	$scope.getProfileVideo = function() {
		
		var postData = {
				email: $rootScope.currentUser.email
		};
		
		$http.post('/getProfileVideo',postData).success(function (response) {
			if(response == "NoVideo") $rootScope.showVideo = false;
			else {
				$rootScope.videoSrc = response;
				$rootScope.showVideo = true;
			}
		}).error(function (err) {
			alert(err);
			console.log(err);
		});
	}
	
	$scope.editProfileInfo = function (){
		$scope.search = $rootScope.currentUser.email;
		var postData ={
				search: $scope.search
		};
		$http.post('/getUserInfo',postData).success(function (response) {
			if($rootScope.currentUser.socialYN == "Y") $rootScope.isSocial=true;
			if(response == "NoProfilePic") $rootScope.dataUrl = undefined;
			else $rootScope.dataUrl = response;
			$location.url('/editProfile');
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.listEndorsements = function (){
		$scope.email = $rootScope.currentUser.email;
		var postData ={
				email: $scope.email
		};
		$http.post('/getEndorsements',postData).success(function (response) {
			$scope.endorseList = response;
			//$location.url('/profile#listEndorses');
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.listRecoJobs = function (skill){
		$scope.search = skill;
		var postData ={
				search: $scope.search
		};
		$http.post('/getRecoJobs',postData).success(function (response) {
			$scope.recoJobsList = response;
			if($scope.recoJobsList.length <=0) $scope.noJobs = true;
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.getRecoJobInfo = function (jobID) {
		var postData = {
				search: jobID
		}
		$http.post('/getJobInfo',postData).success(function (response) {
			$scope.jobInfo = response;
			//$rootScope.jobsList = response;
			$rootScope.jobInfo = response;
			$rootScope.jobID = $scope.jobInfo.jobID;
			$rootScope.jobResults = 2;
			$rootScope.searchResults = 1;
			$location.url('/home');
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.saveEndorseMsg = function(endorseInfo) {
		
		var saveFlag = "";
		if($rootScope.isAdd == true) saveFlag = "add";
		else if($rootScope.isUpdate == true) saveFlag = "update";
		else saveFlag = "";
		$scope.ClearMessages(Flash);
		if(endorseInfo.message == "" || endorseInfo.message == undefined) {
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Endorse Message.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} 
		
		var postData = {
				email : $rootScope.currentUser.email,
			    fromEmail: "test@test.com",
			    message: endorseInfo.message,
			    origPostDate: new Date(),
			    saveFlag: saveFlag
		};

		$http.post('/saveEndorse',postData).success(function (response){
				if (response != 0){
					alert("Successfully Endorsed!");
				}
		}).error(function (err) {
				console.log(err);
		});
	};
	
	$scope.getEndorseMsg = function() {
		var postData = {
				email : $rootScope.currentUser.email,
			    fromEmail: "test@test.com"//$rootScope.contactUser.email
		};

		$http.post('/getEndorseInfo',postData).success(function (response){
				if (response != "") {
					$scope.endorse = response;
					$rootScope.isUpdate = true;
					$rootScope.isAdd = false;
				} else {
					$rootScope.isAdd = true;
					$rootScope.isUpdate = false;
				}
		}).error(function (err) {
				console.log(err);
		});
	};
	
	/* Autosave for Profile Cover Page Information */
	var secondsToWaitBeforeSave = 2;
	var timeout = null;
	$scope.coverPageInfo = $scope.currentUser.coverPageInfo;
	  
	var saveCoverInfoUpdates = function() {
		var postData = { 
				coverPageInfo : $scope.coverPageInfo,
				email : $rootScope.currentUser.email,
		};
		$http.post('/updateUserCoverpageInfo',postData).success(function (response){
				if (response != 0){
					$rootScope.coverPageInfo = postData.coverPageInfo;
				   console.log("updateUserCoverpageInfo::Updated user cover page information.");
				}
		}).error(function (err) {
				console.log(err);
		});
	};
	
	var autoSaveUpdate = function(newVal, oldVal) {
	    if (newVal != oldVal) {
	      if (timeout) {
	        $timeout.cancel(timeout);
	      }
	      timeout = $timeout(saveCoverInfoUpdates, secondsToWaitBeforeSave * 1000);
	    }
	};
	  
	$scope.$watch('coverPageInfo', autoSaveUpdate);
	/* End Coverpage Information Updates */
	
	$scope.ClearMessages = function(flash) {
		$scope.errorMsg = false;
		Flash.clear();
	}
	
	$scope.logout = function () {
		$http.post('/logout',$rootScope.user).success(function () {
			$location.url('/');
			$rootScope.currentUser = undefined;
			$scope.user = undefined;
		})
	};

	$scope.pressEnter = function (e,user) {
		if (e.keyCode == 13){
			$scope.admin(user);
		}
	};
});

app.controller('socialCtrl', function ($q, $scope, $rootScope, $http, $location,Flash) {
		
$rootScope.reqLabel = "Add Contact";
	
	$http.get('/loggedin').success(function (user) {
			if(user != undefined) {
				$scope.contact = user;
				$scope.contact.name = user.firstName+" "+user.lastName;
			}
	});
	
	$scope.ClearMessages = function(flash) {
		$scope.errorMsg = false;
		Flash.clear();
	}
	
	$scope.currentPage = 1;
	$scope.numPerPage = 10;
	$scope.maxSize = 5;
	var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    , end = begin + $scope.numPerPage;
	
	$scope.searchContacts = function (user){
		if($scope.user != undefined) {
		var postData ={
				email: $scope.user.search,
				currEmail: $rootScope.currentUser.email
		};
		} else {
			var postData ={
					currEmail: $rootScope.currentUser.email
			};
		}
		$http.post('/getUsers',postData).success(function (response) {
			$scope.partialUsers = [];
			$scope.allUsers = [];
			$scope.users = response;
			for(i=0;i<=$scope.users.length-1;i++) {
				$scope.allUsers.push($scope.users[i]);
			}
			$scope.partialUsers = $scope.allUsers.slice(begin, end);
		  if ($scope.users[0] != undefined) {			
			$location.url('/socialContacts');
		  }else {
			console.log("No Users found for your Search.");
		  }
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.$watch('currentPage + numPerPage', function() {
	    begin = (($scope.currentPage - 1) * $scope.numPerPage);
	    end = begin + $scope.numPerPage;
	    $scope.partialUsers = $scope.allUsers.slice(begin, end);
	  });
	//End Pagination changes here.
	
	$scope.sendAddContactReq = function (contact){
		var postData = { 
			email : $rootScope.currentUser.email,
			contactEmail : contact.email,
			contactFName : contact.firstName,
			contactLName : contact.lastName,
			contactZipcode : contact.zipcode,
			contactStatus : "S",
			requestDate : new Date()
		};

		$http.post('/requestAddContact',postData).success(function (response){
			if (response != 0){
			   $rootScope.reqLabel = "Request Sent";
			}
		}).error(function (err) {
			console.log(err);
		})
	};
	/*
	$scope.getAddStatus = function (contactEmail){
		
		var postData ={
				email: contactEmail,
				currEmail: $rootScope.currentUser.email
		};
		
		$http.post('/getUserAddStatus',postData).success(function (response) {
			$scope.contactInfo = response;
			alert($scope.contactInfo.contactStatus);
			if($scope.contactInfo.contactStatus == "S") {
				alert("hi")
				$scope.status = "Pending";
				$scope.disable = true;
			} else if($scope.contactInfo.contactStatus == "A") {
				$scope.status = "Added";
				$scope.disable = true;
			} else {
				alert("noStatus");
				$scope.status = "Add Contact";
				$scope.disable = false;
			}
		}).error(function (err) {
			console.log(err);
		})
	};
	*/
	$scope.listReceivedReqs = function (){
		$scope.email = $rootScope.currentUser.email;
		var postData ={
				email: $scope.email
		};
		$http.post('/getContactRequests',postData).success(function (response) {
			$scope.contactList = response;
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.sendApproval = function (contact){
		var postData = { 
			email : contact.email,
			contactEmail : $rootScope.currentUser.email,
			contactStatus : "A",
			approvedDate : new Date()
		};

		$http.post('/updateContactApproval',postData).success(function (response){
			if (response != 0){
				$scope.approvedStat = "A";
			   console.log("Success");
			}
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.logout = function () {
		$http.post('/logout',$rootScope.user).success(function () {
			$location.url('/');
			$rootScope.currentUser = undefined;
			$rootScope.user = undefined;
		})
	};
});

app.controller('jobsCtrl', function ($q, $scope, $rootScope, $http, $location, Flash) {
	$scope.currentPage = 1;
	$scope.numPerPage = 10;
	$scope.maxSize = 5;
	var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    , end = begin + $scope.numPerPage;
	
	$scope.jobHistory = function(user) {
		var postData = { 
				email : user.email
		};
		
		$http.post('/getAppliedJobs',postData).success(function (response) {
			$scope.partialHist = [];
			$scope.allHist = [];
			$scope.jobsHist = response;
			for(i=0;i<=$scope.jobsHist.length-1;i++) {
				$scope.allHist.push($scope.jobsHist[i]);
			}
			$scope.partialHist = $scope.allHist.slice(begin, end);
			if ($scope.jobsHist[0] == undefined) {
				console.log("You have not applied for any jobs.");
			}
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.$watch('currentPage + numPerPage', function() {
	    begin = (($scope.currentPage - 1) * $scope.numPerPage);
	    end = begin + $scope.numPerPage;
	    $scope.partialHist = $scope.allHist.slice(begin, end);
	});
	//End Pagination changes for Jobs History here.
	
	$scope.getJobInfo = function (jobID) {

		var postData = {
				search: jobID
		}
		$http.post('/getJobInfo',postData).success(function (response) {
			$scope.jobInfo = response;
			$rootScope.jobInfo = response;
		}).error(function (err) {
			console.log(err);
		})
	};
	
	$scope.sendJobReference = function(jobInfo) {
		$scope.ClearMessages(Flash);
		if(($scope.name == "" || $scope.name == undefined) && ($scope.referEmail == "" || $scope.referEmail == undefined)) {
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Friends Name & Email Fields.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if($scope.name == "" || $scope.name == undefined) {
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Friends Name.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if($scope.referEmail == "" || $scope.referEmail == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Friends Email.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		}
		
		var postData = {
				name : $scope.name,
				email : $scope.referEmail,
				comments : $scope.comments,
				jobInfo : jobInfo
		};
		$http.post('/referJobDetails',postData).success(function (response){
				if (response != 0){
					alert("Success");
				}
		}).error(function (err) {
				console.log(err);
		});
	}
	
	$scope.ClearMessages = function(flash) {
		$scope.errorMsg = false;
		Flash.clear();
	}
	
	$scope.logout = function () {
		var path = "";
		if($rootScope.currentUser.userType == "E") path = "/empSignIn";
		else path = "/login";
		$http.post('/logout',$rootScope.user).success(function () {				
			$rootScope.currentUser = undefined;
			$rootScope.user = undefined;
			$location.url(path);
		})
	};
	
});

app.controller('changePwdCtrl', function ($q,$scope, $rootScope, $http, $location,Flash) {
	
	$scope.currentUser.oldPassword = "";
	$scope.currentUser.password1 = "";
	$scope.currentUser.password2 = "";
	$scope.firstName = $rootScope.currentUser.firstName;
	$scope.lastName = $rootScope.currentUser.lastName;
	
	$scope.logout = function () {
		$http.post('/logout',$rootScope.user).success(function () {
			$location.url('/');
			$rootScope.currentUser = undefined;
			$rootScope.user = undefined;
		})
	};
	
	$scope.ClearMessages = function(flash) {
		$scope.errorMsg = false;
		Flash.clear();
	}
	
	$scope.pwSave = function (currentUser) {
		
		if(currentUser.oldPassword == "" && currentUser.password1 == "" && currentUser.password2 == "") { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter all Password fields.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(currentUser.oldPassword == undefined && currentUser.password1 == undefined && currentUser.password2 == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter all Password fields.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(currentUser.oldPassword == "" || currentUser.oldPassword == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Old Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(currentUser.password1 == "" || currentUser.password1 == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter New Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(currentUser.password2 == "" || currentUser.password2 == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Repeat New Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		}
		
        var postData = {
            email: $rootScope.currentUser.email,
            oldPassword: currentUser.oldPassword,
            password2: currentUser.password2
        };
        
        $http.post('/changePasswd', postData).success(function (response) {
            if (response == 'success'){
                alert ('Password Updated Successfully!');
                $scope.currentUser=response;
                alert("Please connect the BlueCollarHunt appliation using New Password.");
                $scope.logout();
            } else if (response == 'incorrect') {
                alert ('Old Password is not correct!');
                $scope.currentUser={};
                $location.url('/changePassword')
            } else if (response == 'error'){
                $scope.currentUser={};
            }
        })
    };
    
$scope.empPassSave = function (currentUser) {
		
		if(currentUser.oldPassword == "" && currentUser.password1 == "" && currentUser.password2 == "") { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter all Password fields.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(currentUser.oldPassword == undefined && currentUser.password1 == undefined && currentUser.password2 == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter all Password fields.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(currentUser.oldPassword == "" || currentUser.oldPassword == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Old Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(currentUser.password1 == "" || currentUser.password1 == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter New Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		} else if(currentUser.password2 == "" || currentUser.password2 == undefined) { 
			$scope.errorMsg = true;
			Flash.create('warning', "Please enter Repeat New Password.",0, {class: 'alert-warning', id: 'custom-id'}, true);
			return;
		}
		
        var postData = {
            email: $rootScope.currentUser.email,
            oldPassword: currentUser.oldPassword,
            password2: currentUser.password2
        };
        
        $http.post('/changeEmpPasswd', postData).success(function (response) {
            if (response == 'success'){
                alert ('Password Updated Successfully!');
                $scope.currentUser=response;
                alert("Please connect the BlueCollarHunt appliation using New Password.");
                $scope.logout();
            } else if (response == 'incorrect') {
                //alert ('Old Password is not correct!');
            	$scope.errorMsg = true;
    			Flash.create('warning', "Old Password is not correct!",0, {class: 'alert-warning', id: 'custom-id'}, true);
    			$scope.currentUser={};
    			return;
            } else if (response == 'error'){
                $scope.currentUser={};
            }
        })
    };
    
    $scope.wrong = false;
	$scope.errorClass = "";
	$scope.checkPasswd = function () {

		if ($scope.currentUser.password1 !== $scope.currentUser.password2) {
			$scope.wrong = true;
			$scope.passwdErr = true;
		}
		else {
			$scope.wrong = false;
			$scope.passwdErr = false;
		}

	};
	
	//test on the length of first password.
    $scope.testPass = function () {
        $scope.passwordSh = $scope.currentUser.password1.length <= 5
    };
});

app.controller('aboutCtrl', function ($q, $scope, $rootScope, $http, $location) {
	$scope.logout = function () {
		$http.post('/logout',$rootScope.user).success(function () {
			$location.url('/');
			$rootScope.currentUser = undefined;
			$rootScope.user = undefined;
		})
	};

	function getStyle(obj, name) {
		if(obj.currentStyle) {
			return obj.currentStyle[name];
		}
		else {
			return getComputedStyle(obj, false)[name];
		}
	}
});

app.controller('navCtrl', function ($scope, $http, $location, $rootScope){
    $scope.logout = function () {
        $http.post('/logout',$rootScope.user).success(function () {
            $location.url('/');
            $rootScope.currentUser = undefined;
            $rootScope.user = undefined;
        })
    }
});

app.controller('testCtrl', function ($scope, $http, $location, $rootScope){
	alert("test");
	
	$(".Collapsable").click(function () {
		alert("hi")
        $(this).parent().children().toggle();
        $(this).toggle();

    });
	
	$scope.saveEndorseMsg = function(endorseInfo) {
		var postData = {
				email : "abc@abc.com",
			    fromEmail: "test@test.com",
			    message: endorseInfo.message,
			    origPostDate: new Date()
		};

		$http.post('/saveEndorse',postData).success(function (response){
				if (response != 0){
					alert("Success");
					$location.url('/home');
				}
		}).error(function (err) {
				console.log(err);
		});
	}
	
    $scope.logout = function () {
        $http.post('/logout',$rootScope.user).success(function () {
            $location.url('/');
            $rootScope.currentUser = undefined;
            $rootScope.user = undefined;
        })
    }
});

app.config(function ($routeProvider, $httpProvider, $locationProvider) {
	var checkLoggedIn = function ($q, $timeout, $http, $location, $rootScope) {
		var deferred = $q.defer();
		$http.get('/loggedin').success(function (user) {
			$rootScope.errorMessage = null;
			//alert(user);
			if (user != 0){
				$rootScope.currentUser =  user;
				$rootScope.currentUser.passwd1 = "";
				$rootScope.isLoggedIn = (user != 0);
				if($rootScope.currentUser.role == "admin") $location.url('/admin');
				deferred.resolve();
			} else {
				$rootScope.errorMessage = "You are not login yet.";
				deferred.reject();
				$location.url('/login');
				$rootScope.isLoggedIn = (user != 0);
			}
		})
	};
	
	var checkEmpLoggedIn = function ($q, $timeout, $http, $location, $rootScope) {
		var deferred = $q.defer();
		$http.get('/empLoggedin').success(function (user) {
			$rootScope.errorMessage = null;
			if (user !== '0'){
				$rootScope.currentUser =  user;
				$rootScope.currentUser.passwd1 = "";
				$rootScope.isLoggedIn = (user != 0);
				deferred.resolve();
			} else {
				$rootScope.errorMessage = "You are not login yet.";
				deferred.reject();
				$location.url('/empSignIn');
				$rootScope.isLoggedIn = (user != 0);
			}
		})
	};
	
	var checkSessionActive = function ($q, $timeout, $http, $location, $rootScope) {
		var deferred = $q.defer();
		$http.get('/loggedin').success(function (user) {
			$rootScope.errorMessage = null;
			if (user != '0'){
				$rootScope.currentUser =  user;
				$rootScope.currentUser.passwd1 = "";
				$rootScope.isLoggedIn = (user != 0);
				if($rootScope.currentUser.role == "admin") $location.url('/admin');
				else $location.url('/home');
				deferred.resolve();
			} else {
				deferred.reject();
				$location.url('/login');
			}
		})
	};
	
	var checkEmpSessionActive = function ($q, $timeout, $http, $location, $rootScope) {
		var deferred = $q.defer();
		$http.get('/empLoggedin').success(function (user) {
			$rootScope.errorMessage = null;
			if (user !== '0'){
				$rootScope.currentUser =  user;
				$rootScope.currentUser.passwd1 = "";
				$rootScope.isLoggedIn = (user != 0);
				$location.url('/empHome');
				deferred.resolve();
			}
		})
	};
	
	$locationProvider.html5Mode(true);
	$routeProvider.
		when('/', {
			templateUrl: 'partials/landing.html',
			controller: 'landingCtrl'
		}).
		when('/empSignIn', {
			templateUrl: 'partials/empSignIn.html',
			controller: 'empLoginCtrl',
			resolve: {
				loggedin: checkEmpSessionActive
			}
		}).
		when('/empHome', {
			templateUrl: 'partials/empHome.html',
			controller: 'empHomeCtrl',
			resolve: {
				loggedin: checkEmpLoggedIn
			}
		}).
		when('/empForgetPasswd', {
			templateUrl: 'partials/empForgetPassword.html',
			controller: 'empLoginCtrl'
		}).
		when('/empPostJob', {
			templateUrl: 'partials/empPostJob.html',
			controller: 'empHomeCtrl',
			resolve: {
				loggedin: checkEmpLoggedIn
			}
		}).
		when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'loginCtrl',
			resolve: {
				loggedin: checkSessionActive
			}
		}).
		when('/admin', {
			templateUrl: 'partials/adminControl.html',
			controller: 'loginCtrl',
			resolve: {
				loggedin: checkSessionActive
			}
		}).
		when('/contact', {
			templateUrl: 'partials/contact.html',
			controller: 'contactCtrl'
		}).
		when('/forgetPasswd', {
			templateUrl: 'partials/forgetPassword.html',
			controller: 'loginCtrl'
		}).
		when('/reset',{
			templateUrl : 'partials/resetPassword.html',
			controller : 'loginCtrl'
		}).
		when('/actUserAcct', {
			templateUrl: 'partials/activateUserAccount.html',
			controller: 'loginCtrl'
		}).
		when('/home', {
			templateUrl: 'partials/home.html',
			controller: 'homeCtrl',
			resolve: {
				loggedin: checkLoggedIn
			}
		}).
		when('/upload', {
			templateUrl: 'partials/upload.html',
			controller: 'homeCtrl',
			resolve: {
				loggedin: checkLoggedIn
			}
		}).
		when('/profile', {
			templateUrl: 'partials/profile.html',
			controller: 'profileCtrl',
			resolve: {
				loggedin: checkLoggedIn
			}
		}).
		when('/editProfile', {
			templateUrl: 'partials/editProfile.html',
			controller: 'homeCtrl',
			resolve: {
				loggedin: checkLoggedIn
			}
		}).
		when('/jobHistory', {
			templateUrl: 'partials/jobHistory.html',
			controller: 'jobsCtrl',
			resolve: {
				loggedin: checkLoggedIn
			}
		}).
		when('/about', {
			templateUrl: 'partials/about.html',
			controller: 'aboutCtrl',
			resolve: {
				loggedin: checkLoggedIn
			}
		}).
		when('/register', {
			templateUrl: 'partials/register.html',
			controller: 'registerCtrl'
		}).
		when('/empRegister', {
			templateUrl: 'partials/empRegister.html',
			controller: 'registerCtrl'
		}).
		when('/changePassword', {
			templateUrl: 'partials/changePassword.html',
			controller: 'changePwdCtrl',
			resolve: {
				loggedin: checkLoggedIn
			}
		}).
		when('/empChangePass', {
			templateUrl: 'partials/empChangePass.html',
			controller: 'changePwdCtrl',
			resolve: {
				loggedin: checkEmpLoggedIn
			}
		}).
		when('/empChangeProfile', {
			templateUrl: 'partials/empChangeProfile.html',
			controller: 'empProfileCtrl',
			resolve: {
				loggedin: checkEmpLoggedIn
			}
		}).
		when('/reviewProfile', {
			templateUrl: 'partials/candidateProfile.html',
			controller: 'empProfileCtrl',
			resolve: {
				loggedin: checkEmpLoggedIn
			}
		}).
		when('/socialContacts', {
			templateUrl: 'partials/socialUserInfo.html',
			controller: 'socialCtrl',
			resolve: {
				loggedin: checkLoggedIn
			}
		}).
		when('/endorse', {
			templateUrl: 'partials/endorse.html',
			controller: 'testCtrl'
		}).
		when('/testDynamic', {
			templateUrl: 'partials/test.html',
			controller: 'testCtrl'
		}).
		when('/404', {
			templateUrl: 'partials/404.html'
		})
		.
		otherwise({
			redirectTo: '/'
		});
});