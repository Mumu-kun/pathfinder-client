import { TextAreaInputComponent, TextInputComponent } from "@/components/FormComponents";
import Loading from "@/components/Loading";
import ThemeContext from "@/context/ThemeProvider";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { coverImageUrl } from "@/utils/functions";
import { Enrollment, Review, Session } from "@/utils/types";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import { isAxiosError } from "axios";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Chart } from "react-google-charts";
import { IoChatboxEllipsesSharp, IoClose } from "react-icons/io5";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
	title: Yup.string().required("Title is required"),
	text: Yup.string().required("Review is required"),
	rating: Yup.number().min(0).max(5).required("Rating is required"),
});

const EnrollmentDetails = () => {
	const { enrollmentId } = useParams<{ enrollmentId: string }>();
	const axiosPrivate = useAxiosPrivate();
	const { auth } = useAuth();
	const userId = auth?.userId;

	const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
	const [sessions, setSessions] = useState<Session[]>([]);
	const [review, setReview] = useState<Review | null | undefined>();

	const [tempRating, setTempRating] = useState<number | undefined>();

	const viewType: "buyer" | "seller" | undefined = useMemo(() => {
		if (enrollment) {
			// console.log(enrollment.buyer.id, enrollment.gig.seller.id, userId);

			if (enrollment.buyer.id === userId) {
				return "buyer";
			} else if (enrollment.gig.seller.id === userId) {
				return "seller";
			}
		}
	}, [enrollment]);

	const getEnrollment = async () => {
		try {
			const response = await axiosPrivate.get(`api/v1/enrollments/get/${enrollmentId}`);
			// console.log(response.data);
			setEnrollment(response.data);

			getReview(response.data.gig.id);
		} catch (error) {
			console.error(error);
		}
	};

	const getSessions = async () => {
		try {
			const response = await axiosPrivate.get(`api/v1/sessions/all/enrollment/${enrollmentId}`);
			// console.log(response.data);
			setSessions(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const getReview = async (gigId: number) => {
		try {
			const response = await axiosPrivate.get(`api/v1/gigs/${gigId}/reviews`);
			// console.log(response.data);
			setReview(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getEnrollment();
		getSessions();
	}, []);

	const [reportText, setReportText] = useState<string>("");
	const [fileAReportClicked, setFileAReportClicked] = useState<boolean>(false);
	const [reportFiled, setReportFiled] = useState<boolean>(false);

	const [reviewDeleteClicked, setReviewDeleteClicked] = useState<boolean>(false);

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
			console.error(error);
		}
		setReportFiled(true);
	};

	const chartdata = [
		["Session", "Completed"],
		["Completed Sessions", enrollment?.numSessionsCompleted ?? 0],
		["Remaining Sessions", enrollment ? enrollment.numSessions - enrollment.numSessionsCompleted : 0],
	];

	const { theme } = useContext(ThemeContext);

	const chartOptions = {
		title: "Session Progress",
		pieStartAngle: 0,
		titleTextStyle: {
			color: theme === "dark" ? "#ffffff" : "#000000",
		},
		slices: {
			0: { color: "#4ade80" }, // Color for "Completed Sessions"
			1: { color: "#fff", offset: 0.1 }, // Color for "Remaining Sessions"
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

	if (!enrollment) {
		return <Loading />;
	}

	return (
		<>
			<div className="medium-headings mb-4 mt-8 rounded-sm pb-4 pl-6 text-left text-green-500">Enrollment Details</div>
			<div className="grid grid-cols-[minmax(40%,auto)_1fr] items-center overflow-hidden rounded-sm bg-light-secondary">
				<Link
					to={`/gig/${enrollment.gig.id}`}
					className="small-headings mx-auto w-fit rounded-sm px-3 py-2 hover:underline"
				>
					{enrollment.gig.title}
				</Link>
				<div
					className="flex h-14 items-center justify-end bg-cover bg-center pr-2"
					style={{
						backgroundImage: `url(${coverImageUrl(enrollment.gig.gigCoverImage)})`,
					}}
				></div>
			</div>
			<div className="mt-4 flex gap-y-4 pl-4 max-md:flex-col">
				<div className="mr-auto mt-4 grid h-fit flex-1 grid-cols-[auto_auto_1fr] gap-x-4 gap-y-2">
					<div className="col-span-full grid grid-cols-subgrid items-center">
						<p className="font-semibold">{viewType === "seller" ? "Student" : "Mentor"} </p>
						<p>:</p>
						<div className="flex items-center gap-4">
							<Link
								to={`/profile/${viewType === "seller" ? enrollment.buyer.id : enrollment.gig.seller.id}`}
								className="hover:underline"
							>
								{viewType === "seller" ? enrollment.buyer.fullName : enrollment.gig.seller.fullName}
							</Link>
							<Link
								to={`/interaction/user/${viewType === "seller" ? enrollment.buyer.id : enrollment.gig.seller.id}`}
								className="solid-btn flex w-fit items-center gap-0.5 px-1.5 py-0.5"
							>
								<IoChatboxEllipsesSharp className="mt-0.5" />
								<div className="mr-0.5">Chat</div>
							</Link>
						</div>
					</div>
					<div className="col-span-full grid grid-cols-subgrid">
						<p className="font-semibold">Price</p>
						<p>:</p>
						<div className="flex items-center">
							<TbCurrencyTaka className="h-4 w-4" /> {enrollment.price}{" "}
							{!enrollment.paid && <p className="font-medium text-red-500">(Yet to pay)</p>}
						</div>
					</div>
					<div className="col-span-full grid grid-cols-subgrid">
						<p className="font-semibold">Sessions </p>
						<p>:</p>
						<p className="">
							{enrollment.numSessionsCompleted} / {enrollment.numSessions}
						</p>
					</div>
					<div className="col-span-full grid grid-cols-subgrid">
						<p className="font-semibold">Duration </p>
						<p>:</p>
						<p className="">{enrollment.sessionDurationInMinutes} minutes</p>
					</div>

					<div className="col-span-full grid grid-cols-subgrid">
						<p className="font-semibold">Started </p>
						<p>:</p>
						<p className="">
							{new Date(enrollment.startedAt).toLocaleDateString(undefined, {
								year: "numeric",
								month: "short",
								day: "numeric",
								hour: "numeric",
								minute: "numeric",
								hour12: true,
							})}
						</p>
					</div>
					<div className="col-span-full grid grid-cols-subgrid">
						<p className="font-semibold">{enrollment.completedAt ? "Completed" : "Deadline"} </p>
						<p>:</p>
						<p className="">
							{new Date(enrollment.completedAt ? enrollment.completedAt : enrollment.deadline).toLocaleDateString(
								undefined,
								{
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "numeric",
									minute: "numeric",
									hour12: true,
								}
							)}
						</p>
					</div>
				</div>
				{enrollment && (
					<div className="flex-shrink [&>div]:overflow-hidden [&>div]:rounded">
						<Chart chartType="PieChart" width={"100%"} data={chartdata} options={chartOptions} />
					</div>
				)}
			</div>
			<div className="mb-8">
				<div className="small-headings mb-2 mt-4 pl-4">Sessions List</div>
				<div className="grid grid-cols-[auto_auto_repeat(3,1fr)] gap-x-2 gap-y-2">
					<div className="col-span-full mb-1 grid grid-cols-subgrid border-b border-zinc-300 py-2 font-bold">
						<div className="px-4 text-center">#</div>
						<div className="px-4 text-center">Type</div>
						<div className="px-4 text-center">Date</div>
						<div className="px-4 text-center">Time</div>
						<div className="px-4 text-center">Status</div>
					</div>
					{sessions.length > 0 ? (
						sessions.map((session, idx) => {
							const isRunning = new Date(session.scheduledAt) >= new Date();
							return (
								<div key={session.id} className={`col-span-full grid grid-cols-subgrid text-center`}>
									<p>{idx + 1}</p>
									<p className="capitalize">{session.sessionType}</p>
									<p>
										{new Date(session.scheduledAt).toLocaleDateString(undefined, {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</p>
									<p>
										{new Date(session.scheduledAt).toLocaleTimeString(undefined, {
											hour: "numeric",
											minute: "numeric",
											hour12: true,
										})}
									</p>
									<p
										className={`font-medium ${
											session.completed
												? "text-green-500"
												: session.cancelled
													? "text-red-500"
													: isRunning
														? "text-blue-500"
														: session.buyerConfirmed
															? "font-normal"
															: "text-amber-500"
										}`}
									>
										{session.completed
											? "Completed"
											: session.cancelled
												? "Cancelled"
												: isRunning
													? "Running"
													: session.buyerConfirmed
														? "Upcoming"
														: "Pending Confirmation"}
									</p>
								</div>
							);
						})
					) : (
						<div className="col-span-full text-center">No sessions yet</div>
					)}
				</div>
			</div>
			{review !== undefined && viewType === "buyer" && enrollment.completedAt && (
				<div className="mb-8 pl-4">
					<div className="small-headings mb-2 mt-4">{review ? "Edit Your Review" : "Write a Review"}</div>
					<Formik
						initialValues={{ title: review?.title, text: review?.text, rating: review?.rating ?? 0 }}
						validationSchema={validationSchema}
						onSubmit={async (values) => {
							console.log(values);

							try {
								review
									? await axiosPrivate.put(`/api/v1/gigs/${enrollment.gig.id}/reviews/${review.id}`, values)
									: await axiosPrivate.post(`/api/v1/gigs/${enrollment.gig.id}/reviews`, values);

								toast.success(`Review ${review ? "Updated" : "Created"} Successfully`);

								getReview(enrollment.gig.id);
							} catch (error) {
								console.error(error);
								if (isAxiosError(error)) {
									toast.error(error.response?.data.message);
								}
							}
						}}
						key={review?.id}
					>
						{({ isSubmitting }) => {
							return (
								<Form className="my-4 grid grid-cols-[max-content_minmax(auto,32rem)] place-items-start gap-x-8 gap-y-2">
									<Field
										isGrid
										isFullWidth
										name="title"
										placeholder="Title"
										label="Title"
										component={TextInputComponent}
									/>
									<Field
										isGrid
										isFullWidth
										name="text"
										placeholder="Write your review here..."
										label="Review"
										className="min-h-[10rem]"
										component={TextAreaInputComponent}
									/>
									<Field name="rating">
										{({ field }: FieldProps<any>) => {
											return (
												<>
													<label htmlFor="rating" className={`flex items-center gap-1 self-center font-semibold`}>
														<span>Rating</span>
														<span>:</span>
													</label>
													<div className="flex w-full items-center gap-x-2">
														<Rating
															value={tempRating ? tempRating : field.value}
															className="max-w-32"
															// readOnly
															onChange={(value: any) => {
																field.onChange({ target: { value, name: field.name } });
															}}
															resetLabel="Reset"
															itemStyles={{
																itemShapes: ThinRoundedStar,
																activeFillColor: "#4ade80",
																inactiveFillColor: "white",
																activeStrokeColor: "#157010",
																itemStrokeWidth: 2,
															}}
														/>
														<div className="mr-auto text-lg">({field.value})</div>
														{review && (
															<button
																onClick={(e) => {
																	e.preventDefault();
																	setReviewDeleteClicked(true);
																}}
																className="solid-cancel-btn ml-auto"
																disabled={isSubmitting}
															>
																Delete
															</button>
														)}
														<button type="submit" className="solid-btn" disabled={isSubmitting}>
															{review ? "Update" : "Submit"}
														</button>
													</div>
													<ErrorMessage name="rating">
														{(msg) =>
															typeof msg === "string" && (
																<>
																	<div></div>
																	<div className="text-sm font-medium text-red-500">{msg}</div>
																</>
															)
														}
													</ErrorMessage>
												</>
											);
										}}
									</Field>
								</Form>
							);
						}}
					</Formik>
				</div>
			)}
			<button className="solid-cancel-btn w-fit" onClick={() => setFileAReportClicked(true)}>
				File a report
			</button>
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
			{reviewDeleteClicked && (
				<div className="modal-grand-parent">
					<div className="modal-parent relative">
						<IoClose
							onClick={() => setReviewDeleteClicked(false)}
							className="solid-cancel-btn absolute right-2 top-2 h-5 w-5 !p-0.5"
						/>
						<p className="small-headings mb-4 text-center">Are you sure you want to delete this review?</p>
						<div className="flex items-center justify-center gap-4">
							<button
								onClick={async () => {
									try {
										await axiosPrivate.delete(`/api/v1/gigs/${enrollment.gig.id}/reviews/${review?.id}`);

										setReviewDeleteClicked(false);
										setReview(null);

										toast.success("Review Deleted Successfully");
									} catch (error) {
										console.error(error);
										if (isAxiosError(error)) {
											toast.error(error.response?.data.message);
										}
									}
								}}
								className="solid-cancel-btn"
							>
								Delete
							</button>
							<button onClick={() => setReviewDeleteClicked(false)} className="solid-btn">
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default EnrollmentDetails;
