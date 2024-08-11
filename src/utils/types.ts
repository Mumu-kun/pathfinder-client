export const Category = {};

export type ProfileData = {
	id: number;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	age: number;
	description: string;
	tags: string[];
	interests: string[];
	rating: number;
	ratedByCount: number;
	totalStudents: number;
	totalCompletedEnrollments: number;
	educations: Achievement[];
	qualifications: Achievement[];
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
};

export type Gig = {
	id: number;
	title: string;
	description: string;
	category: string;
	price: number;
	rating: number | null;
	totalOrders: number;
	accepted: boolean;
	seller: User;
	createdAt: Date;
	gigCoverImage: string | null;
	gigVideo: string | null;
};

export type GigCardData = {
	id: number;
	title: string;
	tags: string[];
	price: number;
	rating: number;
	ratedByCount: number;
	coverImage: string | null;
	user?: UserShort;
};

export type Review = {
	id: number;
	title: string;
	text: string;
	rating: number;
	reviewer: UserShort;
	createdAt: Date;
	gig?: {
		id: number;
		title: string;
		coverImage: string | null;
	};
};

export type Achievement = {
	title: string;
	year: number;
};

export type ChatRoom = {
	id: number | null;
	chatId: string;
	firstUserId: number;
	firstUserFullName: string;
	secondUserId: number;
	secondUserFullName: string;
	lastActive: string;
	lastMessage: ChatMessage;
};

export type ChatMessageInput = {
	senderId: number | undefined;
	receiverId: number | undefined;
	message: string;
	timeStamp: string;
};

export type ChatMessage = {
	id: number;
	chatId: string;
	message: string;
	senderId: number;
	senderFullName: string;
	receiverId: number;
	receiverFullName: string;
	timeStamp: string;
	read: boolean;
};

export type Notification = {
	id: number;
	text: string;
	timeStamp: string;
	receiver: User;
	read: boolean;
	type: string;
	linkSuffix: string;
};

export type Enrollment = {
	id: number;
	gig: Gig;
	buyer: User;
	createdAt: string;
	deadline: string;
	completedAt: string | null;
	price: number;
	numSessions: number;
	numSessionsCompleted: number;
	sessionDurationInMinutes: number;
	buyerConfirmed: boolean;
	paid: boolean;
};
