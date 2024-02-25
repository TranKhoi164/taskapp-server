import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { SENDER_EMAIL_ADDRESS, SENDER_PASSWORD } = process.env;

const mailOptionRegister = (to: string, otp: string) => {
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
            display: inline-block;
            background: black;
            color: white;
            margin-top: 30px;
            padding: 10px 30px;
            cursor: pointer;
            font-size: 17px;
          "
        >
          ${otp}
        </div>
      </div>
    </div>
  </div>
    `,
  };
  return mailOption
}

const mailOptionResetPassword = (to: string, otp: string) => {
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
            display: inline-block;
            background: black;
            color: white;
            margin-top: 30px;
            padding: 10px 30px;
            cursor: pointer;
            font-size: 17px;
          "
        >
          ${otp}
        </div>
      </div>
    </div>
  </div>
    `,
  };
  return mailOption
}

const mailOptionVerifyPartner = (to: string) => {
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
  return mailOption
}

const mailOptionUnverifyPartner = (to: string) => {
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
  return mailOption
}

const mailOptionDeletePartner = (to: string) => {
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
  return mailOption
}


export const sendOTPEmail = (to: string, otp: string, task: string) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("sender: ", SENDER_EMAIL_ADDRESS);
      console.log("pass: ", SENDER_PASSWORD);
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: true,
        auth: {
          user: String(SENDER_EMAIL_ADDRESS),
          pass: String(SENDER_PASSWORD),
        },
      });

      let mailOption: any
      if (task === 'register') {
        mailOption = mailOptionRegister(to, otp)
      } else if (task === 'resetPassword') {
        mailOption = mailOptionResetPassword(to, otp)
      } else if (task === 'verifyPartner') {
        mailOption = mailOptionVerifyPartner(to)
      } else if (task === 'unverifyPartner') {
        mailOption = mailOptionUnverifyPartner(to)
      } else if (task === 'deletePartner') {
        mailOption = mailOptionDeletePartner(to)
      }

      transporter.sendMail(mailOption, (err: any, inf: any) => {
        if (err) {
          reject(err);
        }
        if (inf) {
          resolve(inf);
        }
      });
    } catch (e: any) {
      reject(e);
    }
  });
};

