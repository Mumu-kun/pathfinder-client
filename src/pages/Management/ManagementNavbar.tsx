import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const ManagementNavbar = () => {
	const [navClosed, setNavClosed] = useState(true);

	// useEffect(() => {
	// 	const handleResize = () => {
	// 		if (window.innerWidth <= 768) {
	// 			setNavClosed(true);
	// 		} else {
	// 			setNavClosed(false);
	// 		}
	// 	};

	// 	handleResize();

	// 	// event listener for window resize
	// 	window.addEventListener("resize", handleResize);

	// 	return () => {
	// 		window.removeEventListener("resize", handleResize);
	// 	};
	// }, []);

	return (
		<div
			className={
				navClosed
					? `fixed left-0 z-10 h-full w-12 bg-light-secondary transition-all dark:bg-dark-secondary`
					: `fixed left-0 z-10 h-full w-[300px] bg-light-secondary transition-all dark:bg-dark-secondary`
			}
		>
			<button
				onClick={() => setNavClosed(!navClosed)}
				className="outline-btn absolute right-2 top-2.5 z-20 p-1 text-xl font-extrabold"
			>
				<FaAngleLeft className={`${navClosed ? "rotate-180" : ""} transition-all`} />
			</button>
			<div
				className="flex min-w-max flex-col justify-start py-2 transition-all"
				style={{ opacity: navClosed ? "0" : "1", pointerEvents: navClosed ? "none" : undefined }}
			>
				<Link
					className="mx-2 w-auto rounded-sm p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
					to="/management/dashboard"
					onClick={() => setNavClosed(true)}
				>
					Management Dashboard
				</Link>
				<Link
					className="mx-2 w-auto rounded-sm p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
					to="/management/gigs/unaccepted"
					onClick={() => setNavClosed(true)}
				>
					Unaccepted Gigs
				</Link>
				<Link
					className="mx-2 w-auto rounded-sm p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
					to="/management/reports"
					onClick={() => setNavClosed(true)}
				>
					Reports
				</Link>
			</div>
		</div>
	);
};

export default ManagementNavbar;
