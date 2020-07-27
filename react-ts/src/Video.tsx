import React, { Component } from "react";
import "./style.css";
import {
  PageHeader,
  Drawer,
  List,
  Avatar,
  Card,
  Button,
  Pagination,
  Affix,
  BackTop,
  Modal,
  Input,
  message,
  Row,
  Col,
} from "antd";
import { get, post } from "./utils/http";
import { BarsOutlined, CloudSyncOutlined } from "@ant-design/icons";
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom";

interface VideoList {
  title: string;
  id: string;
  thumbnail: string;
  channelId: string;
}

interface Videos {
  title: string;
  id: string;
  thumbnail: string;
  created_at: string;
}

interface Page {
  current: number;
  total: number;
  count: number;
}

interface State {
  drawer_visible: boolean;
  video_list: VideoList[];
  videos: Videos[];
  current_list_id: string;
  token: string;
  page: Page;
  page_title: string;
  sort: number;
  channelVisible: boolean;
  addChannel: boolean;
  addChannelId: "";
}

interface Dom {
  id: string;
  srcoll: number;
}

interface PageInfo {
  id: string;
  page: number;
  sort: number;
}

interface VisitedVideo {
  id: string;
}

class Video extends Component<RouteComponentProps> {
  state: State = {
    token: "",
    drawer_visible: false,
    video_list: [],
    videos: [],
    current_list_id: "",
    page: {
      current: 1,
      total: 1,
      count: 1,
    },
    page_title: "",
    sort: 1,
    channelVisible: false,
    addChannel: false,
    addChannelId: "",
  };

  constructor(props: RouteComponentProps) {
    super(props);
  }

  // 存储视频列表各自ID及ScrollTop
  video_dom: Dom[] = [];

  async componentDidMount() {
    // 监听滚动
    window.addEventListener("scroll", this.handleScroll);
    const token = localStorage.getItem("token") || "";
    const isManager = localStorage.getItem("isManager") || "0";
    const addChannel = isManager == "1" ? true : false;
    if (token) {
      await this.getVideoList().then((data: any) => {
        if (data.length) {
          const video_list = data;
          let current_list_id = "";
          let videos_page = 1;
          let sort: number = 1;
          const storagePageInfo = localStorage.getItem("page_info") || "";
          if (storagePageInfo) {
            const page_info: PageInfo = JSON.parse(storagePageInfo);
            current_list_id = page_info.id;
            videos_page = page_info.page;
            sort = page_info.sort;
          }
          let page_title = video_list[0].title;
          if (!current_list_id) {
            current_list_id = video_list[0].id;
          } else {
            const current_t = video_list.find(
              (o: any) => o.id === current_list_id
            );
            if (current_t && current_t.title) {
              page_title = current_t.title;
            }
          }

          this.getVideos(current_list_id, videos_page, sort).then(
            (data: any) => {
              this.setState({
                video_list: video_list,
                videos: data.list,
                page: data.page,
                current_list_id: current_list_id,
                page_title: page_title,
                addChannel: addChannel,
              });
              const video_id = localStorage.getItem("video_id");
              if (video_id) {
                const index = this.video_dom.findIndex((dom: Dom) => {
                  return dom.id === video_id;
                });
                if (index !== -1) {
                  window.scrollTo(0, this.video_dom[index].srcoll - 74);
                }
              }
              this.storageScrollTop();
              this.handleScroll("event");
            }
          );
        }
      });
    }
  }

