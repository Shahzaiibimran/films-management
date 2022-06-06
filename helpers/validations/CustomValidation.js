"use strict";

//Importing packages
const env = require("dotenv").config();
const mongoose = require("mongoose");

//Importing classes list
const { User, Film, Country, Genre } = require("../../models");

class CustomValidation
{
	validateEmail = async (request, email, checkingType) =>
	{
		try
		{
			const validateEmail = await User.aggregate([
				{
			        $project: 
			        {
						_id: 1,
						email: 1,
						status_id: 1,
						is_deleted: 1
					}
			    },
			    {
			    	$match:
			    	{
			    		email: email
			    		//is_deleted: false
			    	}
			    }
			    /*{
			    	$lookup:
			    	{
				        from: "statuses",
				        let:
				        {
				        	status_id: "$status_id"
				        },
				        as: "userStatus",
				        pipeline: [
				        	{ 
				            	$project: 
			            		{ 
			            			_id: 1, 
			            			title: 1
			            		}
			            	},
			            	{
			            		$match:
			            		{
			            			$expr:
			            			{
			            				$and:
			            				[
				            				{
					            				$eq: [
					            					"$_id", "$$status_id"
					            				]
				            				}
			            				]
			            			}	
			            		}
			            	},
			            	{
			            		$match:
			            		{
	            					name: "active"
	            				}
			            	}
				        ]
				    }
			    },
			    {
			    	$match: 
			    	{
			    		"userStatus._id":
			    		{ 
			    			$exists: true, 
			    			$not:
			    			{
			    				$size: 0
			    			}
			    		}
			    	}
			    }*/
			]);

			if (validateEmail.length > 0 && checkingType === "nonSignUp")
			{
				return true;
			}
			else if (validateEmail.length === 0 && checkingType === "nonSignUp")
			{
				return new Promise.reject(false);
			}
			else if (validateEmail.length > 0 && checkingType === "signUp")
			{
				return new Promise.reject(false);
			}
			else
			{
				return true;
			}
		}
		catch (error)
		{
			return new Promise.reject(false);
		}
	}

	validateConfirmPassword = async (request, password, confirmPassword) =>
	{
		if (password === confirmPassword)
		{
			return true;
		}
		else
		{
			return new Promise.reject(false);
		}
	}

	validateDate = async (request, date) =>
	{
		if (/\d{4}-\d{2}-\d{2}/.test(date))
		{
			const validateDate = new Date(date);
			
			if (validateDate.toISOString().split("T")[0] !== date)
			{
				return new Promise.reject(false);
			}
			else
			{
				return true;
			}
		}
		else
		{
			return new Promise.reject(false);
		}
	}

	validateDoubleDataType = async (request, number) =>
	{
		if (/^[-+]?[0-9]+\.[0-9]+$/.test(number))
		{
			return true;
		}
		else
		{
			return new Promise.reject(false);
		}
	}

	validateArrayDataType = async (request, values) =>
	{
		if (Array.isArray(values))
		{
			return true;
		}
		else
		{
			return new Promise.reject(false);
		}
	}

	validateCountryId = async (request, countryId) =>
	{
		try
		{
			const validateCountryId = await Country.aggregate([
				{
			        $project: 
			        {
						_id: 1,
						status_id: 1,
						is_deleted: 1
					}
			    },
			    {
			    	$match:
			    	{
			    		_id: countryId,
			    		is_deleted: false
			    	}
			    },
			    {
			    	$lookup:
			    	{
				        from: "statuses",
				        let:
				        {
				        	status_id: "$status"
				        },
				        as: "countryStatus",
				        pipeline: [
				        	{ 
				            	$project: 
			            		{ 
			            			_id: 1, 
			            			title: 1
			            		}
			            	},
			            	{
			            		$match:
			            		{
			            			$expr:
			            			{
			            				$and:
			            				[
				            				{
					            				$eq: [
					            					"$_id", "$$status_id"
					            				]
				            				}
			            				]
			            			}	
			            		}
			            	},
			            	{
			            		$match:
			            		{
	            					name: "active"
	            				}
			            	}
				        ]
				    }
			    },
			    {
			    	$match: 
			    	{
			    		"countryStatus._id":
			    		{ 
			    			$exists: true, 
			    			$not:
			    			{
			    				$size: 0
			    			}
			    		}
			    	}
			    }
			]);

			if (validateCountryId.length > 0)
			{
				return true;
			}
			else
			{
				return true;
			}
		}
		catch (error)
		{
			return new Promise.reject(false);
		}
	}

