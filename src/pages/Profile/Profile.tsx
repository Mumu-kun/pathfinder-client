import { useLoaderData } from "react-router-dom";
import ErrorPage from "../../components/ErrorPage";
import { ProfileData } from "../../utils/types";
import { PiChalkboardTeacher } from "react-icons/pi";
import Tag from "../../components/Tag";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import { GoPeople } from "react-icons/go";
import { BsPersonCheck } from "react-icons/bs";
import { useState } from "react";
import { Transition } from "@headlessui/react";

export const loader = async (params: any) => {
	const data: ProfileData = {
		id: params?.id ?? 1,
		email: "mumufahad@gmail.com",
		username: "mumufahad",
		firstName: "Mustafa",
		lastName: "Muhaimin",
		age: 23,
		description:
			"I am a software engineer. I have experience in building web applications using React and Node.js. I am passionate about creating clean and efficient code. In my free time, I enjoy learning new technologies and contributing to open source projects.",
		tags: ["React", "Node.js", "TypeScript", "GraphQL"],
		rating: 2.7,
		ratedBy: 25,
		totalStudents: 40,
		totalSessions: 500,
		totalCompletedEnrollments: 50,
		education: ["Bachelor of Science in Computer Science"],
	};

	// Simulate a network delay
	await new Promise((resolve) => setTimeout(resolve, 1000));

	return data;
};

export const Component = () => {
	const profileData = useLoaderData() as ProfileData;
	const theme = localStorage.getItem("theme");
	const [descriptionExpanded, setDescriptionExpanded] = useState(false);

	return (
		<>
			<div className="mt-12 flex items-center gap-4">
				<div className="h-80 w-80">
					<img src={profileData.profileImage ?? "https://placehold.co/400x400"} alt="" className="object-cover" />
				</div>
				<div className="flex flex-col">
					<div className="text-4xl font-bold">
						{profileData.firstName} {profileData.lastName}
					</div>
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
							<div className="ml-0.5 text-sm font-medium">{profileData.ratedBy} Reviews</div>
						</div>

						<div className="ml-10 grid grid-cols-[max-content_auto] items-center gap-x-2">
							<GoPeople className="row-span-2 mb-1 h-auto w-10" />
							<div className="h-fit self-end text-sm font-semibold leading-3">Mentored</div>
							<div className="h-fit self-start text-sm font-semibold leading-4">
								<span className="text-lg text-green-600">{profileData.totalStudents}</span> Students
							</div>
						</div>
					</div>
					<div className="mt-8 flex items-center">
						<BsPersonCheck className="h-10 w-10" />
						<span className="ml-1 text-base font-medium">
							Total <span className="font-semibold text-green-600">{profileData.totalCompletedEnrollments}</span>{" "}
							Enrollments Completed
						</span>
					</div>
				</div>
			</div>
			<div className="mt-10">
				<div className="text-2xl font-semibold">About Me</div>
				{/* <div className={`mt-4 overflow-hidden transition-all`}>
					<div className={`transition-all ${!descriptionExpanded ? "-mt-[100%]" : "mt-0"}`}>
						{profileData.description}
					</div>
				</div> */}
				<Transition show={descriptionExpanded}>
					<div className="transition duration-300 ease-in data-[closed]:opacity-0">I will fade in and out</div>
				</Transition>
				<button
					className="mt-4 font-semibold text-blue-600"
					onClick={() => setDescriptionExpanded(!descriptionExpanded)}
				>
					See More
				</button>
			</div>
		</>
	);
};

export const ErrorBoundary = ErrorPage;
