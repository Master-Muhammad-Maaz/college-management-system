const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

contact:{
type:String,
required:true,
unique:true
},

dob:{
type:String,
required:true
}

})

module.exports = mongoose.model("Admin",adminSchema)