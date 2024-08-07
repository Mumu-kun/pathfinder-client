import { NumberInputComponent, TextAreaInputComponent, TextInputComponent } from "@/components/FormComponents";
import { ProfileData } from "@/utils/types";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import Creatable from "react-select/creatable";
import * as Yup from "yup";

type EditProfileProps = {
	profileData: ProfileData;
};

const EditProfile = ({ profileData }: EditProfileProps) => {
	const [profileImageChange, setProfileImageChange] = useState<string>();

	return (
		<Formik
			initialValues={{
				profileImage: null,
				age: profileData.age,
				description: profileData.description,
				education: profileData.education,
				qualification: profileData.qualification,
				interests: profileData.interests,
			}}
			onSubmit={async (values) => {
				console.log(values);
			}}
			validationSchema={Yup.object().shape({
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
				age: Yup.number().min(0, "Please set a valid age.").max(150, "Please set a valid age.").nullable(),
				education: Yup.array().of(
					Yup.object().shape({
						title: Yup.string().required("Required"),
						year: Yup.number().required("Required"),
					})
				),
			})}
		>
			{({ isSubmitting, setFieldValue, setFieldTouched, validateField, values, errors, touched }) => (
				<Form className="grid grid-cols-[max-content_auto] place-items-start gap-x-8 gap-y-4 max-md:gap-x-4 max-md:text-sm">
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
					{profileImageChange ? (
						<div className="col-start-2 h-80 w-80 object-cover object-center">
							<img
								src={profileImageChange}
								alt=""
								className="h-full w-full rounded-sm border border-green-400 object-cover object-center shadow dark:border-2"
							/>
						</div>
					) : (
						profileData.profileImage && (
							<div className="col-start-2 h-80 w-80 object-cover object-center">
								<img
									src={profileData.profileImage}
									alt=""
									className="h-full w-full rounded-sm border border-green-400 object-cover object-center shadow dark:border-2"
								/>
							</div>
						)
					)}

					<Field
						isGrid
						label="Age"
						placeholder="Age"
						name="age"
						component={NumberInputComponent}
						className="max-w-20"
					/>

					<Field
						isGrid
						name="description"
						placeholder="Description"
						component={TextAreaInputComponent}
						label="Description"
						isFullWidth
						className="min-h-[20rem]"
					/>

					<FieldArray
						name="education"
						render={(arrayHelpers) => (
							<>
								<label htmlFor={"education"} className={`flex items-center gap-1`}>
									<span>Education</span>
									<span>:</span>
								</label>
								<div className="space-y-2">
									<>
										<div
											className="grid grid-cols-[repeat(3,minmax(min-content,max-content))] gap-x-3 gap-y-1 justify-self-center"
											style={{
												gridTemplateRows: `repeat(${values.education.length + 1}, minmax(0,max-content))`,
											}}
										>
											{values.education.map((_, index) => (
												<div
													className="col-span-full grid grid-cols-subgrid items-center"
													style={{
														gridTemplateRows: `repeat(${1 + Number(!!touched.education?.[index] && !!errors.education?.[index])}, 1fr)`,
													}}
												>
													<Field
														isGrid
														name={`education.${index}.title`}
														placeholder="Education"
														component={TextInputComponent}
														className="max-w-40"
														noShowError
													/>
													<Field
														isGrid
														name={`education.${index}.year`}
														placeholder="Year"
														component={NumberInputComponent}
														className="max-w-20"
														noShowError
													/>

													<FaMinus
														onClick={() => arrayHelpers.remove(index)}
														className="outline-btn h-5 w-5 cursor-pointer rounded p-0.5"
													/>

													<ErrorMessage name={`education.${index}.title`}>
														{(msg) => <div className="col-start-1 text-sm text-red-500">{msg}</div>}
													</ErrorMessage>
													<ErrorMessage name={`education.${index}.year`}>
														{(msg) => <div className="col-start-2 text-sm text-red-500">{msg}</div>}
													</ErrorMessage>
												</div>
											))}
											<FaPlus
												onClick={() =>
													arrayHelpers.push({
														title: "",
														year: null,
													})
												}
												className="outline-btn col-start-1 my-1 h-5 w-5 cursor-pointer rounded p-0.5"
											/>
										</div>
									</>
								</div>
							</>
						)}
					/>

					<FieldArray
						name="qualification"
						render={(arrayHelpers) => (
							<>
								<label htmlFor={"qualification"} className={`flex items-center gap-1`}>
									<span>Qualification</span>
									<span>:</span>
								</label>
								<div className="space-y-2">
									<>
										<div
											className="grid grid-cols-[repeat(3,minmax(min-content,max-content))] gap-x-3 gap-y-1 justify-self-center"
											style={{
												gridTemplateRows: `repeat(${values.qualification.length + 1}, minmax(0,max-content))`,
											}}
										>
											{values.qualification.map((_, index) => (
												<div
													className="col-span-full grid grid-cols-subgrid items-center"
													style={{
														gridTemplateRows: `repeat(${1 + Number(!!touched.qualification?.[index] && !!errors.qualification?.[index])}, 1fr)`,
													}}
												>
													<Field
														isGrid
														name={`qualification.${index}.title`}
														placeholder="Qualification"
														component={TextInputComponent}
														className="max-w-40"
														noShowError
													/>
													<Field
														isGrid
														name={`qualification.${index}.year`}
														placeholder="Year"
														component={NumberInputComponent}
														className="max-w-20"
														noShowError
													/>

													<FaMinus
														onClick={() => arrayHelpers.remove(index)}
														className="outline-btn h-5 w-5 cursor-pointer rounded p-0.5"
													/>

													<ErrorMessage name={`qualification.${index}.title`}>
														{(msg) => <div className="col-start-1 text-sm text-red-500">{msg}</div>}
													</ErrorMessage>
													<ErrorMessage name={`qualification.${index}.year`}>
														{(msg) => <div className="col-start-2 text-sm text-red-500">{msg}</div>}
													</ErrorMessage>
												</div>
											))}
											<FaPlus
												onClick={() =>
													arrayHelpers.push({
														title: "",
														year: null,
													})
												}
												className="outline-btn col-start-1 my-1 h-5 w-5 cursor-pointer rounded p-0.5"
											/>
										</div>
									</>
								</div>
							</>
						)}
					/>

					<FieldArray name="interests">
						{(formikHelpers) => (
							<>
								<label htmlFor={"interests"} className={`flex items-center gap-1`}>
									<span>Interests</span>
									<span>:</span>
								</label>
								<div className="w-full">
									<Creatable
										value={null}
										options={[
											{ value: "foo", label: "Foo" },
											{ value: "bar", label: "Bar" },
										]}
										onChange={(option) => {
											if (option) {
												const idx = values.interests.indexOf(option.value);
												if (idx === -1) {
													formikHelpers.push(option.value);
												}
											}
										}}
										className="mb-2 max-w-40"
										classNames={{
											control: () =>
												`!bg-light-bg dark:!bg-dark-bg border-green-500 hover:!border-green-500 focus:!border-green-500 focus:!outline-none`,
											option: ({ isFocused }) =>
												`${isFocused ? "!bg-green-400" : "!bg-light-bg dark:!bg-dark-bg"} active:!bg-green-500`,
											input: () => "dark:!text-dark-text",
											menu: () => `!bg-light-bg dark:!bg-dark-bg`,
										}}
									/>
									<div className="flex flex-wrap">
										{values.interests.map((tag, index) => (
											<div
												className={`mr-2 flex w-fit cursor-default items-center gap-1 rounded-sm border-2 border-dashed border-green-400 bg-white px-1 py-0.5 text-xss font-medium text-green-600 hover:border-solid dark:bg-dark-secondary`}
											>
												{tag}
												<FaMinus
													onClick={() => formikHelpers.remove(index)}
													className="h-4 w-4 cursor-pointer rounded border-2 border-green-500 p-0.5"
												/>
											</div>
										))}
									</div>
								</div>
							</>
						)}
					</FieldArray>

					<button type="submit" className="solid-btn col-span-full justify-self-center" disabled={isSubmitting}>
						Save Profile
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default EditProfile;
