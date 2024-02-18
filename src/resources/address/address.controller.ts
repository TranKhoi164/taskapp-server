import { Request, Response } from "express";
import handleException from "../../utils/handleExceptions";
import Addresses from "./address.model";
import { missingInforWarn } from "../../utils/warning";


class AddressController {
  public async createAddress(req: Request, res: Response) {
    try {
      const {province, ward, district, address} = req.body
      if (!province || !ward || !district || !address) {
        handleException(400, missingInforWarn, res)
        return
      }
      const newAddress = new Addresses({province, ward, district, address})
      await newAddress.save()
      return res.json({message: "Thành công!", address: newAddress})
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }

  public async deleteAddress(req: Request, res: Response) {
    try {
      const {address_id} = req.params
      console.log('addressId: ', address_id);
      if (!address_id) {
        handleException(400, missingInforWarn, res)
        return
      }
      await Addresses.findByIdAndDelete(address_id)
      return res.json({message: "Thành công!"})
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }


  public async createAddresses(req: Request, res: Response) {
    try {
      const {addresses} = req.body
      if (addresses?.length == 0) {
        handleException(400, "Chưa cung cấp đủ thông tin", res)
        return
      }

      console.log(addresses);

      Addresses.insertMany(addresses)
      .then(docs => {
        res.json({message: "Thành công!", addresses: docs?.map(el=>el?._id)})
      }).catch(e=> {
        handleException(500, e.message, res)
      })
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }
}

export default AddressController