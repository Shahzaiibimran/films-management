"use strict";

//Importing packages
const env = require("dotenv").config();
const mongoose = require("mongoose");

//Imported classes list
const { Film } = require("../../../models");
const mongoConnection = require("../../../config/database/index.js");
const { StatusQueries } = require("../status/StatusQueries.js");
const { IndexResponse } = require("../../responses/IndexResponse.js");
const { IndexResource } = require("../../../resources/films/IndexResource.js");
const { DetailsResource } = require("../../../resources/films/DetailsResource.js");

//Creating classes instance
const statusQueries = new StatusQueries();
const indexResponse = new IndexResponse();
const indexResource = new IndexResource();
const detailsResource = new DetailsResource();

class FilmQueries
{
	//Get films listing by using pagination
	index = async (request, response, object) =>
	{
		try
		{
			const films = await Film.aggregate([
				{
			        $project: 
			        {
						_id: 1,
						title: 1,
						slug: 1,
						released_date: 1,
						rating: 1,
						price: 1,
						cover_image: 1,
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
				        as: "filmsStatus",
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
			    		"filmsStatus._id":
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
				    	totalFilms: [
				      		{
				      			$count: "count"
				      		}
			      		],
				      	films: [
				      		{
						    	$sort:
						    	{ 
						    		created_at : -1
						    	} 
						    },
				      		{
				      			$skip: object.offset
				      		}, 
				      		{
				      			$limit: object.limit
				      		}
			      		]
			      	}
			  	}
			]);

			const totalRecords = films[0]?.totalFilms[0]?.count ?? 0;

			if (totalRecords > 0)
			{
				const filmsResource = indexResource.index(request, response, films[0]?.films);

				return indexResponse.jsonResponse(response, 200, process.env.SUCCESS_MSG, [], {
					total_records: totalRecords,
					records: filmsResource
				});
			}
			else
			{
				return indexResponse.jsonResponse(response, 404, process.env.NOT_FOUND_MSG);
			}
		}
		catch (error)
		{
			return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [error]);
		}
	}

	//Get film information and store it to db
	create = async (request, response, object) =>
	{
		const data =
		{
			id: "",
			title: object.title,
			slug: "",
			rating: object.rating,
			price: "$" + object.price,
			cover_image: object.coverPhoto.destination + object.coverPhoto.filename,
			released_date: object.releasedDate,
			created_at: ""
		};

		try
		{
			const status = await statusQueries.statusByTitle(request, response, object);

			if (status.statusCode === 200)
			{
				let genres = [];

				object.genresId.forEach((genreId) =>
				{
					genres.push({
						genre_id: genreId
					});
				});

				const filmModel = new Film({
					title: object.title,
					slug: object.title.toLowerCase().replace(" ", "-"),
					description: object.description,
					released_date: object.releasedDate,
					rating: object.rating,
					price: object.price,
					country_id: object.country_id,
					genres: genres,
					cover_image: object.coverPhoto.destination + object.coverPhoto.filename,
					status_id: status.data._id
				});

				const film = await filmModel.save();

				if (film && film.id)
				{	
					data.id = film._id;
					data.slug = film.slug;
					data.id = film._id;
					data.cover_image = film.cover_image;
					data.created_at = film.created_at;

					return indexResponse.jsonResponse(response, 200, process.env.SUCCESS_MSG, [], data);
				}
				else
				{
					return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [], data);
				}
			}
			else
			{
				return indexResponse.jsonResponse(response, status.statusCode, status.message, status.errorMsgs, data);
			}
		}
		catch (error)
		{
			return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [error], data);
		}
	}

	//Get films listing by using pagination
	details = async (request, response, object) =>
	{
		try
		{
			const film = await Film.aggregate([
				{
			        $project: 
			        {
						_id: 1,
						title: 1,
						slug: 1,
						description: 1,
						released_date: 1,
						rating: 1,
						price: 1,
						country_id: 1,
						"genres.genre_id": 1,
						cover_image: 1,
						status_id: 1,
						is_deleted: 1,
						created_at: 1
					}
			    },
			    {
			    	$match:
			    	{
			    		slug: object.slug,
			    		is_deleted: false
			    	}
			    },
			    {
			    	$lookup:
			    	{
				        from: "countries",
				        let:
				        {
				        	country_id: "$country_id"
				        },
				        as: "filmCountry",
				        pipeline: [
				        	{ 
				            	$project: 
			            		{ 
			            			_id: 1, 
			            			title: 1,
			            			status_id: 1,
			            			is_deleted: 1
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
					            					"$_id", "$$country_id"
					            				]
				            				}
			            				]
			            			}	
			            		}
			            	},
			            	{
			            		$match:
			            		{
			            			is_deleted: false
			            		}
			            	}
				        ]
				    }
			    },
			    {
			    	$match: 
			    	{
			    		"filmCountry._id":
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
			    	$lookup:
			    	{
				        from: "genres",
				        let:
				        {
				        	genres_id: "$genres.genre_id"
				        },
				        as: "filmGenres",
				        pipeline: [
				        	{ 
				            	$project: 
			            		{ 
			            			_id: 1, 
			            			title: 1,
			            			status_id: 1,
			            			is_deleted: 1
			            		}
			            	},
			            	{ 
			            		$match: 
			            		{ 
			            			$expr: 
			            			{ 
			            				$in: [ 
			            					"$_id", "$$genres_id" 
			            				] 
			            			} 
			            		} 
			            	},
			            	{
			            		$match:
			            		{
			            			is_deleted: false
			            		}
			            	}
				        ]
				    }
			    },
			    {
			    	$match: 
			    	{
			    		"filmGenres._id":
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
			    	$lookup:
			    	{
				        from: "film_comments",
				        let:
				        {
				        	film_id: "$_id"
				        },
				        as: "film_comments",
				        pipeline: [
				        	{ 
				            	$project: 
			            		{ 
			            			_id: 1, 
			            			film_id: 1
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
					            					"$film_id", "$$film_id"
					            				]
				            				}
			            				]
			            			}	
			            		}
			            	},
			            	{
						    	$facet:
							    {
							    	totalComments: [
							      		{
							      			$count: "count"
							      		}
						      		]
					      		}
						    }
				        ]
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
				        as: "filmsStatus",
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
			    		"filmsStatus._id":
			    		{ 
			    			$exists: true, 
			    			$not:
			    			{
			    				$size: 0
			    			}
			    		}
			    	}
			    }
			]);

			if (film.length > 0)
			{
				const filmResource = detailsResource.index(request, response, film);

				return indexResponse.jsonResponse(response, 200, process.env.SUCCESS_MSG, [], filmResource);
			}
			else
			{
				return indexResponse.jsonResponse(response, 404, process.env.NOT_FOUND_MSG);
			}
		}
		catch (error)
		{
			return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [error]);
		}
	}
}

module.exports = { FilmQueries };