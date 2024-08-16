import { BASE_URL, defaultCoverImage, IMAGE_BASE_URL } from "./variables";

export const limitTextLength = (text: string, charCount: number): string => {
	return text.substring(0, charCount);
};

export const userProfileImageUrl = (id: number) => {
	return `${BASE_URL}/api/v1/public/users/${id}/profile-image`;
};

export const fullImageUrl = (filename: string) => {
	return BASE_URL + IMAGE_BASE_URL + filename;
};

export const coverImageUrl = (filename: string | null) => {
	if (!filename) {
		return defaultCoverImage;
	}

	return BASE_URL + IMAGE_BASE_URL + filename;
};

export const disableScroll = () => {
	document.body.style.overflow = "hidden";
};

export const enableScroll = () => {
	document.body.style.overflow = "auto";
};

export const sleep = async (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
