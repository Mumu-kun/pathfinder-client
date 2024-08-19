import React, { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Notification } from "@/utils/types";
import useStomp from "@/hooks/useStomp";
import { Link } from "react-router-dom";

const NotificationIcon = () => {
	const axiosPrivate = useAxiosPrivate();
	const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [notificationModalOpen, setNotificationModalOpen] = useState<boolean>(false);
	const { receivedNotification } = useStomp();

	useEffect(() => {
		const getNotifications = async () => {
			const pageNum = 0;
			try {
				const response = await axiosPrivate.get(`api/v1/notifications/get?page=${pageNum}`);
				setNotifications(response.data.content);
				console.log(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		const checkUnreadNotifications = async () => {
			try {
				const response = await axiosPrivate.get("api/v1/notifications/user-has-unread-notifications");
				setHasUnreadNotifications(response.data);
				console.log(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		getNotifications();
		checkUnreadNotifications();
	}, [receivedNotification]);

	const markAllasRead = async () => {
		try {
			await axiosPrivate.put("api/v1/notifications/mark-all-as-read");
			setHasUnreadNotifications(false);
		} catch (error) {
			console.log(error);
		}
	};

	const notificationIconClicked = () => {
		setNotificationModalOpen(!notificationModalOpen);
		markAllasRead();
	};

	return (
		<div className="text-xl" title="Notification">
			<div onClick={notificationIconClicked} className="cursor-pointer">
				{hasUnreadNotifications ? (
					<div className="relative flex animate-bounce items-center justify-center">
						<i className="bx bx-bell"></i>
						<p className="absolute bottom-2 left-4 text-3xl font-extrabold text-red-700">.</p>
					</div>
				) : (
					<i className="bx bx-bell"></i>
				)}
			</div>

			{/* // TODO: add other notficiation info such as timeStamp */}
			{notificationModalOpen && (
				<div className="fixed z-50 flex items-center justify-start rounded-xl border border-gray-800 bg-light-bg dark:bg-dark-bg">
					<div className="p-2">
						<p className="text-center font-bold">Notifications</p>
						{notifications.map((notification, index) => (
							<div key={index}>
								<Link onClick={() => setNotificationModalOpen(false)} to={{ pathname: `${notification.linkSuffix}` }}>
									<p className="text-base">{notification.text}</p>
								</Link>

								<hr />
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificationIcon;
