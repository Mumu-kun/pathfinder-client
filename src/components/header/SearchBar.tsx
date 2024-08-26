import axios from "@/api/axios";
import useAI from "@/hooks/useAi";
import { coverImageUrl } from "@/utils/functions";
import { GigShort } from "@/utils/types";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import Loading from "../Loading";

type SearchBarProps = {
	stuck?: boolean;
	className?: string;
};

const SearchBar = ({ stuck, className: pClassName = "" }: SearchBarProps) => {
	const [searchText, setSearchText] = useState<string>("");
	const [debouncedSearchText] = useDebounceValue(searchText, 500);
	const [gigSuggestions, setGigSuggestions] = useState<GigShort[] | undefined>();
	const [tagSuggestions, setTagSuggestions] = useState<string[] | undefined>();
	const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

	const { getGuideline } = useAI();

	const fetchSearchResults = async () => {
		if (!debouncedSearchText) {
			setGigSuggestions(undefined);
			return;
		}

		try {
			const res = await axios.get("/api/v1/public/gigs/search", {
				params: {
					query: debouncedSearchText,
				},
			});

			setGigSuggestions(res.data.content);
		} catch (error) {
			console.log(error);
		}

		try {
			const res = await axios.get(`/api/v1/public/tags/search`, {
				params: {
					name: debouncedSearchText,
				},
			});

			setTagSuggestions(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		setShowSearchResults(searchText.length > 0);

		if (!searchText) {
			setGigSuggestions(undefined);
		}
	}, [searchText]);

	useEffect(() => {
		fetchSearchResults();
	}, [debouncedSearchText]);

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
						onChange={(e) => {
							setSearchText(e.currentTarget.value);
						}}
						onFocus={() => gigSuggestions && setShowSearchResults(true)}
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

			<div className="absolute z-50 w-full overflow-hidden rounded-md">
				<div
					className={`scrollbar-none ${showSearchResults ? "my-2 max-h-60 border-2" : "max-h-0 border-0"} mx-2 overflow-y-scroll rounded-md border-green-500 bg-light-bg transition-all duration-75 dark:bg-dark-bg`}
				>
					{gigSuggestions || tagSuggestions || searchText.length === 0 ? (
						<div className="flex flex-col" onClick={() => setShowSearchResults(false)}>
							<div
								className="cursor-pointer text-ellipsis text-nowrap px-4 py-2 transition-all first:pt-3 last:pb-3 hover:bg-light-secondary dark:hover:bg-dark-secondary"
								onClick={() => getGuideline(searchText)}
							>
								Get Ai Based Guideline For "{searchText}"
							</div>
							{tagSuggestions && tagSuggestions.length > 0 && (
								<>
									<div className="bg-light-secondary px-4 py-1.5 text-sm font-bold">Tags</div>
									{tagSuggestions.map((tag, index) => (
										<Link
											to={{ pathname: `/filter`, search: `?tags=${tag}` }}
											key={index}
											className="flex cursor-pointer items-center gap-2 text-ellipsis text-nowrap px-4 py-2 transition-all hover:bg-light-secondary dark:hover:bg-dark-secondary"
										>
											{tag}
										</Link>
									))}
								</>
							)}
							{gigSuggestions && (
								<>
									<div className="bg-light-secondary px-4 py-1.5 text-sm font-bold">Gigs</div>
									{gigSuggestions.length > 0 ? (
										<>
											{gigSuggestions.map((gig, index) => (
												<Link
													to={`/gig/${gig.id}`}
													key={index}
													className="flex cursor-pointer items-center gap-2 text-ellipsis text-nowrap px-4 py-2 transition-all hover:bg-light-secondary dark:hover:bg-dark-secondary"
												>
													<img src={coverImageUrl(gig.coverImage)} alt="" className="aspect-[2/1] w-16 object-cover" />
													{gig.title}
												</Link>
											))}
											<Link
												to={`/filter?query=${searchText}`}
												className="cursor-pointer text-ellipsis text-nowrap px-4 py-2 transition-all hover:bg-light-secondary dark:hover:bg-dark-secondary"
											>
												See More
											</Link>
										</>
									) : (
										<div className="cursor-pointer text-ellipsis text-nowrap px-4 py-2 transition-all first:pt-3 last:pb-3 hover:bg-light-secondary dark:hover:bg-dark-secondary">
											No Gigs Found
										</div>
									)}
								</>
							)}
						</div>
					) : (
						<Loading />
					)}
				</div>
			</div>
		</div>
	);
};

export default SearchBar;
