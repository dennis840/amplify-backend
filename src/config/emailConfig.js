const nodemailer = require('nodemailer');

// Configuración del transporter de email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Función para enviar email de reset de contraseña
const sendPasswordResetEmail = async (to, resetLink, userName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"AMPLIFY - BandasMatch" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Restablecer contraseña - AMPLIFY',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Restablecer contraseña</h2>
        <p>Hola ${userName},</p>
        <p>Recibimos tu solicitud para restablecer tu contraseña en AMPLIFY.</p>
        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Restablecer Contraseña
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Este enlace expirará en 15 minutos por seguridad.
        </p>
        <p style="color: #666; font-size: 14px;">
          Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Equipo AMPLIFY - BandasMatch<br>
          Conectando músicos en Ecuador
        </p>
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