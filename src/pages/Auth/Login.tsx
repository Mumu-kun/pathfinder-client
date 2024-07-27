import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";
import { LOGIN_URL } from "../../utils/variables";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useRefreshToken from "../../hooks/useRefreshToken";
import useLogout from "@/hooks/useLogout";

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

			// console.log(res.data);

			setAuth(res.data);

			navigate(from, { replace: true });
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<p className="medium-headings mb-4">Log in, sire! We are happy to have you back.</p>
			<form className="rounded bg-light-secondary px-8 py-6 shadow-md dark:bg-dark-secondary" onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="mb-2 block text-sm font-bold" htmlFor="email">
						Email
					</label>
					<input
						className="focus:shadow-outline w-full appearance-none rounded bg-light-bg px-3 py-2 leading-tight text-light-text shadow focus:outline-none dark:bg-dark-bg dark:text-dark-text"
						name="email"
						type="text"
						placeholder="Email"
					/>
				</div>
				<div className="mb-4">
					<label className="mb-2 block text-sm font-bold" htmlFor="password">
						Password
					</label>
					<input
						className="focus:shadow-outline w-full appearance-none rounded bg-light-bg px-3 py-2 leading-tight text-light-text shadow focus:outline-none dark:bg-dark-bg dark:text-dark-text"
						name="password"
						type="password"
						placeholder="Password"
					/>
				</div>
				<div className="flex flex-col items-center justify-center">
					<div className="my-2">
						<input
							type="checkbox"
							id="trust"
							onChange={(e) => {
								localStorage.setItem("persist_login", JSON.stringify(e.target.checked));
							}}
						/>
						<label htmlFor="trust" className="m-2">
							Trust this device
						</label>
					</div>
					<div className="flex items-center justify-between">
						<button className="solid-btn" type="submit">
							Log In
						</button>
					</div>
				</div>
			</form>
			{/* <button
				className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
				onClick={refresh}
			>
				Refresh Token
			</button> */}
		</>
	);
};

export default Login;
