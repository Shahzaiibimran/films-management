"use strict";

//Importing packages
const env = require("dotenv").config();
const mongoose = require("mongoose");

//Imported classes list
const { Country } = require("../../../models");
const mongoConnection = require("../../../config/database/index.js");
const { IndexResponse } = require("../../responses/IndexResponse.js");

//Creating classes instance
const indexResponse = new IndexResponse();

class CountryQueries
{
	//Get counries listing from db
	index = async (request, response, object) =>
	{
		try
		{
			const countries = await Country.aggregate([
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
				        as: "countriesStatus",
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
			    		"countriesStatus._id":
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
				    	totalCountries: [
				      		{
				      			$count: "count"
				      		}
			      		],
				      	countries: [
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

			const totalRecords = countries[0]?.totalCountries[0]?.count ?? 0;

			if (totalRecords > 0)
			{
				let filterCountries = [];

				countries[0]?.countries.forEach((country) =>
				{
					filterCountries.push({
						id: country._id,
						title: country.title
					});
				});

				return indexResponse.jsonResponse(response, 200, process.env.SUCCESS_MSG, [], {
					total_records: totalRecords,
					records: filterCountries
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

module.exports = { CountryQueries };