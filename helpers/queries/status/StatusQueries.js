"use strict";

//Importing packages
const env = require("dotenv").config();
const mongoose = require("mongoose");

//Imported classes list
const { Status } = require("../../../models");
const mongoConnection = require("../../../config/database/index.js");
const { IndexResponse } = require("../../responses/IndexResponse.js");

//Creating classes instance
const indexResponse = new IndexResponse();

class StatusQueries
{
	//Get statuses listing from db
	index = async (request, response, object) =>
	{
		try
		{
			const statuses = await Status.aggregate([
				{
			        $project: 
			        {
						_id: 1,
						title: 1,
						created_at: 1
					}
			    },
	     		{
				    $facet:
				    {
				    	totalStatuses: [
				      		{
				      			$count: "count"
				      		}
			      		],
				      	statuses: [
				      		{
						    	$sort:
						    	{ 
						    		created_at : -1
						    	} 
						    }
			      		]
			      	}
			  	}
			]);

			const totalRecords = statuses[0]?.totalStatuses[0]?.count ?? 0;

			if (totalRecords > 0)
			{
				let filterStatuses = [];

				statuses[0]?.statuses.forEach((status) =>
				{
					filterStatuses.push({
						id: status._id,
						title: status.title
					});
				});

				return indexResponse.jsonResponse(response, 200, process.env.SUCCESS_MSG, [], {
					total_records: totalRecords,
					records: filterStatuses
				});
			}
			else
			{
				return indexResponse.jsonResponse(response, 404, process.env.NOT_FOUND_MSG, [], {
					total_records: totalRecords,
					records: [],
				});
			}
		}
		catch (error)
		{
			return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [error], {
				total_records: 0,
				records: [],
			});
		}
	}

	//Get status by title from db
	statusByTitle = async (request, response, object) =>
	{
		try
		{
			const status = await Status.findOne()
			.select({
				_id: 1,
				title: 1
			})
			.where({
				title: object.status
			});

			if (status && status._id)
			{
				return indexResponse.jsonResponse(response, 200, process.env.SUCCESS_MSG, [], status);
			}
			else
			{
				return indexResponse.jsonResponse(response, 404, process.env.NOT_FOUND_MSG, [
					{
						"status": "The selected status is invalid."
					}
				]);
			}
		}
		catch (error)
		{
			return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [error]);
		}
	}
}

module.exports = { StatusQueries };