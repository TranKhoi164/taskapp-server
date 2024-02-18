import { Request, Response } from "express";
import handleException from "../../utils/handleExceptions";
import Services from "./service.model";
import { missingInforWarn } from "../../utils/warning";


class ServiceController {
  public async getServices(req: Request, res: Response) {
    try {
      const services = await Services.find({})
      return res.json({services: services})
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }
  public async createService(req: Request, res: Response) {
    try {
      const {name} = req.body
      if (!name) {
        handleException(400, missingInforWarn, res)
        return
      }
      const newService = new Services({name})
      await newService.save()
      return res.json({message: "Thành công!", service: newService})
    } catch (e: any) {
      handleException(500, 'Dịch vụ đã tồn tại', res)
    }
  }
  public async deleteService(req: Request, res: Response) {
    try {
      const {serviceId} = req.body
      if (!serviceId) {
        handleException(400, missingInforWarn, res)
        return
      }
      await Services.deleteOne({_id: serviceId})
      return res.json({message: "Thành công!"})
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }
  public async deleteServices(req: Request, res: Response) {
    try {
      const {servicesId} = req.body
      if (!servicesId) {
        handleException(400, missingInforWarn, res)
        return
      }
      await Services.deleteMany({_id: {$in: servicesId}})
      return res.json({message: "Thành công!"})
    } catch (e: any) {
      handleException(500, e.message, res)
    }
  }
}

export default ServiceController