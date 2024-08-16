import ErrorPage from "@/components/ErrorPage";
import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import { ProfileData } from "@/utils/types";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProfileData } from "../Profile/Profile";
import ChangePassword from "./ChangePassword";
import EditAccount from "./EditAccount";
import EditProfile from "./EditProfile";

const TABS = ["account", "profile", "password"];

const tabToElement = (tab: string, props: any) => {
	switch (tab) {
		case TABS[0]:
			return <EditAccount {...props} />;

		case TABS[1]:
			return <EditProfile {...props} />;

		case TABS[2]:
			return <ChangePassword />;

		case TABS[3]:
			return <div>DeleteAccount</div>;

		default:
			return null;
	}
};

export const Settings = () => {
	const { pathname } = useLocation();
	const { auth } = useAuth();
	const tab = pathname.split("/")[2];

	const [activeTab, setActiveTab] = useState<string>(tab || TABS[0]);

	const [profileData, setProfileData] = useState<ProfileData>();

	if (!!tab && !TABS.includes(tab)) {
		return <ErrorPage errorCode={404} errorMessage="Page Not Found" />;
	}

	useEffect(() => {
		getProfileData(auth!.userId).then((data) => {
			setProfileData(data);
		});
	}, []);

	return (
		<>
			<div className="semilarge-headings mt-8 rounded-sm pb-4 pl-6 text-left text-green-500">Settings</div>
			<div className="flex py-8 max-md:flex-col">
				<div className="flex gap-4 md:flex-col">
					{TABS.map((tab) => {
						const tabTitle = tab.replace("-", " ");
						return (
							<Link
								to={"/settings/" + tab}
								key={`tab-${tab}`}
								className={`rounded-l-sm px-3 py-1.5 pr-8 text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-green-400 dark:bg-green-500" : "hover:bg-green-300 dark:hover:bg-green-600"}`}
								onClick={() => setActiveTab(tab)}
							>
								{tabTitle}
							</Link>
						);
					})}
				</div>

				<div className="mr-8 min-h-[30rem] w-0.5 bg-zinc-300 max-md:hidden dark:bg-zinc-700"></div>

				<div className="mt-4 h-[1px] bg-zinc-300 md:hidden dark:bg-zinc-700"></div>

				<div
					className="w-full transition-all max-md:pt-5 md:px-8"
					style={{
						minHeight: !profileData ? "30rem" : undefined,
					}}
				>
					{!profileData ? <Loading isTransparent /> : tabToElement(activeTab, { profileData })}
				</div>
			</div>
		</>
	);
};

export default Settings;
