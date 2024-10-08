import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useCollapse } from "react-collapsed";
import axios from "../../api/axios";
import { FaCode, FaLinux, FaNetworkWired } from "react-icons/fa6";
import { PiGraphBold, PiHeadCircuit, PiMatrixLogoBold } from "react-icons/pi";
import { CgWebsite } from "react-icons/cg";
import { TbCategory, TbDeviceMobile } from "react-icons/tb";
import { BsDatabase, BsStars } from "react-icons/bs";
import { RiComputerLine } from "react-icons/ri";
import { MdSecurity } from "react-icons/md";
import { GrCloudComputer } from "react-icons/gr";
import { HiOutlineCog } from "react-icons/hi";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { GiMeshBall } from "react-icons/gi";
import { Link } from "react-router-dom";

const categoryToIcon: { [key: string]: ReactNode } = {
	"Basic Programming": <FaCode className="h-full w-full" />,
	"Data Structures and Algorithms": <PiGraphBold className="h-full w-full" />,
	"Web Development": <CgWebsite className="h-full w-full" />,
	"Mobile App Development": <TbDeviceMobile className="h-full w-full" />,
	"Database Management": <BsDatabase className="h-full w-full" />,
	"Software Engineering": <RiComputerLine className="h-full w-full" />,
	"Artificial Intelligence": <BsStars className="h-full w-full" />,
	"Machine Learning": <PiMatrixLogoBold className="h-full w-full" />,
	Cybersecurity: <MdSecurity className="h-full w-full" />,
	"Cloud Computing": <GrCloudComputer className="h-full w-full" />,
	DevOps: <HiOutlineCog className="h-full w-full" />,
	"Computer Networks": <FaNetworkWired className="h-full w-full" />,
	"Human-Computer Interaction": <PiHeadCircuit className="h-full w-full" />,
	"Computer Graphics": <GiMeshBall className="h-full w-full" />,
	"Embedded Systems": <HiOutlineCpuChip className="h-full w-full" />,
	"Operating Systems": <FaLinux className="h-full w-full" />,
	Others: <TbCategory className="h-full w-full" />,
};

const Categories: React.FC = () => {
	const [categories, setCategories] = useState<string[]>([]);
	const scrollRef = useRef<HTMLDivElement>(null);

	const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
		collapsedHeight: 128,
	});

	useEffect(() => {
		// Fetch categories
		const fetchCategories = async () => {
			try {
				const res = await axios.get("/api/v1/public/categories/all");

				setCategories(res.data);
			} catch (err) {
				console.error(err);
			}
		};

		fetchCategories();
	}, []);

	useEffect(() => {
		const scrollInterval = setInterval(() => {
			if (scrollRef.current) {
				scrollRef.current.scrollLeft += 3; // Adjust scroll speed as needed
			}
		}, 50); // Adjust interval for scroll speed

		return () => clearInterval(scrollInterval);
	}, []);

	return (
		<div className="mb-8 flex w-full flex-col">
			{/* <p className="medium-headings text-left">Browse Popular Categories</p> */}
			<div className="mb-2 flex justify-between">
				<div className="medium-headings text-left">Browse Popular Categories</div>
				<button {...getToggleProps()} className="outline-btn mr-2 self-end text-xs">
					{isExpanded ? "Show Less" : "Show All"}
				</button>
			</div>
			<div {...getCollapseProps()} className="w-full">
				<div className="grid w-full grid-cols-[repeat(auto-fill,8rem)] gap-2 p-2">
					{categories.map((category) => (
						<Link
							to={{ pathname: "/filter", search: `?category=${category}` }}
							key={category}
							className="normal-text hover-effect flex h-28 flex-col items-center justify-center gap-1 rounded-lg bg-light-secondary px-4 py-4 text-center text-xs dark:bg-dark-secondary"
						>
							<div className="h-8 w-8">{categoryToIcon[category] ?? <TbCategory />}</div>
							{category}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Categories;
