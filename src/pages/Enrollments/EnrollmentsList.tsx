import Loading from "@/components/Loading";
import { coverImageUrl } from "@/utils/functions";
import { Enrollment, Page } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from "react-router-dom";

type Props = {
	enrollments: Page<Enrollment> | undefined;
	getEnrollments: (page?: number) => void;
};

const EnrollmentsList = ({ enrollments, getEnrollments }: Props) => {
	const [currPage, setCurrPage] = useState<number>(0);
	const pages = useMemo(() => {
		if (!enrollments) {
			return [0];
		}

		const start = Math.max(0, enrollments.number - 2);
		const end = Math.min(enrollments.totalPages, enrollments.number + 3);

		return Array.from({ length: end - start }, (_, i) => i + start);
	}, [enrollments]);

	const pageNav = (condition: boolean, pageNo: number) => {
		if (!condition) {
			return;
		}

		setCurrPage(pageNo);
	};

	useEffect(() => {
		getEnrollments(currPage);
	}, [currPage]);

	return (
		<div className="grid grid-cols-[5rem_1fr_repeat(5,auto)] gap-x-6 gap-y-1 text-sm max-sm:grid-cols-[3rem_1fr_repeat(6,auto)]">
			<div className="col-span-full mb-2 grid grid-cols-subgrid border-b border-zinc-300 py-2 font-bold">
				<div className="col-span-2 ml-8">Gig</div>
				<div className="text-center">Sessions</div>
				<div className="text-center">Duration</div>
				<div className="text-center">Price</div>
				<div className="text-center">Deadline / Completed</div>
				<div className="text-center">
					<FaAngleDown className="invisible" />
				</div>
			</div>
			{enrollments ? (
				enrollments.content.length > 0 ? (
					<>
						{enrollments.content.map((enrollment) => {
							const isCompleted = !!enrollment.completedAt;
							const isPastDeadline = !isCompleted && new Date(enrollment.deadline) < new Date();
							return (
								<div
									className={`col-span-full grid grid-cols-subgrid items-center rounded p-1 pr-2 ${isPastDeadline ? "bg-red-300 font-medium dark:bg-red-400" : ""}`}
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
										{!isCompleted
											? new Date(enrollment.deadline).toLocaleTimeString("en-GB", {
													year: "2-digit",
													month: "2-digit",
													day: "2-digit",
													hour: "2-digit",
													minute: "2-digit",
												})
											: "Completed"}
									</div>
									<Link
										to={`/enrollment/details/${enrollment.id}`}
										className={`outline-btn text-sm ${isPastDeadline ? "border-none text-zinc-600 hover:bg-zinc-400 dark:text-white dark:hover:bg-zinc-700" : ""}`}
									>
										Details
									</Link>
								</div>
							);
						})}
						<div className="col-span-full mt-1 flex w-full items-center gap-1 rounded bg-light-secondary px-3 py-2 font-semibold dark:bg-dark-secondary">
							<FaAngleDoubleLeft
								className="hover-effect-no-shadow cursor-pointer"
								size={20}
								onClick={() => pageNav(enrollments.number > 0, 0)}
							/>
							<FaAngleLeft
								className="hover-effect-no-shadow mr-auto cursor-pointer"
								size={20}
								onClick={() => pageNav(enrollments.number > 0, enrollments.number - 1)}
							/>

							{pages.map((i) => (
								<p
									key={i}
									className={`hover-effect cursor-pointer select-none rounded px-2 py-0.5 text-sm ${i === enrollments.number ? "bg-green-400 text-white" : "bg-white text-black"}`}
									onClick={() => pageNav(i !== enrollments.number, i)}
								>
									{i + 1}
								</p>
							))}

							<FaAngleRight
								className="hover-effect-no-shadow ml-auto cursor-pointer"
								size={20}
								onClick={() => pageNav(!enrollments.last, enrollments.number + 1)}
							/>
							<FaAngleDoubleRight
								className="hover-effect-no-shadow cursor-pointer"
								size={20}
								onClick={() => pageNav(!enrollments.last, enrollments.totalPages - 1)}
							/>
						</div>
					</>
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
