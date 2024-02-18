import mongoose from 'mongoose'
const {ObjectId} = mongoose.Schema.Types

interface UserOTPVerificationInterface {
  otp: string,
  userId: string,
  task: string,
  createdAt: Date,
  expiresAt: Date
}

const userOTPVerificationModel = new mongoose.Schema<UserOTPVerificationInterface>({
  userId: String,
  otp: String,
  task: String, //register || resetPassword
  createdAt: {
    type: Date,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
})

const UserOTPVerification = mongoose.model("UserOtpVerification", userOTPVerificationModel)
export default UserOTPVerification