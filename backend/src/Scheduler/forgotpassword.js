const nodemailer = require("nodemailer");



const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const existUser = await user.findOne({ email });

    if (!existUser) {
      return res.status(404).json({ status: 404, msg: "User not found" });
    }

    const secret = process.env.secret_key + existUser.password;
    const token = jwt.sign({ id: existUser._id }, secret, { expiresIn: "15m" });

    const resetLink = `http://localhost:3000/reset-password/${existUser._id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"LMS Support" <${process.env.EMAIL}>`,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Hello ${existUser.firstName},</p>
             <p>You requested to reset your password. Click the link below to continue:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>This link will expire in 15 minutes.</p>
             <p>If you didn't request this, you can ignore this email.</p>`,
    });

    res.status(200).json({ status: 200, msg: "Reset link sent to email." });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ status: 500, msg: "Server Error", error });
  }
};


