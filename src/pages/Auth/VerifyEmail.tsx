import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "@/api/axios";
import useAuth from "../../hooks/useAuth";

const VerifyEmail: React.FC = () => {
	const [searchParams] = useSearchParams();
	const verificationToken = searchParams.get("token");
	const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
	const [countdown, setCountdown] = useState<number | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const { setAuth } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				const res = await axios.put(`/api/v1/auth/verify-email/${verificationToken}`);
				console.log(res.data);
				if (res.data.emailVerified) {
					setVerificationSuccess(true);
					setAuth(res.data);
					startCountdown(); // Start countdown after successful verification
				} else {
					setVerificationSuccess(false);
				}
			} catch (error) {
				console.error(error);
			}
		};

		verifyEmail();
	}, [verificationToken]);

	const startCountdown = () => {
		let seconds = 5;
		setCountdown(seconds);
		setMessage(`Email verification successful. Logging you in ${seconds} seconds...`);

		const interval = setInterval(() => {
			seconds -= 1;
			setCountdown(seconds);
			setMessage(`Email verification successful. Logging you in ${seconds} ${seconds === 1 ? "second" : "seconds"}...`);
			if (seconds <= 0) {
				clearInterval(interval);
				navigate("/", { replace: true }); // Redirect to home page after countdown
			}
		}, 1000);
	};

	return (
		<div className="dark-bg-dark-secondary m-5 rounded-md bg-light-secondary p-4">
			<p className="medium-headings">Verifying your email.</p>
			<div>
				{verificationSuccess && (
					<div>
						<p className="normal-text">{message}</p>
					</div>
				)}
				{!verificationSuccess && (
					<div>
						<p className="normal-text">
							Email not verified. Please try again. If the issue persists, please contact us.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default VerifyEmail;
