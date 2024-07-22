export const Category = {};

export type CardUserData = {
	id: number;
	firstName: string;
	lastName: string;
	profileImage: string;
};

export type ProfileData = {
	id: number;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	profileImage: string;
	age: number;
	description: string;
	tags: string[];
	rating: number;
	ratedByCount: number;
	totalStudents: number;
	totalSessions: number;
	totalCompletedEnrollments: number;
	education: string[];
	qualification: string[];
};

export type GigCardData = {
	id: number;
	title: string;
	tags: string[];
	price: number;
	rating: number;
	ratedByCount: number;
	coverImage: string;
	user?: CardUserData;
};

export type Review = {
	title: string;
	text: string;
	rating: number;
	user: CardUserData;
	gig?: {
		id: number;
		title: string;
		coverImage: string;
	};
};
