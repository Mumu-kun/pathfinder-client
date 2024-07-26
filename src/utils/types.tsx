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
