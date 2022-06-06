"use strict";

//Packages list
const express = require("express");
const route = express.Router();

//Imported classes list
const { IndexMiddleware } = require("../helpers/middleware/authorization/IndexMiddleware.js");
const { CommentsController } = require("../controllers/Films/CommentsController.js");
const createFilmCommentRequest = require("../request/films/comments/CreateFilmCommentRequest.js");

//Creating classes instance
const indexMiddleware = new IndexMiddleware();
const commentsController = new CommentsController();

route.use((request, response, next) =>
{
	indexMiddleware.index(request, response, next);
});

//List of routes

/**
	@group Film Comments
		
	Create film comment API

	@response {
	    "response": true,
	    "status_code": 200,
	    "message": "Success",
	    "error_msgs": [],
	    "data": {
	        "id": "629df2222f917e7ddaea6ef6",
	        "comment": "Hello",
	        "created_at": "2022-06-06T22:06:58.952Z"
	    }
	}

	@response 422 {
		"response": false,
	    "status_code": 422,
	    "message": "Internal server error!",
	    "error_msgs": [
		 	{
	            "comment": "The comment field is required."
	        }
	    ],
	    "data": {
	        "id": "",
	        "comment": "Hello",
	        "created_at": ""
	    }
	}
	
	@response 404 {
		"response": false,
	    "status_code": 200,
	    "message": "Not found!",
	    "error_msgs": [],
	    "data": {
	        "id": "",
	        "comment": "Hello",
	        "created_at": ""
	    }
	}

	@response 500 {
		"response": false,
	    "status_code": 500,
	    "message": "Internal server error!",
	    "error_msgs": [],
	    "data": {
	        "id": "",
	        "comment": "Hello",
	        "created_at": ""
	    }
	}

	@bodyParam {string} film_id required min: 23 max: 23 Example: 629e7a82c68fd693edbc9d87
	@bodyParam {string} comment required min: 1 max: 2200 Example: Hi, this is a first comment
*/
route.post("/create", createFilmCommentRequest.validate(), commentsController.create);

module.exports = route;