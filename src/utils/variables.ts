import profileImage from "@/assets/profile.jpg";
import coverImage from "@/assets/cover.jpg";

export const BASE_URL = "http://localhost:8080";
export const LOGIN_URL = "/api/v1/auth/authenticate";
export const REGISTER_URL = "/api/v1/auth/register";
export const REFRESH_TOKEN_URL = "/api/v1/auth/refresh-token";
export const IMAGE_BASE_URL = "/api/v1/public/images";
export const GIGS_BASE_URL = "/api/v1/public/gigs";
export const GIGS_BASE_URL_PRIVATE = "/api/v1/gigs";
export const defaultProfileImage = profileImage;
export const defaultCoverImage = coverImage;
