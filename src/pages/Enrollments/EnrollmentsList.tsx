import Dropdown from "@/components/Dropdown";
import Loading from "@/components/Loading";
import { coverImageUrl } from "@/utils/functions";
import { Enrollment } from "@/utils/types";
import React from "react";
import { FaAngleDown } from "react-icons/fa6";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from "react-router-dom";

type Props = {
	enrollments: Enrollment[] | undefined;
	type: "ongoing" | "completed";
};

const EnrollmentsList = ({ enrollments, type }: Props) => {
	return (
		<div className="grid grid-cols-[5rem_1fr_repeat(5,auto)] gap-x-6 gap-y-1 text-sm max-sm:grid-cols-[3rem_1fr_repeat(6,auto)]">
			<div className="col-span-full mb-2 grid grid-cols-subgrid border-b border-zinc-300 py-2 font-bold">
				<div className="col-span-2 ml-8">Gig</div>
				<div className="text-center">Sessions</div>
				<div className="text-center">Duration</div>
				<div className="text-center">Price</div>
				<div className="text-center">{type === "ongoing" ? "Deadline" : "Completed"}</div>
				<div className="text-center">
					<FaAngleDown className="invisible" />
				</div>
			</div>
			{enrollments ? (
				enrollments.length > 0 ? (
					enrollments.map((enrollment) => (
						<div
							className={`col-span-full grid grid-cols-subgrid items-center rounded p-1 pr-2 ${!enrollment.completedAt && new Date(enrollment.deadline) < new Date() ? "bg-red-300 font-medium dark:bg-red-400" : ""}`}
							key={`enrollments-${enrollment.id}`}
						>
							<img
								src={coverImageUrl(enrollment.gig.gigCoverImage)}
								alt=""
								className="aspect-[2/1] w-full rounded-sm object-cover"
							/>
							<Link to={`/gig/${enrollment.gig.id}`} className="hover:underline">
								{enrollment.gig.title}
							</Link>
							<div className="text-center">
								{enrollment.numSessionsCompleted} / {enrollment.numSessions}
							</div>
							<div className="text-center">{enrollment.sessionDurationInMinutes} Mins</div>
							<div className="flex items-center">
								<TbCurrencyTaka className="h-4 w-4" /> {enrollment.price}
							</div>
							<div className="text-center">
								{new Date(type === "ongoing" ? enrollment.deadline : enrollment.completedAt!).toLocaleTimeString(
									"en-GB",
									{
										year: "2-digit",
										month: "2-digit",
										day: "2-digit",
										hour: "2-digit",
										minute: "2-digit",
									}
								)}
							</div>
							<Link to={`/enrollment/details/${enrollment.id}`} className="solid-btn text-sm">
								Details
							</Link>
						</div>
					))
				) : (
					<div className="col-span-full my-2 inline-block w-fit justify-self-center font-medium">
						No enrollments To Show
					</div>
				)
			) : (
				<div className="col-span-full aspect-video">
					<Loading />
				</div>
			)}
		</div>
	);
};

export default EnrollmentsList;
