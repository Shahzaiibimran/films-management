"use strict";

//Importing packages
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoConnection = require("../config/database/index.js");

const statusSchema = new schema({
    title:
    {
        type: "string",
        index: true
    }
},{
    timestamps:
    {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

statusSchema.set("toJSON",
{
    virtuals: true
});

statusSchema.set("toObject",
{
    virtuals: true
});

statusSchema.index({created_at: 1});

const modelName = mongoConnection.model("Status", statusSchema, "statuses");

modelName.ensureIndexes((err) => 
{ 
    if (err) console.log("model error: ", err); 
}); 

module.exports = modelName;