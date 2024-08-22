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
				setLoading(false);
			} catch (error) {
				console.log(error);
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
									<p className="p-1 pb-10 text-4xl font-semibold">Payment Successful</p>
									<p className="p-1 text-xl">
										Transaction Id: <span className="font-semibold">{transaction.tranxId}</span>
									</p>
									<p className="p-1 text-xl">
										Amount: <span className="font-semibold">{transaction.amount} BDT </span>
									</p>
									<p className="p-1 pb-10 text-xl">
										Gig: <span className="font-semibold">{transaction.enrollment.gig.title}</span>
									</p>

									<p className="p-2 text-3xl font-bold">Good luck learning!</p>
									<Link
										className="solid-btn m-2"
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
