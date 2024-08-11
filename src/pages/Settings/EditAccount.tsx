import { TextInputComponent } from "@/components/FormComponents";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { userProfileImageUrl } from "@/utils/functions";
import { ProfileData } from "@/utils/types";
import { defaultProfileImage } from "@/utils/variables";
import { isAxiosError } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";

import * as Yup from "yup";

type EditAccountProps = {
	profileData: ProfileData;
};

const EditAccount = ({ profileData }: EditAccountProps) => {
	const [profileImageChange, setProfileImageChange] = useState<string>();

	const axiosPrivate = useAxiosPrivate();

	return (
		<Formik
			onSubmit={async (values) => {
				try {
					await axiosPrivate.patch("/api/v1/users/edit-profile", { ...values, profileImage: undefined });
					!!values.profileImage &&
						(await axiosPrivate.post(
							"/api/v1/users/profile-image",
							{ file: values.profileImage },
							{
								headers: { "Content-Type": "multipart/form-data" },
							}
						));

					toast("Account updated successfully", { type: "success" });
				} catch (error) {
					console.error(error);
					if (isAxiosError(error)) {
						error.response?.status === 400 && toast(error.response.data.message, { type: "error" });
					}
				}
			}}
			initialValues={{
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				email: profileData.email,
				profileImage: null,
			}}
			validationSchema={Yup.object().shape({
				firstName: Yup.string().required("Required"),
				lastName: Yup.string().required("Required"),
				profileImage: Yup.mixed()
					.test("fileFormat", "Only Image files are allowed", (value) => {
						if (value) {
							return (value as File).type.startsWith("image/");
						}
						return true;
					})
					.test("fileSize", "File size must be less than 3MB", (value) => {
						if (value) {
							return (value as File).size <= 3145728;
						}
						return true;
					})
					.nullable(),
			})}
		>
			{({ isSubmitting, setFieldValue, setFieldTouched, validateField }) => (
				<Form className="grid grid-cols-[max-content_auto] place-items-start gap-x-8 gap-y-4">
					<Field isGrid name="firstName" placeholder="First Name" component={TextInputComponent} label="First Name" />

					<Field isGrid name="lastName" placeholder="Last Name" component={TextInputComponent} label="Last Name" />

					<Field isGrid name="email" placeholder="Email" component={TextInputComponent} label="Email" disabled />

					{profileImageChange ? (
						<div className="col-start-2 h-60 w-60 object-cover object-center">
							<img
								src={profileImageChange}
								alt=""
								className="h-full w-full rounded-sm border border-green-400 object-cover object-center shadow dark:border-2"
							/>
						</div>
					) : (
						<div className="col-start-2 h-60 w-60 object-cover object-center">
							<img
								src={userProfileImageUrl(profileData.id)}
								onError={({ currentTarget }) => {
									currentTarget.onerror = null;
									currentTarget.src = defaultProfileImage;
								}}
								alt=""
								className="h-full w-full rounded-sm border border-green-400 object-cover object-center shadow dark:border-2"
							/>
						</div>
					)}
					<Field
						isGrid
						label="Profile Image"
						name="profImgDummy"
						type="file"
						accept="image"
						className="outline-btn max-w-80 file:hidden"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							const file = e.target.files![0];

							setFieldTouched("profileImage", true);
							setFieldValue("profileImage", file, true);
							validateField("profileImage");

							if (!file.type.startsWith("image/")) {
								setProfileImageChange(undefined);
								return;
							}

							const fileReader = new FileReader();
							fileReader.onload = () => {
								if (fileReader.readyState === 2) {
									setProfileImageChange(fileReader.result as string);
								}
							};
							fileReader.readAsDataURL(file);
						}}
						component={TextInputComponent}
					/>
					<ErrorMessage name={"profileImage"}>
						{(msg) => <div className="col-start-2 text-sm text-red-500">{msg}</div>}
					</ErrorMessage>

					<button type="submit" className="solid-btn col-span-full justify-self-center" disabled={isSubmitting}>
						Save Account
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default EditAccount;
