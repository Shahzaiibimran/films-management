"use strict";

//Importing packages
const mongoose = require("mongoose");
const env = require("dotenv").config();

let mongoConnection = null;

class Index
{
	//Create mongodb connection
	index = () =>
	{
		try
		{
			if (mongoConnection === null)
			{
				mongoConnection = mongoose.createConnection(process.env.MONGO_DB_HOST,
				{
					minPoolSize: 1,
					maxPoolSize: 20,
					keepAlive: true,
					//socketTimeoutMS: 5000,
					//useNewUrlParser: true,
					//useUnifiedTopology: true,
					serverSelectionTimeoutMS: 10000
				});	
			}
		}
		catch (error)
		{
			console.error("Unable to connect to the mongo db:", error);
		}

		return mongoConnection;
	}
}

module.exports = (new Index()).index();