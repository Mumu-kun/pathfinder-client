import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Gig } from "@/utils/types";
import CreateEnrollment from "./components/CreateEnrollment";

const Controls: React.FC = () => {
	const { auth } = useAuth();
	const userId = auth?.userId;
	const { contactId } = useParams();
	const axiosPrivate = useAxiosPrivate();
	const [createAnEnrollmentClicked, setCreateAnEnrollmentClicked] = useState<boolean>(false);

	const createEnrollmentBtnClicked = () => {
		setCreateAnEnrollmentClicked(true);
	};

	return (
		<div>
			{/* TODO - make sure only the seller mode selected users have this option */}
			<div>
				<button onClick={createEnrollmentBtnClicked}>Create an Enrollment</button>
			</div>
			{createAnEnrollmentClicked && <CreateEnrollment setCreateAnEnrollmentClicked={setCreateAnEnrollmentClicked} />}
		</div>
	);
};

export default Controls;
