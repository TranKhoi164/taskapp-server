import App from './app'
import dotenv from 'dotenv'

dotenv.config()

const app = new App(Number(process.env.PORT))

app.listen()

// {
//   "src": "/(.*)",
//   "dest": "/",
//   "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   "headers": {
//     "Access-Control-Allow-Origin": "*"
//   }
// }