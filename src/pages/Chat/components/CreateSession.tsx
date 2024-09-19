import React from "react";
import { Session } from "@/utils/types";

import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import * as Yup from "yup";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Loading from "@/components/Loading";
import Select, { SingleValue } from "react-select";
import { TextInputComponent } from "@/components/FormComponents";

const sessionScheduleSchema = Yup.object().shape({
	scheduledAt: Yup.date().required(),
	sessionType: Yup.string().required(),
});

interface CreateSessionProps {
	enrollmentId: number;
	setRunningSession: React.Dispatch<React.SetStateAction<Session | null>>;
	setScheduleSessionClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateSession: React.FC<CreateSessionProps> = ({
	enrollmentId,
	setRunningSession,
	setScheduleSessionClicked,
}) => {
	const axiosPrivate = useAxiosPrivate();

	const [loading, setLoading] = React.useState<boolean>(false);

	return (
		<div>
			<div className="modal-grand-parent">
				<div className="modal-parent">
					<div className="flex items-center justify-between">
						<p className="small-headings text-left">Schedule a Session</p>
						<button onClick={() => setScheduleSessionClicked(false)} className="solid-cancel-btn-sm">
							X
						</button>
					</div>

					<Formik
						initialValues={{
							scheduledAt: "",
							sessionType: "",
						}}
						validationSchema={sessionScheduleSchema}
						validateOnBlur
						onSubmit={async (values, { setSubmitting }) => {
							try {
								const offsetDeadline = new Date(values.scheduledAt).toISOString();
								setLoading(true);
								const response = await axiosPrivate.post(
									`api/v1/sessions/create/${enrollmentId}`,
									{ ...values, scheduledAt: offsetDeadline },
									{
										headers: { "Content-Type": "application/json" },
										withCredentials: true,
									}
								);
								console.log(response);
								setRunningSession(response.data);
								setScheduleSessionClicked(false);
								setLoading(false);
							} catch (error) {
								console.log(error);
							}
						}}
					>
						{({ isSubmitting }) => (
							<Form>
								<Field name="sessionType">
									{({ field }: FieldProps<any>) => (
										<>
											<label
												htmlFor="sessionType"
												className={`mb-2 flex items-center gap-1 self-center text-sm font-semibold`}
											>
												<span>Select Session Type</span>
												<span>:</span>
											</label>
											<div className="mb-4 w-full">
												<Select
													options={[
														{
															value: "online",
															label: "Online",
														},
														{
															value: "offline",
															label: "Offline",
														},
													]}
													onChange={(option: SingleValue<{ value: string; label: string }>) => {
														if (option) {
															field.onChange({ target: { value: option.value, name: field.name } });
														}
													}}
													className="max-w-full"
													classNames={{
														control: () => `!bg-white dark:!bg-dark-bg !border-green-500`,
														option: ({ isFocused, isSelected }) =>
															`${isSelected ? "!bg-green-400" : isFocused ? "!bg-green-400" : "!bg-white dark:!bg-dark-bg"} active:!bg-green-500`,
														input: () => "dark:!text-dark-text",
														singleValue: () => "dark:!text-dark-text",
														menu: () => `!bg-white dark:!bg-dark-bg !z-10`,
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
									name="scheduledAt"
									placeholder="Scheduled Time"
									label="Scheduled Time"
									isFullWidth
									component={TextInputComponent}
									type="datetime-local"
								/>

								<div className="flex items-center justify-center">
									<button type="submit" disabled={isSubmitting} className="solid-btn">
										Schedule Session
									</button>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
};

export default CreateSession;
