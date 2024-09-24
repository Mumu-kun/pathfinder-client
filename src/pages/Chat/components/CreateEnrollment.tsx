import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Gig } from "@/utils/types";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import * as Yup from "yup";
import Select, { SingleValue } from "react-select";
import { NumberInputComponent, TextInputComponent } from "@/components/FormComponents";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

interface createEnrollmentProps {
	setCreateAnEnrollmentClicked: React.Dispatch<React.SetStateAction<boolean>>;
	refreshEnrollments: () => void;
}

const CreateEnrollmentSchema = Yup.object().shape({
	price: Yup.number().required("Required"),
	numSessions: Yup.number().required("Required"),
	sessionDurationInMinutes: Yup.number().required("Required"),
	deadline: Yup.date().required("Required"),
	gigId: Yup.number().required("You must select a gig."),
});

const CreateEnrollment: React.FC<createEnrollmentProps> = ({ setCreateAnEnrollmentClicked, refreshEnrollments }) => {
	const { auth } = useAuth();
	const userId = auth?.userId;
	const { id } = useParams();
	const contactId = id ? parseInt(id) : undefined;
	const axiosPrivate = useAxiosPrivate();
	const [usersGigs, setUsersGigs] = useState<Gig[]>([]);

	useEffect(() => {
		// gigs will be needed to select a gig to create an enrollment.
		const getUsersGigs = async () => {
			try {
				const response = await axiosPrivate.get(`api/v1/public/gigs/seller/${userId}`);
				setUsersGigs(response.data);
				console.log(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		getUsersGigs();
	}, [userId]);

	return (
		<div className="modal-grand-parent">
			<div className="modal-parent">
				{usersGigs.length === 0 ? (
					<div className="flex flex-col items-center justify-center">
						<p className="text-center">You do not have any gigs to offer. Please create one first.</p>
						<div className="flex items-center justify-center">
							{/* // todo: link to create a gig page. */}
							<button className="solid-btn m-1">Create a Gig</button>
							<button onClick={() => setCreateAnEnrollmentClicked(false)} className="outline-btn m-1">
								Maybe later
							</button>
						</div>
					</div>
				) : (
					<div>
						<div className="mb-6 flex items-center justify-between">
							<p className="medium-headings text-left">Offer an Enrollment</p>
							<button onClick={() => setCreateAnEnrollmentClicked(false)} className="solid-cancel-btn-sm">
								X
							</button>
						</div>

						<Formik
							initialValues={{
								price: "",
								numSessions: "",
								sessionDurationInMinutes: "",
								deadline: "",
								gigId: "",
							}}
							validationSchema={CreateEnrollmentSchema}
							validateOnBlur
							onSubmit={async (values) => {
								try {
									const offsetDeadline = new Date(values.deadline).toISOString();

									const response = await axiosPrivate.post(
										`api/v1/enrollments/create/${values.gigId}`,
										{ ...values, deadline: offsetDeadline, buyerId: contactId },
										{
											headers: { "Content-Type": "application/json" },
											withCredentials: true,
										}
									);
									console.log(response);
									setCreateAnEnrollmentClicked(false);
									refreshEnrollments();
								} catch (error) {
									console.error(error);
									if (isAxiosError(error)) {
										if (isAxiosError(error)) {
											const fieldErrors: { [key: string]: string } = error.response?.data?.fieldErrors;

											Object.values(fieldErrors).forEach((error) => {
												toast.error(error);
											});
										}
									}
								}
							}}
						>
							{({ isSubmitting }) => (
								<Form>
									<Field name="gigId">
										{({ field }: FieldProps<any>) => (
											<>
												<label
													htmlFor="gigId"
													className={`mb-2 flex items-center gap-1 self-center text-sm font-semibold`}
												>
													<span>Select a Gig</span>
													<span>:</span>
												</label>
												<div className="mb-4 w-full">
													<Select
														value={
															field.value
																? {
																		value: field.value as number,
																		label: usersGigs.find((gig) => gig.id === field.value)?.title!,
																	}
																: null
														}
														options={usersGigs.map((gig) => ({ value: gig.id, label: gig.title }))}
														onChange={(option: SingleValue<{ value: number; label: string }>) => {
															if (option) {
																field.onChange({ target: { value: option.value, name: field.name } });
															}
														}}
														className="max-w-full"
														classNames={{
															control: () => `!bg-white dark:!bg-dark-bg !border-green-500 !shadow-none`,
															option: ({ isFocused, isSelected }) =>
																`${isSelected ? "!bg-green-400" : isFocused ? "!bg-green-400" : "!bg-white dark:!bg-dark-bg"} active:!bg-green-500`,
															input: () => "dark:!text-dark-text",
															singleValue: () => "dark:!text-dark-text",
															menu: () => `!mt-1 !bg-white dark:!bg-dark-bg !z-10 !border-green-500 dark:!border`,
														}}
													/>
													<ErrorMessage name="gigId">
														{(msg) =>
															typeof msg === "string" && (
																<>
																	<div></div>
																	<div className="col-span-full text-sm font-medium text-red-500">{msg}</div>
																</>
															)
														}
													</ErrorMessage>
												</div>
											</>
										)}
									</Field>
									<Field
										name="price"
										placeholder="Total price for all sessions"
										label="Total Price"
										isFullWidth
										component={NumberInputComponent}
									/>
									<Field
										name="numSessions"
										placeholder="Number of Sessions"
										label="Number of Sessions"
										isFullWidth
										component={NumberInputComponent}
									/>
									<Field
										name="sessionDurationInMinutes"
										placeholder="Session Duration In Minutes"
										label="Session Duration In Minutes"
										isFullWidth
										component={NumberInputComponent}
									/>
									<Field
										name="deadline"
										placeholder="Deadline"
										label="Deadline"
										isFullWidth
										component={TextInputComponent}
										type="datetime-local"
									/>
									<div className="flex items-center justify-center">
										<button type="submit" disabled={isSubmitting} className="solid-btn">
											Offer Enrollment
										</button>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				)}
			</div>
		</div>
	);
};

export default CreateEnrollment;
