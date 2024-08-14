import React, { useEffect, useState, useContext, version } from "react";
import { Enrollment } from "@/utils/types";
import SessionData from "./SessionData";
import EnrollmentCompletedView from "./EnrollmentCompletedView";

type ViewType = "buyer" | "seller";

interface EnrollmentViewProps {
	viewType: ViewType;
	enrollment: Enrollment;
}

const EnrollmentView: React.FC<EnrollmentViewProps> = ({ viewType, enrollment }) => {
	console.log(enrollment);

	return (
		<div>
			{enrollment && viewType && (
				<div>
					{enrollment.completedAt !== null ? (
						<EnrollmentCompletedView enrollment={enrollment} />
					) : (
						<div>
							{viewType == "buyer" ? (
								<div>
									<p>You are currently enrolled in the follwing gig offered by {enrollment.gig.seller.fullName}</p>
								</div>
							) : (
								<div>
									<p>You are currently offering an enrollment to {enrollment.buyer.fullName} for the following gig.</p>
								</div>
							)}
							<div>
								<br />
								{/* // todo: show gig image */}
								<p>{enrollment.gig.title}</p>
								<p>Enrollment started at {enrollment.startedAt}</p>
								<p>Enrollment should end at {enrollment.deadline}</p>

								{viewType == "buyer" && (
									<div>
										<p>You have paid {enrollment.price} BDT for this enrollment.</p>
									</div>
								)}
								{viewType == "seller" && (
									<div>
										<p>The buyer has paid {enrollment.price} BDT for this enrollment.</p>
									</div>
								)}
								<p>Total sessions to be held - {enrollment.numSessions}</p>
								<p>Duration of each session - {enrollment.sessionDurationInMinutes} minutes</p>
								<p>
									Session completed - {enrollment.numSessionsCompleted}/{enrollment.numSessions}
								</p>

								<br />
								<SessionData enrollment={enrollment} viewType={viewType} />
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default EnrollmentView;
