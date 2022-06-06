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
		check("title").notEmpty().withMessage("The title field is required.").isLength({ min: 7}).withMessage("The title must be at least 7 character.").isLength({ max: 50 }).withMessage("The title must be less than 51 characters."),
  		check("description").notEmpty().withMessage("The description field is required.").isLength({ min: 20}).withMessage("The description must be at least 20 character.").isLength({ max: 5000 }).withMessage("The description must be less than 5001 characters."),
  		check("released_date").notEmpty().withMessage("The released date field is required.").custom((value, { req }) => customValidation.validateDate(req, value)).withMessage("The given released date is invalid."),
		check("rating").notEmpty().withMessage("The rating field is required.").isLength({ min: 1}).withMessage("The rating must be at least 1 character.").isLength({ max: 1 }).withMessage("The rating must be less than 1 characters."),
		check("price").notEmpty().withMessage("The price field is required.").isLength({ min: 1}).withMessage("The price must be at least 1 character.").isLength({ max: 12 }).withMessage("The price must be less than 13 characters.").custom((value, { req }) => customValidation.validateDoubleDataType(req, value)).withMessage("The given price is invalid."),
		check("country_id").notEmpty().withMessage("The country id field is required.").isLength({ min: 24 }).withMessage("The country id must be at least 24 character.").isLength({ max: 24 }).withMessage("The country id must be less than 25 characters.").custom((value, { req }) => customValidation.validateCountryId(req, value)).withMessage("The given country id is invalid."),
		check("genres_id").notEmpty().withMessage("The genres id field is required.").isArray().withMessage("The genres id must be an array.").custom((value, { req }) => customValidation.validateGenresId(req, value)).withMessage("The given genres id are invalid."),
		check("cover_photo").custom((value, { req }) => customValidation.fileType(req, req.file, "jpeg,jpg,png")).withMessage("The cover photo must be a file of type jpeg, jpg, png.").custom((value, { req }) => customValidation.fileSize(req, req.file, 3000)).withMessage("The cover photo may not be greater than 3000 kilobytes.")
	] 
}