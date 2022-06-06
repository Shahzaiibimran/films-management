"use strict";

//Importing packages
const bcrypt = require("bcrypt");
const jwtToken = require("jsonwebtoken");

class EncryptDecrypt
{
	//encrypt password
	encryptPassword = async (request, response, object) =>
	{
		return await bcrypt.hashSync(object.password, await bcrypt.genSaltSync(10));	
	}

	//decrypt password
	decryptPassword = async (request, response, object) =>
	{
		return await bcrypt.compare(object.password, object.dbPassword);
	}

	//generate token
	generateJWTToken = async (request, response, object) =>
	{
		return new Promise((resolve, reject) => 
		{
	      	const payload = 
	      	{
	      		user: object.user
	      	};

	      	const jwtTokenKey = process.env.JWT_TOKEN_KEY;
	      	
	      	const options = 
	      	{
	        	expiresIn: process.env.JWT_EXPIRATION_TIME,
		        audience: object.user.toString()
	      	};

	      	jwtToken.sign(payload, jwtTokenKey, options, (error, token) => 
	      	{
		        if (error)
	        	{
	        		return reject(error);
	        	}
	        	else
        		{
		        	resolve(token);
	      		}
	      	});
    	});
	}
}

module.exports = { EncryptDecrypt };