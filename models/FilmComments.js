"use strict";

//Importing packages
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoConnection = require("../config/database/index.js");

const filmCommentsSchema = new schema({
    user_id:
    {
        type: mongoose.Types.ObjectId,
        ref: "User",
        index: true
    },
    film_id:
    {
        type: mongoose.Types.ObjectId,
        ref: "Film",
        index: true
    },
    text:
    {
        type: "string"
    },
    deleted:
    {
        type: "boolean",
        default: false,
        index:true
    },
    deleted_at:
    {
        type: "date",
        default: null
    }
},{
    timestamps:
    {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

filmCommentsSchema.set("toJSON",
{
    virtuals: true
});

filmCommentsSchema.set("toObject",
{
    virtuals: true
});

filmCommentsSchema.index({created_at: 1});

const modelName = mongoConnection.model("FilmComments", filmCommentsSchema, "film_comments");

modelName.ensureIndexes((err) => 
{ 
    if (err) console.log("model error: ", err); 
}); 

module.exports = modelName;