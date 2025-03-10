const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail", // ή κάποιον άλλο SMTP πάροχο
    auth: {
        user: process.env.EMAIL_USER, // Το email σου
        pass: process.env.EMAIL_PASS  // Ο κωδικός ή App Password
    }
});

const sendEmail = async (to: any, subject: any, text: any) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        console.log("📧 Email was sent successfully!");
    } catch (error) {
        console.error("❌ There was an error while sending the email:", error);
    }
};

export default sendEmail; 
