"use strict";

//Importing packages
const { validationResult, check } = require("express-validator");
const env = require("dotenv").config();

//Importing classes list
const { IndexResponse } = require("../../helpers/responses/IndexResponse.js");
const { UserQueries }  = require("../../helpers/queries/user/UserQueries.js");

//Creating classes instance
const indexResponse = new IndexResponse();
const userQueries = new UserQueries();

//Initializing variables
let errors;

class IndexController
{
	//Get user information for sign up and pass it to queries to store in db
	index = async (request, response, next) =>
	{
		errors = validationResult(request);

		if (!errors.isEmpty())
		{
			const apiResponse = indexResponse.apiResponse(response, 422, process.env.ERROR_MSG, indexResponse.validationErrors(errors.errors));
		}
		else
		{
			const body = 
			{ 
				firstName: request.body.first_name, 
				lastName: request.body.last_name, 
				email: request.body.email, 
				password : request.body.password,
				status: "active"
			};

			const signUp = await userQueries.index(request, response, body);

			return indexResponse.apiResponse(response, signUp.statusCode, signUp.message, signUp.errorMsgs, signUp.data);
		}
	}

	//Get user information for sign in and pass it to queries to check in db
	signIn = async (request, response, next) =>
	{
		errors = validationResult(request);

		if (!errors.isEmpty())
		{
			const apiResponse = indexResponse.apiResponse(response, 422, process.env.ERROR_MSG, indexResponse.validationErrors(errors.errors));
		}
		else
		{
			const body = 
			{ 
				email: request.body.email, 
				password : request.body.password,
				status: "active"
			};

			const signIn = await userQueries.signIn(request, response, body);

			return indexResponse.apiResponse(response, signIn.statusCode, signIn.message, signIn.errorMsgs, signIn.data);
		}
	}
}

module.exports = { IndexController };