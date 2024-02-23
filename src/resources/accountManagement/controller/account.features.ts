import mongoose, { Document, Model, ObjectId} from "mongoose";
import Accounts from "../model/account.model";
import { accountsPerpage } from "../../../utils/perPage";

interface QueryStringType {
  page?: number
  sort?: number
  status?: string,
  partner?: string
}

class AccountFeature {
  query: any
  queryString: any

  constructor(queryString: any) {
    this.queryString = queryString
  }
  
  private stringifyQuery(queryObj: any) {
    const excludedFields = ['page']
    excludedFields.forEach((el: string) => delete queryObj[el as keyof QueryStringType])
    return JSON.stringify(queryObj)
  }
  //only return ids
  public async filter() {
    const perPage = accountsPerpage
    const queryObj = {...this.queryString}
    await Accounts.init()

    
    let queryStr: string = this.stringifyQuery(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex|text|search|in|or|elemMatch|eq)\b/g, match => '$'+match)
    
    console.log(this?.queryString);
    console.log('skip: ', perPage*(this?.queryString?.page -1));
    console.log('limit: ', perPage*(this?.queryString?.page -1)+perPage);
    // JSON.parse(queryStr)
    console.log(queryStr);
    this.query = await Accounts.find(JSON.parse(queryStr))
              .sort({'_id': -1})
              .populate('services')
              .select('avatar email fullName phoneNumber partnerName addresses services location cover')
              .select('-password')
              .skip(perPage*(this?.queryString?.page -1))
              .limit(perPage) // * (this?.queryString?.page -1)+perPage
              .exec()

    //.select('name sku images price minPrice maxPrice')
    return this
  }
}

export default AccountFeature