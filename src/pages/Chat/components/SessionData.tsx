import React, { useEffect, useState } from "react";
import { Enrollment, Session } from "@/utils/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import CreateSession from "./CreateSession";
import { enableScroll, disableScroll } from "@/utils/functions";
import CompleteSession from "./CompleteSession";
import useStomp from "@/hooks/useStomp";
import Countdown, { zeroPad } from "react-countdown";

interface sesssionDataProps {
	enrollment: Enrollment;
	viewType: "buyer" | "seller";
}

const SessionData: React.FC<sesssionDataProps> = ({ enrollment, viewType }) => {
	const [runningSession, setRunningSession] = useState<Session | null>(null);
	const axiosPrivate = useAxiosPrivate();

	const { receivedNotification } = useStomp();

	const getRunningRessions = async () => {
		try {
			const response = await axiosPrivate.get(`api/v1/sessions/running/enrollment/${enrollment.id}`);
			console.log(response.data);
			setRunningSession(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getRunningRessions();
	}, [enrollment, viewType]);

	useEffect(() => {
		if (receivedNotification?.type === "SESSION") {
			getRunningRessions();
		}
	}, [receivedNotification]);

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
			await axiosPrivate.put(`api/v1/sessions/buyer-declines/${sessionId}`);
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

	const joinSession = async () => {
		if (!runningSession) return;

		try {
			const res = await axiosPrivate.get(`api/v1/sessions/join-zoom/${runningSession.id}`);

			if (res.data) {
				const newWindow = window.open(res.data, "_blank", "noopener,noreferrer");
				if (newWindow) newWindow.opener = null;
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			{runningSession == null && (
				<>
					{viewType == "seller" && (
						<>
							<button className="solid-btn mx-auto" onClick={() => setScheduleSessionClicked(true)}>
								Schedule a Session
							</button>
							{scheduleSessionClicked && (
								<CreateSession
									enrollmentId={enrollment.id}
									setRunningSession={setRunningSession}
									setScheduleSessionClicked={setScheduleSessionClicked}
								/>
							)}
						</>
					)}
					{viewType == "buyer" && (
						<>
							<p>No session is scheduled at the moment.</p>
							<p>Ask {enrollment.gig.seller.fullName} to schedule one.</p>
						</>
					)}
				</>
			)}
			{runningSession && (
				<>
					{runningSession.buyerConfirmed == true ? (
						<>
							{beforeSession && (
								<>
									<p className="mb-1 font-bold">Upcoming Session</p>
									<div className="grid grid-cols-[auto_auto_1fr] gap-x-3 text-sm capitalize">
										<span>Scheduled</span>
										<span>:</span>
										<span>
											{new Date(runningSession.scheduledAt).toLocaleTimeString(undefined, {
												year: "numeric",
												month: "short",
												day: "numeric",
												hour: "numeric",
												minute: "numeric",
											})}
										</span>
										<span>Type</span>
										<span>:</span>
										<span>{runningSession.sessionType}</span>
										<Countdown
											date={new Date(runningSession.scheduledAt).getTime()}
											renderer={({ days, hours, minutes, seconds, completed }) => {
												if (completed) {
													return <span className="col-span-full">Session is running</span>;
												} else {
													return (
														<>
															<span>Time left</span>
															<span>:</span>
															<span>
																{!!days && `${days}D`} {(!!days || !!hours) && `${hours}H`}{" "}
																{(!!days || !!hours || !!minutes) && `${zeroPad(minutes, 2)}M`}{" "}
																{(!!days || !!hours || !!minutes || !!seconds) && `${zeroPad(seconds, 2)}S`}
															</span>
														</>
													);
												}
											}}
										/>
									</div>
									{viewType === "seller" && (
										<div className="mt-3 rounded bg-red-300 px-2.5 py-1.5 text-sm dark:bg-red-700">
											You are highly recommended to have some proof(video/audio/images) of the session. In case the
											buyer files a report with the session, we will ask for the proof, to evaluate the situation with
											transparency.
										</div>
									)}
								</>
							)}

							{duringSession && (
								<div className="flex flex-col gap-y-1">
									<p className="text-center">Session is currently running!</p>

									{viewType === "seller" ? (
										<CompleteSession session={runningSession} />
									) : (
										runningSession.sessionType === "online" && (
											<button onClick={joinSession} className="solid-btn mx-auto mt-1">
												Join Session
											</button>
										)
									)}
								</div>
							)}
							{afterSession && (
								<>
									{viewType === "seller" ? (
										<>
											<div className="text-center">Session has ended. Please mark it as complete.</div>
											<CompleteSession session={runningSession} />
										</>
									) : (
										<div>The session has ended. Ask the seller to mark it as complete.</div>
									)}
								</>
							)}
						</>
					) : viewType === "seller" ? (
						<p className="text-center">
							Wait for <span className="font-bold">{runningSession.enrollment.buyer.fullName}</span> to confirm the
							scheduled session.
						</p>
					) : (
						<>
							<p className="mb-1">
								<span className="font-bold">{runningSession.enrollment.gig.seller.fullName}</span> has scheduled a
								session
							</p>
							<div className="grid grid-cols-[auto_auto_1fr] gap-x-2 text-sm capitalize">
								<span>Scheduled</span>
								<span>:</span>
								<span>
									{new Date(runningSession.scheduledAt).toLocaleTimeString(undefined, {
										year: "numeric",
										month: "short",
										day: "numeric",
										hour: "numeric",
										minute: "numeric",
									})}
								</span>
								<span>Type</span>
								<span>:</span>
								<span>{runningSession.sessionType}</span>
								<Countdown
									date={new Date(runningSession.scheduledAt).getTime()}
									renderer={({ days, hours, minutes, seconds, completed }) => {
										if (completed) {
											return <span className="col-span-full">Session is running</span>;
										} else {
											return (
												<>
													<span>Time left</span>
													<span>:</span>
													<span>
														{!!days && `${days}D`} {(!!days || !!hours) && `${hours}H`}{" "}
														{(!!days || !!hours || !!minutes) && `${zeroPad(minutes, 2)}M`}{" "}
														{(!!days || !!hours || !!minutes || !!seconds) && `${zeroPad(seconds, 2)}S`}
													</span>
												</>
											);
										}
									}}
								/>
							</div>
							<div className="mt-2 flex items-center justify-center gap-x-2">
								<button className="solid-btn" onClick={() => setConfirmSessionModal(true)}>
									Accept
								</button>
								<button className="solid-cancel-btn" onClick={() => setDeclineSessionModal(true)}>
									Decline
								</button>
							</div>

							{confirmSessionModal && (
								<div className="modal-grand-parent">
									<div className="modal-parent">
										<div>
											<p className="small-headings mb-2 text-center">
												Are you sure you want to accept this scheduled session?
											</p>
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
												You can always ask {runningSession.enrollment.gig.seller.fullName} for scheduling another one.
											</p>
											<div className="flex items-center justify-center">
												<button className="solid-btn m-1" onClick={() => setDeclineSessionModal(false)}>
													No
												</button>
												<button className="solid-cancel-btn m-1" onClick={() => declineSession(runningSession.id)}>
													Yes
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</>
					)}
				</>
			)}
		</>
	);
};

export default SessionData;
