// this component checks for the enrollments that are offered to the user and displays them.

import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Enrollment } from "@/utils/types";
import { useParams } from "react-router-dom";
import { setIn } from "formik";

const OfferedEnrollments: React.FC = () => {
	const { auth } = useAuth();
	const userId = auth?.userId;
	const { id } = useParams();
	const contactId = id ? parseInt(id) : undefined;

	const axiosPrivate = useAxiosPrivate();
	const [incompleteEnrollment, setIncompleteEnrollment] = useState<Enrollment | null>(null);

	// there can only be one incomplete enrollment taking place at a time, between two users.
	useEffect(() => {
		const getIncompleteEnrollment = async () => {
			try {
				const response = await axiosPrivate.get(
					`api/v1/enrollments/get/incomplete/seller/${contactId}/buyer/${userId}`
				);
				setIncompleteEnrollment(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		getIncompleteEnrollment();
	}, [userId]);

	const [confirmEnrollmentModal, setConfirmEnrollmentModal] = useState<boolean>(false);

	const confirmEnrollment = async (enrollmentId: number) => {
		try {
			const response = await axiosPrivate.post(`api/v1/enrollments/buyer-confirms/${enrollmentId}`);
			setIncompleteEnrollment(response.data);
			setConfirmEnrollmentModal(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			{incompleteEnrollment && (
				<div>
					{incompleteEnrollment.buyerConfirmed == false && (
						<div>
							<p>You have not confirmed this enrollment yet.</p>

							<p>{incompleteEnrollment.gig.title}</p>
							<p>{incompleteEnrollment.price}</p>
							{/* TODO: other data here */}
							<button onClick={() => setConfirmEnrollmentModal(true)}>Confirm Enrollment</button>
							{confirmEnrollmentModal && (
								<div>
									<p>Are you sure you want to confirm this enrollment?</p>
									<button onClick={() => confirmEnrollment(incompleteEnrollment.id)}>Yes</button>
									<button onClick={() => setConfirmEnrollmentModal(false)}>No</button>
								</div>
							)}
						</div>
					)}
					{incompleteEnrollment.buyerConfirmed && <div>
                        {/* Enrollment data here */}
                        {/* opt for creating sessions */}
                        </div>}
				</div>
			)}
		</div>
	);
};

export default OfferedEnrollments;
