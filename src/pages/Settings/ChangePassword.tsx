import { TextInputComponent } from "@/components/FormComponents";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { isAxiosError } from "axios";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";

import * as Yup from "yup";

const ChangePassword = () => {
	const axiosPrivate = useAxiosPrivate();

	const initialValues: {
		currentPassword?: string;
		newPassword?: string;
		confirmationPassword?: string;
	} = {};

	return (
		<Formik
			onSubmit={async (values) => {
				// console.log(values);

				try {
					await axiosPrivate.patch("/api/v1/users/password", values);

					toast("Password changed successfully", { type: "success" });
				} catch (error) {
					console.error(error);
					if (isAxiosError(error)) {
						error.response?.status === 400 && toast(error.response.data.message, { type: "error" });
					}
				}
			}}
			initialValues={initialValues}
			validationSchema={Yup.object().shape({
				currentPassword: Yup.string().required("Required"),
				newPassword: Yup.string().required("Required").min(8, "Password must be at least 8 characters long"),
				confirmationPassword: Yup.string()
					.required("Required")
					.test("passwords-match", "Passwords must match", function (value) {
						return this.parent.newPassword === value;
					}),
			})}
		>
			{({ isSubmitting }) => (
				<Form className="grid grid-cols-[max-content_auto] place-items-start gap-x-8 gap-y-4">
					<Field
						isGrid
						type="password"
						name="currentPassword"
						placeholder="Current Password"
						component={TextInputComponent}
						label="Current Password"
					/>

					<Field
						isGrid
						type="password"
						name="newPassword"
						placeholder="New Password"
						component={TextInputComponent}
						label="New Password"
					/>

					<Field
						isGrid
						type="password"
						name="confirmationPassword"
						placeholder="Confirm Password"
						component={TextInputComponent}
						label="Confirm Password"
					/>

					<button type="submit" className="solid-btn col-span-full justify-self-center" disabled={isSubmitting}>
						Change Password
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default ChangePassword;
