import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import AuthContext from "../../context/AuthProvider";
import { LOGIN_URL } from "../../utils/variables";
import { Field, Formik, Form } from "formik";
import { TextInputComponent } from "@/components/FormComponents";
import * as Yup from "yup";
import { isAxiosError } from "axios";

const Login: React.FC = () => {
	const { setAuth } = useContext(AuthContext);

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from || "/";

	const [errorMessage, setErrorMessage] = useState<string>();

	return (
		<div className="mx-auto mt-10 max-w-[30rem]">
			<p className="medium-headings mb-4">Log in, sire! We are happy to have you back.</p>
			<Formik
				initialValues={{}}
				validationSchema={Yup.object().shape({
					email: Yup.string().email("Invalid email").required("Required"),
					password: Yup.string().required("Provide a password"),
				})}
				onSubmit={async (values, { setSubmitting }) => {
					setErrorMessage(undefined);
					try {
						const res = await axios.post(LOGIN_URL, values, {
							headers: { "Content-Type": "application/json" },
							withCredentials: true,
						});

						// console.log(res);

						setAuth(res.data);

						navigate(from, { replace: true });
					} catch (error) {
						if (isAxiosError(error) && error.response?.status === 401) {
							setErrorMessage(error.response?.data?.message);
						}
						console.error(error);
						setSubmitting(false);
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form className="mb-4 rounded bg-light-secondary px-8 pb-8 pt-6 shadow-md dark:bg-dark-secondary">
						<Field
							name="email"
							placeholder="Email"
							label="Email"
							type="email"
							component={TextInputComponent}
							isFullWidth={true}
						/>
						<Field
							name="password"
							placeholder="Password"
							label="Password"
							type="password"
							component={TextInputComponent}
							isFullWidth={true}
						/>
						<div className="flex flex-col items-center justify-center">
							{errorMessage && <div className="mb-2 text-sm text-red-500">{errorMessage}</div>}
							<div className="mb-4">
								<input
									type="checkbox"
									id="trust"
									className="accent-green-400"
									onChange={(e) => {
										localStorage.setItem("persist_login", JSON.stringify(e.target.checked));
									}}
								/>
								<label htmlFor="trust" className="m-2">
									Trust this device
								</label>
							</div>
							<button className="solid-btn" type="submit" disabled={isSubmitting}>
								Login
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default Login;
