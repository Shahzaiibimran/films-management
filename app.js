"use strict";

//Packages list
const express = require("express");
const app = express(); 

//Imported classes list
const generalRoutes = require("./routes/GeneralRoutes.js");
const authRoutes = require("./routes/AuthRoutes.js");
const filmsRoutes = require("./routes/FilmsRoutes.js");
const commentsRoutes = require("./routes/CommentsRoutes.js");
const generateModels = require("./models"); //generating collection if not exist

//setting up asset url for serving files from server
app.use(express.static("./public"));

app.use(express.static("./uploads"));

//Setting up body-parser package for parsing form data
app.use(express.urlencoded({
	extended: true
}));

//Setting up json data
app.use(express.json());

//Importing .env file for enviromental variables
const env = require("dotenv").config();

//Importing routes files
app.use("/general", generalRoutes);
app.use("/auth", authRoutes);
app.use("/films", filmsRoutes);
app.use("/films/comments", commentsRoutes);

//Serving app
if (process.env.NODE_ENV === "local")
{
	app.listen(process.env.APP_PORT);
}
else
{
	module.exports.handler = serverlessHTTP(app);
}