const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

const sendPasswordResetEmail = async (to, code, userName) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"AMPLIFY" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Código para restablecer contraseña - AMPLIFY',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">Restablecer contraseña</h2>
        <p>Hola ${userName},</p>
        <p>Recibimos tu solicitud para restablecer tu contraseña en AMPLIFY.</p>
        <p>Tu código de verificación es:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #7C3AED; color: white; padding: 16px 40px;
                font-size: 32px; font-weight: bold; border-radius: 8px; letter-spacing: 8px;">
            ${code}
          </span>
        </div>
        <p style="color: #666; font-size: 14px;">Este código expirará en 15 minutos por seguridad.</p>
        <p style="color: #666; font-size: 14px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">Equipo AMPLIFY<br>Conecta. Crea. Suena.</p>
      </div>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail
};