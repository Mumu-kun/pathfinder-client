import axios from "@/api/axios";
import { NumberInputComponent, TextAreaInputComponent, TextInputComponent } from "@/components/FormComponents";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { ProfileData } from "@/utils/types";
import { isAxiosError } from "axios";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { SingleValue } from "node_modules/react-select/dist/declarations/src";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import AsyncCreatableSelect from "react-select/async-creatable";
import { toast } from "react-toastify";
import * as Yup from "yup";

type EditProfileProps = {
	profileData: ProfileData;
};

const EditProfile = ({ profileData }: EditProfileProps) => {
	const axiosPrivate = useAxiosPrivate();

	return (
		<Formik
			initialValues={{
				age: profileData.age,
				description: profileData.description,
				educations: profileData.educations,
				qualifications: profileData.qualifications,
				interests: profileData.interests,
			}}
			onSubmit={async (values) => {
				try {
					await axiosPrivate.patch("/api/v1/users/edit-profile", values);

					toast("Profile updated successfully", { type: "success" });
				} catch (error) {
					console.error(error);
					if (isAxiosError(error)) {
						error.response?.status === 400 && toast(error.response.data.message, { type: "error" });
					}
				}
			}}
			validationSchema={Yup.object().shape({
				age: Yup.number().min(0, "Please set a valid age.").max(150, "Please set a valid age.").nullable(),
				educations: Yup.array().of(
					Yup.object().shape({
						title: Yup.string().required("Required"),
						year: Yup.number().required("Required"),
					})
				),
			})}
		>
			{({ isSubmitting, values, errors, touched }) => (
				<Form className="grid grid-cols-[max-content_auto] place-items-start gap-x-8 gap-y-4 max-md:gap-x-4 max-md:text-sm">
					<Field
						isGrid
						name="description"
						placeholder="Description"
						component={TextAreaInputComponent}
						label="Description"
						isFullWidth
						className="min-h-[20rem]"
					/>

					<Field
						isGrid
						label="Age"
						placeholder="Age"
						name="age"
						component={NumberInputComponent}
						className="max-w-20"
					/>

					<FieldArray
						name="educations"
						render={(arrayHelpers) => (
							<>
								<label htmlFor={"education"} className={`flex items-center gap-1 font-semibold`}>
									<span>Education</span>
									<span>:</span>
								</label>
								<div className="space-y-2">
									<>
										<div
											className="grid grid-cols-[repeat(3,minmax(min-content,max-content))] gap-x-3 gap-y-1 justify-self-center"
											style={{
												gridTemplateRows: `repeat(${values.educations.length + 1}, minmax(0,max-content))`,
											}}
										>
											{values.educations.map((_, index) => (
												<div
													className="col-span-full grid grid-cols-subgrid items-center"
													style={{
														gridTemplateRows: `repeat(${1 + Number(!!touched.educations?.[index] && !!errors.educations?.[index])}, 1fr)`,
													}}
												>
													<Field
														isGrid
														name={`educations.${index}.title`}
														placeholder="Education"
														component={TextInputComponent}
														className="max-w-40"
														noShowError
													/>
													<Field
														isGrid
														name={`educations.${index}.year`}
														placeholder="Year"
														component={NumberInputComponent}
														className="max-w-20"
														noShowError
													/>

													<FaMinus
														onClick={() => arrayHelpers.remove(index)}
														className="outline-btn h-5 w-5 cursor-pointer rounded p-0.5"
													/>

													<ErrorMessage name={`educations.${index}.title`}>
														{(msg) => <div className="col-start-1 text-sm text-red-500">{msg}</div>}
													</ErrorMessage>
													<ErrorMessage name={`educations.${index}.year`}>
														{(msg) => <div className="col-start-2 text-sm text-red-500">{msg}</div>}
													</ErrorMessage>
												</div>
											))}
											<FaPlus
												onClick={() => {
													arrayHelpers.push({
														title: "",
														year: null,
													});
													console.log(values);
												}}
												className="outline-btn col-start-1 my-1 h-5 w-5 cursor-pointer rounded p-0.5"
											/>
										</div>
									</>
								</div>
							</>
						)}
					/>

					<FieldArray
						name="qualifications"
						render={(arrayHelpers) => (
							<>
								<label htmlFor={"qualification"} className={`flex items-center gap-1 font-semibold`}>
									<span>Qualification</span>
									<span>:</span>
								</label>
								<div className="space-y-2">
									<>
										<div
											className="grid grid-cols-[repeat(3,minmax(min-content,max-content))] gap-x-3 gap-y-1 justify-self-center"
											style={{
												gridTemplateRows: `repeat(${values.qualifications.length + 1}, minmax(0,max-content))`,
											}}
										>
											{values.qualifications.map((_, index) => (
												<div
													className="col-span-full grid grid-cols-subgrid items-center"
													style={{
														gridTemplateRows: `repeat(${1 + Number(!!touched.qualifications?.[index] && !!errors.qualifications?.[index])}, 1fr)`,
													}}
												>
													<Field
														isGrid
														name={`qualifications.${index}.title`}
														placeholder="Qualification"
														component={TextInputComponent}
														className="max-w-40"
														noShowError
													/>
													<Field
														isGrid
														name={`qualifications.${index}.year`}
														placeholder="Year"
														component={NumberInputComponent}
														className="max-w-20"
														noShowError
													/>

													<FaMinus
														onClick={() => arrayHelpers.remove(index)}
														className="outline-btn h-5 w-5 cursor-pointer rounded p-0.5"
													/>

													<ErrorMessage name={`qualifications.${index}.title`}>
														{(msg) => <div className="col-start-1 text-sm text-red-500">{msg}</div>}
													</ErrorMessage>
													<ErrorMessage name={`qualifications.${index}.year`}>
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
								<label htmlFor={"interests"} className={`flex items-center gap-1 font-semibold`}>
									<span>Interests</span>
									<span>:</span>
								</label>
								<div className="w-full">
									<AsyncCreatableSelect
										cacheOptions
										defaultOptions
										loadOptions={async (inputValue) => {
											try {
												const res = await axios.get(`/api/v1/public/tags/search/${inputValue}`);
												const data = res.data;

												return data.map((tag: any) => ({
													value: tag.name,
													label: tag.name,
												}));
											} catch (error) {
												console.error(error);
											}
										}}
										value={null}
										onChange={(option: SingleValue<{ value: string; label: string }>) => {
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
