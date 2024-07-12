import React from "react";
import { Link } from "react-router-dom";
import Intro from "./Intro";

const Home: React.FC = () => {
	return (
		<>
			<Intro />
			<Link
				to="/register"
				className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
			>
				register
			</Link>
			<Link
				to="/login"
				className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
			>
				login
			</Link>
			<Link
				to="/test"
				className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
			>
				Test
			</Link>
		</>
	);
};

export default Home;
