import React from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { REGISTER_URL } from "../../utils/variables";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import { TextInputComponent } from "@/components/FormComponents";
import * as Yup from "yup";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

const RegisterSchema = Yup.object().shape({
	firstName: Yup.string().required(),
	lastName: Yup.string().required(),
	email: Yup.string().email("Invalid email").required("Required"),
	password: Yup.string().required("Provide a password.").min(8, "Password is too short - should be 8 chars minimum."),
});

const Register: React.FC = () => {
	const { setAuth, setPersist } = useAuth();

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from || "/";

	return (
		<div className="mx-auto mt-10 max-w-[30rem]">
			<p className="medium-headings">Hello sire! Join a world full of talented individuals.</p>
			<p className="medium-headings mb-4">Teach them. Learn from them.</p>
			<Formik
				initialValues={{}}
				validationSchema={RegisterSchema}
				validateOnBlur
				onSubmit={async (values, { setSubmitting }) => {
					try {
						const res = await axios.post(
							REGISTER_URL,
							{ ...values, role: "USER" },
							{
								headers: { "Content-Type": "application/json" },
								withCredentials: true,
							}
						);

						// console.log(res);

						setAuth(res.data);

						navigate(from === "/login" ? "/" : from, { replace: true });
					} catch (error) {
						if (isAxiosError(error)) {
							toast(error.response?.data?.message, { type: "error" });
						}
						console.error(error);
						setSubmitting(false);
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form className="mb-4 rounded bg-light-secondary px-8 pb-8 pt-6 shadow-md dark:bg-dark-secondary">
						<Field
							name="firstName"
							placeholder="First Name"
							label="First Name"
							component={TextInputComponent}
							isFullWidth={true}
						/>
						<Field
							name="lastName"
							placeholder="Last Name"
							label="Last Name"
							component={TextInputComponent}
							isFullWidth={true}
						/>
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
							<div>
								Already have an account?{" "}
								<Link to="/login" className="font-medium text-green-500 hover:underline">
									Login
								</Link>
							</div>
							<div className="mb-4 mt-2">
								<input
									type="checkbox"
									id="trust"
									onChange={(e) => {
										setPersist(e.target.checked);
										localStorage.setItem("persist_login", JSON.stringify(e.target.checked));
									}}
								/>
								<label htmlFor="trust" className="m-2">
									Trust this device
								</label>
							</div>
							<button className="solid-btn" type="submit" disabled={isSubmitting}>
								Register
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default Register;
