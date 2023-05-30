const { Schema, Types } = require('mongoose');
const { isEmail } = require('validator');


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: isEmail,
            message: "Please enter a valid email"
        },
    }
})