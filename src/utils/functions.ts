import { BASE_URL, IMAGE_BASE_URL } from "./variables";

export const limitTextLength = (text: string, charCount: number): string => {
	return text.substring(0, charCount);
};

export const userProfileImageUrl = (id: number) => {
	return `${BASE_URL}/api/v1/public/users/${id}/profile-image`;
};

export const fullImageUrl = (filename: string) => {
	return IMAGE_BASE_URL + filename;
};
