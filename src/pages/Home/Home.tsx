import React from "react";
import { Link } from "react-router-dom";
import Categories from "./Categories";
import ChangeTheme from "../../components/ChangeTheme";
import { UnlimitLayoutWidth } from "@/components/wrappers/LimitLayoutWidth";
import Intro from "./Intro";

const Home: React.FC = () => {
	return (
		<>
			<UnlimitLayoutWidth>
				<Intro />
			</UnlimitLayoutWidth>
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
		</>
	);
};

export default Home;
