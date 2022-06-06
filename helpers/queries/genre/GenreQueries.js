"use strict";

//Importing packages
const env = require("dotenv").config();
const mongoose = require("mongoose");

//Imported classes list
const { Genre } = require("../../../models");
const mongoConnection = require("../../../config/database/index.js");
const { IndexResponse } = require("../../responses/IndexResponse.js");

//Creating classes instance
const indexResponse = new IndexResponse();

class GenreQueries
{
	//Get genres listing from db
	index = async (request, response, object) =>
	{
		try
		{
			const genres = await Genre.aggregate([
				{
			        $project: 
			        {
						_id: 1,
						title: 1,
						status_id: 1,
						is_deleted: 1,
						created_at: 1
					}
			    },
			    {
			    	$match:
			    	{
			    		is_deleted: false
			    	}
			    },
			    {
			    	$lookup:
			    	{
				        from: "statuses",
				        let:
				        {
				        	status_id: "$status_id"
				        },
				        as: "genresStatus",
				        pipeline: [
				        	{ 
				            	$project: 
			            		{ 
			            			_id: 1, 
			            			title: 1
			            		}
			            	},
			            	{
			            		$match:
			            		{
			            			$expr:
			            			{
			            				$and:
			            				[
				            				{
					            				$eq: [
					            					"$_id", "$$status_id"
					            				]
				            				}
			            				]
			            			}	
			            		}
			            	},
			            	{
			            		$match:
			            		{
	            					title: "active"
	            				}
			            	}
				        ]
				    }
			    },
			    {
			    	$match: 
			    	{
			    		"genresStatus._id":
			    		{ 
			    			$exists: true, 
			    			$not:
			    			{
			    				$size: 0
			    			}
			    		}
			    	}
			    },
	     		{
				    $facet:
				    {
				    	totalGenres: [
				      		{
				      			$count: "count"
				      		}
			      		],
				      	genres: [
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

			const totalRecords = genres[0]?.totalGenres[0]?.count ?? 0;

			if (totalRecords > 0)
			{
				let filterGenres = [];

				genres[0]?.genres.forEach((genre) =>
				{
					filterGenres.push({
						id: genre._id,
						title: genre.title
					});
				});

				return indexResponse.jsonResponse(response, 200, process.env.SUCCESS_MSG, [], {
					total_records: totalRecords,
					records: filterGenres
				});
			}
			else
			{
				return indexResponse.jsonResponse(response, 404, process.env.NOT_FOUND_MSG, [], {
					total_records: totalRecords,
					records: []
				});
			}
		}
		catch (error)
		{
			return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [error], {
				total_records: 0,
				records: []
			});
		}
	}
}

module.exports = { GenreQueries };