import mongoose, { ObjectId } from 'mongoose'
const {ObjectId} = mongoose.Schema.Types

type Detail = {
  name: string,
  value: string,
}

export interface IAccount {
  fullName: string,
  email?: string,
  password?: string,
  phoneNumber?: string,
  gender?: string,
  addresses?: [ObjectId],
  avatar?: string,
  dateOfBirth?: string,
  role?: string,
  status?: string,
  verified?: boolean,
  partnerName?: string
  favouritePartners?: Array<ObjectId>,
  services?: Array<ObjectId>,
  description?: string,
  details?: Array<Detail>, 
  location?: Array<string>
  cover?: string,
  uploadImage?: Array<string>
  zaloId?: string
}

export interface AccountDocument extends IAccount, mongoose.Document {
  _doc?: any
}
//fullName, 
const accountModel = new mongoose.Schema<AccountDocument>({
  fullName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
  },
  cover: String,
  dateOfBirth: String,
  phoneNumber: {
    type: String,
    unique: true,
  },
  // male, female
  gender: {
    type: String,
    default: 'male'
  },
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/dfkkrqh2s/image/upload/v1691966141/zaloTaskApp/avatar/Screenshot_2022-02-04_181853_u6m6cf_w3hnjo_itbmd4.png"
  },
  // user, admin, partner, tasker
  role: {
    type: String,
    default: 'user'
  },
  // pending, active, inactive
  status: {
    type: String,
    default: 'active'
  },
  verified: {
    type: Boolean,
    index: true
  },
  partnerName: {
    type: String,
    text: true,
    // trim: true  
  },//addresses,details,services,location,uploadImage
  addresses: [
    {
      type: ObjectId,
      ref: 'address'
    }
  ],
  details: [{
    name: String,
    value: String,
  }],
  favouritePartners: [{
    type: ObjectId,
    ref: 'account',
  }],
  services: [{
    type: ObjectId,
    ref: 'service'
  }],
  location: [String],
  description: String,
  uploadImage: [String]
})

accountModel.index({partnerName: 'text'})

const Accounts = mongoose.model("account", accountModel)
export default Accounts