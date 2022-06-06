import React from "react";
import * as Y from "yjs";
import RichMarkdownEditor from "..";
import MultiplayerExtension from "./MultiplayerExtension";
import { WebsocketProvider } from "y-websocket";

const MultiplayerEditor = () => {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(
    "wss://demos.yjs.dev",
    "prosemirror-demo",
    ydoc
  );

  const extensions = [
    new MultiplayerExtension({
      user: "1",
      provider: provider,
      document: ydoc,
    }),
  ];
  return <RichMarkdownEditor extensions={extensions} />;
};

export default MultiplayerEditor;
