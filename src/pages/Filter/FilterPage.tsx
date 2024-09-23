import axios from "@/api/axios";
import Dropdown from "@/components/Dropdown";
import { BaseNumberInputComponent } from "@/components/FormComponents";
import GigCard from "@/components/GigCard";
import Loading from "@/components/Loading";
import Tag from "@/components/Tag";
import { UnlimitLayoutWidth } from "@/components/wrappers/LimitLayoutWidth";
import { GigCardData, Page } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa6";
import { PiSortAscendingThin, PiSortDescendingThin } from "react-icons/pi";
import { TbCurrencyTaka } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useDebounceValue } from "usehooks-ts";

class MyURLSearchParams extends URLSearchParams {
	ifHas(name: string, value?: string) {
		if (super.has(name, value)) return this;
		return undefined;
	}
	ifNotHas(name: string, value?: string) {
		if (!super.has(name, value)) return this;
		return undefined;
	}
	set(name: string, value: string) {
		super.set(name, value);
		return this;
	}
	append(name: string, value: string) {
		super.append(name, value);
		return this;
	}
	delete(name: string, value?: string) {
		super.delete(name, value);
		return this;
	}
	copy() {
		return new MyURLSearchParams(this);
	}
}

const sortOptions: { [key: string]: string } = {
	score: "Recommended",
	totalOrders: "Popular",
	rating: "Rated",
	price: "Priced",
	createdAt: "Created",
};

