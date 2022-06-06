"use strict";

//Importing packages
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
const mongoose = require("mongoose");

//Importing classes list
const { User } = require("../../../models");
const { IndexResponse } = require("../../responses/IndexResponse.js");

//Creating classes instance
const indexResponse = new IndexResponse();

class IndexMiddleware
{
	//authorizing token
	index = async (request, response, next) =>
	{
		if (request.headers && request.headers.authorization && request.headers.authorization.split("Bearer ")[1])
		{
			jwt.verify(request.headers.authorization.split("Bearer ")[1], process.env.JWT_TOKEN_KEY, (error, user) =>
			{
		      	if (error)
		      	{
			        const methodResponse = indexResponse.jsonResponse(response, 409, "Unauthenticated user to access this route");

					const apiResponse = indexResponse.apiResponse(response, methodResponse.statusCode, methodResponse.message, methodResponse.errorMsgs, methodResponse.data);
			        
		      	}
		      	else
	      		{
	      			request.user = user.user;
	      			
	      			return User.findOne({
	      				_id: user.user.id,
	      				deleted: false
	      			})
	      			.select({
	      				_id: 1
	      			})
	      			.then((result) =>
      				{
      					next();
      				})
      				.catch((error) =>
  					{
  						const methodResponse = indexResponse.jsonResponse(response, 409, "Unauthenticated user to access this route");

						const apiResponse = indexResponse.apiResponse(response, methodResponse.statusCode, methodResponse.message, methodResponse.errorMsgs, methodResponse.data);
  					});
	      		}
		    });
		}
		else
		{
			const methodResponse = indexResponse.jsonResponse(response, 403, "A token is required for authentication");

			const apiResponse = indexResponse.apiResponse(response, methodResponse.statusCode, methodResponse.message, methodResponse.errorMsgs, methodResponse.data);
		}	
	}
}

module.exports = { IndexMiddleware };