import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";
import { LOGIN_URL } from "../../utils/variables";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useRefreshToken from "../../hooks/useRefreshToken";

const Login: React.FC = () => {
	const { setAuth } = useContext(AuthContext);

	const refresh = useRefreshToken();

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from || "/";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget as HTMLFormElement);

		try {
			const res = await axios.post(LOGIN_URL, formData, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			});

			// console.log(res);

			const accessToken = res?.data?.access_token;
			const refreshToken = res?.data?.refresh_token;

			setAuth({ email: formData.get("email"), accessToken, refreshToken });

			navigate(from, { replace: true });
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<form className="mb-4 rounded px-8 pb-8 pt-6 shadow-md bg-light-secondary dark:bg-dark-secondary" onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="mb-2 block text-sm font-bold" htmlFor="email">
						Email
					</label>
					<input
						className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						name="email"
						type="text"
						placeholder="Email"
					/>
				</div>
				<div className="mb-6">
					<label className="mb-2 block text-sm font-bold" htmlFor="password">
						Password
					</label>
					<input
						className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						name="password"
						type="password"
						placeholder="Password"
					/>
				</div>
				<div className="flex items-center justify-between">
					<button className="solid-btn" type="submit">
						Log In
					</button>
				</div>
				<div className="mb-6">
					<input
						type="checkbox"
						id="trust"
						onChange={(e) => {
							localStorage.setItem("persist_login", JSON.stringify(e.target.checked));
						}}
					/>
					<label htmlFor="trust">Trust this device</label>
				</div>
			</form>
			<button
				className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
				onClick={refresh}
			>
				Refresh Token
			</button>
		</>
	);
};

export default Login;
