"use strict";

//Packages list
const express = require("express");
const route = express.Router();

//Imported classes list
const { IndexMiddleware } = require("../helpers/middleware/authorization/IndexMiddleware.js");
const { IndexController } = require("../controllers/General/IndexController.js");

//Creating classes instance
const indexMiddleware = new IndexMiddleware();
const indexController = new IndexController();

//Authorization middleware
route.use((request, response, next) =>
{
	indexMiddleware.index(request, response, next);
});

//List of routes

/**
	@group General
		
	Dropdowns listing API

	@response {
	    "response": true,
	    "status_code": 200,
	    "message": "Success",
	    "error_msgs": [],
	    "data": {
	        "statuses": {
	            "total_records": 2,
	            "records": [
	                {
	                    "id": "629df2222f917e7ddaea6ef6",
	                    "title": "active"
	                }
	            ]
	        },
	        "countries": {
	            "total_records": 2,
	            "records": [
	                {
	                    "id": "629e29b22f917e7ddaea6f0b",
	                    "title": "Pakistan"
	                }
	            ]
	        },
	        "genres": {
	            "total_records": 3,
	            "records": [
	                {
	                    "id": "629e29f52f917e7ddaea6f0f",
	                    "title": "action"
	                }
	            ]
	        }
	    }
	}

	@response 401 {
		"response": false,
	    "status_code": 401,
	    "message": "Unauthenticated user to access this route",
	    "error_msgs": [],
	    "data": {}
	}

	@response 403 {
		"response": false,
	    "status_code": 403,
	    "message": "A token is required for authentication",
	    "error_msgs": [],
	    "data": {}
	}
*/
route.get("/", indexController.index);

module.exports = route;