const FilterPage = () => {
	const { search } = useLocation();
	const navigate = useNavigate();
	const [queryParams, setQueryParams] = useState<MyURLSearchParams>(() => new MyURLSearchParams(search));
	const [debouncedQueryParams] = useDebounceValue(queryParams, 500);

	const [gigs, setGigs] = useState<Page<GigCardData> | undefined>();

	const [categories, setCategories] = useState<string[]>([]);
	const [tags, setTags] = useState<string[]>([]);

	const selectedTags = queryParams.getAll("tags");

	useEffect(() => {
		axios.get("/api/v1/public/categories/all").then((res) => {
			setCategories(res.data);
		});

		axios.get("/api/v1/public/tags/search").then((res) => {
			setTags(res.data);
		});
	}, []);

	const fetchGigs = async () => {
		try {
			const res = await axios.get("/api/v1/public/gigs/search", {
				params: queryParams,
			});

			setGigs(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	const pageNav = (condition: boolean, pageNo: number) => {
		if (!condition) {
			return;
		}

		setQueryParams(queryParams.copy().set("page", pageNo.toString()));
	};

	const pages = useMemo(() => {
		if (!gigs) {
			return [0];
		}

		const start = Math.max(0, gigs.number - 2);
		const end = Math.min(gigs.totalPages, gigs.number + 3);

		return Array.from({ length: end - start }, (_, i) => i + start);
	}, [gigs]);

	useEffect(() => {
		if (search === queryParams.toString()) {
			return;
		}
		setQueryParams(new MyURLSearchParams(search));
	}, [search]);

	useEffect(() => {
		fetchGigs();
		navigate({ search: `?${debouncedQueryParams.toString()}` });
	}, [debouncedQueryParams]);

	if (!gigs) {
		return <Loading />;
	}

	let sort = queryParams.get("sort");
	sort = sort && Object.keys(sortOptions).includes(sort) ? sort : "score";

	let order = queryParams.get("order");
	order = order && ["ASC", "DESC"].includes(order) ? order : "DESC";

	const category = queryParams.get("category");

	return (
		<UnlimitLayoutWidth>
			<div className="mx-auto flex flex-1 flex-col pt-4">
				{queryParams.get("query") ? (
					<div className="mt-4 text-xl font-semibold">Search results for "{queryParams.get("query")}"</div>
				) : selectedTags.length > 0 ? (
					<div className="mt-4 text-xl font-semibold">
						Gigs from{" "}
						{selectedTags.map((tag) => (
							<Tag tag={tag} className="px-2 !text-base" />
						))}
					</div>
				) : null}
				<div className="mx-4 mt-4 grid w-full max-w-[1200px] grid-cols-[repeat(4,auto)_1fr] items-center justify-center gap-4 self-center text-sm max-lg:grid-cols-[repeat(2,auto)_1fr] max-lg:grid-rows-2 max-lg:text-sm max-[480px]:grid-cols-[repeat(2,1fr)]">
					<Select
						options={categories.map((category) => ({ value: category, label: category }))}
						className="w-48"
						value={!!category ? { value: category, label: category } : null}
						onChange={(value) => {
							const newParams = queryParams.copy();

							setQueryParams(value ? newParams.set("category", value.value) : newParams.delete("category"));
						}}
						placeholder="Category"
						classNames={{
							control: () => `!bg-white dark:!bg-dark-bg !border-green-500`,
							option: ({ isFocused, isSelected }) =>
								`${isSelected ? "!bg-green-400" : isFocused ? "!bg-green-400" : "!bg-white dark:!bg-dark-bg"} active:!bg-green-500`,
							input: () => "dark:!text-dark-text",
							singleValue: () => "dark:!text-dark-text",
							menu: () => `!mt-1 !bg-white dark:!bg-dark-bg !z-10`,
						}}
						isClearable
					/>

					<Dropdown
						head={
							<div className="flex select-none items-center justify-between gap-1 rounded border border-green-500 bg-white px-3 py-1.5">
								Tags <FaCaretDown className="h-3 w-3" />
							</div>
						}
						className="w-20 max-lg:col-span-2 max-[480px]:col-span-1"
						noCloseOnClick
					>
						<div
							className="mt-1 grid gap-x-6 gap-y-1 rounded border border-green-500 bg-white px-4 py-3"
							style={{
								gridTemplateColumns: `repeat(3, 1fr)`,
							}}
						>
							{tags.map((tag) => (
								<div className="flex items-center gap-1 text-sm">
									<input
										type="checkbox"
										className="checked:accent-green-400"
										checked={selectedTags.includes(tag)}
										name={tag}
										id={tag}
										onClick={(e) => {
											const newParams = queryParams.copy();
											if (e.currentTarget.checked) {
												newParams.ifNotHas("tags", tag)?.append("tags", tag);
											} else {
												newParams.delete("tags", tag);
											}
											setQueryParams(newParams);
										}}
									/>
									<label htmlFor={tag} className="cursor-pointer">
										{tag}
									</label>
								</div>
							))}
						</div>
					</Dropdown>

					<div className="flex items-center gap-1.5">
						<div className="text-[0.9rem] font-semibold">Rated Above :</div>
						<input
							type="number"
							placeholder="0"
							className={`w-[3.75rem] min-w-0 rounded border border-green-400 bg-white px-2 py-1 focus:rounded-sm focus:outline-green-500 dark:bg-black [&::-webkit-inner-spin-button]:opacity-100`}
							min={0}
							max={5}
							step={0.5}
							onChange={(e) => {
								let val = parseFloat(e.currentTarget.value);

								if (val > 5) {
									e.currentTarget.value = "5";
								} else if (val < 0) {
									e.currentTarget.value = "0";
								}

								val = Math.round(val * 2) / 2;

								const newParams = queryParams.copy();

								setQueryParams(
									!isNaN(val) ? newParams.set("ratingAbove", val.toString()) : newParams.delete("ratingAbove")
								);
							}}
						/>
					</div>

					<div className="flex w-36 items-center lg:mx-4">
						<BaseNumberInputComponent
							type="text"
							placeholder="Budget"
							isGrid
							onChange={(e) => {
								const newParams = queryParams.copy();

								setQueryParams(
									!isNaN(parseFloat(e.currentTarget.value))
										? newParams.set("price", e.currentTarget.value)
										: newParams.delete("price")
								);
							}}
							className="!rounded !py-1"
							leftContent={<TbCurrencyTaka className="mr-1 h-5 w-5" />}
							rightContent={<div className="ml-2 w-max font-medium">/ Hr</div>}
						/>
					</div>

					<div className="ml-auto flex w-52 flex-shrink-0 items-center gap-2 max-sm:col-span-full">
						<Select
							options={Object.entries(sortOptions).map(([key, value]) => ({ value: key, label: value }))}
							value={{ value: sort, label: sortOptions[sort] }}
							onChange={async (option) => {
								if (!option) {
									return;
								}

								setQueryParams(queryParams.copy().set("sort", option.value));
							}}
							className="max-w-full flex-1"
							classNames={{
								control: () => `!bg-white dark:!bg-dark-bg !border-green-500`,
								option: ({ isFocused, isSelected }) =>
									`${isSelected ? "!bg-green-400" : isFocused ? "!bg-green-400" : "!bg-white dark:!bg-dark-bg"} active:!bg-green-500`,
								input: () => "dark:!text-dark-text",
								singleValue: () => "dark:!text-dark-text",
								menu: () => `!mt-1 !bg-white dark:!bg-dark-bg !z-10`,
							}}
						/>
						<div className="flex cursor-pointer items-center rounded border border-green-500 bg-white p-0.5 px-1">
							{order === "DESC" ? (
								<PiSortAscendingThin
									className="h-8 w-8"
									onClick={() => setQueryParams(queryParams.copy().set("order", "ASC"))}
								/>
							) : (
								<PiSortDescendingThin
									className="h-8 w-8"
									onClick={() => setQueryParams(queryParams.copy().set("order", "DESC"))}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="mx-auto my-4 grid grid-cols-3 items-start gap-4 max-[1100px]:grid-cols-2 max-[730px]:grid-cols-1">
					{gigs?.content.map((gig) => <GigCard gig={gig} key={gig.id} />)}
				</div>

				<div className="mb-4 mt-auto flex w-full items-center gap-1 rounded bg-light-secondary px-3 py-2 font-semibold dark:bg-dark-secondary">
					<FaAngleDoubleLeft
						className="hover-effect-no-shadow cursor-pointer"
						size={20}
						onClick={() => pageNav(gigs.number > 0, 0)}
					/>
					<FaAngleLeft
						className="hover-effect-no-shadow mr-auto cursor-pointer"
						size={20}
						onClick={() => pageNav(gigs.number > 0, gigs.number - 1)}
					/>

					{pages.map((i) => (
						<p
							key={i}
							className={`hover-effect cursor-pointer select-none rounded px-2 py-0.5 text-sm ${i === gigs.number ? "bg-green-400 text-white" : "bg-white text-black"}`}
							onClick={() => pageNav(i !== gigs.number, i)}
						>
							{i + 1}
						</p>
					))}

					<FaAngleRight
						className="hover-effect-no-shadow ml-auto cursor-pointer"
						size={20}
						onClick={() => pageNav(!gigs.last, gigs.number + 1)}
					/>
					<FaAngleDoubleRight
						className="hover-effect-no-shadow cursor-pointer"
						size={20}
						onClick={() => pageNav(!gigs.last, gigs.totalPages - 1)}
					/>
				</div>
			</div>
		</UnlimitLayoutWidth>
	);
};

export default FilterPage;
