import { coverImageUrl } from "@/utils/functions";
import { Enrollment } from "@/utils/types";
import React from "react";
import { PiChalkboardTeacher, PiTimerBold } from "react-icons/pi";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from "react-router-dom";
import SessionData from "./SessionData";

type ViewType = "buyer" | "seller";

interface EnrollmentViewProps {
	viewType: ViewType;
	enrollment: Enrollment;
}

const EnrollmentView: React.FC<EnrollmentViewProps> = ({ viewType, enrollment }) => {
	return (
		<>
			<p className="w-full bg-light-secondary px-4 py-2 text-center text-sm font-semibold dark:bg-dark-secondary">
				{!enrollment.buyerConfirmed ? (
					viewType == "buyer" ? (
						<>
							<span className="font-bold">{enrollment.gig.seller.fullName}</span> has offered you an enrollment.
						</>
					) : (
						<>
							You have offered <span className="font-bold">{enrollment.buyer.fullName}</span> an enrollment.
						</>
					)
				) : viewType == "buyer" ? (
					<>
						<p>
							You are currently enrolled in the following gig offered by{" "}
							<span className="font-bold">{enrollment.gig.seller.fullName}</span>
						</p>
					</>
				) : (
					<>
						<p>
							You are currently offering an enrollment to <span className="font-bold">{enrollment.buyer.fullName}</span>{" "}
							for the following gig.
						</p>
					</>
				)}
			</p>

			<div className="overflow-hidden">
				<img
					src={coverImageUrl(enrollment.gig.gigCoverImage)}
					className="col-span-full aspect-[6/1] w-full object-cover"
				/>
				<div className="flex flex-col gap-y-3 p-2 px-4 font-semibold">
					<div className="flex items-center justify-between">
						<Link to={`/gig/${enrollment.gig.id}`} className="small-headings pl-0 text-left hover:underline">
							{enrollment.gig.title}
						</Link>
						<div className="flex w-max flex-shrink-0 items-center justify-self-end text-xl font-semibold">
							<TbCurrencyTaka className="mt-0.5 h-6 w-6" /> {enrollment.price}
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<PiChalkboardTeacher
								className="mr-1 mt-0.5 h-6 w-6"
								style={{ marginRight: enrollment.buyerConfirmed ? "0.5rem" : undefined }}
							/>
							{enrollment.buyerConfirmed && `${enrollment.numSessionsCompleted} / `}
							{enrollment.numSessions} Session
							{enrollment.numSessions > 1 && "s"}
						</div>
						<div className="flex items-center justify-self-end">
							<PiTimerBold className="mr-1 mt-0.5 h-5 w-5" />
							{enrollment.sessionDurationInMinutes} Min
							{enrollment.sessionDurationInMinutes > 1 && "s"} Each
						</div>
					</div>
					<div className="col-span-full grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-1 text-sm">
						{enrollment.startedAt && (
							<div className="col-span-full grid grid-cols-subgrid">
								<span>Started</span>
								<span>:</span>
								<span>
									{new Date(enrollment.startedAt).toLocaleTimeString(undefined, {
										year: "numeric",
										month: "short",
										day: "numeric",
										hour: "numeric",
										minute: "numeric",
									})}
								</span>
							</div>
						)}
						<div className="col-span-full grid grid-cols-subgrid">
							<span>Deadline</span>
							<span>:</span>
							<span>
								{new Date(enrollment.deadline).toLocaleTimeString(undefined, {
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "numeric",
									minute: "numeric",
								})}
							</span>
						</div>
					</div>
					{enrollment.buyerConfirmed && (
						<div className="flex flex-col gap-y-2">
							{enrollment.numSessionsCompleted <= enrollment.numSessions ? (
								<div className="flex flex-col">
									<SessionData enrollment={enrollment} viewType={viewType} />
								</div>
							) : (
								<p className="small-headings text-center">Enrollment has ended. Voila!!</p>
							)}
							<Link
								className="solid-btn col-span-full self-center"
								to={{ pathname: `/enrollment/details/${enrollment.id}` }}
							>
								View details
							</Link>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default EnrollmentView;
