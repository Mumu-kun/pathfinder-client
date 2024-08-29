import React, { useState, useEffect, useContext } from "react";
import { Enrollment, Session } from "@/utils/types";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";
import { Chart } from "react-google-charts";
import ThemeContext from "@/context/ThemeProvider";

const EnrollmentDetails = () => {
	const { enrollmentId } = useParams<{ enrollmentId: string }>();
	const axiosPrivate = useAxiosPrivate();
	const { auth } = useAuth();
	const userId = auth?.userId;

	const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
	const [sessions, setSessions] = useState<Session[]>([]);
	const [viewType, setViewType] = useState<"buyer" | "seller" | "">("");

	const getEnrollment = async () => {
		try {
			const response = await axiosPrivate.get(`api/v1/enrollments/get/${enrollmentId}`);
			console.log(response.data);
			setEnrollment(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getEnrollment();
	}, []);

	const getSessions = async () => {
		try {
			const response = await axiosPrivate.get(`api/v1/sessions/all/enrollment/${enrollmentId}`);
			console.log(response.data);
			setSessions(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (enrollment) {
			if (enrollment.buyer.id === userId) {
				setViewType("buyer");
			} else if (enrollment.gig.seller.id === userId) {
				setViewType("seller");
			}
			getSessions();
		}
	}, [enrollment]);

	const [reportText, setReportText] = useState<string>("");
	const [fileAReportClicked, setFileAReportClicked] = useState<boolean>(false);
	const [reportFiled, setReportFiled] = useState<boolean>(false);

	const reportSubmitted = async (e: React.FormEvent<HTMLFormElement>, report: string) => {
		e.preventDefault();

		try {
			axiosPrivate.post(
				`api/v1/reports/create`,
				{
					text: report,
					reportedUserId: viewType === "buyer" ? enrollment?.gig.seller.id : enrollment?.buyer.id,
					enrollmentId: enrollmentId,
				},
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
		} catch (error) {
			console.log(error);
		}
		setReportFiled(true);
	};

	const chartdata = [
		["Session", "Completed"],
		["Completed Sessions", 9],
		["Remaining Sessions", 2],
	];

	const { theme } = useContext(ThemeContext);

	const chartOptions = {
		title: "Session Progress",
		pieStartAngle: 100,
		titleTextStyle: {
			color: theme === "dark" ? "#ffffff" : "#000000",
		},
		slices: {
			0: { color: "#22C564" }, // Color for "Completed Sessions"
			1: { color: "#fec501", offset: 0.1 }, // Color for "Remaining Sessions"
		},
		pieSliceTextStyle: {
			color: "#000000", // Label text color on pie slices
		},
		legend: {
			textStyle: {
				color: theme === "dark" ? "#ffffff" : "#000000", // Label text color in the legend
			},
		},
		backgroundColor: theme === "dark" ? "#171717" : "#e0e0e0",
	};

	// TODO: adjustable view based on who's viewing - buyer/seller.

	return (
		<div>
			<button className="solid-cancel-btn" onClick={() => setFileAReportClicked(true)}>
				File a report
			</button>
			<div className="">
				<Chart chartType="PieChart" data={chartdata} options={chartOptions} width={"100%"} height={"400px"} />
			</div>
			{fileAReportClicked && (
				<div className="modal-grand-parent">
					<div className="modal-parent">
						{reportFiled && (
							<div className="flex flex-col items-center justify-center">
								<p className="normal-text">
									Your report has been filed. Please be patient while we look into this. We will contact you soon.
								</p>
								<button className="solid-btn my-2" onClick={() => setFileAReportClicked(false)}>
									Okay, I understand.
								</button>
							</div>
						)}
						{!reportFiled && (
							<div>
								<div className="flex items-center justify-between">
									<p className="small-headings">File a Report</p>
									<button onClick={() => setFileAReportClicked(false)} className="solid-btn">
										x
									</button>
								</div>
								<form onSubmit={(e) => reportSubmitted(e, reportText)} className="flex flex-col items-center">
									<textarea
										required
										value={reportText}
										onChange={(e) => setReportText(e.target.value)}
										placeholder="Describe your issue..."
										className="m-2 h-32 w-full rounded-lg border-2 border-gray-300 p-2"
									></textarea>
									<button type="submit" className="solid-cancel-btn">
										Submit
									</button>
								</form>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default EnrollmentDetails;
