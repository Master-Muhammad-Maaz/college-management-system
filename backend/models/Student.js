const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({

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

module.exports = mongoose.model("Student",studentSchema)