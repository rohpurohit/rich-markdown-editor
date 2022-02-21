import * as React from "react";
import { dark, light } from "../styles/theme";
import Editor from "..";

const docSearchResults = [
  {
    title: "Hiring",
    subtitle: "Created by Jane",
    url: "/doc/hiring"
  },
  {
    title: "Product Roadmap",
    subtitle: "Created by Tom",
    url: "/doc/product-roadmap"
  },
  {
    title: "Finances",
    subtitle: "Created by Coley",
    url: "/doc/finances"
  },
  {
    title: "Security",
    subtitle: "Created by Coley",
    url: "/doc/security"
  },
  {
    title: "Super secret stuff",
    subtitle: "Created by Coley",
    url: "/doc/secret-stuff"
  },
  {
    title: "Supero notes",
    subtitle: "Created by Vanessa",
    url: "/doc/supero-notes"
  },
  {
    title: "Meeting notes",
    subtitle: "Created by Rob",
    url: "/doc/meeting-notes"
  }
];

class YoutubeEmbed extends React.Component<{
  attrs: any;
  isSelected: boolean;
}> {
  render() {
    const { attrs } = this.props;
    const videoId = attrs.matches[1];

    return (
      <iframe
        className={this.props.isSelected ? "ProseMirror-selectednode" : ""}
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
      />
    );
  }
}

const text = `
<h1 style="text-align: justify;">
    What is a Cell
</h1>
<p style="text-align: justify;">
    In biology, the smallest unit that can live on its own and that makes up all living organisms and the tissues of the body.
    A cell has three main parts: the cell membrane, the nucleus, and the cytoplasm.
    The cell membrane surrounds the cell and controls the substances that go into and out of the cell.
    The nucleus is a structure inside the cell that contains the nucleolus and most of the cell&rsquo;s DNA.
</p>
`;

export default function Example(props) {
  const { body } = document;
  if (body)
    body.style.backgroundColor = props.dark
      ? dark.background
      : light.background;

  return (
    <div style={{ padding: "1em 2em" }}>
      <Editor
        defaultValue={text}
        onCreateLink={title => {
          // Delay to simulate time taken for remote API request to complete
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (title !== "error") {
                return resolve(
                  `/doc/${encodeURIComponent(title.toLowerCase())}`
                );
              } else {
                reject("500 error");
              }
            }, 1500);
          });
        }}
        onSearchLink={async term => {
          // Delay to simulate time taken for remote API request to complete
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(
                docSearchResults.filter(result =>
                  result.title.toLowerCase().includes(term.toLowerCase())
                )
              );
            }, Math.random() * 500);
          });
        }}
        uploadImage={file => {
          // Delay to simulate time taken to upload
          return new Promise(resolve => {
            setTimeout(() => resolve(URL.createObjectURL(file)), 1500);
          });
        }}
        {...props}
      />
    </div>
  );
}
