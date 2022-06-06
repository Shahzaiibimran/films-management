"use strict";

//Importing packages
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoConnection = require("../config/database/index.js");

const filmSchema = new schema({
    title:
    {
        type: "string",
        index: true
    },
    slug:
    {
        type: "string",
        unique: true
    },
    description:
    {
        type: "string"
    },
    released_date:
    {
        type: "string",
        index: true
    },
    rating:
    {
        type: "number",
        index: true
    },
    price:
    {
        type: "number",
        index: true
    },
    country_id:
    {
        type: mongoose.Types.ObjectId,
        ref: "Country",
        index: true
    },
    genres:
    [
        {
            genre_id:
            {
                type: mongoose.Types.ObjectId,
                ref: "Genre",
                index: true
            }
        }
    ],
    cover_image:
    {
        type: "string"
    },
    status_id:
    {
        type: mongoose.Types.ObjectId,
        ref: "Status",
        index: true
    },
    is_deleted:
    {
        type: "boolean",
        default: false,
        index: true
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

filmSchema.set("toJSON",
{
    virtuals: true
});

filmSchema.set("toObject",
{
    virtuals: true
});

filmSchema.index({created_at: 1});

const modelName = mongoConnection.model("Film", filmSchema, "films");

modelName.ensureIndexes((err) => 
{ 
    if (err) console.log("model error: ", err); 
}); 

module.exports = modelName;