import React, { useState, useEffect, useRef } from "react";
import axios from "../../api/axios";

const Categories: React.FC = () => {
	const [categories, setCategories] = useState<string[]>([]);
	const scrollRef = useRef<HTMLDivElement>(null);

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
		<div className="p-10">
			<p className="medium-headings">Browse Popular Categories</p>
			<div
				ref={scrollRef}
				className="flex flex-nowrap space-x-4 overflow-hidden whitespace-nowrap p-2"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Hide scrollbar for Firefox
			>
				{categories.map((category) => (
					<div
						key={category}
						className="category normal-text bg-light-secondary dark:bg-dark-secondary rounded-lg px-4 py-4"
					>
						{category} {"-> "}
					</div>
				))}
			</div>
		</div>
	);
};

export default Categories;
