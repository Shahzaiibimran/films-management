"use strict";

//Importing packages
const { validationResult, check } = require("express-validator");
const env = require("dotenv").config();

//Importing classes list
const { IndexResponse } = require("../../helpers/responses/IndexResponse.js");
const { FilmQueries }  = require("../../helpers/queries/film/FilmQueries.js");

//Creating classes instance
const indexResponse = new IndexResponse();
const filmQueries = new FilmQueries();

//Initializing variables
let errors;

class IndexController
{
	//Get films listing by using pagination
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
				limit: parseInt(request.query.limit),
				offset: parseInt(request.query.from)
			};

			const films = await filmQueries.index(request, response, body);

			return indexResponse.apiResponse(response, films.statusCode, films.message, films.errorMsgs, films.data);
		}
	}

	//Get film information and pass it to db
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
				title: request.body.title,
				description: request.body.description,
				releasedDate: request.body.released_date,
				rating: request.body.rating,
				price: request.body.price,
				country_id: request.body.country_id,
				genresId: request.body.genres_id,
				coverPhoto: request.file,
				status: "active"
			};

			const film = await filmQueries.create(request, response, body);

			return indexResponse.apiResponse(response, film.statusCode, film.message, film.errorMsgs, film.data);
		}
	}

	//Get film details by using slug
	details = async (request, response, next) =>
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
				slug: request.query.slug
			};

			const film = await filmQueries.details(request, response, body);

			return indexResponse.apiResponse(response, film.statusCode, film.message, film.errorMsgs, film.data);
		}
	}
}

module.exports = { IndexController };