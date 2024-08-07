type LabeledInputProps = {
	label: string;
	name: string;
	type: React.HTMLInputTypeAttribute;
	defaultValue?: string;
	isFullWidth?: boolean;
	isGrid?: boolean;
	disabled?: boolean;
	className?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const LabeledInput = ({
	label,
	name,
	type,
	defaultValue,
	isGrid = false,
	isFullWidth = false,
	disabled = false,
	className: pClassName = "",
	onChange,
}: LabeledInputProps) => {
	return (
		<>
			<label htmlFor={name} className={`flex items-center ${isGrid ? "justify-between" : ""} gap-1 font-semibold`}>
				<span>{label}</span>
				<span>:</span>
			</label>
			<input
				type={type}
				id={name}
				name={name}
				placeholder={label}
				defaultValue={defaultValue}
				onChange={onChange}
				className={`min-w-0 rounded-sm border border-green-400 px-2 py-0.5 focus:rounded-sm focus:outline-green-500 dark:bg-dark-secondary ${isFullWidth ? "" : "max-w-60"} ${disabled ? "bg-gray-200 dark:bg-gray-800" : ""} ${pClassName}`}
				disabled={disabled}
			/>
		</>
	);
};

export default LabeledInput;
