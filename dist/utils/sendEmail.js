"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { SENDER_EMAIL_ADDRESS, SENDER_PASSWORD } = process.env;
const mailOptionRegister = (to, otp) => {
    const mailOption = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "TASK to you",
        html: `
  <div>
    <div>
      <h2>Cảm ơn bạn vì đã đăng ký</h2>
      <div>Đây là mã OTP của bạn, mã OTP này có hiệu lực trong 5 phút</div>
      <div>
        <div
          style="
            background: black;
            color: white;
            margin-top: 30px;
            width: 150px;
            height: 40px;
            border-radius: 30px;
            cursor: pointer;
            font-size: 15px;
          "
        >
          ${otp}
        </div>
      </div>
    </div>
  </div>
    `,
    };
    return mailOption;
};
const mailOptionResetPassword = (to, otp) => {
    const mailOption = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "TASK to you",
        html: `
  <div>
    <div>
      <div>Mã OTP dùng để tạo mật khẩu mới, mã OTP này có hiệu lực trong 5 phút</div>
      <div>
        <div
          style="
            background: black;
            color: white;
            margin-top: 30px;
            width: 150px;
            height: 40px;
            border-radius: 30px;
            cursor: pointer;
            font-size: 15px;
          "
        >
          ${otp}
        </div>
      </div>
    </div>
  </div>
    `,
    };
    return mailOption;
};
const mailOptionVerifyPartner = (to) => {
    const mailOption = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "TASK to you",
        html: `
    <div>
      <div>
        <div>
          Tài khoản doanh nghiệp của bạn đã được xác nhận. Bạn có thể đăng nhập và sử dụng các tính năng dành cho doanh nghiệp
        </div>
      </div>
    </div>
    `,
    };
    return mailOption;
};
const mailOptionUnverifyPartner = (to) => {
    const mailOption = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "TASK to you",
        html: `
    <div>
      <div>
        <div>
          Tài khoản doanh nghiệp của bạn đã ngưng hoạt động. Bạn sẽ không thể đăng nhập hay sử dụng các tính năng dành cho doanh nghiệp
        </div>
      </div>
    </div>
    `,
    };
    return mailOption;
};
const mailOptionDeletePartner = (to) => {
    const mailOption = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "TASK to you",
        html: `
    <div>
      <div>
        <div>
          Tài khoản doanh nghiệp bạn đăng ký đã bị hủy bỏ
        </div>
      </div>
    </div>
    `,
    };
    return mailOption;
};
const sendOTPEmail = (to, otp, task) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("sender: ", SENDER_EMAIL_ADDRESS);
            console.log("pass: ", SENDER_PASSWORD);
            let transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                secure: true,
                auth: {
                    user: String(SENDER_EMAIL_ADDRESS),
                    pass: String(SENDER_PASSWORD),
                },
            });
            let mailOption;
            if (task === 'register') {
                mailOption = mailOptionRegister(to, otp);
            }
            else if (task === 'resetPassword') {
                mailOption = mailOptionResetPassword(to, otp);
            }
            else if (task === 'verifyPartner') {
                mailOption = mailOptionVerifyPartner(to);
            }
            else if (task === 'unverifyPartner') {
                mailOption = mailOptionUnverifyPartner(to);
            }
            else if (task === 'deletePartner') {
                mailOption = mailOptionDeletePartner(to);
            }
            transporter.sendMail(mailOption, (err, inf) => {
                if (err) {
                    reject(err);
                }
                if (inf) {
                    resolve(inf);
                }
            });
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.sendOTPEmail = sendOTPEmail;
