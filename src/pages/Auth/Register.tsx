import React from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { REGISTER_URL } from "../../utils/variables";

const Register: React.FC = () => {
	const { setAuth } = useAuth();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		formData.append("role", "USER");

		try {
			const res = await axios.post(REGISTER_URL, formData, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			});

			// console.log(res);

			const accessToken = res?.data?.access_token;
			const refreshToken = res?.data?.refresh_token;

			setAuth({ email: formData.get("email"), accessToken, refreshToken });
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="flex h-screen items-center justify-center">
			<form className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md" onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="mb-2 block text-sm font-bold text-gray-700">First Name:</label>
					<input
						className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						type="text"
						name="firstname"
						placeholder="firstname"
					/>
				</div>
				<div className="mb-4">
					<label className="mb-2 block text-sm font-bold text-gray-700">Last Name:</label>
					<input
						className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						type="text"
						name="lastname"
						placeholder="lastname"
					/>
				</div>
				<div className="mb-4">
					<label className="mb-2 block text-sm font-bold text-gray-700">Email:</label>
					<input
						className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						type="text"
						name="email"
						placeholder="email"
					/>
				</div>
				<div className="mb-4">
					<label className="mb-2 block text-sm font-bold text-gray-700">Password:</label>
					<input
						className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						type="password"
						name="password"
						placeholder="password"
					/>
				</div>
				<button
					className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
					type="submit"
				>
					Register
				</button>
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
		</div>
	);
};

export default Register;
