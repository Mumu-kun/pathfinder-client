import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Gig, Enrollment } from "@/utils/types";
import CreateEnrollment from "./components/CreateEnrollment";
import OfferedEnrollments from "./components/OfferedEnrollments";
import { disableScroll, enableScroll } from "@/utils/functions";
import ModeContext from "@/context/ModeProvider";

const Controls: React.FC = () => {
	const { auth } = useAuth();
	const userId = auth?.userId;
	const { id } = useParams();
	const contactId = id ? parseInt(id) : undefined;
	const axiosPrivate = useAxiosPrivate();
	const [createAnEnrollmentClicked, setCreateAnEnrollmentClicked] = useState<boolean>(false);
	const { mode } = useContext(ModeContext);

	const createEnrollmentBtnClicked = () => {
		setCreateAnEnrollmentClicked(true);
	};

	useEffect(() => {
		if (createAnEnrollmentClicked) {
			disableScroll();
		} else {
			enableScroll();
		}
	}, [createAnEnrollmentClicked]);

	const [runningEnrollment, setRunningEnrollment] = useState<Enrollment | null>(null);

	useEffect(() => {
		const findRunningEnrollment = async () => {
			try {
				if (mode == "buyer") return;
				const response = await axiosPrivate.get(
					`api/v1/enrollments/get/incomplete/seller/${userId}/buyer/${contactId}`
				);
				setRunningEnrollment(response.data);
				console.log(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		findRunningEnrollment();
	}, [userId, contactId]);

	return (
		<div>
			{userId !== contactId && (
				<div>
					<div>
						{mode === "seller" && runningEnrollment == null && (
							<div>
								<button className="solid-btn" onClick={createEnrollmentBtnClicked}>
									Create an Enrollment
								</button>
							</div>
						)}
					</div>
					{createAnEnrollmentClicked && (
						<CreateEnrollment setCreateAnEnrollmentClicked={setCreateAnEnrollmentClicked} />
					)}
					<OfferedEnrollments />
				</div>
			)}
		</div>
	);
};

export default Controls;
