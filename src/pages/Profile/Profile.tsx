import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useCollapse } from "react-collapsed";
import { BsPersonCheck } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { PiChalkboardTeacher } from "react-icons/pi";
import { useParams } from "react-router-dom";
import Carousel from "../../components/Carousel";
import GigCard from "../../components/GigCard";
import Tag from "../../components/Tag";
import { GigCardData, ProfileData, Review } from "../../utils/types";
import FloatCard from "./FloatCard";

import axios from "@/api/axios";
import coverImg from "@/assets/cover.png";
import profileImg from "@/assets/profile.jpg";
import ReviewCard from "@/components/ReviewCard";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/Loading";
import { boolean } from "yup";

export const getProfileData = async (userId: number) => {
	try {
		const res = await axios.get(`/api/v1/public/users/${userId}/profile`);
		const data = res.data;

		return data as unknown as ProfileData;
	} catch (error) {
		console.error(error);
	}
};

export const Profile = () => {
	const params = useParams();
	const { auth } = useAuth();

	let userId = params?.id ? parseInt(params?.id) : auth?.userId;

	const [profileData, setProfileData] = useState<ProfileData | undefined>();

	const [gigs, setGigs] = useState<GigCardData[]>([
		{
			id: 1,
			title: "Intro to Python Programming",
			tags: ["programming", "python", "introductory", "casfsasfse"],
			price: 1500,
			rating: 4.3,
			ratedByCount: 20,
			coverImage: coverImg,
			user: {
				id: userId ?? 1,
				firstName: "Mustafa",
				lastName: "Muhaimin",
				profileImage: profileImg,
			},
		},
	]);

	const [reviews, setReviews] = useState<Review[]>([
		{
			id: 1,
			title: "This was life changing",
			text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt eligendi sapiente ratione consectetur, sed architecto earum magni alias repudiandae dolores quo, vero minima accusantium beatae esse doloremque? Rem, vero dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt eligendi sapiente ratione consectetur, sed architecto earum magni alias repudiandae dolores quo, vero minima accusantium beatae esse doloremque? Rem, vero dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt eligendi sapiente ratione consectetur, sed architecto earum magni alias repudiandae dolores quo, vero minima accusantium beatae esse doloremque? Rem, vero dolores.",
			rating: 4.5,
			reviewer: {
				id: 1,
				firstName: "Mustafa",
				lastName: "Muhaimin",
				profileImage: profileImg,
			},
			gig: {
				id: 1,
				title: "Intro to Python Programming",
				coverImage: coverImg,
			},
		},
	]);

	const theme = localStorage.getItem("theme");

	const descRef = useRef<HTMLParagraphElement>(null);
	const [shouldCollapse, setShouldCollapse] = useState<boolean>(false);
	const resizeObs = useMemo(() => {
		return new ResizeObserver((entries) => {
			entries.forEach((e) => {
				if (e.contentRect.height > 130) {
					setExpanded(false);
					setShouldCollapse(true);
				} else {
					setExpanded(true);
					setShouldCollapse(false);
				}
			});
		});
	}, []);

	const { getCollapseProps, getToggleProps, isExpanded, setExpanded } = useCollapse({
		collapsedHeight: 100,
		defaultExpanded: true,
	});

	const [activeTab, setActiveTab] = useState<string>("education");

	useEffect(() => {
		getProfileData(auth!.userId).then((data) => {
			setProfileData(data);
		});
	}, []);

	useEffect(() => {
		if (descRef?.current) {
			resizeObs.observe(descRef.current);
		}

		return () => {
			resizeObs.disconnect();
		};
	}, [descRef]);

	if (!profileData) {
		return <Loading fullscreen />;
	}

	return (
		<>
			<FloatCard />
			<div className="mt-12 flex w-full gap-4">
				{/* Profile Image */}
				<img
					src={profileData.profileImage ? profileData.profileImage : profileImg}
					alt=""
					className={`${profileData.totalStudents ? "h-80 w-80" : "h-40 w-40"} object-cover object-center`}
				/>

				{/* Profile Info */}
				<div className="flex flex-col">
					<div className="text-4xl font-bold">
						{profileData.firstName} {profileData.lastName}
					</div>

					{/* Tags */}
					{profileData.tags?.length > 0 && (
						<div className="mt-4 grid grid-cols-[max-content_auto] grid-rows-2 items-center gap-x-1.5">
							<PiChalkboardTeacher className="h-7 w-7" />
							<div className="text-lg font-medium">Teaches</div>
							<div className="col-start-2 ml-0.5 flex flex-wrap">
								{profileData.tags.map((tag, index) => (
									<Tag tag={tag} key={index} />
								))}
							</div>
						</div>
					)}

					{!!profileData.totalStudents && (
						<>
							<div className="mt-8 flex items-center">
								{/* Rating */}
								<div className="space-y-1">
									<div className="ml-0.5 text-lg font-medium">
										<span className="">Rating</span> {profileData.rating}
									</div>
									<div className="flex items-center">
										<Rating
											value={profileData.rating}
											className="max-w-28"
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
									<div className="ml-0.5 text-sm font-medium">{profileData.ratedByCount} Reviews</div>
								</div>

								{/* Total Mentored */}
								<div className="ml-10 grid grid-cols-[max-content_auto] items-center gap-x-2">
									<GoPeople className="row-span-2 mb-1 h-auto w-10" />
									<div className="h-fit self-end text-sm font-semibold leading-3">Mentored</div>
									<div className="h-fit self-start text-sm font-semibold leading-4">
										<span className="text-lg text-green-600">{profileData.totalStudents}</span> Students
									</div>
								</div>
							</div>

							{/* Total Enrollments */}
							<div className="mt-8 flex items-center">
								<BsPersonCheck className="h-10 w-10" />
								<span className="ml-1 text-base font-medium">
									Total <span className="font-semibold text-green-600">{profileData.totalCompletedEnrollments}</span>{" "}
									Enrollments Completed
								</span>
							</div>
						</>
					)}
				</div>
			</div>

			{/* Description */}
			{!!profileData.description && (
				<div className="mt-10 max-w-[50rem]">
					<div className="mb-4 flex items-center text-2xl font-semibold">About Me</div>
					<div {...getCollapseProps()} className="whitespace-pre-line">
						<p ref={descRef}>{profileData.description}</p>
					</div>
					{shouldCollapse && (
						<button
							className="mt-2 font-semibold text-green-500"
							{...getToggleProps({
								onClick: () => setExpanded((prev) => !prev),
							})}
						>
							{isExpanded ? "See Less" : "See More"}
						</button>
					)}
				</div>
			)}

			{/* Education */}
			<div className="mt-8 w-fit min-w-[30rem]">
				<div className={`flex items-center border-b-2 border-green-400`}>
					{["education", "qualification", "interest"].map((value) => {
						return (
							<div
								key={`profileTabs-${value}`}
								className={`w-fit cursor-pointer rounded-t-sm px-2 py-0.5 text-lg font-semibold capitalize transition-all duration-200 ${activeTab === value ? "bg-green-400" : "hover:bg-green-200 dark:hover:bg-green-700"}`}
								onClick={() => {
									setActiveTab(value);
								}}
							>
								{value}
							</div>
						);
					})}
				</div>
				{activeTab === "education" ? (
					<ul className="ml-4 mt-4 grid grid-cols-[repeat(4,max-content)] items-center gap-x-2 gap-y-2">
						{profileData.educations.map((value, index) => (
							<Fragment key={`profileEducation-${index}`}>
								<FaCircle className="mr-2 h-1.5 w-1.5 text-green-400" />
								<span>{value.title}</span>
								<span>-</span>
								<span>{value.year}</span>
							</Fragment>
						))}
					</ul>
				) : activeTab === "qualification" ? (
					<ul className="ml-4 mt-4 grid grid-cols-[repeat(4,max-content)] items-center gap-x-2 gap-y-2">
						{profileData.qualifications.map((value, index) => (
							<Fragment key={`profileQualification-${index}`}>
								<FaCircle className="mr-2 h-1.5 w-1.5 text-green-400" />
								<span>{value.title}</span>
								<span>-</span>
								<span>{value.year}</span>
							</Fragment>
						))}
					</ul>
				) : activeTab === "interest" ? (
					<ul className="ml-4 mt-4 flex max-w-[30rem] flex-wrap items-center gap-x-2 gap-y-2">
						{profileData.interests.map((value) => (
							<Tag tag={value} key={`profileInterest-${value}`} />
						))}
					</ul>
				) : null}
			</div>

			{/* Gigs */}
			{gigs ? (
				gigs.length > 0 && (
					<div className="mt-8">
						<div className="mb-2 flex items-center text-xl font-semibold">Gigs from this Mentor</div>
						<Carousel>
							{gigs.map((value) => (
								<GigCard gig={value} key={`profileGig-${value.id}`} />
							))}
						</Carousel>
					</div>
				)
			) : (
				<Loading />
			)}

			{/* Reviews */}
			{reviews ? (
				reviews.length > 0 && (
					<div className="mb-60 mt-8 max-w-[50rem]">
						<div className="mb-4 flex items-center text-xl font-semibold">Some reviews for this Mentor</div>
						{reviews.map((review, index) => (
							<ReviewCard review={review} key={`profile-review-${index}`} />
						))}
					</div>
				)
			) : (
				<Loading />
			)}
		</>
	);
};

export default Profile;
