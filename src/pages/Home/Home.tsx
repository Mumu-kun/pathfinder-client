import React from "react";
import { Link } from "react-router-dom";
import Categories from "./Categories";
import ChangeTheme from "../../components/ChangeTheme";

const Home: React.FC = () => {
	return (
		<div className="mt-80">
			<Categories />
			{/* <Link
				to="/register"
				className="solid-btn"
			>
				register
			</Link>
			<Link
				to="/login"
				className="solid-btn"
			>
				login
			</Link>
			<Link
				to="/test"
				className="solid-btn"
			>
				Test
			</Link> */}
			<ChangeTheme />
			<Link to="/profile" className="solid-btn">
				Profile
			</Link>
		</div>
	);
};

export default Home;
