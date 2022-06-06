"use strict";

//Packages list
const express = require("express");
const route = express.Router();

//Imported classes list
const { IndexController } = require("../controllers/Auth/IndexController.js");
const signUpRequest = require("../request/auth/SignUpRequest.js");
const signInRequest = require("../request/auth/SignInRequest.js");

//Creating classes instance
const indexController = new IndexController();

/*route.use((request, response, next) =>
{
	indexMiddleware.index(request, response, next);
});*/

//List of routes

/**
	@group Auth
		
	Sign up API

	@response {
	    "response": true,
	    "status_code": 200,
	    "message": "Success",
	    "error_msgs": [],
	    "data": {
	        "firstName": "Shahzaib",
	        "lastName": "Imran",
	        "email": "shahzaiibimran@gmail.com"
	    }
	}

	@response 422 {
		"response": false,
	    "status_code": 422,
	    "message": "Internal server error!",
	    "error_msgs": [
		 	{
	            "first_name": "The first name field is required."
	        }
	    ],
	    "data": {
	        "firstName": "Shahzaib",
	        "lastName": "Imran",
	        "email": "shahzaiibimran@gmail.com"
	    }
	}
	
	@response 404 {
		"response": false,
	    "status_code": 200,
	    "message": "Not found!",
	    "error_msgs": [],
	    "data": {
	        "firstName": "Shahzaib",
	        "lastName": "Imran",
	        "email": "shahzaiibimran@gmail.com"
	    }
	}

	@response 500 {
		"response": false,
	    "status_code": 500,
	    "message": "Internal server error!",
	    "error_msgs": [],
	    "data": {
	        "firstName": "Shahzaib",
	        "lastName": "Imran",
	        "email": "shahzaiibimran@gmail.com"
	    }
	}

	@bodyParam {string} first_name required min: 3 max: 20 Example: Shahzaib
	@bodyParam {string} last_name required min: 3 max: 20 Example: Imran
	@bodyParam {string} email required min: 3 max: 30 Example: shahzaiibimran@gmail.com
	@bodyParam {string} password required min: 7 max: 40 Example: 123456789
	@bodyParam {string} confirm_password required min: 7 max: 40 Example: 123456789
*/
route.post("/sign-up", signUpRequest.validate(), indexController.index);

/**
	@group Auth
		
	Sign in API

	@response {
	    "response": true,
	    "status_code": 200,
	    "message": "Success",
	    "error_msgs": [],
	    "data": {
		    "response": true,
		    "status_code": 200,
		    "message": "Success",
		    "error_msgs": [],
		    "data": {
		        "id": "629e0c147317166748842736",
		        "first_name": "Shahzaib",
		        "last_name": "Imran",
		        "email": "shahzaiibimran@gmail.com",
		        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI5ZTBjMTQ3MzE3MTY2NzQ4ODQyNzM2IiwiZmlyc3RfbmFtZSI6IlNoYWh6YWliIiwibGFzdF9uYW1lIjoiSW1yYW4iLCJlbWFpbCI6InNoYWh6YWlpYmltcmFuQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NTQ1MjY4NjQsImV4cCI6MTY1NDYxMzI2NCwiYXVkIjoiW29iamVjdCBPYmplY3RdIn0.Wa44sKFoSFbmljSm-OWupJjVHV3xgZfRR3fm0-lKJeQ"
		    }
		}
	}

	@response 422 {
		"response": false,
	    "status_code": 422,
	    "message": "Internal server error!",
	    "error_msgs": [
		 	{
	            "email": "The given email is invalid."
	        }
	    ],
	    "data": {}
	}
	
	@response 404 {
		"response": false,
	    "status_code": 200,
	    "message": "Not found!",
	    "error_msgs": [],
	    "data": {}
	}

	@response 500 {
		"response": false,
	    "status_code": 500,
	    "message": "Internal server error!",
	    "error_msgs": [],
	    "data": {}
	}

	@bodyParam {string} email required min: 3 max: 30 Example: shahzaiibimran@gmail.com
	@bodyParam {string} password required min: 7 max: 40 Example: 123456789
*/
route.post("/sign-in", signInRequest.validate(), indexController.signIn);

module.exports = route;