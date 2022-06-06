"use strict";

//Importing packages
const env = require("dotenv").config();
const mongoose = require("mongoose");

//Imported classes list
const { User } = require("../../../models");
const mongoConnection = require("../../../config/database/index.js");
const { StatusQueries } = require("../status/StatusQueries.js");
const { EncryptDecrypt } = require("../../general/EncryptDecrypt.js");
const { IndexResponse } = require("../../responses/IndexResponse.js");

//Creating classes instance
const statusQueries = new StatusQueries();
const encryptDecrypt = new EncryptDecrypt();
const indexResponse = new IndexResponse();

class UserQueries
{
	//Get user information for sign up and store in db
	index = async (request, response, object) =>
	{
		const data =
		{
			id: "",
			firstName: object.firstName, 
			lastName: object.lastName, 
			email: object.email
		};

		try
		{
			const validateEmail = await this.validateEmail(request, response, object);
			
			if (validateEmail.statusCode === 200)
			{
				return indexResponse.jsonResponse(response, 422, process.env.ERROR_MSG, [
			        {
			            "email": "The email has already been taken."
			        }
			    ], data);
			}
			else if (validateEmail.statusCode === 404)
			{
				const status = await statusQueries.statusByTitle(request, response, object);

				if (status.statusCode === 200)
				{
					const userModel = new User({
						first_name: object.firstName,
						last_name: object.lastName,
						email: object.email,
						password: await encryptDecrypt.encryptPassword(request, response, object),
						status_id: status.data._id
					});

					const signUpUser = await userModel.save();

					if (signUpUser && signUpUser.id)
					{	
						data.id = signUpUser._id;

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
			else
			{
				return indexResponse.jsonResponse(response, validateEmail.statusCode, validateEmail.message, validateEmail.errorMsgs, data);
			}
		}
		catch (error)
		{
			return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [error], data);
		}
	}

	//Get user information for sign in and pass it to queries to check in db
	signIn = async (request, response, object) =>
	{
		const data =
		{
			id: "",
			first_name: "", 
			last_name: "", 
			email: object.email
		};

		try
		{
			const validateEmail = await this.validateEmail(request, response, object);
			
			if (validateEmail.statusCode === 200)
			{
				const user = validateEmail.data[0];

				object.dbPassword = user.password;

				const validatePassword = await encryptDecrypt.decryptPassword(request, response, object);

				data.id = user._id;
				data.first_name = user.first_name;
				data.last_name = user.last_name;
				data.email = user.email;

				object.user = data;

				const generateJWTToken = await encryptDecrypt.generateJWTToken(request, response, object);

				if (validatePassword && generateJWTToken)
				{
					data.token = generateJWTToken;

					return indexResponse.jsonResponse(response, 200, process.env.SUCCESS_MSG, [], data);
				}
				else
				{
					return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [], data);
				}
			}
			else
			{
				return indexResponse.jsonResponse(response, validateEmail.statusCode, validateEmail.message, validateEmail.errorMsgs, data);	
			}
		}
		catch (error)
		{
			return indexResponse.jsonResponse(response, 500, process.env.ERROR_MSG, [error]);
		}
	}

	validateEmail = async (request, response, object) =>
	{
		try
		{
			const validateEmail = await User.aggregate([
				{
			        $project: 
			        {
						_id: 1,
						first_name: 1,
						last_name: 1,
						email: 1,
						password: 1,
						status_id: 1,
						is_deleted: 1
					}
			    },
			    {
			    	$match:
			    	{
			    		email: object.email,
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
				        as: "userStatus",
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
			    		"userStatus._id":
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

			if (validateEmail.length > 0)
			{
				return indexResponse.jsonResponse(response, 200, process.env.SUCCESS_MSG, [], validateEmail);
			}
			else
			{
				return indexResponse.jsonResponse(response, 404, process.env.NOT_FOUND_MSG, [
					{
						"email": "The email has already been taken."
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

module.exports = { UserQueries };