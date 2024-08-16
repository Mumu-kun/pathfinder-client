import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Transaction } from "@/utils/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/ErrorPage";

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
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		};

		makeSureValidTransaction();
	}, [transactionId]);
	return (
		<div>
			{loading ? (
				<Loading fullscreen />
			) : (
				<div>
					{transaction ? (
						<div>
							{status === "success" && transaction.paymentConfirmed && (
								<div className="m-10 text-left">
									{/* TODO: Add confetti */}
									<p className="text-4xl font-semibold p-1 pb-10">Payment Successful</p>
									<p className="text-xl font-semibold p-1">Transaction Id: {transaction.tranxId}</p>
									<p className="text-xl font-semibold p-1">Amount: {transaction.amount}</p>
									<p className="text-xl font-semibold p-1 pb-10">Gig: {transaction.enrollment.gig.title}</p>

									<p className="text-3xl font-bold p-2">Good luck learning!</p>
									<Link
										className="solid-btn"
										to={{ pathname: `/interaction/user/${transaction.enrollment.gig.seller.id}` }}
									>
										Visit Enrollment
									</Link>
								</div>
							)}
							{status === "failed" && !transaction.paymentConfirmed && (
								<div>
									<div className="m-10 text-left">
										{/* TODO: Add confetti */}
										<p className="text-4xl font-semibold">Payment Failed.</p>
										<p className="text-xl font-semibold">
											If you have any issues, please contact us with the following transaction id: {transaction.id},
											which was created on your attempt to make the payment.
										</p>

										<p className="text-xl font-semibold">Gig: {transaction.enrollment.gig.title}</p>

										<Link
											className="solid-btn"
											to={{ pathname: `/interaction/user/${transaction.enrollment.gig.seller.id}` }}
										>
											Visit Enrollment
										</Link>
									</div>
								</div>
							)}
							{status == "cancel" && !transaction.paymentConfirmed && (
								<div>
									<div>
										<div className="m-10 text-left">
											{/* TODO: Add confetti */}
											<p className="text-4xl font-semibold">Payment cancelled.</p>
											<p className="text-xl font-semibold">
												If you have any issues, please contact us with the following transaction id: {transaction.id},
												which was created on your attempt to make the payment.
											</p>

											<p className="text-xl font-semibold">Gig: {transaction.enrollment.gig.title}</p>

											<Link
												className="solid-btn"
												to={{ pathname: `/interaction/user/${transaction.enrollment.gig.seller.id}` }}
											>
												Visit Enrollment
											</Link>
										</div>
									</div>
								</div>
							)}
						</div>
					) : (
						<div className="mt-20">
							<ErrorPage
								errorCode={404}
								errorMessage="Invalid Transaction Id. You weren't supposed to manually visit this url lol."
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default PaymentStatus;
