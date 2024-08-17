import React from "react";
import { Session } from "@/utils/types";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Loading from "@/components/Loading";

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
								<Field
									name="sessionType"
									as="select"
									label="Select Session Type"
									className="mb-4 w-full rounded border border-gray-300 bg-light-secondary p-2 dark:bg-dark-secondary"
								>
									<option disabled value="">
										Select Session Type
									</option>
									<option value="online">Online</option>
									<option value="offline">Offline</option>
								</Field>

								<Field
									name="scheduledAt"
									placeholder="Scheduled Time"
									label="Scheduled Time"
									type="datetime-local"
									className="mb-4 w-full rounded border border-gray-300 bg-light-secondary p-2 dark:bg-dark-secondary"
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
