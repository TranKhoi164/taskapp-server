import mongoose from 'mongoose'
const {ObjectId} = mongoose.Schema.Types

const addressModel = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  ward: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  }
})

const Addresses = mongoose.model("address", addressModel)
export default Addresses