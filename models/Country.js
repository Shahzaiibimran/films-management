"use strict";

//Importing packages
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoConnection = require("../config/database/index.js");

const countrySchema = new schema({
    title:
    {
        type: "string",
        index: true
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

countrySchema.set("toJSON",
{
    virtuals: true
});

countrySchema.set("toObject",
{
    virtuals: true
});

countrySchema.index({created_at: 1});

const modelName = mongoConnection.model("Country", countrySchema, "countries");

modelName.ensureIndexes((err) => 
{ 
    if (err) console.log("model error: ", err); 
}); 

module.exports = modelName;