import { DropDownControllerProps } from "./DropDownController.types";
import useDropDownController from "./useDropDownController";

export default function DropDownController(props: DropDownControllerProps) {
  const h = useDropDownController(props);
  return (
    <div
      ref={h.dropDownRef as never}
      className={props.fit ? "relative max-w-max" : "relative w-full"}
    >
      <button
        onClick={h.toggleOptionsOpen}
        type="button"
        className="w-full"
        style={{ textAlign: "unset" }}
      >
        {props.children}
      </button>

      {h.isOptionsOpen && (
        <ul
          className="absolute bg-white border border-gray-200 rounded-md z-20 shadow-xl w-full max-h-[210px] overflow-auto"
          style={{
            top: props.top ?? undefined,
            bottom: props.bottom ?? undefined,
            right: props.right ?? undefined,
            left: props.left ?? undefined,
            minWidth: props.width ?? 180,
          }}
        >
          {(!props.options || props.options.length === 0) && (
            <li className="text-gray-400 text-xs text-center py-3 px-5">
              No options at this moment.
            </li>
          )}

          {props.options?.map((option) => (
            <li
              key={option.id}
              className="py-2.5 px-3 hover:bg-gray-50 bg-opacity-0 text-sm font-semibold flex items-start gap-2.5 cursor-pointer border-gray-100 border-b last:border-none"
              onClick={() => h.handleOptionClick(option)}
            >
              {option.icon}
              <div>
                {option.description ? (
                  <p className="text-sm">{option.name}</p>
                ) : (
                  <span>{option.name}</span>
                )}

                {option.description && (
                  <span className="block mt-1 font-medium text-stone-800">
                    {option.description}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
