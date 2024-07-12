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
				<div className="has-[.search-input:focus]:drop-shadow-glow m-2 flex items-center gap-3 rounded-md bg-white px-4 shadow-md ring-2 ring-blue-500 transition-all has-[.search-input:focus]:ring-blue-700">
					<FaSearch className="cursor-pointer text-blue-600 opacity-80 transition-all hover:text-blue-400" />
					<div className="my-2 w-0.5 self-stretch rounded-lg bg-blue-600 opacity-80"></div>
					<input
						type="text"
						value={searchText}
						onChange={(e) => setSearchText(e.currentTarget.value)}
						className="search-input mx-auto flex-1 py-2 font-medium text-gray-700 focus:outline-none"
					/>
					<div className={`overflow-hidden transition-all duration-[50] ${searchText.length > 0 ? "w-5" : "w-0"}`}>
						<IoClose className="h-full w-full cursor-pointer text-blue-600 opacity-80 transition-all hover:text-blue-400" />
					</div>
				</div>
			</div>

			{/* Suggestions */}

			<div className="absolute w-full overflow-hidden">
				<div
					className={`scrollbar-none ${!!searchText ? "my-2 max-h-60" : "max-h-0"} mx-2 overflow-y-scroll rounded-md ring-2 ring-blue-500 transition-all`}
				>
					<div className="flex flex-col">
						{suggestions.map((suggestion, index) => (
							<div
								key={index}
								className="cursor-pointer text-ellipsis text-nowrap bg-white px-4 py-2 shadow-md transition-all first:pt-3 last:pt-3 hover:bg-blue-50"
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
