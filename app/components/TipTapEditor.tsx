"use client";

import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

export function TipTapEditor({
  setJson,
  json,
}: {
  setJson: (json: JSONContent) => void;
  json: JSONContent | null;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: json ?? "<p>Hello binusian</p>",
    editorProps: {
      attributes: {
        class: "prose",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setJson(json);
    },
  });
  return (
    <div>
      <EditorContent
        editor={editor}
        className="rounded-lg border p-2 min-h-[150px] mt-2 max-w-[585px]"
      />
    </div>
  );
}
