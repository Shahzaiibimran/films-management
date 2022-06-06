"use strict";

//Importing packages
const mongoose = require("mongoose");

//Imported classes list
const env = require("dotenv").config();

class IndexResponse
{
	jsonResponse = (response, statusCode, message, errorMsgs = [], data = {}) =>
	{
		mongoose.connection.close(false, () => 
		{});

		const httpResponse = {
	        statusCode: statusCode,
	        message: message,
	        errorMsgs: errorMsgs,
	        data: data
	    };
	    
		return httpResponse;
	}

	apiResponse = (response, statusCode, message, errorMsgs = [], data = {}) =>
	{
		const http_response = {
			response: statusCode === 200 ? true : false,
	        status_code: statusCode,
	        message: message,
	        error_msgs: statusCode === 422 || process.env.APP_DEBUG === "true" ? errorMsgs : [],
	        data: data
	    };
	    
		return response.status(http_response.status_code).json(http_response);
	}

	validationErrors = (errors = []) =>
	{
		let array = [];

	    errors.forEach((error) =>
	    {
	        var obj = {};
	        
	        obj[error.param] = error.msg;

	        array.push(obj);
	    });
	    
	    return array;
	}
}

module.exports = { IndexResponse };