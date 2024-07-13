import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const Categories: React.FC = () => {
	const [categories, setCategories] = useState<string[]>([]);

	useEffect(() => {
		// Fetch categories
		try {
			axios.get("/api/v1/public/categories/all").then((res) => {
				console.log(res.data);
				setCategories(res.data);
			});
		} catch (err) {
			console.error(err);
		}
		console.log(categories);
	}, []);

	return (
		<div className="p-10">
			<p className="small-headings">Browser Popular Categories</p>
			<div className="overflow-x-auto whitespace-nowrap flex flex-nowrap space-x-4 p-2">
				{categories.map((category) => (
					<div key={category} className="category normal-text rounded-lg bg-gray-200 px-4 py-2">
						{category} {"->  "}
					</div>
				))}
			</div>
		</div>
	);
};

export default Categories;
