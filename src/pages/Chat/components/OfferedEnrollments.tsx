// this component checks for the enrollments that are offered to the user and displays them.

import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Enrollment } from "@/utils/types";
import { useParams } from "react-router-dom";
import { disableScroll, enableScroll } from "@/utils/functions";
import EnrollmentView from "./EnrollmentView";
import useStomp from "@/hooks/useStomp";

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
			console.log(response.data);
			setIncompleteEnrollmentAsBuyer(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	const getIncompleteEnrollmentAsSeller = async () => {
		try {
			const response = await axiosPrivate.get(`api/v1/enrollments/get/incomplete/seller/${userId}/buyer/${contactId}`);
			console.log(response.data);
			setIncompleteEnrollmentAsSeller(response.data);
		} catch (error) {
			console.log(error);
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
			console.log(error);
		}
	};

	const declineEnrollment = async (enrollmentId: number) => {
		try {
			const response = await axiosPrivate.delete(`api/v1/enrollments/buyer-declines/${enrollmentId}`);
			setIncompleteEnrollmentAsBuyer(response.data);
			setDeclineEnrollmentModal(false);
		} catch (error) {
			console.log(error);
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
				<div className="m-2 rounded-md bg-light-secondary p-2 dark:bg-dark-secondary">
					{" "}
					{incompleteEnrollmentAsBuyer.buyerConfirmed == false && (
						<div>
							<p>
								{incompleteEnrollmentAsBuyer.gig.seller.fullName} has offered you an enrollment. Confirm it to begin the
								sessions.
							</p>

							<p>{incompleteEnrollmentAsBuyer.gig.title}</p>
							<p>{incompleteEnrollmentAsBuyer.price}</p>
							{/* TODO: other data here */}
							<div className="flex items-center justify-center">
								<button className="solid-cancel-btn mr-1" onClick={() => setDeclineEnrollmentModal(true)}>
									Decline Enrollment
								</button>
								<button className="solid-btn ml-1" onClick={() => setConfirmEnrollmentModal(true)}>
									Accept Enrollment
								</button>
							</div>

							{confirmEnrollmentModal && (
								<div className="modal-grand-parent">
									<div className="modal-parent">
										<div>
											<p className="small-headings">Are you sure you want to accept this enrollment?</p>
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
											<p className="small-headings">Are you sure you want to decline this enrollment?</p>
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
						</div>
					)}
					{incompleteEnrollmentAsBuyer.buyerConfirmed && (
						<div>
							<EnrollmentView viewType="buyer" enrollment={incompleteEnrollmentAsBuyer} />
						</div>
					)}
				</div>
			)}
			{incompleteEnrollmentAsSeller && (
				<div className="m-2 rounded-md bg-light-secondary p-2 dark:bg-dark-secondary">
					{incompleteEnrollmentAsSeller.buyerConfirmed == false && (
						<div>
							<p>
								<p className="small-headings">Unconfirmed Enrollment!</p>
								You have offered the following enrollment. You can begin the sessions once{" "}
								{incompleteEnrollmentAsSeller?.buyer?.fullName} accepts the enrollment.
							</p>
							<div>
								<p>{incompleteEnrollmentAsSeller.gig.title}</p>
								<p>{incompleteEnrollmentAsSeller.price}</p>
							</div>
						</div>
					)}

					{incompleteEnrollmentAsSeller.buyerConfirmed && (
						<div>
							<EnrollmentView viewType="seller" enrollment={incompleteEnrollmentAsSeller} />
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default OfferedEnrollments;
