import { Icon } from "@iconify/react/dist/iconify.js";
import { ModalLayoutProps } from "./ModalLayout.types";

export default function ModalLayout(props: ModalLayoutProps) {
  return (
    <section className="w-full h-dvh bg-black bg-opacity-20 fixed top-0 left-0 flex z-10">
      <div className="m-auto bg-white py-6 px-6 rounded-xl border border-white border-opacity-10 w-full max-w-2xl">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h5 className="text-2xl text-black font-semibold">{props.title}</h5>
            <p className="text-sm text-black text-opacity-50 mt-0">
              {props.description}
            </p>
          </div>
          <button
            className="bg-gray-100 w-8 h-8 rounded-md"
            onClick={props.onClose}
          >
            <Icon icon={"ci:close-lg"} width={14} className="m-auto" />
          </button>
        </div>

        {props.children}
      </div>
    </section>
  );
}
