import axios from "@/api/axios";
import Carousel from "@/components/Carousel";
import { NumberInputComponent, TextAreaInputComponent, TextInputComponent } from "@/components/FormComponents";
import GigCard from "@/components/GigCard";
import Loading from "@/components/Loading";
import { GigCardData } from "@/utils/types";
import { ErrorMessage, Field, FieldArray, FieldProps, Form, Formik } from "formik";
import { SingleValue } from "node_modules/react-select/dist/declarations/src";
import { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Modal } from "react-responsive-modal";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { TbCurrencyTaka } from "react-icons/tb";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import * as Yup from "yup";

type ProfileGigsProps = {
	gigs: GigCardData[] | undefined;
	refreshGigs: () => void;
	isOwnerProfile: boolean;
};

const ProfileGigs = ({ gigs, refreshGigs, isOwnerProfile }: ProfileGigsProps) => {
	const [formOpen, setFormOpen] = useState(false);

	if (!gigs) {
		return <Loading />;
	}

	const closeForm = () => {
		setFormOpen(false);
	};
	return (
		<div className="mt-8">
			{gigs.length > 0 && (
				<>
					<div className="mb-2 flex items-center text-xl font-semibold">Gigs from this Mentor</div>
					<Carousel>
						{gigs.map((value) => (
							<GigCard gig={value} key={`profileGig-${value.id}`} />
						))}
					</Carousel>
				</>
			)}
			{isOwnerProfile && (
				<>
					<button
						className="solid-btn ml-8 mt-2"
						onClick={() => {
							setFormOpen(true);
						}}
					>
						Create a New Gig
					</button>
					<Modal
						open={formOpen}
						onClose={closeForm}
						closeIcon={<IoCloseCircleOutline className="h-6 w-6" />}
						classNames={{
							modalContainer: "!overflow-x-auto px-8",
							modal: "rounded !p-12 dark:!bg-dark-secondary !max-w-[40rem] !mx-0 w-full",
						}}
						center
					>
						<GigCreateForm {...{ refreshGigs }} />
					</Modal>
				</>
			)}
		</div>
	);
};

export default ProfileGigs;

