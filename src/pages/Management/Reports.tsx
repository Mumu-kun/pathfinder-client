import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Report } from "@/utils/types";
import ManagementNavbar from "./ManagementNavbar";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const Reports = () => {
	const axiosPrivate = useAxiosPrivate();

	const [unresolvedReports, setUnresolvedReports] = useState<Report[]>([]);
	const [resolvedReports, setResolvedReports] = useState<Report[]>([]);

	const [resolvedViewOn, setResolvedViewOn] = useState<boolean>(false);
	useEffect(() => {
		const getUnresolvedReports = async () => {
			try {
				const response = await axiosPrivate.get("api/v1/reports/unresolved/all");
				console.log(response.data);
				setUnresolvedReports(response.data.content);
			} catch (error) {
				console.log(error);
			}
		};

		const getResolvedReports = async () => {
			try {
				const response = await axiosPrivate.get("api/v1/reports/resolved/all");
				console.log(response.data);
				setResolvedReports(response.data.content);
			} catch (error) {
				console.log(error);
			}
		};

		getUnresolvedReports();
		getResolvedReports();
	}, [resolvedViewOn]);

	const resolveReport = async (reportId: number) => {
		try {
			await axiosPrivate.post(`api/v1/reports/resolve/${reportId}`);
			setUnresolvedReports(unresolvedReports.filter((report) => report.id !== reportId));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<ManagementNavbar />
			<div className="flex items-center justify-center">
				<button
					onClick={() => setResolvedViewOn(false)}
					className={resolvedViewOn ? `solid-btn-sm w-[100px]` : `outline-btn w-[100px]`}
				>
					Unresolved
				</button>
				<button
					onClick={() => setResolvedViewOn(true)}
					className={resolvedViewOn ? `outline-btn w-[100px]` : `solid-btn-sm w-[100px]`}
				>
					Resolved
				</button>
			</div>
			{resolvedViewOn ? (
				<div>
					{resolvedReports.length === 0 && <p className="small-headings">No resolved reports</p>}
					{resolvedReports.length > 0 && (
						<div>
							<p className="small-headings">resolved Reports</p>
							{resolvedReports.map((report) => {
								return (
									<div key={report.id} className="my-2 rounded-md bg-light-secondary p-2 dark:bg-dark-secondary">
										<p className="normal-text">
											<span className="font-bold">{report.reporter.fullName}</span> reported{" "}
											<span className="font-bold">{report.reportedUser.fullName}.</span>
										</p>
										<p className="normal-text">
											<span className="font-bold">Reason: </span> {report.text}
										</p>
										{/* <button className="solid-btn-sm" onClick={() => resolveReport(report.id)}>
										Mark unresolved
									</button> */}
									</div>
								);
							})}
						</div>
					)}
				</div>
			) : (
				<div>
					{unresolvedReports.length === 0 && <p className="small-headings">No unresolved reports</p>}
					{unresolvedReports.length > 0 && (
						<div>
							<p className="small-headings">Unresolved Reports</p>
							{unresolvedReports.map((report) => {
								return (
									<div
										key={report.id}
										className="my-2 flex items-center justify-between rounded-md bg-light-secondary p-2 dark:bg-dark-secondary"
									>
										<div>
											<p className="normal-text">
												<span className="font-bold">{report.reporter.fullName}</span> reported{" "}
												<span className="font-bold">{report.reportedUser.fullName}.</span>
											</p>
											<p className="normal-text">
												<span className="font-bold">Reason: </span> {report.text}
											</p>
										</div>

										<button className="solid-btn-sm" onClick={() => resolveReport(report.id)}>
											Mark as resolved
										</button>
									</div>
								);
							})}
						</div>
					)}
				</div>
			)}

			<div></div>
		</div>
	);
};

export default Reports;
