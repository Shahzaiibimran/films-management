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
  		check("first_name").notEmpty().withMessage("The first name field is required.").isLength({ min: 3}).withMessage("The first name must be at least 3 character.").isLength({ max: 20 }).withMessage("The first name must be less than 21 characters."),
  		check("last_name").notEmpty().withMessage("The last name field is required.").isLength({ min: 3}).withMessage("The last name must be at least 3 character.").isLength({ max: 20 }).withMessage("The last name must be less than 21 characters."),
		check("email").notEmpty().withMessage("The email field is required.").isLength({ min: 3 }).withMessage("The email must be at least 3 character.").isLength({ max: 30 }).withMessage("The email must be less than 31 characters.").trim().normalizeEmail().isEmail().withMessage("The email must be a valid email address.").custom((value, { req }) => customValidation.validateEmail(req, value, "signUp")).withMessage("The email has already been taken."),
		check("password").notEmpty().withMessage("The password field is required.").isLength({ min: 7}).withMessage("The password must be at least 7 character.").isLength({ max: 40 }).withMessage("The password must be less than 41 characters."),
		check("confirm_password").notEmpty().withMessage("The confirm password field is required.").isLength({ min: 7}).withMessage("The confirm password must be at least 7 character.").isLength({ max: 40 }).withMessage("The confirm password must be less than 41 characters.").custom((value, { req }) => customValidation.validateConfirmPassword(req, value, req.body.password)).withMessage("The confirm password and password must match.")
	]
}