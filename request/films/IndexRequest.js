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
		check("limit").notEmpty().withMessage("The limit field is required.").isLength({ min: 1 }).withMessage("The limit must be at least 1 character.").isNumeric().withMessage("The limit field must be a number").isInt({ gt: 0}).withMessage("The limit must be greater than 0."),
		check("from").notEmpty().withMessage("The from field is required.").isLength({ min: 1 }).withMessage("The from must be at least 1 character.").isNumeric().withMessage("The from field must be a number")
	] 
}