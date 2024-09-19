import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ManagementNavbar = () => {
	const [navClosed, setNavClosed] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 768) {
				setNavClosed(true);
			} else {
				setNavClosed(false);
			}
		};

		handleResize();

		// event listener for window resize
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div
			className={
				navClosed
					? `fixed left-0 z-10 h-full w-[45px] bg-light-secondary transition-all dark:bg-dark-secondary`
					: `fixed left-0 z-10 h-full w-[300px] bg-light-secondary transition-all dark:bg-dark-secondary`
			}
		>
			<button onClick={() => setNavClosed(!navClosed)} className="solid-btn-sm absolute right-0 font-extrabold text-xl">
				{navClosed ? ">" : "<"}
			</button>
			{!navClosed && (
				<div className="flex flex-col justify-start py-2">
					<Link
						className="mx-2 w-auto rounded-sm p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
						to="/management/dashboard"
					>
						Management Dashboard
					</Link>
					<Link
						className="mx-2 w-auto rounded-sm p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
						to="/management/gigs/unaccepted"
					>
						Unexpected Gigs
					</Link>
					<Link
						className="mx-2 w-auto rounded-sm p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
						to="/management/reports"
					>
						Reports
					</Link>
				</div>
			)}
		</div>
	);
};

export default ManagementNavbar;
