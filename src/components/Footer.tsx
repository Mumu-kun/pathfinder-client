import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<div className="mt-5 w-full overflow-x-hidden bg-light-secondary py-10 text-light-text dark:bg-dark-secondary dark:text-dark-text">
			<div className="flex-start flex flex-col justify-start lg:flex-row">
				<div className="my-5 flex w-full flex-col items-start justify-start pl-20 lg:w-1/3">
					<p className="small-headings mb-4 ml-0">Browse Popular Categories</p>
					{/* <Link className="normal-text ml-0 underline" to="/filter?category=Basic+Programming">
						Basic Programming
					</Link> */}
					<Link className="normal-text ml-0 underline" to="/filter?category=Data+Structures+and+Algorithms">
						Data Structures and Algorithms
					</Link>
					<Link className="normal-text ml-0 underline" to="/filter?category=Web+Development">
						Web Development
					</Link>
					{/* <Link className="normal-text ml-0 underline" to="/filter?category=Mobile+App+Development">
						Mobile App Development
					</Link> */}
					{/* <Link className="normal-text ml-0 underline" to="/filter?category=Database+Management">
						Database Management
					</Link> */}
					<Link className="normal-text ml-0 underline" to="/filter?category=Software+Engineering">
						Software Engineering
					</Link>
					<Link className="normal-text ml-0 underline" to="/filter?category=Artificial+Intelligence">
						Artificial Intelligence
					</Link>
					<Link className="normal-text ml-0 underline" to="/filter?category=Machine+Learning">
						Machine Learning
					</Link>
					<Link className="normal-text ml-0 underline" to="/filter?category=Cybersecurity">
						Cybersecurity
					</Link>
					{/* <Link className="normal-text ml-0 underline" to="/filter?category=Cloud+Computing">
						Cloud Computing
					</Link> */}
					<Link className="normal-text ml-0 underline" to="/filter?category=DevOps">
						DevOps
					</Link>
					<Link className="normal-text ml-0 underline" to="/filter?category=Computer+Networks">
						Computer Networks
					</Link>

					{/* <Link className="normal-text ml-0 underline" to="/filter?category=Human-Computer+Interaction">
						Human-Computer Interaction
					</Link> */}
					{/* <Link className="normal-text ml-0 underline" to="/filter?category=Computer+Graphics">
						Computer Graphics
					</Link> */}

					{/* <Link className="normal-text ml-0 underline" to="/filter?category=Embedded+Systems">
						Embedded Systems
					</Link> */}
					{/* <Link className="normal-text ml-0 underline" to="/filter?category=Operating+Systems">
						Operating Systems
					</Link> */}
					{/* <Link className="normal-text ml-0 underline" to="/filter?category=Others">
						Others
					</Link> */}
				</div>
				<div className="my-5 flex w-full flex-col items-start justify-start pl-20 lg:w-1/3">
					<p className="small-headings mb-4 ml-0">Community</p>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						Forums
					</Link>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						Events
					</Link>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						Blogs
					</Link>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						Creators
					</Link>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						Invite a Friend
					</Link>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						Become a seller
					</Link>
				</div>
				<div className="my-5 flex w-full flex-col items-start justify-start pl-20 lg:w-1/3">
					<p className="small-headings mb-4 ml-0">Contact us</p>
					<div className="flex items-center justify-center">
						<i className="bx bx-phone normal-text ml-0 text-xl"></i>
						<p className="normal-text ml-0">+8801306231965</p>
					</div>
					<div className="flex items-center justify-center">
						<i className="bx bx-envelope normal-text ml-0 text-xl"></i>
						<p className="normal-text ml-0">contact@pathphindr.com</p>
					</div>
				</div>
				<div className="my-5 flex w-full flex-col items-start justify-start pl-20 lg:w-1/3">
					<p className="small-headings mb-4 ml-0">About pathPhindr</p>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						About
					</Link>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						Blog
					</Link>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						Careers
					</Link>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						Terms & Conditions
					</Link>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						Privacy Policy
					</Link>
					<Link className="normal-text ml-0 text-center underline" to={{ pathname: `/` }}>
						FAQs
					</Link>
				</div>
			</div>

			<hr className="mx-10 h-1 rounded-md border-0 bg-dark-secondary md:my-10 lg:mx-20 dark:bg-light-secondary" />
			<div className="mx-0 mt-5 flex flex-col items-center justify-between px-10 md:mx-10 md:flex-row">
				<div className="flex items-center justify-center">
					<p className="small-headings mr-2">pathPhindr</p>
					<i className="normal-text bx bx-copyright mx-0"></i>
					<p className="px-1 font-bold">2024</p>
					<p className="pr-1 font-bold">pathPhindr Inc.</p>
				</div>
				<div className="flex items-center justify-center">
					<p className="small-headings pr-5">Connect: </p>

					<a
						className="normal-text mx-1 px-1 underline hover:text-indigo-500"
						href=""
						target="_blank"
						rel="noopener noreferrer"
					>
						<i className="bx bxl-facebook-circle normal-text mx-1 px-1 text-xl"></i>
					</a>

					<a
						className="normal-text mx-1 px-1 underline hover:text-indigo-500"
						href=""
						target="_blank"
						rel="noopener noreferrer"
					>
						<i className="bx bxl-instagram normal-text mx-1 px-1 text-xl"></i>
					</a>

					<a
						className="normal-text mx-1 px-1 underline hover:text-indigo-500"
						href=""
						target="_blank"
						rel="noopener noreferrer"
					>
						<i className="bx bxl-linkedin normal-text mx-1 px-1 text-xl"></i>
					</a>

					<a
						className="normal-text mx-1 px-1 underline hover:text-indigo-500"
						href=""
						target="_blank"
						rel="noopener noreferrer"
					>
						<i className="bx bxl-twitter normal-text mx-1 px-1 text-xl"></i>
					</a>
				</div>
			</div>
		</div>
	);
}
