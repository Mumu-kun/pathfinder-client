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

		// converting to json
		let object: {[key: string]: any} = {};
		formData.forEach((value, key) => {
			object[key] = value;
		});

		const json = JSON.stringify(object);

		console.log(json);

		try {
			console.log(formData);
			const res = await axios.post(REGISTER_URL, json, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			});

			// console.log(res);

			const accessToken = res?.data?.accessToken;
			const refreshToken = res?.data?.refreshToken;

			const userId = res?.data?.userId;
			const firstName = res?.data?.firstName;
			const lastName = res?.data?.lastName;
			const role = res?.data?.role;

			setAuth({ email: formData.get("email"), accessToken, refreshToken, userId, firstName, lastName, role });
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			<p className="medium-headings">Hello sire! Join a world full of talented individuals.</p>
			<p className="medium-headings mb-4">Teach them. Learn from them.</p>
			<div className="">
				<form
					className="mb-4 rounded bg-light-secondary px-8 pb-8 pt-6 shadow-md dark:bg-dark-secondary"
					onSubmit={handleSubmit}
				>
					<div className="mb-4">
						<label className="mb-2 block text-sm font-bold">First Name:</label>
						<input
							className="focus:shadow-outline w-full appearance-none rounded bg-light-bg px-3 py-2 leading-tight shadow focus:outline-none dark:bg-dark-bg"
							type="text"
							name="firstName"
							placeholder="firstname"
						/>
					</div>
					<div className="mb-4">
						<label className="mb-2 block text-sm font-bold">Last Name:</label>
						<input
							className="focus:shadow-outline w-full appearance-none rounded bg-light-bg px-3 py-2 leading-tight shadow focus:outline-none dark:bg-dark-bg"
							type="text"
							name="lastName"
							placeholder="lastname"
						/>
					</div>
					<div className="mb-4">
						<label className="mb-2 block text-sm font-bold">Email:</label>
						<input
							className="focus:shadow-outline w-full appearance-none rounded bg-light-bg px-3 py-2 leading-tight shadow focus:outline-none dark:bg-dark-bg"
							type="text"
							name="email"
							placeholder="email"
						/>
					</div>
					<div className="mb-4">
						<label className="mb-2 block text-sm font-bold">Password:</label>
						<input
							className="focus:shadow-outline w-full appearance-none rounded bg-light-bg px-3 py-2 leading-tight shadow focus:outline-none dark:bg-dark-bg"
							type="password"
							name="password"
							placeholder="password"
						/>
					</div>
					<div className="flex flex-col items-center justify-center">
						<div className="mb-4">
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
						<button className="solid-btn" type="submit">
							Register
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register;
