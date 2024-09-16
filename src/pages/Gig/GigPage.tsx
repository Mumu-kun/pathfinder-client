import Loading from "@/components/Loading";
import ZoomableImg from "@/components/misc/ZoomableImg";
import ReviewBlock from "@/components/review/ReviewBlock";
import Tag from "@/components/Tag";
import { UnlimitLayoutWidth } from "@/components/wrappers/LimitLayoutWidth";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { fullImageUrl, userProfileImageUrl } from "@/utils/functions";
import { defaultCoverImage, defaultProfileImage } from "@/utils/variables";
import {
	MDXEditor,
	MDXEditorMethods,
	headingsPlugin,
	listsPlugin,
	quotePlugin,
	thematicBreakPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import React, { useEffect, useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { RxSlash } from "react-icons/rx";
import { Link, useParams } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
import axios from "../../api/axios";
import { Gig, Page, Review } from "../../utils/types";
import FAQQuestion from "./FAQQuestion";
import ErrorPage from "@/components/ErrorPage";
import { isAxiosError } from "axios";

type props = {
	gig?: Gig;
	setEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
};

const getGigReviews = async (id: number) => {
	try {
		const res = await axios.get(`/api/v1/public/gigs/${id}/reviews`);

		return res.data;
	} catch (err) {
		console.log(err);
	}
};

const GigPage = ({ gig: propGig, setEditMode }: props) => {
	const id: number = Number(useParams().id ?? propGig?.id);
	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();

	const [gig, setGig] = useState<Gig | undefined>(propGig);

	const [error, setError] = useState<{ errorCode: number; errorMessage: string } | undefined>(undefined);

	const isMD = useMediaQuery("(max-width: 768px)");

	const [reviews, setReviews] = useState<Page<Review> | undefined>({
		content: [],
		totalPages: 0,
		totalElements: 0,
		number: 0,
		last: true,
	});

	const getGig = async (id: number) => {
		try {
			if (auth) {
				const res = await axiosPrivate.get(`/api/v1/gigs/get/${id}`);
				return res.data;
			} else {
				const res = await axios.get(`/api/v1/public/gigs/${id}`);
				return res.data;
			}
		} catch (err) {
			console.error(err);
			if (isAxiosError(err)) {
				setError({
					errorCode: err.response?.status ?? 500,
					errorMessage: err.response?.data.message ?? "Something went wrong",
				});
			}
		}
	};

	useEffect(() => {
		!propGig && getGig(id).then((data) => setGig(data));
		id && getGigReviews(id).then((data) => setReviews(data));
	}, [id]);

	if (error) {
		return <ErrorPage {...error} />;
	}

	if (gig === undefined) {
		return <Loading />;
	}

	const seller = gig.seller;
	const isSeller = seller.id === auth?.userId;

	return (
		<>
			<UnlimitLayoutWidth>
				<div className="flex aspect-[6/1] w-full items-center overflow-hidden">
					<ZoomableImg
						src={
							gig.gigCoverImage
								? gig.gigCoverImage.startsWith("data:image/")
									? gig.gigCoverImage
									: fullImageUrl(gig.gigCoverImage)
								: defaultCoverImage
						}
						alt={gig.title}
						className="w-full overflow-hidden object-cover"
					/>
				</div>
			</UnlimitLayoutWidth>

			<div className="-mt-[2vw] flex justify-between">
				<div className="mb-4 w-fit rounded bg-light-secondary px-4 py-2 shadow dark:bg-dark-secondary">
					<div className="medium-headings pr-8 pt-2 text-left">{gig.title}</div>
					<Link to={"#"} className="font-medium hover:underline">
						{gig.category}
					</Link>
				</div>
				<div className="space-x-4">
					{propGig && (
						<button className="solid-btn" onClick={() => setEditMode && setEditMode(true)}>
							Edit Details
						</button>
					)}
				</div>
			</div>
			<div className="grid grid-cols-[auto_max-content] gap-4">
				<div className="space-y-4">
					<div className="grid w-fit grid-cols-[repeat(2,auto)] items-center gap-y-4 rounded bg-light-secondary p-2 shadow max-[500px]:grid-cols-1 dark:bg-dark-secondary">
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
							<div className="ml-2 flex flex-col items-start justify-center gap-1 self-stretch">
								<Link
									to={`/profile/${seller.id}`}
									className="mr-2 text-lg font-semibold hover:underline max-md:text-sm"
								>
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
						<div className="mr-3 border-light-text pl-3 font-medium min-[500px]:ml-2 min-[500px]:border-l dark:border-dark-text">
							<div>{gig.totalOrders} Orders Placed</div>
							<div>{gig.totalOrders} Reviews</div>
						</div>
					</div>

					{!!gig.gigVideo && <video src={gig.gigVideo} controls className="w-full" />}

					{isMD && (
						<div className={`flex gap-4 max-sm:flex-col`}>
							<TagsBlock {...{ gig }} className="flex-1 sm:self-start" />
							<CallToEnroll {...{ gig, isSeller }} />
						</div>
					)}

					<div className="w-full rounded">
						<h3 className="medium-headings mb-2 text-left">About the gig</h3>
						<MDXEditor
							markdown={gig.description ?? " "}
							contentEditableClassName={`prose prose-sm dark:prose-invert`}
							plugins={[
								headingsPlugin({
									allowedHeadingLevels: [2, 3, 4],
								}),
								listsPlugin(),
								quotePlugin(),
								thematicBreakPlugin(),
							]}
							readOnly
						/>
					</div>

					{isMD && <FAQBlock {...{ gig }} />}
				</div>

				{/* Sidebar */}
				{!isMD && (
					<div className="w-[18rem] space-y-4">
						<CallToEnroll {...{ gig, isSeller }} sticky />
						<TagsBlock {...{ gig }} />
						<FAQBlock {...{ gig }} />
					</div>
				)}
			</div>

			{/* Reviews */}
			{reviews ? (
				<div className="mb-60 mt-8 max-w-[50rem]">
					<div className="medium-headings mb-2 text-left">Reviews</div>
					{reviews.totalElements > 0 ? (
						<ReviewBlock
							reviews={reviews}
							setReviews={setReviews}
							rating={gig.rating}
							ratedByCount={gig.totalReviews}
							baseUrl={`/api/v1/public/gigs/${id}/reviews`}
						/>
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

const CallToEnroll = ({ gig, sticky = false, isSeller }: { gig: Gig; isSeller: boolean; sticky?: boolean }) => {
	const ref = React.useRef<MDXEditorMethods>(null);

	return (
		<div
			className={`w-[18rem] rounded bg-light-secondary p-4 shadow max-sm:self-center dark:bg-dark-secondary ${sticky ? "sticky top-[8rem] z-10" : ""}`}
		>
			<h3 className="small-headings mb-2 p-0 text-left text-2xl">What You Get :</h3>
			<MDXEditor
				ref={ref}
				markdown={gig.offerText ?? ""}
				readOnly
				plugins={[headingsPlugin({ allowedHeadingLevels: [4] }), listsPlugin()]}
				contentEditableClassName="prose prose-sm dark:prose-invert px-2 pt-0"
			/>

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

const TagsBlock = ({ gig, className = "" }: { gig: Gig; className?: string }) => {
	return (
		<div className={`rounded bg-light-secondary p-3 shadow dark:bg-dark-secondary ${className}`}>
			<h3 className="small-headings p-0 text-left">Topics Covered :</h3>
			<div className="mt-2 flex flex-wrap">
				{gig.tags.map((tag) => (
					<Tag key={tag} tag={tag} className="my-0.5" />
				))}
			</div>
		</div>
	);
};

const FAQBlock = ({ gig }: { gig: Gig }) => {
	return (
		<div className="rounded bg-light-secondary p-3 shadow dark:bg-dark-secondary">
			<h3 className="small-headings p-0 text-left">FAQ :</h3>
			<div className="mt-2 space-y-2">
				{gig.faqs?.map((faq, index) => (
					<FAQQuestion key={`faq-${index}`} question={faq.question} answer={faq.answer} />
				))}
			</div>
		</div>
	);
};
