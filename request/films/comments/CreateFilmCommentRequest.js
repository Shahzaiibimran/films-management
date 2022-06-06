"use strict";

//Packages list
const { check } = require("express-validator");

//Importing classes list
const { CustomValidation } = require("../../../helpers/validations/CustomValidation.js");

//Creating classes instance
const customValidation = new CustomValidation();

exports.validate = () =>
{
  	return [ 
		check("film_id").notEmpty().withMessage("The film id field is required.").isLength({ min: 24}).withMessage("The film id must be at least 24 character.").isLength({ max: 24 }).withMessage("The film id must be less than 25 characters.").custom((value, { req }) => customValidation.validateFilmFilmId(req, value)).withMessage("The given film id is invalid."),
		check("comment").notEmpty().withMessage("The comment field is required.").isLength({ min: 1}).withMessage("The comment must be at least 1 character.").isLength({ max: 2200 }).withMessage("The comment must be less than 2201 characters.")
	] 
}