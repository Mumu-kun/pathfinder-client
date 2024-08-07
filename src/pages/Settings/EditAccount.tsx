import { TextInputComponent } from "@/components/FormComponents";
import { ProfileData } from "@/utils/types";
import { Field, Form, Formik } from "formik";
type EditAccountProps = {
	profileData: ProfileData;
};

const EditAccount = ({ profileData }: EditAccountProps) => {
	return (
		<Formik
			onSubmit={async (values, { setSubmitting }) => {
				console.log(values);
			}}
			initialValues={{
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				username: profileData.username,
				email: profileData.email,
			}}
		>
			{({ isSubmitting }) => (
				<Form className="grid grid-cols-[max-content_auto] gap-x-8 gap-y-4">
					<Field isGrid name="firstName" placeholder="First Name" component={TextInputComponent} label="First Name" />

					<Field isGrid name="lastName" placeholder="Last Name" component={TextInputComponent} label="Last Name" />

					<Field isGrid name="username" placeholder="Username" component={TextInputComponent} label="Username" />

					<Field isGrid name="email" placeholder="Email" component={TextInputComponent} label="Email" disabled />

					<button type="submit" className="solid-btn" disabled={isSubmitting}>
						Submit
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default EditAccount;
