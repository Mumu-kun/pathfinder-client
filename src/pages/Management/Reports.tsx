import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Page, Report } from "@/utils/types";
import { isAxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import ManagementNavbar from "./ManagementNavbar";
import ReportsList from "./ReportsList";

const Reports = () => {
	const axiosPrivate = useAxiosPrivate();

	const [unresolvedReports, setUnresolvedReports] = useState<Page<Report> | undefined>();
	const [resolvedReports, setResolvedReports] = useState<Page<Report> | undefined>();

	const [resolvedViewOn, setResolvedViewOn] = useState<boolean>(false);

	const getUnresolvedReports = async (page: number = 0) => {
		try {
			const response = await axiosPrivate.get("api/v1/reports/unresolved/all", {
				params: {
					page,
				},
			});
			console.log(response.data);
			setUnresolvedReports(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	const getResolvedReports = async (page: number = 0) => {
		try {
			const response = await axiosPrivate.get("api/v1/reports/resolved/all", {
				params: {
					page,
				},
			});
			console.log(response.data);
			setResolvedReports(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	// useEffect(() => {
	// 	!resolvedViewOn && getUnresolvedReports();
	// 	resolvedViewOn && getResolvedReports();
	// }, [resolvedViewOn]);

	const resolveReport = async (reportId: number) => {
		try {
			await axiosPrivate.post(`api/v1/reports/resolve/${reportId}`);
			setUnresolvedReports((prev) => {
				if (!prev) {
					return prev;
				}
				const reports = prev.content.filter((report) => report.id !== reportId);
				return { ...prev, content: reports };
			});
			toast.success("Report resolved successfully");
		} catch (error) {
			console.log(error);
			if (isAxiosError(error)) {
				toast.error(error.response?.data.message);
			}
		}
	};

	return (
		<>
			<ManagementNavbar />
			<div className="flex items-center gap-2">
				<div className="medium-headings mb-4 mr-4 mt-8 rounded-sm pb-4 pl-16 text-left text-green-500">
					Manage Reports
				</div>
				<button
					onClick={() => setResolvedViewOn(false)}
					className={!resolvedViewOn ? `solid-btn-sm w-[100px]` : `outline-btn w-[100px]`}
				>
					Unresolved
				</button>
				<button
					onClick={() => setResolvedViewOn(true)}
					className={!resolvedViewOn ? `outline-btn w-[100px]` : `solid-btn-sm w-[100px]`}
				>
					Resolved
				</button>
			</div>
			{resolvedViewOn ? (
				<ReportsList key={"resolved"} reports={resolvedReports} getReports={getResolvedReports} />
			) : (
				<ReportsList
					key={"unresolved"}
					reports={unresolvedReports}
					getReports={getUnresolvedReports}
					resolveReport={resolveReport}
				/>
			)}

			<div></div>
		</>
	);
};

export default Reports;
