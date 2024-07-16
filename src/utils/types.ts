export const Category = {};

export type ProfileData = {
	id: number;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	profileImage?: string;
	age: number;
	description: string;
	tags: string[];
	rating: number;
	ratedBy: number;
	totalStudents: number;
	totalSessions: number;
	totalCompletedEnrollments: number;
	education: string[];
};
