import * as React from "react";
import videojs from "video.js";
// Styles
import "video.js/dist/video-js.css";

interface VideoPlayerPropsInferface extends videojs.PlayerOptions {}

export default class VideoPlayer extends React.Component<
  VideoPlayerPropsInferface
> {
  private player?: videojs.Player;
  private videoNode?: HTMLVideoElement;

  constructor(props: VideoPlayerPropsInferface) {
    super(props);
    this.player = undefined;
    this.videoNode = undefined;
  }

  componentDidMount() {
    this.player = videojs(this.videoNode, this.props).ready(function () {
      // console.log('onPlayerReady', this);
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }
  render() {
    return (
      <div className="c-player">
        <div className="c-player__screen" data-vjs-player="true">
          <video
            ref={(node: HTMLVideoElement) => (this.videoNode = node)}
            className="video-js vjs-16-9"
          />
        </div>
      </div>
    );
  }
}
