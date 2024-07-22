import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import { useState } from "react";
import { useCollapse } from "react-collapsed";
import { BsPersonCheck } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { PiChalkboardTeacher } from "react-icons/pi";
import { useLoaderData } from "react-router-dom";
import Carousel from "../../components/Carousel";
import ErrorPage from "../../components/ErrorPage";
import GigCard from "../../components/GigCard";
import Tag from "../../components/Tag";
import { GigCardData, ProfileData, Review } from "../../utils/types";
import FloatCard from "./FloatCard";

import profileImg from "@/assets/profile.jpg";
import coverImg from "@/assets/cover.jpg";
import ReviewCard from "@/components/ReviewCard";

type loaderDataType = {
	profileData: ProfileData;
	gigs: GigCardData[];
};

export const loader = async (params: any): Promise<loaderDataType> => {
	const profileData: ProfileData = {
		id: params?.id ?? 1,
		email: "mumufahad@gmail.com",
		username: "mumufahad",
		firstName: "Mustafa",
		lastName: "Muhaimin",
		profileImage: profileImg,
		age: 23,
		description: `I am a software engineer. I have experience in building web applications using React and Node.js. I am passionate about creating clean and efficient code.
	In my free time, I enjoy learning new technologies and contributing to open source projects.I am currently working on a project that uses TypeScript and GraphQL.
	I am a software engineer with over 5 years of experience in building web applications using React and Node.js. I have a strong passion for creating clean and efficient code that delivers exceptional user experiences. My expertise includes working with TypeScript, GraphQL, and various front-end frameworks. I have a proven track record of successfully delivering projects on time and exceeding client expectations.
	In my free time, I enjoy contributing to open source projects and staying up-to-date with the latest industry trends. If you're looking for a dedicated and skilled developer, I would love to collaborate with you on your next project`,
		tags: ["React", "Node.js", "TypeScript", "GraphQL"],
		rating: 2.7,
		ratedByCount: 25,
		totalStudents: 40,
		totalSessions: 500,
		totalCompletedEnrollments: 50,
		education: ["Bachelor of Science in Computer Science", "M.Sc. in Computer Science"],
		qualification: ["Bachelor of Science in Computer Science", "M.Sc. in Computer Science"],
	};

	const gigs: GigCardData[] = [
		{
			id: 1,
			title: "Intro to Python Programming",
			tags: ["programming", "python", "introductory", "casfsasfse"],
			price: 1500,
			rating: 4.3,
			ratedByCount: 20,
			coverImage: coverImg,
			user: {
				id: profileData.id,
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				profileImage: profileData.profileImage,
			},
		},
	];

	const data = {
		profileData,
		gigs,
	};

	// Simulate a network delay
	// await new Promise((resolve) => setTimeout(resolve, 1000));

	return data;
};

export const Component = () => {
	const { profileData, gigs } = useLoaderData() as loaderDataType;

	const reviews: Review[] = [
		{
			title: "This was life changing",
			text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt eligendi sapiente ratione consectetur, sed architecto earum magni alias repudiandae dolores quo, vero minima accusantium beatae esse doloremque? Rem, vero dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt eligendi sapiente ratione consectetur, sed architecto earum magni alias repudiandae dolores quo, vero minima accusantium beatae esse doloremque? Rem, vero dolores. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt eligendi sapiente ratione consectetur, sed architecto earum magni alias repudiandae dolores quo, vero minima accusantium beatae esse doloremque? Rem, vero dolores.",
			rating: 4.5,
			user: {
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
	];

	const theme = localStorage.getItem("theme");
	const { getCollapseProps, getToggleProps, setExpanded } = useCollapse({
		collapsedHeight: 100,
	});

	const [activeTab, setActiveTab] = useState<string>("education");

	return (
		<>
			<FloatCard />
			<div className="mt-12 flex w-full items-center gap-4">
				{/* Profile Image */}
				<img
					src={profileData.profileImage ?? "https://placehold.co/400x400"}
					alt=""
					className="h-80 w-80 object-cover object-center"
				/>

				{/* Profile Info */}
				<div className="flex flex-col">
					<div className="text-4xl font-bold">
						{profileData.firstName} {profileData.lastName}
					</div>

					{/* Tags */}
					<div className="mt-4 grid grid-cols-[max-content_auto] grid-rows-2 items-center gap-x-1.5">
						<PiChalkboardTeacher className="h-7 w-7" />
						<div className="text-lg font-medium">Teaches</div>
						<div className="col-start-2 ml-0.5 flex flex-wrap">
							{profileData.tags.map((tag, index) => (
								<Tag tag={tag} key={index} />
							))}
						</div>
					</div>

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
										inactiveFillColor: theme === "light" ? "#e0e0e0" : "#333",
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
				</div>
			</div>

			{/* Description */}
			<div className="mt-10 max-w-[50rem]">
				<div className="mb-4 flex items-center text-2xl font-semibold">About Me</div>
				<p {...getCollapseProps()} className="whitespace-pre-line">
					{profileData.description}
				</p>
				<button
					className="mt-2 font-semibold text-blue-600"
					{...getToggleProps({
						onClick: () => setExpanded((prev) => !prev),
					})}
				>
					See More
				</button>
			</div>

			{/* Education */}
			<div className="mt-8 w-fit min-w-[30rem]">
				<div className={`flex items-center border-b-2 border-green-400`}>
					{["education", "qualification"].map((value) => {
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
					<ul className="ml-1 mt-4 space-y-2">
						{profileData.education.map((value, index) => (
							<li key={`profileEducation-${index}`} className="flex items-center gap-1">
								<FaCircle className="h-1.5 w-1.5" /> {value}
							</li>
						))}
					</ul>
				) : activeTab === "qualification" ? (
					<ul className="ml-1 mt-4 space-y-2">
						{profileData.education.map((value, index) => (
							<li key={`profileQualification-${index}`} className="flex items-center gap-1">
								<FaCircle className="h-1.5 w-1.5" /> {value}
							</li>
						))}
					</ul>
				) : null}
			</div>

			{/* Gigs */}
			<div className="mt-4">
				<Carousel>
					{gigs.map((value) => (
						<GigCard gig={value} key={`profileGig-${value.id}`} />
					))}
				</Carousel>
			</div>

			{/* Reviews */}
			<div className="mb-60 mt-8 max-w-[50rem]">
				<div className="mb-4 flex items-center text-xl font-semibold">Some reviews for this Mentor</div>
				{reviews.map((review, index) => (
					<ReviewCard review={review} key={`profile-review-${index}`} />
				))}
			</div>
		</>
	);
};

export const ErrorBoundary = ErrorPage;
