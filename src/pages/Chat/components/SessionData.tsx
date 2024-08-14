import React, { useEffect, useState } from "react";
import { Enrollment, Session } from "@/utils/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import CreateSession from "./CreateSession";
import { enableScroll, disableScroll } from "@/utils/functions";
import CompleteSession from "./CompleteSession";

interface sesssionDataProps {
	enrollment: Enrollment;
	viewType: "buyer" | "seller";
}

const SessionData: React.FC<sesssionDataProps> = ({ enrollment, viewType }) => {
	const [runningSession, setRunningSession] = useState<Session | null>(null);
	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		const getRunningRessions = async () => {
			try {
				const response = await axiosPrivate.get(`api/v1/sessions/running/enrollment/${enrollment.id}`);
				console.log(response.data);
				setRunningSession(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		getRunningRessions();
	}, [enrollment, viewType]);

	const [scheduleSessionClicked, setScheduleSessionClicked] = useState<boolean>(false);

	const [confirmSessionModal, setConfirmSessionModal] = useState<boolean>(false);
	const [declineSessionModal, setDeclineSessionModal] = useState<boolean>(false);

	useEffect(() => {
		if (scheduleSessionClicked || confirmSessionModal || declineSessionModal) {
			disableScroll();
		} else {
			enableScroll();
		}
	}, [scheduleSessionClicked, confirmSessionModal, declineSessionModal]);

	const confirmSession = async (sessionId: number) => {
		try {
			const response = await axiosPrivate.put(`api/v1/sessions/buyer-confirms/${sessionId}`);
			setRunningSession(response.data);
			setConfirmSessionModal(false);
		} catch (error) {
			console.log(error);
		}
	};

	const declineSession = async (sessionId: number) => {
		try {
			const response = await axiosPrivate.put(`api/v1/sessions/buyer-declines/${sessionId}`);
			setRunningSession(null);
			setDeclineSessionModal(false);
		} catch (error) {
			console.log(error);
		}
	};

	var sessionScheduledAt;
	var sessionEndTime;

	const [beforeSession, setBeforeSession] = useState<boolean>(false);
	const [duringSession, setDuringSession] = useState<boolean>(false);
	const [afterSession, setAfterSession] = useState<boolean>(false);

	useEffect(() => {
		if (!runningSession) return;

		const now = new Date().getTime();
		sessionScheduledAt = new Date(runningSession.scheduledAt).getTime();
		sessionEndTime = sessionScheduledAt + runningSession.enrollment.sessionDurationInMinutes * 60000;
		if (now < sessionScheduledAt) {
			setBeforeSession(true);
			setDuringSession(false);
			setAfterSession(false);
		} else if (now > sessionScheduledAt && now < sessionEndTime) {
			setBeforeSession(false);
			setDuringSession(true);
			setAfterSession(false);
		} else if (now > sessionEndTime) {
			setBeforeSession(false);
			setDuringSession(false);
			setAfterSession(true);
		}
	}, [runningSession]);

	return (
		<div>
			{runningSession == null && (
				<div>
					{viewType == "seller" && (
						<div>
							<div>
								<button className="solid-btn" onClick={() => setScheduleSessionClicked(true)}>
									Schedule a Session
								</button>
							</div>
							{scheduleSessionClicked && (
								<CreateSession
									enrollmentId={enrollment.id}
									setRunningSession={setRunningSession}
									setScheduleSessionClicked={setScheduleSessionClicked}
								/>
							)}
						</div>
					)}
					{viewType == "buyer" && (
						<div>
							<p>No session is scheduled at the moment. Ask {enrollment.gig.seller.fullName} to schedule one.</p>
						</div>
					)}
				</div>
			)}
			{runningSession && (
				<div>
					{runningSession.buyerConfirmed == true ? (
						<div>
							<div>
								{beforeSession && (
									<div>
										<p>
											Next session is scheduled at {runningSession.scheduledAt}. It is set to be{" "}
											{runningSession.sessionType}.
											{viewType === "seller" && (
												<div className="py-5">
													You are highly recommended to have some proof(video/audio/images) of the session. In case the
													buyer files a report with the session, we will ask for the proof, to evaluate the situation
													with transparency.
												</div>
											)}
										</p>
									</div>
								)}

								{duringSession && (
									<div>
										<p>Session is currently running!</p>
										{viewType === "seller" && (
											<div>
												<CompleteSession session={runningSession} />
											</div>
										)}
									</div>
								)}
								{afterSession && (
									<div>
										{viewType === "seller" ? (
											<div>
												<div>Session has ended. Please mark it as complete.</div>
												<CompleteSession session={runningSession} />
											</div>
										) : (
											<div>The session has ended. Ask the seller to mark it as complete.</div>
										)}
									</div>
								)}
							</div>
						</div>
					) : (
						<div>
							{viewType === "seller" ? (
								<div>
									<p>Wait for {runningSession.enrollment.buyer.fullName} to confirm the scheduled session.</p>
								</div>
							) : (
								<div>
									<p>
										{runningSession.enrollment.gig.seller.fullName} has scheduled a session at{" "}
										{runningSession.scheduledAt} and it's set to be {runningSession.sessionType}. Please take action.
									</p>
									<div>
										<div className="flex items-center justify-center">
											<button className="solid-cancel-btn mr-1" onClick={() => setDeclineSessionModal(true)}>
												Decline Session
											</button>
											<button className="solid-btn ml-1" onClick={() => setConfirmSessionModal(true)}>
												Accept Session
											</button>
										</div>

										{confirmSessionModal && (
											<div className="modal-grand-parent">
												<div className="modal-parent">
													<div>
														<p className="small-headings">Are you sure you want to accept this scheduled session?</p>
														<div className="flex items-center justify-center">
															<button className="solid-cancel-btn m-1" onClick={() => setConfirmSessionModal(false)}>
																No
															</button>
															<button className="solid-btn m-1" onClick={() => confirmSession(runningSession.id)}>
																Yes
															</button>
														</div>
													</div>
												</div>
											</div>
										)}

										{declineSessionModal && (
											<div className="modal-grand-parent">
												<div className="modal-parent">
													<div>
														<p className="small-headings">Are you sure you want to decline this Session?</p>
														<p className="p-2 text-center font-bold">
															You can always ask {runningSession.enrollment.gig.seller.fullName} for scheduling another
															one.
														</p>
														<div className="flex items-center justify-center">
															<button className="solid-btn m-1" onClick={() => setDeclineSessionModal(false)}>
																No
															</button>
															<button
																className="solid-cancel-btn m-1"
																onClick={() => declineSession(runningSession.id)}
															>
																Yes
															</button>
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SessionData;
