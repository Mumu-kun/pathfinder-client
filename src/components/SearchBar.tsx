import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const SearchBar = () => {
	const [searchText, setSearchText] = useState<string>("");
	const [suggestions, setSuggestions] = useState<string[]>([
		"Lorem ipsum dolor sit amet",
		"Consectetur adipiscing elit",
		"Sed do eiusmod tempor incididunt",
		"Ut labore et dolore magna aliqua",
		"Ut enim ad minim veniam",
		"Quis nostrud exercitation ullamco",
	]);

	return (
		<div className="relative">
			<div className="overflow-hidden">
				<div className="m-2 flex items-center gap-3 rounded-md px-4 shadow-md ring-2 ring-green-500 transition-all has-[.search-input:focus]:ring-green-700 has-[.search-input:focus]:drop-shadow-glow">
					<FaSearch className="cursor-pointer text-green-600 opacity-80 transition-all hover:text-green-400" />
					<div className="my-2 w-0.5 self-stretch rounded-lg bg-green-600 opacity-80"></div>
					<input
						type="text"
						value={searchText}
						onChange={(e) => setSearchText(e.currentTarget.value)}
						className="search-input bg-light-secondary dark:bg-dark-secondary mx-auto flex-1 p-2 font-medium focus:outline-none outline-none"
					/>
					<div className={`overflow-hidden transition-all duration-[50] ${searchText.length > 0 ? "w-5" : "w-0"}`}>
						<IoClose
							onClick={() => setSearchText("")}
							className="h-full w-full cursor-pointer text-green-600 opacity-80 transition-all hover:text-green-400"
						/>
					</div>
				</div>
			</div>

			{/* Suggestions */}

			<div className="dark:bg-dark-bg bg-light-bg absolute w-full overflow-hidden rounded-md">
				<div
					className={`scrollbar-none ${!!searchText ? "my-2 max-h-60" : "max-h-0"} mx-2 overflow-y-scroll rounded-md ring-2 ring-green-500 transition-all`}
				>
					<div className="flex flex-col">
						{suggestions.map((suggestion, index) => (
							<div
								key={index}
								className="hover:bg-light-secondary dark:hover:bg-dark-secondary cursor-pointer text-ellipsis text-nowrap px-4 py-2 shadow-md transition-all first:pt-3 last:pt-3"
							>
								{suggestion}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchBar;
