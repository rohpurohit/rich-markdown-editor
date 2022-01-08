import React from "react";

const YoutubeEmbed = ({
  attrs,
  isSelected,
}): React.ReactElement<{
  attrs: any;
  isSelected: boolean;
}> => {
  const videoId = attrs.matches[1];

  return (
    <iframe
      className={isSelected ? "ProseMirror-selectednode" : ""}
      src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
    />
  );
};

export default {
  title: "YouTube",
  keywords: "youtube video tube google",
  searchKeyword: "youtube",
  // defaultHidden: true,
  // eslint-disable-next-line react/display-name
  icon: () => (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/7/75/YouTube_social_white_squircle_%282017%29.svg"
      width={24}
      height={24}
    />
  ),
  matcher: (url) => {
    return url.match(
      /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i
    );
  },
  component: YoutubeEmbed,
};
