"use strict";

//Packages list
const express = require("express");
const app = express(); 
const route = express.Router();
const multer = require("multer");

//Storing file
const storage = multer.diskStorage({
  	destination: function (request, file, cb) 
  	{
  		cb(null, "uploads/")
  	},
  	filename: function (req, file, cb) 
  	{
	    cb(null, Date.now() + "." + file.originalname.toLowerCase().split(".")[1])
  	}
});

//Setting up uploading file dir
const upload = multer({ 
	storage: storage 
});

//Imported classes list
const { IndexMiddleware } = require("../helpers/middleware/authorization/IndexMiddleware.js");
const { IndexController } = require("../controllers/Films/IndexController.js");
const indexRequest = require("../request/films/IndexRequest.js");
const createFilmRequest = require("../request/films/CreateFilmRequest.js");
const filmDetailsRequest = require("../request/films/FilmDetailsRequest.js");

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
	@group Films
		
	Films listing API

	@response {
	    "response": true,
	    "status_code": 200,
	    "message": "Success",
	    "error_msgs": [],
	    "data": {
	        "total_records": 6,
	        "records": [
	            {
	                "id": "629e7a82c68fd693edbc9d87",
	                "title": "Movie F",
	                "slug": "movie-f",
	                "rating": 5,
	                "price": "$ 50",
	                "cover_image": "http://localhost:3000/1654553218911.jpg",
	                "released_date": "2021-01-01",
	                "created_at": "2022-06-06T22:06:58.952Z"
	            }
	        ]
	    }
	}

	@response 422 {
		"response": false,
	    "status_code": 422,
	    "message": "Internal server error!",
	    "error_msgs": [
		 	{
	            "limit": "The limit field is required."
	        }
	    ],
	    "data": {}
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

	@response 404 {
	    "response": true,
	    "status_code": 200,
	    "message": "Not found!",
	    "error_msgs": [],
	    "data": {
	        "total_records": 1,
	        "films": []
	    }
	}
	
	@response 500 {
		"response": false,
	    "status_code": 500,
	    "message": "Internal server error!",
	    "error_msgs": [],
	    "data": {
	        "total_records": 0,
	        "films": []
	    }
	}

	@queryParam {integer} limit required gt: 0 min: 1 Example: 10
	@queryParam {integer} from required min: 1 Example: 0
*/
route.get("/", indexRequest.validate(), indexController.index);

/**
	@group Films
		
	Create film API

	@response {
	    "response": true,
	    "status_code": 200,
	    "message": "Success",
	    "error_msgs": [],
	    "data": {
	        "id": "629e73b8a0d8d4cec16c50f8",
	        "title": "Movie D",
	        "slug": "movie-d",
	        "rating": "5",
	        "price": "$50.00",
	        "cover_image": "uploads/1654551480925.jpg",
	        "released_date": "2021-01-01",
	        "created_at": "2022-06-06T21:38:01.000Z"
	    }
	}

	@response 422 {
		"response": false,
	    "status_code": 422,
	    "message": "Internal server error!",
	    "error_msgs": [
		 	{
	            "title": "The title field is required."
	        }
	    ],
	    "data": {}
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

	@response 404 {
	    "response": true,
	    "status_code": 200,
	    "message": "Not found!",
	    "error_msgs": [],
	    "data": {
	        "id": "",
	        "title": "Movie D",
	        "slug": "",
	        "rating": "5",
	        "price": "$50.00",
	        "cover_image": "uploads/1654551480925.jpg",
	        "released_date": "2021-01-01",
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
	        "title": "Movie D",
	        "slug": "",
	        "rating": "5",
	        "price": "$50.00",
	        "cover_image": "uploads/1654551480925.jpg",
	        "released_date": "2021-01-01",
	        "created_at": ""
	    }
	}

	@bodyParam {string} title required min: 7 max: 50 Example: Movie A
	@bodyParam {string} description required min: 20 max: 5000 Example: 123456789
	@bodyParam {string} released_date required format: yyyy-mm-dd Example: 2021-01-01
	@bodyParam {float} rating required min: 1 max: 1 Example: 5
	@bodyParam {string} price required min: 1 max: 12 Example: 50.00
	@bodyParam {string} country_id required min: 24 max: 24 Example: 629e29b22f917e7ddaea6f0b
	@bodyParam {array} genres_id[] required min: 24 max: 24 Example: 629e2b702f917e7ddaea6f1b
	@bodyParam {file} cover_photo required max_size: 3mb allowed_types: jpeg, jpg, png
*/
route.post("/create", upload.single("cover_photo"), createFilmRequest.validate(), indexController.create);

/**
	@group Films
		
	Film details API

	@response {
	    "response": true,
	    "status_code": 200,
	    "message": "Success",
	    "error_msgs": [],
	    "data": {
	        "id": "629e6b76b518799aa88a05f1",
	        "title": "Movie A",
	        "slug": "movie-a",
	        "description": "Where does it come from",
	        "rating": 5,
	        "price": "$ 50",
	        "cover_image": "http://localhost:3000/1654549366390.jpg",
	        "released_date": "2021-01-01",
	        "country": {
	            "id": "629e29b22f917e7ddaea6f0b",
	            "title": "Pakistan"
	        },
	        "genres": [
	            {
	                "id": "629e29f52f917e7ddaea6f0f",
	                "title": "action"
	            },
	            {
	                "id": "629e2b432f917e7ddaea6f1a",
	                "title": "animation"
	            }
	        ],
	        "total_comments": 1,
	        "created_at": "2022-06-06T21:02:46.479Z"
	    }
	}

	@response 422 {
		"response": false,
	    "status_code": 422,
	    "message": "Internal server error!",
	    "error_msgs": [
		 	{
	            "slug": "The slug field is required."
	        }
	    ],
	    "data": {}
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

	@response 404 {
	    "response": true,
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

	@queryParam {string} slug required min: 1 Example: movie-a
*/
route.get("/details", filmDetailsRequest.validate(), indexController.details);

module.exports = route;