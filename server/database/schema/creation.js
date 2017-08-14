const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema

const CreationSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User'
  },

  video: {
    type: ObjectId,
    ref: 'Video'
  },

  audio: {
    type: ObjectId,
    ref: 'Audio'
  },

  title: String,

  qiniu_thumb: String,
  qiniu_video: String,

  cloudinary_thumb: String,
  cloudinary_video: String,

  finish: {
    type: Number,
    default: 0
  },

  votes: [String],
  up: {
    type: Number,
    default: 0
  },

  meta: {
    createAt: {
      type: Date,
      dafault: Date.now()
    },
    updateAt: {
      type: Date,
      dafault: Date.now()
    }
  }
})

mongoose.model('Creation', CreationSchema)
