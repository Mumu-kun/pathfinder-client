// this component checks for the enrollments that are offered to the user and displays them.

import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useStomp from "@/hooks/useStomp";
import { disableScroll, enableScroll } from "@/utils/functions";
import { Enrollment } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EnrollmentView from "./EnrollmentView";

const OfferedEnrollments: React.FC = () => {
	const { auth } = useAuth();
	const userId = auth?.userId;
	const { id } = useParams();
	const contactId = id ? parseInt(id) : undefined;

	const { receivedNotification } = useStomp();

	const axiosPrivate = useAxiosPrivate();
	const [incompleteEnrollmentAsBuyer, setIncompleteEnrollmentAsBuyer] = useState<Enrollment | null>(null);
	const [incompleteEnrollmentAsSeller, setIncompleteEnrollmentAsSeller] = useState<Enrollment | null>(null);

	// there can only be one incomplete enrollment taking place at a time, between two users.
	const getIncompleteEnrollmentAsBuyer = async () => {
		try {
			const response = await axiosPrivate.get(`api/v1/enrollments/get/incomplete/seller/${contactId}/buyer/${userId}`);
			// console.log(response.data);
			setIncompleteEnrollmentAsBuyer(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const getIncompleteEnrollmentAsSeller = async () => {
		try {
			const response = await axiosPrivate.get(`api/v1/enrollments/get/incomplete/seller/${userId}/buyer/${contactId}`);
			// console.log(response.data);
			setIncompleteEnrollmentAsSeller(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (receivedNotification?.type === "ENROLLMENT") {
			getIncompleteEnrollmentAsBuyer();
			getIncompleteEnrollmentAsSeller();
		}
	}, [receivedNotification]);

	useEffect(() => {
		getIncompleteEnrollmentAsBuyer();
		getIncompleteEnrollmentAsSeller();
	}, [userId, contactId]);

	const [confirmEnrollmentModal, setConfirmEnrollmentModal] = useState<boolean>(false);
	const [declineEnrollmentModal, setDeclineEnrollmentModal] = useState<boolean>(false);

	const [paymentGatewayUrl, setPaymentGatewayUrl] = useState<string>("");
	const confirmEnrollment = async (enrollmentId: number) => {
		try {
			const response = await axiosPrivate.put(`api/v1/enrollments/buyer-confirms/${enrollmentId}`);
			console.log(response.data);
			setPaymentGatewayUrl(response.data);
			setConfirmEnrollmentModal(false);
		} catch (error) {
			console.error(error);
		}
	};

	const declineEnrollment = async (enrollmentId: number) => {
		try {
			const response = await axiosPrivate.delete(`api/v1/enrollments/buyer-declines/${enrollmentId}`);
			setIncompleteEnrollmentAsBuyer(response.data);
			setDeclineEnrollmentModal(false);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (confirmEnrollmentModal) {
			disableScroll();
		} else {
			enableScroll();
		}
	}, [confirmEnrollmentModal, declineEnrollmentModal]);

	useEffect(() => {
		if (paymentGatewayUrl) {
			window.location.href = paymentGatewayUrl;
		}
	}, [paymentGatewayUrl]);

	return (
		<div>
			{incompleteEnrollmentAsBuyer && (
				<div className="m-2 overflow-hidden rounded-md bg-light-bg pb-1 shadow dark:bg-dark-secondary">
					<EnrollmentView viewType="buyer" enrollment={incompleteEnrollmentAsBuyer} />

					{!incompleteEnrollmentAsBuyer.buyerConfirmed && (
						<>
							<div className="my-2 flex items-center justify-center gap-x-2">
								<button className="solid-btn" onClick={() => setConfirmEnrollmentModal(true)}>
									Accept
								</button>
								<button className="solid-cancel-btn" onClick={() => setDeclineEnrollmentModal(true)}>
									Decline
								</button>
							</div>
							{confirmEnrollmentModal && (
								<div className="modal-grand-parent">
									<div className="modal-parent">
										<div>
											<p className="small-headings text-center">Are you sure you want to accept this enrollment?</p>
											<p className="p-2 text-center font-bold">You will be redirected to the payment page.</p>
											<div className="flex items-center justify-center">
												<button className="solid-cancel-btn m-1" onClick={() => setConfirmEnrollmentModal(false)}>
													No
												</button>
												<button
													className="solid-btn m-1"
													onClick={() => confirmEnrollment(incompleteEnrollmentAsBuyer.id)}
												>
													Yes
												</button>
											</div>
										</div>
									</div>
								</div>
							)}

							{declineEnrollmentModal && (
								<div className="modal-grand-parent">
									<div className="modal-parent">
										<div>
											<p className="small-headings text-center">Are you sure you want to decline this enrollment?</p>
											<p className="p-2 text-center font-bold">
												You can always negotiate and ask {incompleteEnrollmentAsBuyer.gig.seller.fullName} for another
												offer.
											</p>
											<div className="flex items-center justify-center">
												<button className="solid-btn m-1" onClick={() => setDeclineEnrollmentModal(false)}>
													No
												</button>
												<button
													className="solid-cancel-btn m-1"
													onClick={() => declineEnrollment(incompleteEnrollmentAsBuyer.id)}
												>
													Yes
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			)}
			{incompleteEnrollmentAsSeller && (
				<div className="m-2 flex flex-col items-center overflow-hidden rounded-md bg-light-bg pb-1 shadow dark:bg-dark-secondary">
					<EnrollmentView viewType="seller" enrollment={incompleteEnrollmentAsSeller} />
				</div>
			)}
		</div>
	);
};

export default OfferedEnrollments;
