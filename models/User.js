"use strict";

//Importing packages
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoConnection = require("../config/database/index.js");

const userSchema = new schema({
    first_name:
    {
        type: "string",
        index: true
    },
    last_name:
    {
        type: "string",
        index: true
    },
    email:
    {
        type: "string",
        index: true,
        unique: true
    },
    password:
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

userSchema.set("toJSON",
{
    virtuals: true
});

userSchema.set("toObject",
{
    virtuals: true
});

userSchema.index({created_at: 1});

const modelName = mongoConnection.model("User", userSchema, "users");

modelName.ensureIndexes((err) => 
{ 
    if (err) console.log("model error: ", err); 
}); 

module.exports = modelName;