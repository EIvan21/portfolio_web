import React from "react";
import ReactPlayer from "react-player";
import video from "../../assets/VideosProjects/AfluenciaCovid.mp4";

function PlotlyVideo() {
  return (
    <div className="plotlyvideo">
      <ReactPlayer
        url={video}
        playing={true}
        loop={true}
        controls={false}
        width="640px"
        height="360px"
        muted={true}
      />
    </div>
  );
}

export default PlotlyVideo;
