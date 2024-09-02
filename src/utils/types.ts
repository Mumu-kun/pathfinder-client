export const Category = {};

export type ProfileData = {
	id: number;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	age: number;
	description: string;
	teachTags: string[];
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
	fullName?: string;
};

export type UserShort = {
	id: number;
	firstName: string;
	lastName: string;
};

export type Gig = {
	id: number;
	title: string;
	category: string;
	description: string;
	offerText: string;
	price: number;
	gigCoverImage: string | null;
	gigVideo: string | null;
	tags: string[];
	faqs: FAQ[];
	rating: number;
	totalReviews: number;
	totalCompleted: number;
	totalOrders: number;
	accepted: boolean;
	paused: boolean;
	score: number;
	seller: User;
	createdAt: Date;
};

export type FAQ = {
	question: string;
	answer: string;
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

export type GigShort = {
	id: number;
	title: string;
	coverImage: string | null;
};

export type GigManage = {
	id: number;
	title: string;
	gigCoverImage: string | null;
	price: number;
	accepted: boolean;
	paused: boolean;
	score: number;
	ongoing: number;
	completed: number;
	earning: number;
	rating: number;
};

export type Review = {
	id: number;
	title: string;
	text: string;
	rating: number;
	reviewer: UserShort;
	createdAt: Date;
	gig?: GigShort;
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
	// id: number;
	// chatId: string;
	message: string;
	// senderId: number;
	senderFullName: string;
	// receiverId: number;
	// receiverFullName: string;
	timeStamp: string;
	read: boolean;
	[other: string]: any;
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
	startedAt: string;
	deadline: string;
	completedAt: string | null;
	price: number;
	numSessions: number;
	numSessionsCompleted: number;
	sessionDurationInMinutes: number;
	buyerConfirmed: boolean;
	paid: boolean;
};

type CancelledBy = "BUYER" | "SELLER" | "SYSTEM";

export type Session = {
	id: number;
	createdAt: string;
	scheduledAt: string;
	completedAt: string | null;
	completed: boolean;
	sessionType: "offline" | "online";
	enrollment: Enrollment;
	buyerConfirmed: boolean;
	cancelled: boolean;
	cancelledBy: CancelledBy;
	cancellationReason: string | null;
	cancelledAt: string | null;
};

export type Transaction = {
	id: number;
	tranxId: string;
	enrollment: Enrollment;
	amount: number;
	paidAt: string;
	paymentConfirmed: boolean;
};

export type Page<T> = {
	content: T[];
	totalElements: number;
	totalPages: number;
	last: boolean;
	number: number;
};
