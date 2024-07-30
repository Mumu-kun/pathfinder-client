export const Category = {};

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
	totalCompletedEnrollments: number;
	education: string[];
	qualification: string[];
};

export type AuthUser = {
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	accessToken: string;
};

export type User = {
	id: number;
	firstName: string;
	lastName: string;
	email?: string;
	role?: string;
	username?: string;
};

export type UserShort = {
	id: number;
	firstName: string;
	lastName: string;
	profileImage: string;
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

export type GigCardData = {
	id: number;
	title: string;
	tags: string[];
	price: number;
	rating: number;
	ratedByCount: number;
	coverImage: string;
	user?: UserShort;
};

export type Review = {
	id: number;
	title: string;
	text: string;
	rating: number;
	reviewer: UserShort;
	gig?: {
		id: number;
		title: string;
		coverImage: string;
	};
};