import { Node as ProsemirrorNode } from "prosemirror-model";

export default function isEmptyDoc(doc: ProsemirrorNode<any>): boolean {
  return (
    doc.textContent === "" &&
    doc.content.childCount === 1 &&
    doc.content.firstChild?.type.name === "paragraph"
  );
}
