"use strict";

//Importing packages
const { validationResult, check } = require("express-validator");
const env = require("dotenv").config();

//Importing classes list
const { IndexResponse } = require("../../helpers/responses/IndexResponse.js");
const { FilmCommentsQueries }  = require("../../helpers/queries/film/FilmCommentsQueries.js");

//Creating classes instance
const indexResponse = new IndexResponse();
const filmCommentsQueries = new FilmCommentsQueries();

//Initializing variables
let errors;

class CommentsController
{
	//Get comment for film and pass it to db
	create = async (request, response, next) =>
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
				userId: request.user.id,
				filmId: request.body.film_id,
				comment: request.body.comment
			};

			const filmComment = await filmCommentsQueries.create(request, response, body);

			return indexResponse.apiResponse(response, filmComment.statusCode, filmComment.message, filmComment.errorMsgs, filmComment.data);
		}
	}
}

module.exports = { CommentsController };