"use strict";

//Importing packages
const { validationResult, check } = require("express-validator");
const env = require("dotenv").config();

//Importing classes list
const { IndexResponse } = require("../../helpers/responses/IndexResponse.js");
const { StatusQueries }  = require("../../helpers/queries/status/StatusQueries.js");
const { CountryQueries }  = require("../../helpers/queries/country/CountryQueries.js");
const { GenreQueries }  = require("../../helpers/queries/genre/GenreQueries.js");

//Creating classes instance
const indexResponse = new IndexResponse();
const statusQueries = new StatusQueries();
const countryQueries = new CountryQueries();
const genreQueries = new GenreQueries();

//Initializing variables
let errors;

class IndexController
{
	//Get statuses, countries and genres listing from db
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
				userId: request.user.id
			};

			const statuses = await statusQueries.index(request, response, body);

			const countries = await countryQueries.index(request, response, body);

			const genres = await genreQueries.index(request, response, body);

			return indexResponse.apiResponse(response, 200, process.env.SUCCESS_MSG, [], {
				statuses: statuses.data,
				countries: countries.data,
				genres: genres.data
			});
		}
	}
}

module.exports = { IndexController };