'use server';
import type { SendMailOptions, SentMessageInfo } from 'nodemailer';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth:    {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export function sendMail(mailOptions: SendMailOptions): Promise<SentMessageInfo> {
	return transporter.sendMail(mailOptions);
}