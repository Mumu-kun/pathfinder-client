import axios from "@/api/axios";
import { NumberInputComponent, TextAreaInputComponent, TextInputComponent } from "@/components/FormComponents";
import Loading from "@/components/Loading";
import ZoomableImg from "@/components/misc/ZoomableImg";
import { UnlimitLayoutWidth } from "@/components/wrappers/LimitLayoutWidth";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import GigPage from "@/pages/Gig/GigPage";
import { fullImageUrl, sleep } from "@/utils/functions";
import { Gig } from "@/utils/types";
import { defaultCoverImage } from "@/utils/variables";
import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	CreateLink,
	headingsPlugin,
	InsertThematicBreak,
	linkPlugin,
	listsPlugin,
	ListsToggle,
	MDXEditor,
	MDXEditorMethods,
	quotePlugin,
	thematicBreakPlugin,
	toolbarPlugin,
	UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { isAxiosError } from "axios";
import { ErrorMessage, Field, FieldArray, FieldProps, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { TbCurrencyTaka } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import Creatable from "react-select/creatable";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const getGig = async (id: number) => {
	try {
		const res = await axios.get(`/api/v1/public/gigs/${id}`);

		return res.data;
	} catch (err) {
		console.error(err);
	}
};

const validationSchema = Yup.object().shape({
	title: Yup.string().required("Title is required"),
	category: Yup.string().required("Category is required"),
	tags: Yup.array().of(Yup.string()).min(3, "At least three tags required"),
	description: Yup.string().required("Description is required"),
	offerText: Yup.string().required("Offer is required"),
	price: Yup.number().required("Price is required").min(0, "Price must be greater than 0"),
	faqs: Yup.array()
		.of(
			Yup.object().shape({
				question: Yup.string().required("Question is required"),
				answer: Yup.string().required("Answer is required"),
			})
		)
		.min(1, "At least one FAQ required"),
});

const isDetailsUpdated = (values: Gig, gig: Gig) => {
	return (
		values.title !== gig.title ||
		values.category !== gig.category ||
		JSON.stringify(values.tags) !== JSON.stringify(gig.tags) ||
		values.description !== gig.description ||
		values.offerText !== gig.offerText ||
		values.price !== gig.price ||
		JSON.stringify(values.faqs) !== JSON.stringify(gig.faqs)
	);
};

type props = {
	formType: "create" | "edit";
};

const GigFormPage = ({ formType }: props) => {
	let id: number = Number(useParams().id);
	const { auth } = useAuth();
	const navigate = useNavigate();
	const [gig, setGig] = useState<Gig | undefined>();

	const [editMode, setEditMode] = useState<boolean>(true);
	const axiosPrivate = useAxiosPrivate();

	const [categories, setCategories] = useState<string[]>([]);
	const [tags, setTags] = useState<{ value: string; label: string; disabled?: boolean }[]>([]);

	const descRef = React.useRef<MDXEditorMethods>(null);
	const CTERef = React.useRef<MDXEditorMethods>(null);

	const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
	const [gigVideo, setGigVideo] = useState<File | null>(null);

	const [tagInputText, setTagInputText] = useState<string>("");

	useEffect(() => {
		axiosPrivate.get("/api/v1/public/categories/all").then((res) => {
			setCategories(res.data);
		});

		axiosPrivate.get("/api/v1/public/tags/all").then((res) => {
			const tagOptions = res.data.map((tag: any) => ({ value: tag.name, label: tag.name }));
			tagOptions.push({ value: "newOption", label: "Type to Create New Tag", disabled: true });
			setTags(tagOptions);
		});
	}, []);

	useEffect(() => {
		formType === "edit"
			? getGig(id).then((gig) => {
					setGig(gig);
				})
			: setGig({
					title: "",
					category: "",
					tags: [],
					description: "",
					offerText: "",
					price: undefined,
					faqs: [],
					seller: {
						id: auth?.userId ?? 0,
						firstName: auth?.firstName ?? "",
						lastName: auth?.lastName ?? "",
					},
				} as unknown as Gig);
	}, [id]);

	if (!gig) {
		return <Loading />;
	}

	return (
		<Formik
			initialValues={gig}
			onSubmit={async (values, { validateForm, resetForm }) => {
				validateForm(values);
				const gigRequest = {
					title: values.title,
					category: values.category,
					tags: values.tags,
					description: values.description,
					offerText: values.offerText,
					price: values.price,
					faqs: values.faqs,
				};

				try {
					if (formType === "create") {
						const res = await axiosPrivate.post("/api/v1/gigs/create", gigRequest);
						id = res.data.id;
						toast.success("Gig created successfully");
					} else if (isDetailsUpdated(values, gig)) {
						await axiosPrivate.patch(`/api/v1/gigs/${id}`, gigRequest);
						toast.success("Gig updated successfully");
					} else if (!newCoverImage && !gigVideo) {
						toast.info("No changes made");
						return;
					}

					if (newCoverImage) {
						const formData = new FormData();
						formData.append("file", newCoverImage);
						await axiosPrivate.post(`/api/v1/gigs/${id}/cover-image`, formData, {
							headers: {
								"Content-Type": "multipart/form-data",
							},
						});
						toast.success("Cover image updated successfully");
					}

					if (gigVideo) {
						const formData = new FormData();
						formData.append("file", gigVideo);
						await axiosPrivate.post(`/api/v1/gigs/${id}/gig-video`, formData, {
							headers: {
								"Content-Type": "multipart/form-data",
							},
						});
						toast.success("Gig video updated successfully");
					}

					resetForm();

					if (formType === "create") {
						await sleep(2000);
						navigate(`/manage/gigs`);
					}
				} catch (error) {
					console.error(error);
					if (isAxiosError(error)) {
						if (error.response?.status === 400) {
							toast(error.response.data.message, { type: "error" });
						}

						const fieldErrors: { [key: string]: string } = error.response?.data?.fieldErrors;

						Object.values(fieldErrors).forEach((error) => {
							toast.error(error);
						});
					}
				}
			}}
			validationSchema={validationSchema}
			validateOnBlur
			validateOnChange
			validateOnMount
		>
			{({ isSubmitting, values, setFieldValue, setFieldTouched, errors, touched }) => {
				if (!editMode) {
					return <GigPage gig={{ ...gig, ...values }} setEditMode={setEditMode} />;
				}

				return (
					<>
						<UnlimitLayoutWidth>
							<div className="flex aspect-[6/1] w-full items-center overflow-hidden">
								<ZoomableImg
									src={
										values.gigCoverImage
											? values.gigCoverImage.startsWith("data:image/")
												? values.gigCoverImage
												: fullImageUrl(values.gigCoverImage)
											: defaultCoverImage
									}
									alt={values.title}
									className="w-full overflow-hidden object-cover"
								/>
							</div>
						</UnlimitLayoutWidth>
						<div className="-mt-[2vw] flex justify-between gap-4">
							<label htmlFor="coverImage" className="outline-btn">
								Set/Change Cover Image
								<input
									type="file"
									id="coverImage"
									hidden
									onChange={(e) => {
										const file = e.target.files![0];

										if (!file.type.startsWith("image/")) {
											setNewCoverImage(null);
											toast.error("Invalid file type. Please select an image file.");
											return;
										}

										if (file.size > 3145728) {
											setNewCoverImage(null);
											toast.error("File size must be less than 3MB.");
											return;
										}

										setNewCoverImage(file);

										const fileReader = new FileReader();
										fileReader.onload = () => {
											if (fileReader.readyState === 2) {
												setFieldValue("gigCoverImage", fileReader.result);
											}
										};
										fileReader.readAsDataURL(file);
									}}
								/>
							</label>
							<button className="solid-btn" onClick={() => setEditMode(false)}>
								Preview
							</button>
						</div>

						<Form className="my-8 grid grid-cols-[max-content_auto] place-items-start gap-x-8 gap-y-4">
							<Field
								isGrid
								isFullWidth
								name="title"
								placeholder="Title"
								label="Title"
								component={TextInputComponent}
								className="max-w-[30rem]"
							/>
							<Field name="category">
								{({ field }: FieldProps<any>) => (
									<>
										<label htmlFor="category" className={`flex items-center gap-1 self-center font-semibold`}>
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
													control: () => `!bg-white dark:!bg-dark-bg !border-green-500`,
													option: ({ isFocused, isSelected }) =>
														`${isSelected ? "!bg-green-400" : isFocused ? "!bg-green-400" : "!bg-white dark:!bg-dark-bg"} active:!bg-green-500`,
													input: () => "dark:!text-dark-text",
													singleValue: () => "dark:!text-dark-text",
													menu: () => `!bg-white dark:!bg-dark-bg !z-10`,
												}}
											/>
										</div>
										<ErrorMessage name="category">
											{(msg) =>
												typeof msg === "string" && (
													<>
														<div></div>
														<div className="col-span-full text-sm font-medium text-red-500">{msg}</div>
													</>
												)
											}
										</ErrorMessage>
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
												inputValue={tagInputText}
												onInputChange={(input) => setTagInputText(input.replace(/[^a-zA-Z0-9 ]/g, ""))}
												isOptionDisabled={(option) => option.disabled ?? false}
												className="max-w-52"
												classNames={{
													control: () => `!bg-white dark:!bg-dark-bg !border-green-500`,
													option: ({ isFocused, isDisabled }) =>
														`${isDisabled ? "!bg-light-bg dark:!bg-dark-bg" : isFocused ? "!bg-green-400" : ""} active:!bg-green-500`,
													input: () => "dark:!text-dark-text",
													singleValue: () => "dark:!text-dark-text",
													menu: () => `!bg-white dark:!bg-dark-bg !z-10`,
												}}
											/>
											<div className="mt-2 flex flex-wrap gap-y-2">
												{values.tags.map((tag, index) => (
													<div
														className={`mr-2 flex w-fit cursor-default items-center gap-1 rounded-sm border-2 border-dashed border-green-400 bg-white px-1 py-0.5 text-xss font-medium text-green-600 hover:border-solid dark:bg-dark-secondary`}
														key={tag}
													>
														{tag}
														<FaMinus
															onClick={() => arrayHelpers.remove(index)}
															className="h-4 w-4 cursor-pointer rounded border-2 border-green-500 p-0.5"
														/>
													</div>
												))}
											</div>
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
								label="Gig Video"
								name="_"
								type="file"
								className="outline-btn max-w-80 py-1 file:hidden"
								onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
									const file = e.target.files![0];

									setFieldValue("gigVideo", undefined);
									setFieldTouched("gigVideo", true);

									if (!file) {
										setGigVideo(null);
										return;
									}

									if (["video/mp4", "video/webm"].indexOf(file.type) === -1) {
										toast.error("Please select a .mp4 or .webm video file.");

										setGigVideo(null);
										e.target.value = "";
										return;
									}

									if (file.size > 1024 * 1024 * 100) {
										toast.error("File size must be less than 100MB.");

										setGigVideo(null);
										e.target.value = "";
										return;
									}

									setGigVideo(file);

									const fileReader = new FileReader();
									fileReader.onload = () => {
										if (fileReader.readyState === 2) {
											setFieldValue("gigVideo", fileReader.result);
										}
									};
									fileReader.readAsDataURL(file);
								}}
								component={TextInputComponent}
								noShowError
							/>
							<ErrorMessage name={"gigVideo"}>
								{(msg) => <div className="col-start-2 text-sm text-red-500">{msg}</div>}
							</ErrorMessage>
							{!!values.gigVideo && (
								<video src={values.gigVideo} controls className="col-start-2 w-full max-w-[30rem]"></video>
							)}

							<Field name="description">
								{({ field }: FieldProps<any>) => (
									<>
										<label htmlFor="description" className={`flex items-center gap-1 font-semibold`}>
											<span>Description</span>
											<span>:</span>
										</label>
										<MDXEditor
											ref={descRef}
											markdown={field.value}
											plugins={[
												headingsPlugin({
													allowedHeadingLevels: [2, 3, 4],
												}),
												listsPlugin(),
												quotePlugin(),
												thematicBreakPlugin(),
												linkPlugin(),
												toolbarPlugin({
													toolbarContents: () => (
														<div className="z-0 flex flex-wrap gap-y-2">
															<UndoRedo />
															<BoldItalicUnderlineToggles />
															<BlockTypeSelect />
															<div className="flex">
																<ListsToggle options={["bullet", "number"]} />
																<InsertThematicBreak />
																<CreateLink />
															</div>
														</div>
													),
												}),
											]}
											onChange={(md) => {
												if (!md) {
													md = "";
												}
												field.onChange({ target: { value: md, name: field.name } });
											}}
											contentEditableClassName={`prose prose-sm dark:prose-invert min-h-[10rem] max-w-[43.5rem]`}
											className="w-full max-w-[43.5rem] rounded-md border border-green-500 bg-white shadow dark:bg-dark-secondary"
										/>
										<ErrorMessage name="description">
											{(msg) =>
												typeof msg === "string" && (
													<>
														<div></div>
														<div className="text-sm font-medium text-red-500">{msg}</div>
													</>
												)
											}
										</ErrorMessage>
									</>
								)}
							</Field>

							<Field name="offerText">
								{({ field }: FieldProps<any>) => (
									<>
										<label htmlFor="offerText" className={`flex items-center gap-1 font-semibold`}>
											<span>Offer</span>
											<span>:</span>
										</label>
										<MDXEditor
											ref={CTERef}
											markdown={values.offerText ?? " "}
											plugins={[
												headingsPlugin({ allowedHeadingLevels: [4] }),
												listsPlugin(),
												toolbarPlugin({
													toolbarContents: () => (
														<>
															<BoldItalicUnderlineToggles options={["Bold", "Underline"]} />
															<BlockTypeSelect />
															<ListsToggle options={["bullet"]} />
														</>
													),
												}),
											]}
											onChange={(md) => {
												if (!md) {
													md = "";
												}
												field.onChange({ target: { value: md, name: field.name } });
											}}
											contentEditableClassName={`px-4 prose prose-sm dark:prose-invert min-h-[10rem] max-w-[18rem]`}
											className="rounded-md border border-green-500 bg-white shadow dark:bg-dark-secondary"
										/>
										<ErrorMessage name="offerText">
											{(msg) => (
												<>
													<div></div>
													<div className="text-sm font-medium text-red-500">{msg}</div>
												</>
											)}
										</ErrorMessage>
									</>
								)}
							</Field>

							<Field
								isGrid
								name="price"
								placeholder="Hourly Rate"
								component={NumberInputComponent}
								label="Hourly Rate"
								leftContent={<TbCurrencyTaka className="mr-1 h-5 w-5" />}
								rightContent={<div className="ml-2 w-max font-medium">/ Hr</div>}
							/>

							<FieldArray name="faqs">
								{(arrayHelpers) => (
									<>
										<label htmlFor={"faqs"} className={`flex items-center gap-1 font-semibold`}>
											<span>FAQs</span>
											<span>:</span>
										</label>
										<div className="grid w-full max-w-[40rem] grid-cols-[1fr,max-content] gap-x-3 gap-y-1">
											{values.faqs?.map((_, index) => (
												<div className="col-span-full grid grid-cols-subgrid gap-y-1" key={`faq-${index}`}>
													<Field
														isGrid
														isFullWidth
														name={`faqs.${index}.question`}
														placeholder="Question"
														component={TextInputComponent}
														noShowError
													/>
													<FaMinus
														onClick={() => arrayHelpers.remove(index)}
														className="outline-btn h-5 w-5 cursor-pointer rounded p-0.5"
													/>
													<ErrorMessage name={`faqs.${index}.question`}>
														{(msg) => <div className="col-span-full text-sm text-red-500">{msg}</div>}
													</ErrorMessage>
													<Field
														isGrid
														isFullWidth
														name={`faqs.${index}.answer`}
														placeholder="Answer"
														component={TextAreaInputComponent}
														noShowError
													/>
													<div></div>

													<ErrorMessage name={`faqs.${index}.answer`}>
														{(msg) => <div className="col-span-full text-sm text-red-500">{msg}</div>}
													</ErrorMessage>
												</div>
											))}
											<FaPlus
												onClick={() =>
													arrayHelpers.push({
														question: "",
														answer: "",
													})
												}
												className="outline-btn col-start-1 my-1 h-5 w-5 cursor-pointer rounded p-0.5"
											/>
											<ErrorMessage name="faqs">
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
							<button type="submit" className="solid-btn col-span-full justify-self-center" disabled={isSubmitting}>
								{formType === "edit" ? "Save Changes" : "Create Gig"}
							</button>
						</Form>
					</>
				);
			}}
		</Formik>
	);
};

export default GigFormPage;
