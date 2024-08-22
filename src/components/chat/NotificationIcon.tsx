import React, { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Notification } from "@/utils/types";
import useStomp from "@/hooks/useStomp";
import { Link } from "react-router-dom";
import Dropdown from "../Dropdown";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";

const NotificationIcon = () => {
	const axiosPrivate = useAxiosPrivate();
	const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const { receivedNotification } = useStomp();

	const [pageInfo, setPageInfo] = useState({
		number: 0,
		numberOfElements: 0,
		last: true,
		totalElements: 0,
		totalPages: 0,
	});

	const getNotifications = async (pageNum: number = 0) => {
		try {
			const response = await axiosPrivate.get(`api/v1/notifications/get?page=${pageNum}`);
			setNotifications(response.data.content);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
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

	return (
		<Dropdown
			head={
				<div className="cursor-pointer text-xl" onClick={markAllasRead}>
					{hasUnreadNotifications ? (
						<div className="relative flex animate-bounce items-center justify-center">
							<i className="bx bx-bell"></i>
							<p className="absolute bottom-2 left-4 text-3xl font-extrabold text-red-700">.</p>
						</div>
					) : (
						<i className="bx bx-bell"></i>
					)}
				</div>
			}
			rightAlign
		>
			<div className="z-50 flex flex-col items-center justify-start rounded-xl border border-gray-800 bg-light-bg px-4 py-1 dark:bg-dark-bg">
				<p className="text-center font-bold">Notifications</p>
				<InfiniteScroll
					dataLength={notifications.length}
					next={() => getNotifications(pageInfo.number + 1)}
					hasMore={!pageInfo.last}
					loader={<Loading isTransparent />}
					className="flex max-h-40 w-40 flex-col truncate"
					endMessage={
						<p className="truncate" style={{ textAlign: "center" }}>
							<b>Yay! You have seen it all</b>
						</p>
					}
				>
					{notifications.map((notification, index) => (
						<div key={index}>
							<Link to={{ pathname: `${notification.linkSuffix}` }}>
								<p className="text-base">{notification.text}</p>
							</Link>

							<hr />
						</div>
					))}
				</InfiniteScroll>
			</div>
		</Dropdown>
	);
};

export default NotificationIcon;
