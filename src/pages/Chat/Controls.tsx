import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Gig } from "@/utils/types";
import CreateEnrollment from "./components/CreateEnrollment";
import OfferedEnrollments from "./components/OfferedEnrollments";
import { disableScroll, enableScroll } from "@/utils/functions";

const Controls: React.FC = () => {
	const { auth } = useAuth();
	const userId = auth?.userId;
	const { contactId } = useParams();
	const axiosPrivate = useAxiosPrivate();
	const [createAnEnrollmentClicked, setCreateAnEnrollmentClicked] = useState<boolean>(false);

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

	

	return (
		<div>
			{/* TODO - make sure only the seller mode selected users have this option */}
			<div>
				<button className="solid-btn" onClick={createEnrollmentBtnClicked}>
					Create an Enrollment
				</button>
			</div>
			{createAnEnrollmentClicked && <CreateEnrollment setCreateAnEnrollmentClicked={setCreateAnEnrollmentClicked} />}
			<OfferedEnrollments />
		</div>
	);
};

export default Controls;
