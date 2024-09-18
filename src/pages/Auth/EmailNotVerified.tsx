import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Navigate, useParams } from "react-router-dom";

const EmailNotVerified: React.FC = () => {
	const [emailVerified, setEmailVerified] = useState<boolean>(false);
	const [emailSent, setEmailSent] = useState<boolean>(false);
	const [rateLimited, setRateLimited] = useState<boolean>(false);
	const email = useParams<{ email: string }>().email;

	useEffect(() => {
		const verifyEmailProcess = async () => {
			try {
				const res = await axios.get(`/api/v1/auth/is-email-verified/${email}`);
				setEmailVerified(res.data);

				// If the email is not verified, send the verification request
				if (!res.data) {
					const sendRes = await axios.post(`/api/v1/auth/send-verify-email-request/${email}`);
					if (sendRes.data === "email_sent") {
						console.log("Email sent");
						setEmailSent(true);
					} else if (sendRes.data === "rate_limited") {
						console.log("Rate limited");
						setRateLimited(true);
					}
				}
			} catch (error) {
				console.error(error);
			}
		};

		// Run the email verification process
		verifyEmailProcess();
	}, [email]);

	return (
		<div className="dark-bg-dark-secondary m-5 space-y-2 rounded-md bg-light-secondary p-4">
			{emailVerified ? (
				<Navigate to="/" replace />
			) : (
				<>
					<p className="medium-headings !mb-4 text-left">Email not verified.</p>
					<p className="normal-text">
						Your account has been created, but you need to verify your email address to access the platform.
					</p>
					{emailSent && (
						<p className="normal-text">
							Email verification link sent to <span className="font-bold">{email}</span>
						</p>
					)}
					{rateLimited && (
						<p className="normal-text">
							A verification email was very recently sent. Please try again in a few minutes.
						</p>
					)}
					<p>Simply login later if you lose this link</p>
					<button
						className="solid-btn-sm !mt-4"
						onClick={() => {
							window.location.reload();
						}}
					>
						Resend Verification Link
					</button>
				</>
			)}
		</div>
	);
};

export default EmailNotVerified;
