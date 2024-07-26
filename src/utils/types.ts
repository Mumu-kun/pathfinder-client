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

export type User = {
	id: number;
	firstname: string;
	lastname: string;
	email: string | null;
	role: string | null;
	username: string | null;
};

export type Gig = {
	id: number;
	title: string;
	description: string;
	category: string;
	price: number;
	rating: number | null;
	total_orders: number;
	accepted: boolean;
	seller: User;
	created_at: Date;
	gig_cover_image: string | null;
	gig_video: string | null;
};

export type Review = {
	id: number;
	title: string;
	text: string;
	rating: number;
	created_at: Date;
	reviewer: User;
};
