import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useMode from "@/hooks/useMode";
import { disableScroll, enableScroll } from "@/utils/functions";
import { Enrollment } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateEnrollment from "./components/CreateEnrollment";
import OfferedEnrollments from "./components/OfferedEnrollments";

const Controls: React.FC = () => {
	const { auth } = useAuth();
	const userId = auth?.userId;
	const { id } = useParams();
	const contactId = id ? parseInt(id) : undefined;
	const axiosPrivate = useAxiosPrivate();
	const [createAnEnrollmentClicked, setCreateAnEnrollmentClicked] = useState<boolean>(false);
	const { mode } = useMode();

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
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const findRunningEnrollment = async () => {
			try {
				if (mode == "buyer") return;

				setLoading(true);
				const response = await axiosPrivate.get(
					`api/v1/enrollments/get/incomplete/seller/${userId}/buyer/${contactId}`
				);
				setRunningEnrollment(response.data);
				setLoading(false);
				console.log(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		findRunningEnrollment();
	}, [userId, contactId]);

	return (
		<div className="ml-2 w-[24rem] border-l-2">
			<p className="medium-headings text-center">Controls</p>
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
