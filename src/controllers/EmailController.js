const errorHandler = require('../utils/errorHandler');
const nodemailer = require("nodemailer");
require('dotenv').config();

class EmailController {
  async sendMail(req, res) {
    try {
      const {
        name, email, message
      } = req.body;

      if (!name || !email || !message) {
          return errorHandler(res, 400, 'Missing parameters');
      }

      const text = `\n Nome: ${name} \n
      Email: ${email} \n
      Mensagem: ${message}`

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      
      var mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'Novo contato',
        text,
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          errorHandler(res, 400, 'Something went wrong');
        } else {
          return res.status(200).json({ message: 'Email enviado' });
        }
      });

      return null;
    } catch (error) {
      return errorHandler(res, 500, 'Server error');
    }
  }
}

module.exports = new EmailController();