	validateGenresId = async (request, genresId) =>
	{
		try
		{
			const validateGenresId = await Genre.aggregate([
				{
			        $project: 
			        {
						_id: 1,
						status_id: 1,
						is_deleted: 1
					}
			    },
			    {
			    	$match:
			    	{
			    		_id:
			    		{
			    			$in: genresId
			    		}
			    	}
			    },
			    {
			    	$match:
			    	{
			    		is_deleted: false
			    	}
			    },
			    {
			    	$lookup:
			    	{
				        from: "statuses",
				        let:
				        {
				        	status_id: "$status"
				        },
				        as: "genresStatus",
				        pipeline: [
				        	{ 
				            	$project: 
			            		{ 
			            			_id: 1, 
			            			title: 1
			            		}
			            	},
			            	{
			            		$match:
			            		{
			            			$expr:
			            			{
			            				$and:
			            				[
				            				{
					            				$eq: [
					            					"$_id", "$$status_id"
					            				]
				            				}
			            				]
			            			}	
			            		}
			            	},
			            	{
			            		$match:
			            		{
	            					name: "active"
	            				}
			            	}
				        ]
				    }
			    },
			    {
			    	$match: 
			    	{
			    		"genresStatus._id":
			    		{ 
			    			$exists: true, 
			    			$not:
			    			{
			    				$size: 0
			    			}
			    		}
			    	}
			    }
			]);

			if (validateGenresId.length > 0)
			{
				return true;
			}
			else
			{
				return true;
			}
		}
		catch (error)
		{
			return new Promise.reject(false);
		}
	}

	fileType = async (request, file, mimeTypes = "jpeg, jpg, png") =>
	{
		const fileName = file.originalname;

	    const fileExtension = await this.getFileExtension(request, fileName);

	    const requiredExtensions = mimeTypes.replace(", ", ",").split(",");
	    
	    if (requiredExtensions.includes(fileExtension))
	    {
	        return true;
	    }
	    else
    	{
    		return new Promise.reject(false);
    	}
	}

	getFileExtension = async (request, fileName) =>
	{
	    return fileName.toLowerCase().split(".")[1];
	}

	fileSize = async (request, file, fileSize = 1000) =>
	{
		const dm = 0;
		
		const kb = 1024;

	    let currentFileSize = file.size;

	    const convertingBytestoKB = Math.floor(Math.log(currentFileSize) / Math.log(kb));

	    currentFileSize = parseFloat((currentFileSize / Math.pow(kb, convertingBytestoKB)).toFixed(dm));
	    
	    if (fileSize > currentFileSize)
	    {
	        return true;
	    }
	    else
    	{
    		return new Promise.reject(false);
    	}
	}

	validateFilmSlug = async (request, slug) =>
	{
		try
		{
			const film = await Film.aggregate([
				{
			        $project: 
			        {
						_id: 1,
						slug: 1,
						status_id: 1,
						is_deleted: 1
					}
			    },
			    {
			    	$match:
			    	{
			    		slug: slug,
			    		is_deleted: false
			    	}
			    },
			    {
			    	$lookup:
			    	{
				        from: "statuses",
				        let:
				        {
				        	status_id: "$status"
				        },
				        as: "filmStatus",
				        pipeline: [
				        	{ 
				            	$project: 
			            		{ 
			            			_id: 1, 
			            			title: 1
			            		}
			            	},
			            	{
			            		$match:
			            		{
			            			$expr:
			            			{
			            				$and:
			            				[
				            				{
					            				$eq: [
					            					"$_id", "$$status_id"
					            				]
				            				}
			            				]
			            			}	
			            		}
			            	},
			            	{
			            		$match:
			            		{
	            					name: "active"
	            				}
			            	}
				        ]
				    }
			    },
			    {
			    	$match: 
			    	{
			    		"filmStatus._id":
			    		{ 
			    			$exists: true, 
			    			$not:
			    			{
			    				$size: 0
			    			}
			    		}
			    	}
			    }
			]);

			if (film.length > 0)
			{
				return true;
			}
			else
			{
				return true;
			}
		}
		catch (error)
		{co
			return new Promise.reject(false);
		}
	}

	validateFilmFilmId = async (request, filmId) =>
	{
		try
		{
			const film = await Film.aggregate([
				{
			        $project: 
			        {
						_id: 1,
						status_id: 1,
						is_deleted: 1
					}
			    },
			    {
			    	$match:
			    	{
			    		_id: mongoose.Types.ObjectId(filmId),
			    		is_deleted: false
			    	}
			    },
			    {
			    	$lookup:
			    	{
				        from: "statuses",
				        let:
				        {
				        	status_id: "$status"
				        },
				        as: "filmStatus",
				        pipeline: [
				        	{ 
				            	$project: 
			            		{ 
			            			_id: 1, 
			            			title: 1
			            		}
			            	},
			            	{
			            		$match:
			            		{
			            			$expr:
			            			{
			            				$and:
			            				[
				            				{
					            				$eq: [
					            					"$_id", "$$status_id"
					            				]
				            				}
			            				]
			            			}	
			            		}
			            	},
			            	{
			            		$match:
			            		{
	            					name: "active"
	            				}
			            	}
				        ]
				    }
			    },
			    {
			    	$match: 
			    	{
			    		"filmStatus._id":
			    		{ 
			    			$exists: true, 
			    			$not:
			    			{
			    				$size: 0
			    			}
			    		}
			    	}
			    }
			]);

			if (film.length > 0)
			{
				return true;
			}
			else
			{
				return true;
			}
		}
		catch (error)
		{co
			return new Promise.reject(false);
		}
	}
}

module.exports = { CustomValidation };