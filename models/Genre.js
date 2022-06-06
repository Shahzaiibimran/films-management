"use strict";

//Importing packages
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoConnection = require("../config/database/index.js");

const genreSchema = new schema({
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

genreSchema.set("toJSON",
{
    virtuals: true
});

genreSchema.set("toObject",
{
    virtuals: true
});

genreSchema.index({created_at: 1});

const modelName = mongoConnection.model("Genre", genreSchema, "genres");

modelName.ensureIndexes((err) => 
{ 
    if (err) console.log("model error: ", err); 
}); 

module.exports = modelName;