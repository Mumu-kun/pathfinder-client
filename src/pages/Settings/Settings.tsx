import ErrorPage from "@/components/ErrorPage";
import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import { ProfileData } from "@/utils/types";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProfileData } from "../Profile/Profile";
import EditAccount from "./EditAccount";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import { ToastContainer } from "react-toastify";
import ThemeContext from "@/context/ThemeProvide";

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
	const { theme } = useContext(ThemeContext);
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
			<div className="mt-6 text-center text-3xl font-bold text-green-500">Settings</div>
			<div className="mt-4 grid grid-cols-[minmax(0,max-content)_auto] gap-x-10">
				<div className="mt-4 flex flex-col gap-4">
					{TABS.map((tab) => {
						const tabTitle = tab.replace("-", " ");
						return (
							<Link
								to={"/settings/" + tab}
								key={`tab-${tab}`}
								className={`rounded-sm px-3 py-1.5 pr-6 text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-green-400 dark:bg-green-500" : "bg-light-secondary hover:bg-green-300 dark:bg-dark-secondary dark:hover:bg-green-600"}`}
								onClick={() => setActiveTab(tab)}
							>
								{tabTitle}
							</Link>
						);
					})}
				</div>

				<div
					className="w-full rounded-sm bg-light-secondary px-8 pb-8 pt-10 shadow-md transition-all dark:bg-dark-secondary"
					style={{
						minHeight: !profileData ? "30rem" : undefined,
					}}
				>
					{!profileData ? <Loading isTransparent /> : tabToElement(activeTab, { profileData })}
				</div>
				<ToastContainer position="bottom-center" theme={theme} />
			</div>
		</>
	);
};

export default Settings;
