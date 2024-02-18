import mongoose from 'mongoose'
const {ObjectId} = mongoose.Schema.Types

const serviceModel = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  }
})

const Services = mongoose.model("service", serviceModel)
export default Services