const GigCreateForm = ({ refreshGigs }: { refreshGigs: () => void }) => {
	const initialValues: {
		title: string;
		description: string;
		price: number | null;
		category: string;
		tags: string[];
	} = { title: "", description: "", price: null, category: "", tags: [] };
	const [categories, setCategories] = useState<string[]>([]);
	const [tags, setTags] = useState<{ value: string; label: string; disabled?: boolean }[]>([]);

	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		axios.get("/api/v1/public/categories/all").then((res) => {
			setCategories(res.data);
		});

		axios.get("/api/v1/public/tags/all").then((res) => {
			console.log(res);

			const tagOptions = res.data.map((tag: any) => ({ value: tag.name, label: tag.name }));
			tagOptions.push({ value: "newOption", label: "Type to Create New Tag", disabled: true });
			setTags(tagOptions);
		});
	}, []);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={async (values, { resetForm }) => {
				console.log(values);

				try {
					const res = await axiosPrivate.post("/api/v1/gigs/create", values);
					console.log(res);

					refreshGigs();
					resetForm();
					toast.success("Gig Created Successfully");
				} catch (error) {
					console.error(error);
					if (isAxiosError(error)) {
						const fieldErrors: { [key: string]: string } = error.response?.data?.fieldErrors;

						Object.values(fieldErrors).forEach((error) => {
							toast.error(error);
						});
					}
				}
			}}
			validationSchema={Yup.object({
				title: Yup.string().required("Title is required"),
				description: Yup.string().required("Description is required"),
				price: Yup.number().required("Price is required"),
				category: Yup.string().required("Category is required"),
				tags: Yup.array().of(Yup.string()).min(1, "At least one tag is required"),
			})}
		>
			{({ isSubmitting, values }) => (
				<Form className="grid grid-cols-[max-content_auto] place-items-start gap-x-8 gap-y-4 pr-4">
					<Field isGrid isFullWidth name="title" placeholder="Title" component={TextInputComponent} label="Title" />
					<Field name="category">
						{({ field }: FieldProps<any>) => (
							<>
								<label htmlFor="category" className={`flex items-center gap-1 font-semibold`}>
									<span>Category</span>
									<span>:</span>
								</label>
								<div className="w-full">
									<Select
										value={field.value ? { value: field.value, label: field.value } : null}
										options={categories.map((category) => ({ value: category, label: category }))}
										onChange={(option: SingleValue<{ value: string; label: string }>) => {
											if (option) {
												field.onChange({ target: { value: option.value, name: field.name } });
											}
										}}
										className="max-w-60"
										classNames={{
											control: () =>
												`!bg-light-bg dark:!bg-dark-bg border-green-500 hover:!border-green-500 focus:!border-green-500 focus:!outline-none`,
											option: ({ isFocused, isSelected }) =>
												`${isSelected ? "!bg-green-400" : isFocused ? "!bg-green-400" : "!bg-light-bg dark:!bg-dark-bg"} active:!bg-green-500`,
											input: () => "dark:!text-dark-text",
											singleValue: () => "dark:!text-dark-text",
											menu: () => `!bg-light-bg dark:!bg-dark-bg `,
										}}
									/>
									<ErrorMessage name="category">
										{(msg) =>
											typeof msg === "string" && (
												<div className="col-span-full text-sm font-medium text-red-500">{msg}</div>
											)
										}
									</ErrorMessage>
								</div>
							</>
						)}
					</Field>

					<FieldArray name="tags">
						{(arrayHelpers) => (
							<>
								<label htmlFor={"tags"} className={`flex items-center gap-1 font-semibold`}>
									<span>Tags</span>
									<span>:</span>
								</label>
								<div className="w-full">
									<Creatable
										value={null}
										options={tags}
										placeholder="Select or Create"
										onChange={(option: SingleValue<{ value: string; label: string; disabled?: boolean }>) => {
											if (option) {
												const idx = values.tags.indexOf(option.value);
												if (idx === -1) {
													arrayHelpers.push(option.value);
												}
											}
										}}
										isOptionDisabled={(option) => option.disabled ?? false}
										className="max-w-52"
										classNames={{
											control: () =>
												`!bg-light-bg dark:!bg-dark-bg border-green-500 hover:!border-green-500 focus:!border-green-500 focus:!outline-none`,
											option: ({ isFocused, isDisabled }) =>
												`${isDisabled ? "!bg-light-bg dark:!bg-dark-bg" : isFocused ? "!bg-green-400" : ""} active:!bg-green-500`,
											input: () => "dark:!text-dark-text",
											menu: () => `!bg-light-bg dark:!bg-dark-bg`,
										}}
									/>
									{values.tags.map((tag, index) => (
										<div className="mt-2 flex flex-wrap">
											<div
												className={`mr-2 flex w-fit cursor-default items-center gap-1 rounded-sm border-2 border-dashed border-green-400 bg-white px-1 py-0.5 text-xss font-medium text-green-600 hover:border-solid dark:bg-dark-secondary`}
											>
												{tag}
												<FaMinus
													onClick={() => arrayHelpers.remove(index)}
													className="h-4 w-4 cursor-pointer rounded border-2 border-green-500 p-0.5"
												/>
											</div>
										</div>
									))}
									<ErrorMessage name="tags">
										{(msg) =>
											typeof msg === "string" && (
												<div className="col-span-full text-sm font-medium text-red-500">{msg}</div>
											)
										}
									</ErrorMessage>
								</div>
							</>
						)}
					</FieldArray>

					<Field
						isGrid
						name="description"
						placeholder="Description"
						component={TextAreaInputComponent}
						label="Description"
						isFullWidth
						className="min-h-[16rem]"
					/>
					<Field
						isGrid
						name="price"
						placeholder="Hourly Rate"
						component={NumberInputComponent}
						label="Hourly Rate"
						rightContent={
							<>
								<TbCurrencyTaka className="ml-2 h-5 w-5" />
								<div className="w-max font-medium">/ Hr</div>
							</>
						}
					/>

					<button type="submit" className="solid-btn col-span-full justify-self-center" disabled={isSubmitting}>
						Create Gig
					</button>
				</Form>
			)}
		</Formik>
	);
};
