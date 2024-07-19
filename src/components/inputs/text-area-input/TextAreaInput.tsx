/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputProps } from "../__base__/Inputs.types";
import { useInput } from "../__base__/useInput";

export default function TextAreaInput(props: InputProps<HTMLTextAreaElement>) {
  const { handleChange, parentRef } = useInput(props);
  const { onChange, validationTrigger, validation, label, ...inputProps } =
    props;
  // function handleEditorError(error: Error, editor: LexicalEditor) {
  //   console.log("An error occurred in editor", error, editor);
  // }

  // function handleChange(editor: EditorState) {
  //   props.onChange({
  //     value: JSON.stringify(editor.toJSON()),
  //     field: props.name,
  //   });
  // }

  return (
    <div ref={parentRef} className="w-full">
      <label
        className="flex items-center text-accent-3 text-sm font-medium gap-2 mb-1"
        htmlFor={props.id ?? props.name}
      >
        {props.label}
      </label>

      <textarea
        {...inputProps}
        onChange={handleChange}
        className="block px-5 py-3 min-h-[0px] w-full disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-gray-100 text-ellipsis bg-transparent placeholder:text-gray-400 text-black font-semibold text-sm border-gray-200 border rounded-lg"
      />

      {/* <div className="relative">
        <LexicalComposer
          initialConfig={{
            editorState: props.value ? (props.value as string) : null,
            namespace: "MessageArea",
            onError: handleEditorError,
          }}
        >
          <PlainTextPlugin
            contentEditable={
              <ContentEditable className="bg-accent-6 bg-opacity-30 min-h-[100px] text-xs max-h-[350px] sm:max-h-[300px] border border-accent-5 overflow-auto rounded-lg p-4 text-accent-2 font-medium" />
            }
            placeholder={
              <span className="text-sm text-gray-400 font-semibold absolute top-4 left-4 pointer-events-none">
                {props.placeholder}
              </span>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
        </LexicalComposer>
      </div> */}
    </div>
  );
}
