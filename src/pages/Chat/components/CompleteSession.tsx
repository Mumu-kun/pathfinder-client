import React, { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Session } from "@/utils/types";
import { enableScroll, disableScroll } from "@/utils/functions";
import Loading from "@/components/Loading";

interface CompleteSessionProps {
	session: Session;
}

const CompleteSession: React.FC<CompleteSessionProps> = ({ session }) => {
	const axiosPrivate = useAxiosPrivate();

	const [markSessionCompletedClicked, setMarkSessionCompletedClicked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

	const completeSession = async (sessionId: number) => {
		try {
            setLoading(true);
			const response = await axiosPrivate.put(`api/v1/sessions/complete/${sessionId}`);
			setLoading(false);
			setMarkSessionCompletedClicked(false);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (markSessionCompletedClicked) {
			disableScroll();
		} else {
			enableScroll();
		}
	}, [markSessionCompletedClicked]);

	return (
		<div>
			<button onClick={() => setMarkSessionCompletedClicked(true)} className="outline-btn">
				Mark Session as Completed
			</button>
			{markSessionCompletedClicked && (
				<div className="modal-grand-parent">
					<div className="modal-parent">
						<div>
							<p className="small-headings">Are you sure you want to make this session as completed?</p>
							<p className="text-center font-bold">Make sure you have given the promised time and effort!</p>
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
				</div>
			)}
		</div>
	);
};

export default CompleteSession;
