import mongoose from 'mongoose'
const {ObjectId} = mongoose.Schema.Types

const orderModel = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'account',
    required: true
  },
  partner: {
    type: ObjectId,
    ref: 'account',
    required: true
  },
  userName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  service: {
    type: ObjectId,
    ref: 'service',
    required: true
  },
  email: {
    type: String
  },
  userNote: {
    type: String,
  },
  address: {
    type: ObjectId,
    ref: 'address',
    required: true,
  },
  status: {
    type: String,
    default: 'await' // active || complete || inactive
  },
  location: {
    type: String,
    required: true
  },
  partnerNote: {
    type: String,
  }
}, {timestamps: true})


orderModel.index({userName: 'text'})

const Orders = mongoose.model("order", orderModel)
export default Orders