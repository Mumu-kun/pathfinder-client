import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Gig } from "@/utils/types";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { TextInputComponent, NumberInputComponent } from "@/components/FormComponents";

interface createEnrollmentProps {
	setCreateAnEnrollmentClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateEnrollmentSchema = Yup.object().shape({
	price: Yup.number().required(),
	numSessions: Yup.number().required(),
	sessionDurationInMinutes: Yup.number().required(),
	deadline: Yup.date().required(),
	gigId: Yup.number().required("You must select a gig."),
});

const CreateEnrollment: React.FC<createEnrollmentProps> = ({ setCreateAnEnrollmentClicked }) => {
	const { auth } = useAuth();
	const userId = auth?.userId;
	const { contactId } = useParams();
	const axiosPrivate = useAxiosPrivate();
	const [usersGigs, setUsersGigs] = useState<Gig[]>([]);

	useEffect(() => {
		// gigs will be needed to select a gig to create an enrollment.
		const getUsersGigs = async () => {
			try {
				const response = await axiosPrivate.get(`api/v1/public/gigs/${userId}`);
				setUsersGigs(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		getUsersGigs();
	}, [userId]);
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
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
					onSubmit={async (values, { setSubmitting }) => {
						try {
							const response = await axiosPrivate.post(
								`api/v1/enrollments/create/${values.gigId}`,
								{ ...values, buyerId: contactId },
								{
									headers: { "Content-Type": "application/json" },
									withCredentials: true,
								}
							);
							console.log(response);
							setCreateAnEnrollmentClicked(false);
						} catch (error) {
							console.log(error);
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Field
								name="gigId"
								as="select"
								label="Select a Gig"
								className="mb-4 w-full rounded border border-gray-300 p-2"
							>
								<option value="">Select a gig</option>
								{usersGigs.map((gig) => (
									<option key={gig.id} value={gig.id}>
										{gig.title}
									</option>
								))}
							</Field>
							<Field
								name="price"
								placeholder="Price"
								label="Price"
								component={NumberInputComponent}
								className="mb-4 w-full rounded border border-gray-300 p-2"
							/>
							<Field
								name="numSessions"
								placeholder="Number of Sessions"
								label="Number of Sessions"
								component={NumberInputComponent}
								className="mb-4 w-full rounded border border-gray-300 p-2"
							/>
							<Field
								name="sessionDurationInMinutes"
								placeholder="Session Duration In Minutes"
								label="Session Duration In Minutes"
								component={NumberInputComponent}
								className="mb-4 w-full rounded border border-gray-300 p-2"
							/>
							<Field
								name="deadline"
								placeholder="Deadline"
								label="Deadline"
								type="date"
								component={TextInputComponent}
								className="mb-4 w-full rounded border border-gray-300 p-2"
							/>
							<button type="submit" disabled={isSubmitting} className="mt-4 w-full rounded bg-blue-500 p-2 text-white">
								Submit
							</button>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default CreateEnrollment;
