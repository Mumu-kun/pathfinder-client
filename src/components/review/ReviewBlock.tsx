import axios from "@/api/axios";
import { Page, Review } from "@/utils/types";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import Select from "react-select";
import ReviewCard from "./ReviewCard";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useMemo } from "react";

type Props = {
	rating: number;
	ratedByCount: number;
	reviews: Page<Review>;
	setReviews: React.Dispatch<React.SetStateAction<Page<Review> | undefined>>;
	baseUrl: string;
};

const ReviewBlock = ({ rating, ratedByCount, reviews, setReviews, baseUrl }: Props) => {
	const pages = useMemo(() => {
		const start = Math.max(0, reviews.number - 2);
		const end = Math.min(reviews.totalPages, reviews.number + 3);

		return Array.from({ length: end - start }, (_, i) => i + start);
	}, [reviews]);

	const pageNav = async (condition: boolean, pageNo: number) => {
		if (!condition) {
			return;
		}

		try {
			const response = await axios.get(`${baseUrl}?page=${pageNo}`);

			setReviews(response.data);
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1">
					<Rating
						value={rating}
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
					<p className="text-lg font-semibold text-green-600">{rating ?? 0}</p>
					<p className="text-sm text-gray-500">({ratedByCount})</p>
				</div>

				<Select
					defaultValue={{ value: "newest", label: "Newest" }}
					options={[
						{ value: "newest", label: "Newest" },
						{ value: "oldest", label: "Oldest" },
						{ value: "highest", label: "Highest Rating" },
						{ value: "lowest", label: "Lowest Rating" },
					]}
					onChange={async (e) => {
						if (!e) {
							return;
						}

						let requestUrl = baseUrl;
						if (e.value === "newest") {
							requestUrl += "?sort=createdAt&order=DESC";
						} else if (e.value === "oldest") {
							requestUrl += "?sort=createdAt&order=ASC";
						} else if (e.value === "highest") {
							requestUrl += "?sort=rating&order=DESC";
						} else if (e.value === "lowest") {
							requestUrl += "?sort=rating&order=ASC";
						}

						try {
							const response = await axios.get(requestUrl);

							// console.log(response.data);

							setReviews(response.data);
						} catch (error) {
							console.error(error);
						}
					}}
					className="w-[10rem]"
					classNames={{
						control: () => `!bg-white dark:!bg-dark-bg !border-green-500 !shadow-none`,
						option: ({ isFocused, isSelected }) =>
							`${isSelected ? "!bg-green-400" : isFocused ? "!bg-green-400" : "!bg-white dark:!bg-dark-bg"} active:!bg-green-500`,
						input: () => "dark:!text-dark-text",
						singleValue: () => "dark:!text-dark-text",
						menu: () => `!mt-1 !bg-white dark:!bg-dark-bg !z-10 !border-green-500 dark:!border`,
					}}
				/>
			</div>

			{reviews.content.map((review) => (
				<ReviewCard key={review.id} review={review} />
			))}

			<div className="flex w-full items-center gap-1 rounded bg-light-secondary px-3 py-2 font-semibold dark:bg-dark-secondary">
				<FaAngleDoubleLeft
					className="hover-effect-no-shadow cursor-pointer"
					size={20}
					onClick={() => pageNav(reviews.number > 0, 0)}
				/>
				<FaAngleLeft
					className="hover-effect-no-shadow mr-auto cursor-pointer"
					size={20}
					onClick={() => pageNav(reviews.number > 0, reviews.number - 1)}
				/>

				{pages.map((i) => (
					<p
						key={i}
						className={`hover-effect cursor-pointer rounded px-2 py-0.5 text-sm ${i === reviews.number ? "bg-green-400 text-white" : "bg-white"}`}
						onClick={async () => {
							if (i === reviews.number) {
								return;
							}

							try {
								const response = await axios.get(`${baseUrl}?page=${i}`);

								setReviews(response.data);
							} catch (error) {
								console.error(error);
							}
						}}
					>
						{i + 1}
					</p>
				))}

				<FaAngleRight
					className="hover-effect-no-shadow ml-auto cursor-pointer"
					size={20}
					onClick={() => pageNav(!reviews.last, reviews.number + 1)}
				/>
				<FaAngleDoubleRight
					className="hover-effect-no-shadow cursor-pointer"
					size={20}
					onClick={() => pageNav(reviews.last, reviews.totalPages - 1)}
				/>
			</div>
		</div>
	);
};

export default ReviewBlock;
