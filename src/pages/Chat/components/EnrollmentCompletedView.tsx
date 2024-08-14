import React from "react";
import { Enrollment } from "@/utils/types";

interface EnrollmentCompletedViewProps {
	enrollment: Enrollment;
}

const EnrollmentCompletedView: React.FC<EnrollmentCompletedViewProps> = ({ enrollment }) => {
	return (
		<div>
			<p className="small-headings.">Enrollment has ended. Voila!!</p>
		</div>
	);
};

export default EnrollmentCompletedView;
