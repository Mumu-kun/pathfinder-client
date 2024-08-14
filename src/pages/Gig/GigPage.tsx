import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Gig, Review } from "../../utils/types";
import axios from "../../api/axios";
import Loading from "@/components/Loading";
import { UnlimitLayoutWidth } from "@/components/LimitLayoutWidth";
import { fullImageUrl, userProfileImageUrl } from "@/utils/functions";
import { defaultCoverImage, defaultProfileImage } from "@/utils/variables";
import ZoomableImg from "@/components/misc/ZoomableImg";
import { RxSlash } from "react-icons/rx";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { IoChatboxEllipsesOutline, IoChatboxEllipsesSharp } from "react-icons/io5";
import Tag from "@/components/Tag";
import FAQQuestion from "./FAQQuestion";
import ReviewCard from "@/components/ReviewCard";
import { useMediaQuery } from "usehooks-ts";
import { boolean } from "yup";
import Carousel from "@/components/Carousel";
import useAuth from "@/hooks/useAuth";

const GigPage: React.FC = () => {
	const { id } = useParams();
	const { auth } = useAuth();

	const isMD = useMediaQuery("(max-width: 768px)");

	const [gig, setGig] = useState<Gig | undefined>();

	const getGig = async () => {
		try {
			const res = await axios.get(`/api/v1/public/gigs/${id}`);
			setGig(res.data);
			console.log(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	const [reviews, setReviews] = useState<Review[] | undefined>([
		{
			id: 1,
			title: "This was life changing",
			text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt eligendi sapiente ratione consectetur, sed architecto earum magni alias repudiandae dolores quo, vero minima accusantium beatae esse doloremque? Rem, vero dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt eligendi sapiente ratione consectetur, sed architecto earum magni alias repudiandae dolores quo, vero minima accusantium beatae esse doloremque? Rem, vero dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt eligendi sapiente ratione consectetur, sed architecto earum magni alias repudiandae dolores quo, vero minima accusantium beatae esse doloremque? Rem, vero dolores.",
			rating: 4.5,
			createdAt: new Date(),
			reviewer: {
				id: 1,
				firstName: "Mustafa",
				lastName: "Muhaimin",
			},
			gig: {
				id: 1,
				title: "Intro to Python Programming",
				coverImage: null,
			},
		},
	]);
	const getGigReviews = async () => {
		try {
			const res = await axios.get(`/api/v1/public/gigs/${id}/reviews`);
			setReviews(res.data);
			console.log(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getSimilarGigs = async () => {
		// TODO
	};

	useEffect(() => {
		getGig();
		getGigReviews();
	}, [id]);

	// TODO: handle loading.
	if (!gig) {
		return <Loading />;
	}

	const seller = gig.seller;
	const isSeller = seller.id === auth?.userId;

	return (
		<>
			<UnlimitLayoutWidth>
				<div className="flex aspect-[6/1] w-full items-center overflow-hidden">
					<ZoomableImg
						src={gig.gigCoverImage ? fullImageUrl(gig.gigCoverImage) : defaultCoverImage}
						alt={gig.title}
						className="w-full overflow-hidden object-cover"
					/>
				</div>
			</UnlimitLayoutWidth>

			<div className="-mt-[2vw] mb-4 w-fit rounded bg-light-secondary px-4 py-2 shadow dark:bg-dark-secondary">
				<div className="medium-headings pr-8 pt-2">{gig.title}</div>
				<Link to={"#"} className="font-medium hover:underline">
					{gig.category}
				</Link>
			</div>
			<div className="grid grid-cols-[auto_max-content] gap-4">
				<div className="space-y-4">
					<div className="grid w-fit grid-cols-2 items-center gap-2 rounded bg-light-secondary p-2 shadow dark:bg-dark-secondary">
						<div className="flex h-20 gap-2" title={`${seller.firstName} ${seller.lastName}`}>
							<img
								src={userProfileImageUrl(seller.id)}
								onError={({ currentTarget }) => {
									currentTarget.onerror = null;
									currentTarget.src = defaultProfileImage;
								}}
								className="aspect-square h-full rounded-sm border-4 border-white object-cover object-center shadow dark:border-black"
								alt={`${seller.firstName} ${seller.lastName}`}
							/>
							<div className="flex flex-col justify-center gap-1 self-stretch">
								<Link to={`/profile/${seller.id}`} className="text-xl font-semibold hover:underline">
									{seller.firstName} {seller.lastName}
								</Link>
								<Link
									to={isSeller ? "#" : `/interaction/user/${gig.seller.id}`}
									className="solid-btn flex items-center gap-0.5"
								>
									<IoChatboxEllipsesSharp className="mt-0.5" />
									<div className="mr-0.5">Chat</div>
								</Link>
							</div>
						</div>
						<div className="ml-4 border-l border-light-text pl-3 font-medium dark:border-dark-text">
							<div>{gig.totalOrders} Orders Placed</div>
							<div>{gig.totalOrders} Reviews</div>
						</div>
					</div>

					<Carousel>
						<video src={gig.gigVideo ?? ""} controls className="w-full" />
					</Carousel>

					{isMD && (
						<div className={`flex gap-4 max-sm:flex-col`}>
							<CallToEnroll {...gig} isSeller={isSeller} />
							<div className="self-start rounded bg-light-secondary p-3 shadow dark:bg-dark-secondary">
								<h3 className="small-headings p-0 text-left">Topics Covered :</h3>
								<div className="mt-2 flex flex-wrap">
									{gig.tags.map((tag) => (
										<Tag key={tag} tag={tag.name} className="my-0.5" />
									))}
								</div>
							</div>
						</div>
					)}

					<div className="w-full rounded">
						<h3 className="medium-headings mb-2 text-left">About the gig</h3>
						<div>
							{gig.description}
							Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt unde alias at itaque harum facere
							reprehenderit incidunt dolores quibusdam quam nobis officia aliquam debitis earum ex, eligendi saepe, nam
							adipisci? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam molestiae ipsa sequi? Expedita
							sequi distinctio ea iusto ducimus nihil, ipsam, voluptas quam cupiditate, facilis libero minima quaerat
							adipisci saepe dolor?
						</div>
					</div>

					{isMD && <FAQBlock {...gig} />}
				</div>

				{/* Sidebar */}
				{!isMD && (
					<div className="w-[18rem] space-y-4">
						<CallToEnroll {...gig} sticky isSeller={isSeller} />
						<div className="rounded bg-light-secondary p-3 shadow dark:bg-dark-secondary">
							<h3 className="small-headings p-0 text-left">Topics Covered :</h3>
							<div className="mt-2 flex flex-wrap">
								{gig.tags.map((tag) => (
									<Tag key={tag} tag={tag.name} className="my-0.5" />
								))}
							</div>
						</div>
						<FAQBlock {...gig} />
					</div>
				)}
			</div>

			{/* Reviews */}
			{reviews ? (
				<div className="mb-60 mt-8 max-w-[50rem]">
					<div className="medium-headings mb-2 text-left">Reviews</div>
					{reviews.length > 0 ? (
						reviews.map((review, index) => <ReviewCard review={review} key={`profile-review-${index}`} />)
					) : (
						<div className="flex h-10 items-center">No reviews yet.</div>
					)}
				</div>
			) : (
				<Loading />
			)}
		</>
	);
};

export default GigPage;

const CallToEnroll = ({ sticky = false, isSeller, ...gig }: Gig & { isSeller: boolean; sticky?: boolean }) => {
	return (
		<div
			className={`flex-[0_0_18rem] rounded bg-light-secondary p-4 shadow dark:bg-dark-secondary ${sticky ? "sticky top-[8rem] z-10" : ""}`}
		>
			<h3 className="small-headings mb-2 p-0 text-left text-2xl">What You Get :</h3>
			<div className="mb-2">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam officiis quia perferendis, dolorem quasi soluta
				impedit eum quibusdam accusamus hic inventore minus? Dolorem facilis ratione deserunt amet veritatis ea error.
			</div>
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center text-xl font-semibold">
					<FaBangladeshiTakaSign className="pb-0.5 pt-1" /> {gig.price}
					<RxSlash className="-mx-1 pt-0.5" />
					Hr
				</div>
				<Link
					to={isSeller ? "#" : `/interaction/user/${gig.seller.id}`}
					className="solid-btn flex-1 text-center text-base"
				>
					Enroll
				</Link>
			</div>
		</div>
	);
};

const FAQBlock = ({ ...gig }: Gig) => {
	return (
		<div className="rounded bg-light-secondary p-3 shadow dark:bg-dark-secondary">
			<h3 className="small-headings p-0 text-left">FAQ :</h3>
			<div className="mt-2 space-y-2">
				<FAQQuestion
					question="What is the duration of the course?"
					answer="Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus consequatur, sunt sequi corrupti consectetur ratione assumenda sed adipisci praesentium saepe eius autem accusamus quis dignissimos suscipit nulla repudiandae! Mollitia, ut."
				/>
				<FAQQuestion
					question="What is the duration of the course?"
					answer="Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus consequatur, sunt sequi corrupti consectetur ratione assumenda sed adipisci praesentium saepe eius autem accusamus quis dignissimos suscipit nulla repudiandae! Mollitia, ut."
				/>
				<FAQQuestion
					question="What is the duration of the course?"
					answer="Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus consequatur, sunt sequi corrupti consectetur ratione assumenda sed adipisci praesentium saepe eius autem accusamus quis dignissimos suscipit nulla repudiandae! Mollitia, ut."
				/>
				<FAQQuestion
					question="What is the duration of the course?"
					answer="Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus consequatur, sunt sequi corrupti consectetur ratione assumenda sed adipisci praesentium saepe eius autem accusamus quis dignissimos suscipit nulla repudiandae! Mollitia, ut."
				/>
			</div>
		</div>
	);
};
