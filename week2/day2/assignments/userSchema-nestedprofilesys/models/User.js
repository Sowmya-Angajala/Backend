const mongoose = require('mongoose');
const validator = require('validator');


const ProfileSchema = new mongoose.Schema({
profileName: {
type: String,
required: [true, 'profileName is required'],
enum: {
values: ['fb', 'twitter', 'github', 'instagram'],
message: '{VALUE} is not a supported profile name',
},
},
url: {
type: String,
required: [true, 'url is required'],
validate: {
validator: function (v) {
return validator.isURL(v, { require_protocol: true });
},
message: (props) => `${props.value} is not a valid URL. Include http:// or https://`,
},
},
});


const UserSchema = new mongoose.Schema(
{
name: { type: String, required: [true, 'Name is required'] },
email: {
type: String,
required: [true, 'Email is required'],
unique: true,
lowercase: true,
validate: {
validator: function (v) {
return validator.isEmail(v);
},
message: (props) => `${props.value} is not a valid email`,
},
},
password: {
type: String,
required: [true, 'Password is required'],
minlength: [6, 'Password must be at least 6 characters long'],
},
profiles: {
type: [ProfileSchema],
default: [],
},
},
{ timestamps: true }
);


// create an index for email uniqueness at DB level
UserSchema.index({ email: 1 }, { unique: true });


const User = mongoose.model('User', UserSchema);
module.exports = User;