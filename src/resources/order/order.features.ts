import mongoose, { Document, Model, ObjectId} from "mongoose";
import Orders from "./order.model";
import { ordersPerpage } from "../../utils/perPage";

interface QueryStringType {
  page?: number
  sort?: number
  status?: string,
  partner?: string
}

class OrderFeature {
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
    const perPage = ordersPerpage
    const queryObj = {...this.queryString}
    
    let queryStr: string = this.stringifyQuery(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex|text|search|in|or|elemMatch|eq)\b/g, match => '$'+match)
    
    console.log(this?.queryString);
    console.log('skip: ', perPage*(this?.queryString?.page -1));
    console.log('limit: ', perPage*(this?.queryString?.page -1)+perPage);
    // JSON.parse(queryStr)
    this.query = await Orders.find(JSON.parse(queryStr))
              .sort({'_id': -1})
              .populate('service address')
              .populate('user', 'fullName phoneNumber email')
              .populate('partner', 'email phoneNumber partnerName location')
              .skip(perPage*(this?.queryString?.page -1))
              .limit(perPage) // * (this?.queryString?.page -1)+perPage
              .exec()

    //.select('name sku images price minPrice maxPrice')
    return this
  }
}

export default OrderFeature