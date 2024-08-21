// this component checks for the enrollments that are offered to the user and displays them.

import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Enrollment } from "@/utils/types";
import { useParams } from "react-router-dom";
import { coverImageUrl, disableScroll, enableScroll } from "@/utils/functions";
import EnrollmentView from "./EnrollmentView";
import { TbCurrencyTaka } from "react-icons/tb";
import { PiChalkboardTeacher, PiTimer, PiTimerBold } from "react-icons/pi";
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
				<div className="m-2 overflow-hidden rounded-md bg-light-bg px-1 pb-4 shadow dark:bg-dark-secondary">
					{incompleteEnrollmentAsBuyer.buyerConfirmed == false && (
						<div>
							<p className="bg-light-secondary py-2 text-center text-sm font-semibold dark:bg-dark-secondary">
								<span className="font-bold">{incompleteEnrollmentAsBuyer.gig.seller.fullName}</span> has offered you an
								enrollment.
							</p>

							<div className="overflow-hidden">
								<img
									src={coverImageUrl(incompleteEnrollmentAsBuyer.gig.gigCoverImage)}
									className="col-span-full aspect-[6/1] w-full object-cover"
								/>
								<div className="grid grid-cols-[auto_auto] gap-y-1 p-2 px-4 font-semibold">
									<p className="medium-headings text-left">{incompleteEnrollmentAsBuyer.gig.title}</p>
									<div className="flex items-center justify-self-end text-xl font-semibold">
										<TbCurrencyTaka className="mt-0.5 h-6 w-6" /> {incompleteEnrollmentAsBuyer.price}
									</div>
									<div className="flex items-center">
										<PiChalkboardTeacher className="mr-1 mt-0.5 h-6 w-6" /> {incompleteEnrollmentAsBuyer.numSessions}{" "}
										Session
										{incompleteEnrollmentAsBuyer.numSessions > 1 && "s"}
									</div>
									<div className="flex items-center justify-self-end">
										<PiTimerBold className="mr-1 mt-0.5 h-5 w-5" />
										{incompleteEnrollmentAsBuyer.sessionDurationInMinutes} Min
										{incompleteEnrollmentAsBuyer.sessionDurationInMinutes > 1 && "s"} Each
									</div>
									<div className="col-span-full my-1 text-sm">
										Deadline :{" "}
										{new Date(incompleteEnrollmentAsBuyer.deadline).toLocaleTimeString(undefined, {
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "numeric",
											minute: "numeric",
										})}
									</div>
								</div>
							</div>
							{/* TODO: other data here */}
							<div className="flex items-center justify-center">
								<button className="solid-cancel-btn mr-1" onClick={() => setDeclineEnrollmentModal(true)}>
									Decline
								</button>
								<button className="solid-btn ml-1" onClick={() => setConfirmEnrollmentModal(true)}>
									Accept
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
				<div className="m-2 overflow-hidden rounded-md bg-light-bg shadow dark:bg-dark-secondary">
					{incompleteEnrollmentAsSeller.buyerConfirmed == false && (
						<div>
							{/* <p className="bg-light-secondary py-2 text-center font-semibold dark:bg-dark-secondary">
								<p className="small-headings">Unconfirmed Enrollment!</p>
								You have offered the following enrollment. You can begin the sessions once{" "}
								{incompleteEnrollmentAsSeller?.buyer?.fullName} accepts the enrollment.
							</p> */}
							<p className="bg-light-secondary px-1 py-2 text-center text-sm font-semibold dark:bg-dark-secondary">
								<p>You have offered the following enrollment.</p>
								<p>You can begin the sessions once</p>
								<p>
									<span className="font-bold">{incompleteEnrollmentAsSeller?.buyer?.fullName}</span> accepts the
									enrollment.
								</p>
							</p>

							<div className="overflow-hidden">
								<img
									src={coverImageUrl(incompleteEnrollmentAsSeller.gig.gigCoverImage)}
									className="col-span-full aspect-[6/1] w-full object-cover"
								/>
								<div className="grid grid-cols-[auto_auto] gap-y-1 p-2 px-4 font-semibold">
									<p className="medium-headings text-left">{incompleteEnrollmentAsSeller.gig.title}</p>
									<div className="flex items-center justify-self-end text-xl font-semibold">
										<TbCurrencyTaka className="mt-0.5 h-6 w-6" /> {incompleteEnrollmentAsSeller.price}
									</div>
									<div className="flex items-center">
										<PiChalkboardTeacher className="mr-1 mt-0.5 h-6 w-6" /> {incompleteEnrollmentAsSeller.numSessions}{" "}
										Session
										{incompleteEnrollmentAsSeller.numSessions > 1 && "s"}
									</div>
									<div className="flex items-center justify-self-end">
										<PiTimerBold className="mr-1 mt-0.5 h-5 w-5" />
										{incompleteEnrollmentAsSeller.sessionDurationInMinutes} Min
										{incompleteEnrollmentAsSeller.sessionDurationInMinutes > 1 && "s"} Each
									</div>
									<div className="col-span-full my-1 text-sm">
										Deadline :{" "}
										{new Date(incompleteEnrollmentAsSeller.deadline).toLocaleTimeString(undefined, {
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "numeric",
											minute: "numeric",
										})}
									</div>
								</div>
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
