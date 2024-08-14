import { ErrorMessage, FieldProps } from "formik";
import { useEffect, useRef, useState } from "react";

type InputComponentProps = {
	label?: string;
	type: React.HTMLInputTypeAttribute;
	isFullWidth?: boolean;
	isGrid?: boolean;
	disabled?: boolean;
	className?: string;
	noShowError?: boolean;
	rightContent?: React.ReactNode;
};

export const TextInputComponent = ({
	label,
	type = "text",
	isGrid = false,
	isFullWidth = false,
	disabled = false,
	className: pClassName = "",
	noShowError = false,
	field,
	form,
	...props
}: InputComponentProps & FieldProps) => {
	return (
		<>
			{label && (
				<label
					htmlFor={field.name}
					className={`flex items-center py-0.5 font-semibold ${isGrid ? "" : "mb-2 text-sm"} gap-1 max-md:text-sm`}
				>
					<span>{label}</span>
					<span>:</span>
				</label>
			)}
			<div className={`${isFullWidth ? "w-full" : "max-w-60"} ${isGrid ? "" : "mb-4"}`}>
				<input
					id={field.name}
					type={type}
					{...field}
					{...props}
					disabled={disabled}
					className={`w-full min-w-0 rounded-sm border border-green-400 bg-light-bg px-2 py-0.5 focus:rounded-sm focus:outline-green-500 dark:bg-dark-bg ${disabled ? "bg-gray-200 dark:bg-gray-800" : ""} ${pClassName}`}
				/>
				{!noShowError && (
					<ErrorMessage name={field.name}>
						{(msg) => <div className="col-span-full text-sm font-medium text-red-500">{msg}</div>}
					</ErrorMessage>
				)}
			</div>
		</>
	);
};

export const NumberInputComponent = ({
	label,
	isGrid = false,
	isFullWidth = false,
	disabled = false,
	noShowError = false,
	className: pClassName = "",
	rightContent,
	field,
	form,
	...props
}: InputComponentProps & FieldProps) => {
	const [inputState, setInputState] = useState<{ value: string; caret: number }>({ value: "", caret: 0 });

	const inputRef = useRef<HTMLInputElement>(null);

	const removeInvalidCharacters = (text: string, selectionStart: number | null) => {
		const regex = /\D+/g;

		let ret: [string, number] = [text.replace(regex, ""), selectionStart ? selectionStart : 0];

		if (text.match(regex)) {
			ret = [text.replace(regex, ""), selectionStart ? selectionStart - 1 : 0];
		}

		return ret;
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const [value, caret] = removeInvalidCharacters(e.target.value, e.target.selectionStart);

		setInputState({ value, caret });
		e.currentTarget.value = value;
		field.onChange(e);
	};

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.selectionEnd = inputRef.current.selectionStart = inputState.caret;
		}
	}, [inputState]);

	return (
		<>
			{label && (
				<label
					htmlFor={field.name}
					className={`flex items-center py-0.5 ${isGrid ? "" : "mb-2 text-sm"} gap-1 font-semibold max-md:text-sm`}
				>
					<span>{label}</span>
					<span>:</span>
				</label>
			)}
			<div className={`${isFullWidth ? "w-full" : "max-w-60"} ${isGrid ? "" : "mb-4"}`}>
				<div className="flex items-center">
					<input
						id={field.name}
						{...field}
						{...props}
						onChange={handleInput}
						disabled={disabled}
						className={`w-full min-w-0 flex-1 rounded-sm border border-green-400 bg-light-bg px-2 py-0.5 focus:rounded-sm focus:outline-green-500 dark:bg-dark-bg ${disabled ? "bg-gray-200 dark:bg-gray-800" : ""} ${pClassName}`}
					/>
					{rightContent}
				</div>
				{!noShowError && (
					<ErrorMessage name={field.name}>
						{(msg) => <div className="col-span-full text-sm font-medium text-red-500">{msg}</div>}
					</ErrorMessage>
				)}
			</div>
		</>
	);
};

export const TextAreaInputComponent = ({
	label,
	type = "text",
	isGrid = false,
	isFullWidth = false,
	disabled = false,
	noShowError = false,
	className: pClassName = "",
	field,
	form,
	...props
}: InputComponentProps & FieldProps) => {
	return (
		<>
			{label && (
				<label
					htmlFor={field.name}
					className={`flex items-center py-0.5 ${isGrid ? "" : "mb-2 text-sm"} gap-1 font-semibold max-md:text-sm`}
				>
					<span>{label}</span>
					<span>:</span>
				</label>
			)}
			<div className={`${isFullWidth ? "w-full" : "max-w-60"} ${isGrid ? "" : "mb-4"}`}>
				<textarea
					id={field.name}
					{...field}
					{...props}
					disabled={disabled}
					className={`w-full min-w-0 rounded-sm border border-green-400 bg-light-bg px-2 py-0.5 focus:rounded-sm focus:outline-green-500 dark:bg-dark-bg ${disabled ? "bg-gray-200 dark:bg-gray-800" : ""} ${pClassName}`}
				></textarea>
				{!noShowError && (
					<ErrorMessage name={field.name}>
						{(msg) => <div className="col-span-full text-sm font-medium text-red-500">{msg}</div>}
					</ErrorMessage>
				)}
			</div>
		</>
	);
};
