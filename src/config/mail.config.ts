import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	secure: false,
	auth: {
		user: process.env.EMAIL_ADDRESS || "space.nvkien@gmail.com",
		pass: process.env.EMAIL_PASSWORD || "ipxadadeptjllwjw",
	},
});

transporter.verify((error: any, success: any) => {
	if (error) {
		console.log({ error });
	} else {
		console.log("Server is ready to take our messages");
	}
});

export default transporter;
