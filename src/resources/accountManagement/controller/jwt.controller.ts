import { Request, Response } from "express";
import { JwtControllerInterface } from "../../../interfaces/controllerInterfaces/account.interfaces";
import  jwt from "jsonwebtoken";
import handleException from "../../../utils/handleExceptions";


class JwtController implements JwtControllerInterface {
  public createAccessToken(payload: any): string {
    return jwt.sign(payload, String(process.env.JWT_ACCESS_TOKEN), {expiresIn: '15m'})
  }
  public createRefreshToken(payload: any, res: Response): string {
    const refresh_token = jwt.sign(payload, String(process.env.JWT_REFRESH_TOKEN), {expiresIn: '7d'})

    res.cookie('refreshtoken', refresh_token, {
      httpOnly: true,
      path: '/account/refresh_token',
      sameSite: 'strict',
      maxAge: 7*24*59*60*1000
      //7*24*60*60*1000 //1 week
    })
    return refresh_token
  }

  public refreshRefreshToken = (req: Request, res: Response) => {
    try {
      const { _id } = req.body
      const refresh_token = jwt.sign({_id: _id}, String(process.env.JWT_REFRESH_TOKEN), {expiresIn: '7d'})

      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/account/refresh_token',
        sameSite: 'strict',
        maxAge: 7*24*59*60*1000 
        //7*24*60*60*1000 //1 week
      })
      const access_token = this.createAccessToken({ _id: _id });
      res.json({access_token: access_token})
    } catch(e: any) {
      handleException(500, e.message, res)
    }
  }

  public refreshAccessToken = (req: Request, res: Response): void => {
    try {
      let refresh_token = req.body.refresh_token
      jwt.verify(refresh_token, String(process.env.JWT_REFRESH_TOKEN), async (e: any, accountData: any) => {
        if (e) {
          handleException(400, e.message, res)
          return
        }
        const access_token = this.createAccessToken({_id: accountData._id})
        
        res.json({access_token: access_token})
      })
    } catch(e: any) {
      handleException(500, e.message, res)
    }
  }
}

export default JwtController