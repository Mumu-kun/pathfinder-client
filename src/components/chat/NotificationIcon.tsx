import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useStomp from "@/hooks/useStomp";
import { Notification } from "@/utils/types";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import Dropdown from "../Dropdown";
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
			console.log(response.data);

			setPageInfo({
				number: response.data.number,
				numberOfElements: response.data.numberOfElements,
				last: response.data.last,
				totalElements: response.data.totalElements,
				totalPages: response.data.totalPages,
			});

			setNotifications((prev) => [...prev, ...response.data.content]);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const checkUnreadNotifications = async () => {
			try {
				const response = await axiosPrivate.get("api/v1/notifications/user-has-unread-notifications");
				setHasUnreadNotifications(response.data);
				// console.log(response.data);
			} catch (error) {
				console.error(error);
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
			console.error(error);
		}
	};

	return (
		<Dropdown
			head={
				<div className="hover-effect-no-shadow cursor-pointer text-xl" onClick={markAllasRead}>
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
			<div className="z-50 flex flex-col items-center justify-start rounded-md border border-green-400 bg-light-bg pb-1 dark:bg-dark-bg">
				<p className="small-headings w-full px-4 py-2 pb-1 text-center text-green-500 shadow">Notifications</p>
				<InfiniteScroll
					dataLength={notifications.length}
					next={() => getNotifications(pageInfo.number + 1)}
					hasMore={!pageInfo.last}
					loader={<Loading isTransparent />}
					className="flex w-72 flex-col text-sm scrollbar-thin"
					height={200}
					endMessage={<p className="mt-2 text-wrap pb-2 text-center font-bold">Yay! You have seen it all</p>}
				>
					{notifications.map((notification) => (
						<Link
							key={notification.id}
							to={{ pathname: `${notification.linkSuffix}` }}
							className="text-wrap px-6 py-2 shadow-sm hover:bg-green-100 dark:hover:bg-green-800"
						>
							{notification.text}
						</Link>
					))}
				</InfiniteScroll>
			</div>
		</Dropdown>
	);
};

export default NotificationIcon;
