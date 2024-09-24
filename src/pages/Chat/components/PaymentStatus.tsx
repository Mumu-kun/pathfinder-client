import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Transaction } from "@/utils/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/ErrorPage";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

interface PaymentStatusProps {
	status: String;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ status }) => {
	const [searchParams] = useSearchParams();
	const transactionId = searchParams.get("transactionId");
	const [loading, setLoading] = useState<boolean>(false);

	const axiosPrivate = useAxiosPrivate();

	const [transaction, setTransaction] = useState<Transaction | null>(null);

	useEffect(() => {
		const makeSureValidTransaction = async () => {
			if (!transactionId) {
				return;
			}

			try {
				setLoading(true);
				const response = await axiosPrivate.get(`api/v1/transactions/find/${transactionId}`);
				console.log(response.data);
				setTransaction(response.data);

				const transaction: Transaction = response.data;

				if (transaction.paymentConfirmed) {
					const recommId = window.localStorage.getItem(`gig-recommId-${transaction.enrollment.gig.id}`);

					if (recommId) {
						await axiosPrivate.post(
							`api/v1/recommendations/add-purchase-view/${transaction.enrollment.gig.id}/${transaction.enrollment.buyer.id}?recommId=${recommId}`
						);
					}
				}

				setLoading(false);
			} catch (error) {
				console.error(error);
				setLoading(false);
			}
		};

		makeSureValidTransaction();
	}, [transactionId]);

	const { width, height } = useWindowSize();
	return (
		<div>
			{loading ? (
				<Loading fullscreen />
			) : (
				<div>
					{transaction ? (
						<div className="">
							{status === "success" && transaction.paymentConfirmed && (
								<div className="m-10 rounded-md bg-light-secondary p-5 pb-8 text-left dark:bg-dark-secondary">
									<Confetti width={width} height={height} />
									<p className="medium-headings mb-4 text-left">Payment Successful</p>
									<div className="mb-4 grid grid-cols-[auto_auto_1fr] gap-x-2">
										<p>Transaction Id</p>
										<p>:</p>
										<span className="font-semibold">{transaction.tranxId}</span>
										<p>Amount</p>
										<p>:</p>
										<span className="font-semibold">{transaction.amount} BDT </span>
										<p>Gig</p>
										<p>:</p>
										<span className="font-semibold">{transaction.enrollment.gig.title}</span>
									</div>
									<p className="small-headings mb-2">Good luck learning!</p>
									<Link
										className="solid-btn"
										to={{ pathname: `/interaction/user/${transaction.enrollment.gig.seller.id}` }}
									>
										Visit Enrollment
									</Link>
								</div>
							)}
							{status == "success" && !transaction.paymentConfirmed && (
								<div className="mt-20">
									<ErrorPage
										errorCode={404}
										errorMessage="Invalid Transaction Id and/or payment status. You weren't supposed to edit this url.. nerd!"
									/>
								</div>
							)}

							{status === "fail" && !transaction.paymentConfirmed && (
								<div>
									<div className="m-10 rounded-md bg-light-secondary p-5 pb-8 text-left dark:bg-dark-secondary">
										{/* TODO: Add confetti */}
										<p className="text-4xl font-semibold">Payment Failed.</p>
										<p className="text-xl font-semibold">
											If you have any issues, please contact us with the following transaction id: {transaction.id},
											which was created on your attempt to make the payment.
										</p>

										<p className="text-xl font-semibold">Gig: {transaction.enrollment.gig.title}</p>

										<Link
											className="solid-btn m-2"
											to={{ pathname: `/interaction/user/${transaction.enrollment.gig.seller.id}` }}
										>
											Visit Enrollment
										</Link>
									</div>
								</div>
							)}

							{status == "fail" && transaction.paymentConfirmed && (
								<div className="mt-20">
									<ErrorPage
										errorCode={404}
										errorMessage="Invalid Transaction Id and/or payment status. You weren't supposed to edit this url.. nerd!"
									/>
								</div>
							)}

							{status == "cancel" && !transaction.paymentConfirmed && (
								<div>
									<div>
										<div className="m-10 rounded-md bg-light-secondary p-5 pb-8 text-left dark:bg-dark-secondary">
											{/* TODO: Add confetti */}
											<p className="text-4xl font-semibold">Payment cancelled.</p>
											<p className="text-xl font-semibold">
												If you have any issues, please contact us with the following transaction id: {transaction.id},
												which was created on your attempt to make the payment.
											</p>

											<p className="text-xl font-semibold">Gig: {transaction.enrollment.gig.title}</p>

											<Link
												className="solid-btn m-2"
												to={{ pathname: `/interaction/user/${transaction.enrollment.gig.seller.id}` }}
											>
												Visit Enrollment
											</Link>
										</div>
									</div>
								</div>
							)}
							{status == "cancel" && transaction.paymentConfirmed && (
								<div className="mt-20">
									<ErrorPage
										errorCode={404}
										errorMessage="Invalid Transaction Id and/or payment status. You weren't supposed to edit this url.. nerd!"
									/>
								</div>
							)}
						</div>
					) : (
						<div className="mt-20">
							<ErrorPage
								errorCode={404}
								errorMessage="Invalid Transaction Id. You weren't supposed to edit this url.. nerd!"
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default PaymentStatus;
