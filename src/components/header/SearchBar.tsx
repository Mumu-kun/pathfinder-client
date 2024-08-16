import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

type SearchBarProps = {
	stuck?: boolean;
	className?: string;
};

const SearchBar = ({ stuck, className: pClassName = "" }: SearchBarProps) => {
	const [searchText, setSearchText] = useState<string>("");
	const [suggestions, setSuggestions] = useState<string[]>([
		"Lorem ipsum dolor sit amet",
		"Consectetur adipiscing elit",
		"Sed do eiusmod tempor incididunt",
		"Ut labore et dolore magna aliqua",
		"Ut enim ad minim veniam",
		"Quis nostrud exercitation ullamco",
	]);
	const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

	useEffect(() => {
		setShowSearchResults(searchText.length > 0);
	}, [searchText]);

	useEffect(() => {
		setShowSearchResults(false);
	}, [stuck]);

	return (
		<div className={`relative ${pClassName}`}>
			<div className="overflow-hidden">
				<div className="m-2 flex items-center gap-2 rounded-md bg-light-bg px-3 ring-2 ring-green-500 transition-all has-[.search-input:focus]:ring-green-700 has-[.search-input:focus]:drop-shadow-glow dark:bg-dark-bg">
					<FaSearch className="cursor-pointer text-green-600 opacity-80 transition-all hover:text-green-400 max-lg:w-3" />
					<div className="my-2 w-0.5 self-stretch rounded-lg bg-green-600 opacity-80"></div>
					<input
						type="text"
						value={searchText}
						onChange={(e) => setSearchText(e.currentTarget.value)}
						className="search-input mx-auto min-w-0 flex-1 bg-light-bg p-2 font-medium outline-none focus:outline-none dark:bg-dark-bg"
					/>
					<div
						className={`overflow-hidden transition-all duration-[50] ${searchText.length > 0 ? "w-5 max-lg:w-3" : "w-0"}`}
					>
						<IoClose
							onClick={() => setSearchText("")}
							className="h-full w-full cursor-pointer text-green-600 opacity-80 transition-all hover:text-green-400"
						/>
					</div>
				</div>
			</div>

			{/* Suggestions */}

			<div className="absolute w-full min-w-96 overflow-hidden rounded-md">
				<div
					className={`scrollbar-none ${showSearchResults ? "my-2 max-h-60 border-2" : "max-h-0 border-0"} mx-2 overflow-y-scroll rounded-md border-green-500 bg-light-bg transition-all duration-75 dark:bg-dark-bg`}
				>
					<div className="flex flex-col">
						{suggestions.map((suggestion, index) => (
							<div
								key={index}
								className="cursor-pointer text-ellipsis text-nowrap px-4 py-2 shadow-md transition-all first:pt-3 last:pt-3 hover:bg-light-secondary dark:hover:bg-dark-secondary"
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
