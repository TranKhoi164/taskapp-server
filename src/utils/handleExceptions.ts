import { Response } from "express";

export default function handleException(status: number, msg: any, res: Response ): Response {
  console.log(msg);
  return res.status(status).json({message: msg})
}