"use strict";

//Packages list
const { check } = require("express-validator");

//Importing classes list
const { CustomValidation } = require("../../helpers/validations/CustomValidation.js");

//Creating classes instance
const customValidation = new CustomValidation();

exports.validate = () =>
{
  	return [ 
		check("slug").notEmpty().withMessage("The slug field is required.").isLength({ min: 7}).withMessage("The slug must be at least 7 character.").isLength({ max: 50 }).withMessage("The slug must be less than 51 characters.").custom((value, { req }) => customValidation.validateFilmSlug(req, value)).withMessage("The given slug is invalid.")
	] 
}