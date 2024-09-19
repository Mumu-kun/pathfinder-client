import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";
import { userProfileImageUrl } from "@/utils/functions";
import { defaultProfileImage } from "@/utils/variables";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import ChangeMode from "../ChangeMode";
import ChangeTheme from "../ChangeTheme";
import Dropdown from "../Dropdown";

type Props = {};

const HeaderAuthLinks = (props: Props) => {
	const { auth } = useAuth();
	const logout = useLogout();
	const [profileOutline, setProfileOutline] = useState<boolean>(false);

	return (
		<>
			{!auth ? (
				<>
					<Link to="/login" state={{ from: location.pathname }} className="outline-btn">
						Log In
					</Link>
					<Link to="/register" state={{ from: location.pathname }} className="solid-btn">
						Join as a{" "}
						<span className="inline-block w-14 pr-2">
							<TypeAnimation sequence={["Student", 3000, "Mentor", 3000]} speed={10} repeat={Infinity} />
						</span>
					</Link>
				</>
			) : (
				<div>
					<Dropdown
						head={
							<div
								className={`h-10 w-10 overflow-hidden rounded-full ring-white hover:ring-2 ${profileOutline ? "ring-2" : ""}`}
								style={{
									background: `url(${defaultProfileImage}) center center / cover no-repeat`,
								}}
							>
								<img
									src={userProfileImageUrl(auth.userId)}
									className="h-full w-full object-cover"
									onError={({ currentTarget }) => {
										currentTarget.onerror = null;
										currentTarget.src = defaultProfileImage;
									}}
								/>
							</div>
						}
						isOpen={profileOutline}
						setIsOpen={setProfileOutline}
						rightAlign
						dropdownClassName="mt-2"
					>
						<div
							className={`flex min-w-20 flex-col items-center justify-center rounded-md bg-light-bg p-2 text-center transition-all dark:bg-dark-bg`}
						>
							<ChangeMode />
							<ChangeTheme />
							<Link
								to="/profile"
								className="w-full p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
							>
								Profile
							</Link>
							{(auth?.role == "ADMIN" || auth?.role == "MANAGER") && (
								<Link
									to="/management/dashboard"
									className="w-full p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
								>
									Site Management
								</Link>
							)}
							<Link
								to="/settings"
								className="w-full p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
							>
								Settings
							</Link>
							<button
								onClick={() => {
									logout();
								}}
								className="w-full p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
							>
								Logout
							</button>
						</div>
					</Dropdown>
				</div>
			)}
		</>
	);
};

export default HeaderAuthLinks;