  componentDidUpdate() {
    const dom = document.getElementsByClassName("video_card");
    let doms: Dom[] = [];
    for (let i = 0; i < dom.length; i++) {
      doms.push({
        id: dom[i].id,
        srcoll: this.getOffsetTop(dom[i]),
      });
    }
    this.video_dom = doms;
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  getVideoList = () => {
    const token = localStorage.getItem("token") || "";
    return get("/video_list", { token: token }).then((data: any) => {
      if (data.status && data.data.length) {
        return data.data;
      } else {
        return [];
      }
    });
  };

  getVideos = (id?: string, current_page?: number, current_sort?: number) => {
    const token = localStorage.getItem("token") || "";
    let { current_list_id, page, sort } = this.state;
    if (id) {
      current_list_id = id;
    }
    let videos_page = page.current;
    if (current_page) {
      videos_page = current_page;
    }
    if (current_sort !== undefined) {
      sort = current_sort;
    }
    return get("/videos", {
      token: token,
      id: current_list_id,
      page: videos_page,
      sort: sort,
    }).then((data: any) => {
      if (data.status && data.data.list.length) {
        return data.data;
      } else {
        return [];
      }
    });
  };

  showDrawer = () => {
    this.setState({
      drawer_visible: true,
    });
  };

  onClose = () => {
    this.setState({
      drawer_visible: false,
    });
  };

  //列表点击
  handleListChange: (current_list_id: string, page_title: string) => void = (
    current_list_id,
    page_title
  ) => {
    this.getVideos(current_list_id, 1, 1).then((data: any) => {
      this.setState({
        drawer_visible: false,
        videos: data.list,
        page: data.page,
        current_list_id: current_list_id,
        page_title: page_title,
      });
      const video_id = localStorage.getItem("video_id");
      if (video_id) {
        const index = this.video_dom.findIndex((dom: Dom) => {
          return dom.id === video_id;
        });
        if (index !== -1) {
          window.scrollTo(0, this.video_dom[index].srcoll - 74);
        } else {
          window.scrollTo(0, 0);
        }
      }
      this.storageScrollTop();
      this.handleScroll("event");
    });
  };

  onPageChange = (page: number) => {
    this.getVideos("", page).then((data: any) => {
      this.setState({
        videos: data.list,
        page: data.page,
      });
      this.storageScrollTop();
    });
  };

  onSortChange = () => {
    let { sort } = this.state;
    sort = sort === 1 ? 0 : 1;
    this.getVideos("", 1, sort).then((data: any) => {
      this.setState({
        videos: data.list,
        page: data.page,
        sort: sort,
      });
      this.storageScrollTop();
    });
  };

  // 记录当前访问
  storageScrollTop = () => {
    const { current_list_id, page, sort } = this.state;
    localStorage.setItem(
      "page_info",
      JSON.stringify({
        id: current_list_id,
        page: page.current,
        sort: sort,
      })
    );
  };
  // 记录当前位置
  storageVideoId = (id: string) => {
    localStorage.setItem("video_id", id);
  };

  getOffsetTop(obj: any) {
    let offsetTop = 0;
    while (obj != window.document.body && obj != null) {
      offsetTop += obj.offsetTop;
      obj = obj.offsetParent;
    }
    return offsetTop;
  }

  handleScroll = (event: any) => {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    const video_id = localStorage.getItem("video_id");
    for (let i = 0; i < this.video_dom.length; i++) {
      if (this.video_dom[i].srcoll > scrollTop) {
        if (this.video_dom[i].id != video_id) {
          this.storageVideoId(this.video_dom[i].id);
        }
        break;
      }
    }
  };

  //是否已观看
  isPlay: (id: string) => boolean = (id) => {
    const played = localStorage.getItem("played");
    let video_played: string[] = [];
    if (played) {
      video_played = JSON.parse(played);
    }
    if (video_played.indexOf(id) === -1) {
      return false;
    } else {
      return true;
    }
  };

  logout = () => {
    localStorage.removeItem("token");
    this.setState({
      token: "",
    });
    window.location.reload();
  };

  // 跳转
  handlePlayClick: (id: string, type: string, title: string) => void = (
    id,
    type,
    title
  ) => {
    // 记录已观看访问ID
    const played = localStorage.getItem("played");
    let video_palyed: string[];
    if (played) {
      video_palyed = JSON.parse(played);
      video_palyed.push(id);
    } else {
      video_palyed = [id];
    }
    localStorage.setItem("played", JSON.stringify(video_palyed));
    this.props.history.push({
      pathname: "/Play",
      state: {
        id: id,
        type: type,
        title: title,
      },
    });
  };

  // 添加频道
  handleAddChange = () => {
    this.setState({
      channelVisible: true,
    });
  };
  handleAddChannelOk = () => {
    const { addChannelId } = this.state;
    const token = localStorage.getItem("token") || "";
    if (addChannelId.length != 34) {
      message.error("错误的ID");
      return false;
    }
    post("/admin/video_list", { id: addChannelId, token: token }).then(
      (data: any) => {
        if (data.status) {
          message.success("添加成功");
        } else {
          message.warning(data.msg);
        }
      }
    );
    this.setState({
      channelVisible: false,
    });
  };
  handleAddChannelCancel = () => {
    this.setState({
      channelVisible: false,
    });
  };
  // 更新当前视频列表
  listUpdate = () => {
    const { current_list_id } = this.state;
    const token = localStorage.getItem("token");
    post("/list_update", { id: current_list_id, token: token }).then(
      (data: any) => {
        if (data.status) {
          message.loading("视频列表更新成功", 2.5, () => {
            window.location.reload();
          });
        } else {
          message.warn("更新失败");
        }
      }
    );
  };

  public render() {
    const token = localStorage.getItem("token") || "";
    const {
      videos,
      drawer_visible,
      video_list,
      page_title,
      sort,
      addChannel,
      current_list_id,
    } = this.state;
    const { Meta } = Card;

    if (token) {
      let extra = [
        <Button onClick={this.logout}>退出</Button>,
        <Button onClick={this.onSortChange}>{sort ? "最新" : "最早"}</Button>,
        <Button
          type="primary"
          shape="circle"
          icon={<CloudSyncOutlined />}
          onClick={this.listUpdate}
        />,
      ];
      if (addChannel) {
        extra.push(
          <Button shape="circle" onClick={this.handleAddChange}>
            +
          </Button>
        );
      }
      return (
        <>
          <Affix offsetTop={0}>
            <PageHeader
              className="site-page-header"
              onBack={this.showDrawer}
              title={page_title}
              subTitle=""
              ghost={false}
              backIcon={<BarsOutlined />}
              extra={extra}
            />
          </Affix>

          <Drawer
            title="播放列表"
            placement="left"
            closable={false}
            onClose={this.onClose}
            visible={drawer_visible}
          >
            <List
              itemLayout="horizontal"
              dataSource={video_list}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.thumbnail} />}
                    title={
                      <Button
                        type={item.id == current_list_id ? "link" : "text"}
                        onClick={() =>
                          this.handleListChange(item.id, item.title)
                        }
                      >
                        {item.title}
                      </Button>
                    }
                  />
                </List.Item>
              )}
            />
          </Drawer>
          <Row className="card_list" gutter={{ md: 16, xl: 32 }}>
            {videos.map((v, i) => {
              return (
                <Col
                  sm={32}
                  md={16}
                  xl={8}
                  className="video_card card_margin_bottom"
                  id={"video_" + v.id}
                  key={i}
                >
                  <Card
                    style={{ width: "100%" }}
                    cover={<img alt="example" src={v.thumbnail} />}
                    actions={[
                      <Button
                        onClick={() => {
                          this.handlePlayClick(v.id, "video", v.title);
                        }}
                        type={this.isPlay(v.id) ? "dashed" : "primary"}
                      >
                        视频
                      </Button>,
                      <Button
                        onClick={() => {
                          this.handlePlayClick(v.id, "audio", v.title);
                        }}
                        type={this.isPlay(v.id) ? "dashed" : "default"}
                      >
                        音频
                      </Button>,
                    ]}
                  >
                    <Meta title={v.title} description={v.created_at} />
                  </Card>
                </Col>
              );
            })}
          </Row>
          <Pagination
            current={this.state.page.current}
            onChange={this.onPageChange}
            defaultPageSize={50}
            total={this.state.page.total}
            showSizeChanger={false}
          />
          <BackTop />
          <Modal
            title="添加频道"
            visible={this.state.channelVisible}
            onOk={this.handleAddChannelOk}
            onCancel={this.handleAddChannelCancel}
          >
            <Input
              placeholder="输入列表ID"
              onChange={(event) => {
                this.setState({ addChannelId: event.target.value });
              }}
            />
          </Modal>
        </>
      );
    } else {
      return <Redirect to="/"></Redirect>;
    }
  }
}

export default withRouter(Video);
