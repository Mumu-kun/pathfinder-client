import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useStomp from "@/hooks/useStomp";
import { disableScroll, enableScroll } from "@/utils/functions";
import { Session } from "@/utils/types";
import { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";

interface CompleteSessionProps {
	session: Session;
}

const CompleteSession: React.FC<CompleteSessionProps> = ({ session }) => {
	const axiosPrivate = useAxiosPrivate();

	const { receivedNotification } = useStomp();

	const [isZoomAuthorized, setIsZoomAuthorized] = useState<boolean>(false);
	const [joinLink, setJoinLink] = useState<string | undefined>();
	const [markSessionCompletedClicked, setMarkSessionCompletedClicked] = useState<boolean>(false);

	const completeSession = async (sessionId: number) => {
		try {
			await axiosPrivate.put(`api/v1/sessions/complete/${sessionId}`);
			setMarkSessionCompletedClicked(false);
		} catch (error) {
			console.error(error);
		}
	};

	const checkZoomAuthorized = async () => {
		try {
			const res = await axiosPrivate.get("api/v1/zoom/auth-check");

			setIsZoomAuthorized(res.data);
		} catch (error) {
			console.error(error);
		}
	};

	const startSession = async () => {
		try {
			const res = await axiosPrivate.post(`api/v1/sessions/start-zoom/${session.id}`);

			const data = res.data;

			if (data.start_url) {
				const newWindow = window.open(data.start_url, "_blank", "noopener,noreferrer");
				if (newWindow) newWindow.opener = null;
			}

			if (data.join_url) {
				setJoinLink(data.join_url);
			}
		} catch (error) {
			console.error(error);
			if (isAxiosError(error) && error.response?.status === 450) {
				const newWindow = window.open(error.response.data, "_blank", "noopener,noreferrer");
				if (newWindow) newWindow.opener = null;
			}
		}
	};

	const getJoinLink = async () => {
		try {
			const res = await axiosPrivate.get(`api/v1/sessions/join-zoom/${session.id}`);

			setJoinLink(res.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		checkZoomAuthorized();
		getJoinLink();
	}, []);

	useEffect(() => {
		if (markSessionCompletedClicked) {
			disableScroll();
		} else {
			enableScroll();
		}
	}, [markSessionCompletedClicked]);

	useEffect(() => {
		if (
			receivedNotification?.type === "SILENT" &&
			receivedNotification?.text === "Your Zoom account has been connected."
		) {
			checkZoomAuthorized();
			getJoinLink();
		}
	}, [receivedNotification]);

	const now = new Date().getTime();
	const sessionScheduledAt = new Date(session.scheduledAt).getTime();
	const sessionEndTime = sessionScheduledAt + session.enrollment.sessionDurationInMinutes * 60000;

	const isDuringSession = now >= sessionScheduledAt && now <= sessionEndTime;

	return (
		<>
			{session.sessionType === "online" && isDuringSession && (
				<div className="mx-auto mt-1 flex items-center justify-center gap-x-2">
					<button onClick={startSession} className="solid-btn">
						{isZoomAuthorized ? "Start Session" : "Connect Zoom"}
					</button>
					{joinLink && (
						<button
							onClick={() => {
								navigator.clipboard.writeText(joinLink);
							}}
							className="solid-btn"
						>
							Copy Join Link
						</button>
					)}
				</div>
			)}
			<button onClick={() => setMarkSessionCompletedClicked(true)} className="outline-btn mx-auto mt-1">
				Mark Session as Completed
			</button>
			{markSessionCompletedClicked && (
				<div className="modal-grand-parent">
					<div className="modal-parent space-y-2">
						<p className="small-headings text-center">Are you sure you want to make this session as completed?</p>
						<p className="text-center">Make sure you have given the promised time and effort!</p>
						<div className="flex items-center justify-center">
							<button className="solid-cancel-btn m-1" onClick={() => setMarkSessionCompletedClicked(false)}>
								No
							</button>
							<button className="solid-btn m-1" onClick={() => completeSession(session.id)}>
								Yes
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default CompleteSession;
