"use strict";

//Importing packages
const env = require("dotenv").config();
const mongoose = require("mongoose");

//Imported classes list
const { FilmComments } = require("../../../models");
const mongoConnection = require("../../../config/database/index.js");
const { IndexResponse } = require("../../responses/IndexResponse.js");

//Creating classes instance
const indexResponse = new IndexResponse();

class FilmCommentsQueries
{
	//Get comment for film and store it in db
	create = async (request, response, object) =>
	{
		const data =
		{
			id: "",
			comment: object.comment,
			created_at: ""
		};

		try
		{
			const filmCommentsModel = new FilmComments({
				user_id: object.userId,
				film_id: object.filmId,
				text: object.comment
			});

			const filmComment = await filmCommentsModel.save();

			if (filmComment && filmComment.id)
			{	
				data.id = filmComment._id;
				data.created_at = filmComment.created_at;

				return indexResponse.jsonResponse(response, 200, process.env.SUCCESS_MSG, [], data);
			}
			else
			{
				return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [], data);
			}
		}
		catch (error)
		{
			return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [error], data);
		}
	}
}

module.exports = { FilmCommentsQueries };