export const limitTextLength = (text: string, charCount: number): string => {
	return text.substring(0, charCount);
};

export const userProfileImageUrl = (id: number) => {
	return `/api/v1/public/users/${id}/profile-image`;
};
