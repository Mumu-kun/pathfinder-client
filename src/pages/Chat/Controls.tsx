import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useMode from "@/hooks/useMode";
import useStomp from "@/hooks/useStomp";
import { disableScroll, enableScroll } from "@/utils/functions";
import { Enrollment } from "@/utils/types";
import { useEffect, useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useBoolean } from "usehooks-ts";
import CreateEnrollment from "./components/CreateEnrollment";
import OfferedEnrollments from "./components/OfferedEnrollments";
import Loading from "@/components/Loading";

type ControlsProps = {
	isControlsExpanded: boolean;
	toggleControlsExpanded: () => void;
};

const Controls = ({ isControlsExpanded: isExpanded, toggleControlsExpanded: toggleExpanded }: ControlsProps) => {
	const { auth } = useAuth();
	const userId = auth?.userId;
	const { id } = useParams();
	const contactId = id ? parseInt(id) : undefined;
	const axiosPrivate = useAxiosPrivate();
	const [createAnEnrollmentClicked, setCreateAnEnrollmentClicked] = useState<boolean>(false);
	const { mode } = useMode();
	const { receivedNotification } = useStomp();

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
	const { value: refreshEnrollmentsVal, toggle: refreshEnrollments } = useBoolean(false);
	const [loading, setLoading] = useState<boolean>(false);

	const findRunningEnrollment = async () => {
		try {
			if (mode == "buyer") return;

			setLoading(true);
			const response = await axiosPrivate.get(`api/v1/enrollments/get/incomplete/seller/${userId}/buyer/${contactId}`);
			setRunningEnrollment(response.data);
			setLoading(false);
			// console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		findRunningEnrollment();
	}, [userId, contactId]);

	useEffect(() => {
		if (receivedNotification?.type === "ENROLLMENT") {
			findRunningEnrollment();
		}
	}, [receivedNotification]);

	return (
		<>
			{loading && <Loading />}
			<div
				className="hover-effect-no-shadow mx-auto flex h-8 cursor-pointer items-center justify-center gap-2 px-4"
				onClick={toggleExpanded}
			>
				<FaListCheck className="h-5 w-5" />
				<p
					className="small-headings text-center"
					style={{
						display: isExpanded ? "block" : "none",
					}}
				>
					Controls
				</p>
			</div>
			{userId !== contactId && (
				<div
					className="min-w-[20rem] flex-col items-center"
					style={{
						display: isExpanded ? "flex" : "none",
					}}
				>
					<div>
						{mode === "seller" && runningEnrollment == null && (
							<button className="solid-btn mx-auto my-4" onClick={createEnrollmentBtnClicked}>
								Create an Enrollment
							</button>
						)}
					</div>
					{createAnEnrollmentClicked && (
						<CreateEnrollment
							setCreateAnEnrollmentClicked={setCreateAnEnrollmentClicked}
							refreshEnrollments={refreshEnrollments}
						/>
					)}
					<OfferedEnrollments key={`controls-enrollments-${refreshEnrollmentsVal}`} />
				</div>
			)}
		</>
	);
};

export default Controls;
