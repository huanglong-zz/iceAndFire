const mongoose = require('mongoose')
const { Schema } = mongoose

const ExamResultSchema = new Schema({
  openid: String,
  result: [
    { profession: String, intro: String }
  ]
})

mongoose.model('ExamResult', ExamResultSchema)
