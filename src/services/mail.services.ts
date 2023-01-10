import transporter from "../config/mail.config";
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS || "space.nvkien@gmail.com";
export const sendMailService = async (to: string, subject: string, html: string) => {
	const mailOptions = {
		from: EMAIL_ADDRESS,
		to: to,
		subject: subject,
		html: html,
	};
	try {
		const promise = () => {
			return new Promise((resolve: any, rejects: any) => {
				transporter.sendMail(mailOptions, (error: any, info: any) => {
					if (error) {
						rejects(error);
					} else {
						resolve(info);
					}
				});
			});
		};
		const result: any = await promise();
        console.log(result);
		return result;
	} catch (error) {
		console.log(error);
	}
};
