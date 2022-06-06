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
  		check("email").notEmpty().withMessage("The email field is required.").isLength({ min: 3 }).withMessage("The email must be at least 3 character.").isLength({ max: 30 }).withMessage("The email must be less than 31 characters.").trim().normalizeEmail().isEmail().withMessage("The email must be a valid email address.").custom((value, { req }) => customValidation.validateEmail(req, value, "nonSignUp")).withMessage("The given email is invalid."),
		check("password").notEmpty().withMessage("The password field is required.").isLength({ min: 7}).withMessage("The password must be at least 7 character.").isLength({ max: 40 }).withMessage("The password must be less than 41 characters.")
	]
}