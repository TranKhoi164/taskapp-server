import App from './app'
import dotenv from 'dotenv'

dotenv.config()

new App(Number(process.env.PORT))


// {
//   "src": "/(.*)",
//   "dest": "/",
//   "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   "headers": {
//     "Access-Control-Allow-Origin": "*"
//   }
// }