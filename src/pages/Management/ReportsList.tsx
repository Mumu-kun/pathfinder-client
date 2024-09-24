import Loading from "@/components/Loading";
import { Page, Report } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

type Props = {
	reports: Page<Report> | undefined;
	getReports: (page?: number) => void;
	resolveReport?: (reportId: number) => void;
};

const ReportsList = ({ reports, getReports, resolveReport }: Props) => {
	const isUnresolvedView = !!resolveReport;

	const [currPage, setCurrPage] = useState<number>(0);
	const pages = useMemo(() => {
		if (!reports) {
			return [0];
		}

		const start = Math.max(0, reports.number - 2);
		const end = Math.min(reports.totalPages, reports.number + 3);

		return Array.from({ length: end - start }, (_, i) => i + start);
	}, [reports]);

	const pageNav = (condition: boolean, pageNo: number) => {
		if (!condition) {
			return;
		}

		setCurrPage(pageNo);
	};

	useEffect(() => {
		getReports(currPage);
	}, [currPage]);

	return (
		<>
			<div className="grid grid-cols-[1fr_repeat(2,8rem)_1fr_repeat(2,auto)] gap-x-4 gap-y-1 pl-10 text-sm max-sm:grid-cols-[3rem_1fr_repeat(6,auto)]">
				<div className="col-span-full mb-1 grid grid-cols-subgrid border-b border-zinc-300 py-2 font-bold">
					<div className="ml-8">Gig</div>
					<div className="text-center">Mentor</div>
					<div className="text-center">Reporter</div>
					<div className="">Reason</div>
					<div className="text-center">{isUnresolvedView ? "Created" : "Resolved"} At</div>
					<div className="text-center">{isUnresolvedView ? "" : "Resolved By"}</div>
				</div>
				{reports ? (
					reports.content.length > 0 ? (
						<>
							{reports.content.map((report) => {
								return (
									<div
										className={`col-span-full grid grid-cols-subgrid rounded p-1.5 pr-2`}
										key={`reports-${report.id}`}
									>
										<Link to={`/gig/${report.enrollment.gig.id}`} className="hover:underline">
											{report.enrollment.gig.title}
										</Link>
										<Link to={`/profile/${report.reportedUser.id}`} className="text-center hover:underline">
											{report.reportedUser.fullName}
										</Link>
										<Link to={`/profile/${report.reporter.id}`} className="text-center hover:underline">
											{report.reporter.fullName}
										</Link>
										<div>{report.text}</div>
										<div className="text-center">
											{new Date(report.createdAt).toLocaleTimeString("en-GB", {
												year: "2-digit",
												month: "2-digit",
												day: "2-digit",
												hour: "2-digit",
												minute: "2-digit",
												hour12: true,
											})}
										</div>
										{isUnresolvedView ? (
											<button
												onClick={() => resolveReport(report.id)}
												className="solid-btn flex self-start break-words"
											>
												Mark Resolved
											</button>
										) : (
											<div className="text-center">{report.resolvedBy}</div>
										)}
									</div>
								);
							})}
						</>
					) : (
						<div className="col-span-full my-2 inline-block w-fit justify-self-center font-medium">
							No reports To Show
						</div>
					)
				) : (
					<div className="col-span-full aspect-video">
						<Loading />
					</div>
				)}
			</div>
			{reports && reports.totalPages > 1 && (
				<div className="col-span-full ml-10 mt-auto flex items-center gap-1 self-stretch rounded bg-light-secondary px-3 py-2 font-semibold dark:bg-dark-secondary">
					<FaAngleDoubleLeft
						className="hover-effect-no-shadow cursor-pointer"
						size={20}
						onClick={() => pageNav(reports.number > 0, 0)}
					/>
					<FaAngleLeft
						className="hover-effect-no-shadow mr-auto cursor-pointer"
						size={20}
						onClick={() => pageNav(reports.number > 0, reports.number - 1)}
					/>

					{pages.map((i) => (
						<p
							key={i}
							className={`hover-effect cursor-pointer select-none rounded px-2 py-0.5 text-sm ${i === reports.number ? "bg-green-400 text-white" : "bg-white text-black"}`}
							onClick={() => pageNav(i !== reports.number, i)}
						>
							{i + 1}
						</p>
					))}

					<FaAngleRight
						className="hover-effect-no-shadow ml-auto cursor-pointer"
						size={20}
						onClick={() => pageNav(!reports.last, reports.number + 1)}
					/>
					<FaAngleDoubleRight
						className="hover-effect-no-shadow cursor-pointer"
						size={20}
						onClick={() => pageNav(!reports.last, reports.totalPages - 1)}
					/>
				</div>
			)}
		</>
	);
};

export default ReportsList;
