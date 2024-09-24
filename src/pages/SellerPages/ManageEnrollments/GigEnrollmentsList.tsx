import Loading from "@/components/Loading";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { coverImageUrl, userProfileImageUrl } from "@/utils/functions";
import { Enrollment, Gig, GigManage, Page } from "@/utils/types";
import { defaultProfileImage } from "@/utils/variables";
import { useEffect, useMemo, useState } from "react";
import { useCollapse } from "react-collapsed";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from "react-router-dom";

type Props = {
	gig: GigManage;
};

const GigEnrollmentsList = ({ gig }: Props) => {
	const axiosPrivate = useAxiosPrivate();
	const [enrollments, setEnrollments] = useState<Page<Enrollment> | undefined>();
	const [currPage, setCurrPage] = useState<number>(0);

	const getGigEnrollments = async (page: number = 0) => {
		try {
			const res = await axiosPrivate.get(`/api/v1/enrollments/gig/${gig.id}`, {
				params: {
					page,
				},
			});

			setEnrollments(res.data);
		} catch (error) {
			console.error(error);
		}
	};

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

	const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
		defaultExpanded: true,
		collapsedHeight: 0,
	});

	useEffect(() => {
		getGigEnrollments(currPage);
	}, [currPage]);

	if (!enrollments) {
		return null;
	}

	return (
		<div className={`relative overflow-hidden rounded bg-light-secondary shadow transition-all dark:bg-dark-secondary`}>
			<div className="grid grid-cols-[20%_1fr_auto] items-center rounded-t">
				<div
					className="flex h-14 items-center justify-end bg-cover bg-center pr-2"
					style={{
						backgroundImage: `url(${coverImageUrl(gig.gigCoverImage)})`,
					}}
				></div>
				<Link
					to={`/gig/${gig.id}`}
					className="small-headings ml-4 w-fit rounded-sm px-3 py-2 text-base hover:underline"
				>
					{gig.title}
				</Link>
				<div className={`mr-4 w-fit rounded-sm bg-white p-1`} {...getToggleProps()}>
					<FaAngleDown
						className={`h-4 w-4 text-black focus:outline-none ${isExpanded ? "rotate-180" : ""} transition-all`}
					/>
				</div>
			</div>
			<div {...getCollapseProps()} className="">
				<div className="grid grid-cols-[1fr_repeat(5,auto)] gap-x-6 gap-y-0 text-sm max-sm:grid-cols-[3rem_1fr_repeat(6,auto)]">
					<div className="col-span-full mb-0.5 grid grid-cols-subgrid border-b border-zinc-300 py-2.5 font-bold">
						<div className="ml-10">Student</div>
						<div className="text-center">Sessions</div>
						<div className="text-center">Duration</div>
						<div className="text-center">Price</div>
						<div className="text-center">Deadline</div>
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
											className={`col-span-full grid grid-cols-subgrid items-center bg-opacity-60 p-1 py-1.5 pr-2 ${isPastDeadline ? "bg-red-500 dark:bg-red-900" : "bg-white dark:bg-transparent"}`}
											key={`enrollments-${enrollment.id}`}
										>
											<Link
												to={`/profile/${enrollment.buyer.id}`}
												className="flex items-center gap-x-3 px-2 hover:underline"
											>
												<img
													src={userProfileImageUrl(enrollment.buyer.id)}
													onError={({ currentTarget }) => {
														console.log("Error loading image");

														currentTarget.onerror = null;
														currentTarget.src = defaultProfileImage;
													}}
													style={{
														backgroundImage: `url(${defaultProfileImage})`,
													}}
													className={`aspect-square w-8 rounded-sm border-2 border-white bg-cover bg-center object-cover object-center dark:border-black`}
												/>
												{enrollment.buyer.fullName}
											</Link>
											<div className="text-center">
												{enrollment.numSessionsCompleted} / {enrollment.numSessions}
											</div>
											<div className="text-center">{enrollment.sessionDurationInMinutes} Mins</div>
											<div className="flex items-center">
												<TbCurrencyTaka className="h-4 w-4" /> {enrollment.price}
											</div>
											<div className={`text-center ${isCompleted ? "font-semibold text-green-500" : ""}`}>
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
								<div className="col-span-full flex w-full items-center gap-1 rounded bg-light-secondary px-3 py-2 font-semibold dark:bg-dark-secondary">
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
			</div>
		</div>
	);
};

export default GigEnrollmentsList;
