import mongoose, { Document, Model, ObjectId} from "mongoose";
import Notifications from "./notification.model";
import { notificationsPerPage } from "../../utils/perPage";

interface QueryStringType {
  page?: number
  sort?: number
  role?: string
}

class NotificationFeature {
  query: any
  queryString: QueryStringType

  constructor(queryString: QueryStringType) {
    this.queryString = queryString
  }
  
  private stringifyQuery(queryObj: any) {
    const excludedFields = ['page']
    excludedFields.forEach((el: string) => delete queryObj[el as keyof QueryStringType])
    return JSON.stringify(queryObj)
  }
  //only return ids
  public async filter() {
    const perPage = notificationsPerPage
    const queryObj = {...this.queryString}
    console.log(queryObj);


    
    let queryStr: string = this.stringifyQuery(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex|in|or|elemMatch|eq)\b/g, match => '$'+match)
    
    console.log(perPage*(this?.queryString?.page as number - 1)+perPage);

    this.query = await Notifications.find(JSON.parse(queryStr))
              .skip(perPage*(this?.queryString?.page as number - 1))
              .limit(perPage)
              .sort({'_id': -1})
              .exec()

    //.select('name sku images price minPrice maxPrice')
    return this
  }
}

export default NotificationFeature