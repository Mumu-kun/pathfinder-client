import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Enrollment, Gig, Page } from "@/utils/types";
import { useEffect, useState } from "react";
import EnrollmentsList from "./EnrollmentsList";

type Props = {};

const enrl: Enrollment = {
	id: 1,
	gig: {
		id: 1,
		title: "Intro To Python Programming",
		description:
			"## *I Will Develop Custom Software Solutions for Your Business*\n\nAre you looking for a reliable software developer to bring your ideas to life? Look no further! With over 5 years of experience in software development, I specialize in creating custom software solutions tailored to your business needs.\n\n## <u>What I Offer:</u>\n\n* **Custom Software Development**: Tailored solutions to meet your specific requirements.\n* **Web Application Development**: Modern, responsive web applications.\n* **Mobile App Development**: High-quality apps for both iOS and Android platforms.\n* **API Integration**: Seamless integration with third-party services.\n* **Bug Fixes & Maintenance**: Ongoing support and maintenance for your projects.\n\n### Let's Get Started!\n\nFeel free to contact me with any questions or to discuss your project in detail. I look forward to working with you and bringing your vision to life!",
		category: "Basic Programming",
		price: 500,
		offerText: "**Ready to Transform Your Ideas into Reality?**\n\nContact me today to get started on your project!",
		rating: 0,
		totalOrders: 1,
		accepted: true,
		paused: false,
		seller: {
			id: 2,
			firstName: "Mustafa",
			lastName: "Muhaimin",
			email: "mumufahad@gmail.com",
			role: "USER",
			// profileImage: "pf-Modern-Software-Development-fc9d3ffc-31b5-4d71-82bb-8a105537235e.jpg",
			// emailVerified: true,
			// emailVerificationToken: null,
			// lastVerificationEmailSentAt: "2024-09-18T13:46:19.147828Z",
			fullName: "Mustafa Muhaimin",
			username: "mumufahad@gmail.com",
		},
		tags: ["Intro", "Programming", "Python"],
		createdAt: new Date("2024-09-18T14:28:05.479014Z"),
		gigCoverImage: null,
		gigVideo: null,
		score: 15,
	} as Gig,
	buyer: {
		id: 3,
		firstName: "Fahad",
		lastName: "ABC",
		email: "sayanolion@gmail.com",
		role: "USER",
		// profileImage: "pf-Kiwi-9116-33ef48b0-fed7-407a-a940-c8c96dc71b56.jpg",
		// emailVerified: true,
		// emailVerificationToken: null,
		// lastVerificationEmailSentAt: "2024-09-18T13:57:26.411305Z",
		fullName: "Fahad ABC",
		username: "sayanolion@gmail.com",
	},
	createdAt: "2024-09-18T14:37:22.074358Z",
	startedAt: "2024-09-18T14:41:04.797343Z",
	deadline: "2024-09-18T14:37:00Z",
	completedAt: null,
	price: 500,
	numSessions: 2,
	numSessionsCompleted: 2,
	sessionDurationInMinutes: 40,
	buyerConfirmed: true,
	paid: true,
};

const Enrollments = ({}: Props) => {
	const { auth } = useAuth();
	const axios = useAxiosPrivate();
	const [enrollments, setEnrollments] = useState<Page<Enrollment> | undefined>();

	const getEnrollments = async (page: number = 0) => {
		try {
			const res = await axios.get(`/api/v1/enrollments/buyer/${auth?.userId}`, {
				params: {
					page,
				},
			});

			console.log(res.data);
			setEnrollments(res.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getEnrollments();
	}, []);

	return (
		<>
			<div className="medium-headings mb-4 mt-8 rounded-sm pb-4 pl-6 text-left text-green-500">My Enrollments</div>

			<EnrollmentsList enrollments={enrollments} getEnrollments={getEnrollments} />
		</>
	);
};

export default Enrollments;
