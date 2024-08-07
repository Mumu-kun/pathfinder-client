import { limitTextLength } from "@/utils/functions";
import { Review } from "@/utils/types";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import React, { useState } from "react";
import { Link } from "react-router-dom";

type ReviewProps = {
	review: Review;
};

const ReviewCard = ({ review }: ReviewProps) => {
	const { gig, reviewer: user } = review;
	const [reviewExpanded, setReviewExpanded] = useState<boolean>(false);

	return (
		<div className="w-full rounded-sm bg-light-secondary p-2 shadow dark:bg-dark-secondary">
			<div className="grid w-full grid-cols-[max-content_max-content_minmax(max-content,1fr)] items-center gap-3 gap-y-1 rounded-sm max-sm:grid-cols-[max-content_minmax(0,1fr)]">
				<div className="h-20 w-20" title={`${user.firstName} ${user.lastName}`}>
					<img
						src={user.profileImage}
						className="h-full w-full rounded-sm border-4 border-white object-cover object-center shadow dark:border-black"
						alt={`${user.firstName} ${user.lastName}`}
					/>
				</div>
				<div className="flex flex-col justify-center self-stretch">
					<Link to={`/profile/${user.id}`} className="mb-0.5 text-lg font-semibold hover:underline">
						{user.firstName} {user.lastName}
					</Link>
					<div className="ml-0.5 text-sm font-medium">
						Rated it <span className="font-bold text-green-700">{review.rating}</span>
					</div>
					<Rating
						value={review.rating}
						className="max-w-24"
						readOnly
						itemStyles={{
							itemShapes: ThinRoundedStar,
							activeFillColor: "#4ade80",
							inactiveFillColor: "white",
							activeStrokeColor: "#157010",
							itemStrokeWidth: 2,
						}}
					/>
				</div>
				{!!gig && (
					<Link
						to={"#"}
						className="flex h-full w-full max-w-[20rem] cursor-pointer items-start justify-end rounded-sm bg-cover bg-center p-0.5 text-sm max-md:text-xs max-sm:col-span-full max-sm:w-fit max-sm:justify-start max-sm:!bg-none sm:ml-auto"
						style={{
							backgroundImage: `url(${gig.coverImage})`,
						}}
					>
						<div className="rounded-sm bg-light-bg bg-opacity-95 px-1 py-0.5 text-right font-medium dark:bg-dark-bg">
							for {gig.title}
						</div>
					</Link>
				)}
			</div>
			<div className="mt-2 overflow-hidden rounded-sm bg-light-bg p-2 dark:bg-dark-bg">
				{review.text.length > 500 ? (
					!reviewExpanded ? (
						<>
							{limitTextLength(review.text, 500)}
							{"... "}
							<span
								className="cursor-pointer font-semibold text-green-600 hover:underline"
								onClick={setReviewExpanded.bind(null, true)}
							>
								See More
							</span>
						</>
					) : (
						<>
							{review.text}{" "}
							<span
								className="cursor-pointer font-semibold text-green-600 hover:underline"
								onClick={setReviewExpanded.bind(null, false)}
							>
								See Less
							</span>
						</>
					)
				) : (
					review.text
				)}
			</div>
		</div>
	);
};

export default ReviewCard;
