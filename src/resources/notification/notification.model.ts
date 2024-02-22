import mongoose from 'mongoose'
const {ObjectId} = mongoose.Schema.Types

const notificationModel = new mongoose.Schema({
  title: String,
  body: String,
  sender: {
    type: ObjectId,
    ref: 'account'
  },
  roleOfReceiver: String, // admin, partner, user
  to: {
    type: ObjectId,
    ref: 'account',
    index: true
  },
  isSeen: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
})

const Notifications = mongoose.model("notification", notificationModel)
export default Notifications