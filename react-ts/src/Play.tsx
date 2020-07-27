import React, { Component } from "react";
import "./style.css";
import { withRouter, RouteComponentProps } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { Spin, PageHeader, Divider, Typography } from "antd";

interface State {
  token: string;
  id: string;
  type: string;
  title: string;
  videoOptions: videoJsOptions | any;
}

interface videoJsOptionsSources {
  src: string;
  type: string;
}

interface videoJsOptions {
  autoplay: boolean;
  controls: boolean;
  sources: videoJsOptionsSources[];
}

interface Param extends RouteComponentProps {
  location: any;
}
class Play extends Component<Param> {
  constructor(props: Param) {
    super(props);
  }
  state: State = {
    token: "",
    id: "",
    type: "",
    title: "",
    videoOptions: {},
  };
  player: any;
  componentDidMount() {
    const token = localStorage.getItem("token") || "";
    if (this.props.location.state?.id) {
      const { id, type, title } = this.props.location.state;
      let videoType = "video/mp4";
      if (type == "audio") {
        videoType = "audio/mp4";
      }
      this.setState({
        token: token,
        id: id,
        type: type,
        title: title,
        videoOptions: {
          autoplay: true,
          controls: true,
          sources: {
            src: `/api/play?id=${id}&type=${type}&token=${token}`,
            //src: `http://vjs.zencdn.net/v/oceans.mp4`,
            type: videoType,
          },
        },
      });
    } else {
      this.props.history.push("/");
    }
  }
  public render() {
    const { Title } = Typography;
    const { videoOptions, title } = this.state;
    if (videoOptions.sources?.src) {
      return (
        <>
          <div className="play-box">
            <PageHeader
              className="site-page-header"
              onBack={() => this.props.history.goBack()}
              title={title}
            />
            <VideoPlayer {...videoOptions} />
            <Divider />
            <Title level={4} className="title">
              {title}
            </Title>
          </div>
        </>
      );
    } else {
      return (
        <>
          <PageHeader
            className="site-page-header"
            onBack={() => this.props.history.goBack()}
            title={title}
          />
          <Spin />
        </>
      );
    }
  }
}
export default withRouter(Play);
