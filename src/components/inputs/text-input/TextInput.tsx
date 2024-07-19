/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextInputProps } from "./TextInput.types";
import { useTextInput } from "./useTextInput";

export function TextInput(props: TextInputProps) {
  const {
    validationTrigger,
    validation,
    label,
    type,
    onChange,
    name,
    iconLeft,
    iconRight,
    placeholder,
    ...inputProps
  } = props;

  const {
    inputType,
    handleIconClickAction,
    validationError,
    handleChange,
    parentRef,
  } = useTextInput(props);

  return (
    <div ref={parentRef} className="w-full">
      <label
        htmlFor={name}
        className="flex items-center text-accent-3 text-sm gap-2 mb-1 font-medium"
      >
        {props.label}
      </label>
      <div
        className={
          "relative h-[45px] rounded-xl border bg-accent-6 bg-opacity-30 text-sm overflow-hidden border-gray-200 flex items-center"
        }
      >
        {iconLeft && (
          <button
            className={`my-auto flex pl-1.5 h-full items-center justify-center text-xs text-gray-500 flex-shrink-0`}
            type={"button"}
            onClick={handleIconClickAction}
          >
            {props.iconLeft}
          </button>
        )}
        <input
          {...inputProps}
          className={`block px-5 flex-grow h-full disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-gray-100 text-ellipsis bg-transparent placeholder:text-gray-400 text-black font-semibold`}
          type={inputType}
          onChange={handleChange}
          placeholder={props.placeholder}
        />
        {props.iconRight && (
          <button
            disabled={props.disabled}
            className={`my-auto flex px-1.5 h-full items-center justify-center text-xs text-gray-500 disabled:bg-gray-100 flex-shrink-0`}
            type={"button"}
            onClick={handleIconClickAction}
          >
            {props.iconRight}
          </button>
        )}
      </div>
      {validationError != null && (
        <p className={"leading-none"}>
          <span className={"text-[11px] leading-none font-medium text-red-500"}>
            {validationError}
          </span>
        </p>
      )}
    </div>
  );
}
