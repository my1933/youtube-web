import React, { Component, ReactNode } from "react";
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
  Menu,
} from "antd";
import { get, post } from "./utils/http";
import {
  BarsOutlined,
  CloudSyncOutlined,
  ReadOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom";

enum ChannelType {
  "list" = "list",
  "channel" = "channel",
}
interface VideoListInfo {
  title: string;
  id: string;
  thumbnail: string;
}

interface VideoList {
  [key: string]: VideoListInfo[];
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
  left_drawer_visible: boolean; // 左侧的抽屉
  list_type: ChannelType; // 视频列表类型 enum[channel,list]，也控制左侧菜单的展开
  channel_list: VideoList; // 频道列表
  videos: Videos[]; // 视频列表
  current_channel_id: string; // 当前的频道列表
  token: string; // TOKEN
  page: Page; // 页码
  page_title: string; // 页标题
  sort: number; // 排序
  channel_modal_visible: boolean; // 添加频道的Modal
  add_channel_power: boolean; // 添加频道的权限
  add_channel_inpu_id: ""; // 添加频道的ID
}

interface Dom {
  id: string;
  srcoll: number;
}

interface PageInfo {
  current_channel_id: string;
  current_page: number;
  sort: number;
  list_type: ChannelType;
}

interface VisitedVideo {
  id: string;
}

class Video extends Component<RouteComponentProps> {
  state: State = {
    token: "",
    left_drawer_visible: false,
    list_type: ChannelType.list,
    channel_list: {
      list: [],
      channel: [],
    },
    videos: [],
    current_channel_id: "",
    page: {
      current: 1,
      total: 1,
      count: 1,
    },
    page_title: "",
    sort: 1,
    channel_modal_visible: false,
    add_channel_power: false,
    add_channel_inpu_id: "",
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
    const add_channel_power = isManager == "1" ? true : false;
    if (token) {
      await this.getVideoList().then((data: any) => {
        const channel_list = data;
        let {
          current_channel_id,
          current_page,
          sort,
          list_type,
        } = this.getPageStorage();
        let page_title = "";
        console.log(list_type, channel_list);
        if (!current_channel_id && channel_list[list_type].length) {
          current_channel_id = channel_list[list_type][0].id;
          page_title = channel_list[list_type][0].title;
        } else if (channel_list[list_type].length) {
          const current_t = channel_list[list_type].find(
            (o: any) => o.id === current_channel_id
          );
          if (current_t && current_t.title) {
            page_title = current_t.title;
          }
        }
        console.log("call getVideos");
        this.getVideos(current_channel_id, current_page, sort, list_type).then(
          (data: any) => {
            console.log(data);
            this.setState({
              channel_list: channel_list,
              videos: data.list,
              page: data.page,
              current_channel_id: current_channel_id,
              page_title: page_title,
              add_channel_power: add_channel_power,
              list_type: list_type,
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
      if (data.status) {
        return data.data;
      } else {
        return [];
      }
    });
  };

  getVideos = (
    id?: string,
    current_page?: number,
    current_sort?: number | null,
    current_type?: ChannelType | null,
    refresh?: boolean
  ) => {
    const token = localStorage.getItem("token") || "";
    let { current_channel_id, page, sort, list_type } = this.state;
    if (id) {
      current_channel_id = id;
    }
    let get_page = page.current;
    if (current_page) {
      get_page = current_page;
    }
    if (current_sort !== undefined && current_sort !== null) {
      sort = current_sort;
    }
    if (current_type) {
      list_type = current_type;
    }
    let params = {
      token: token,
      id: current_channel_id,
      page: get_page,
      sort: sort,
      type: list_type,
    };
    if (refresh) {
      params = Object.assign(params, { refresh: true });
    }
    return get("/videos", params).then((data: any) => {
      if (data.status && data.data.list.length) {
        return data.data;
      } else {
        return [];
      }
    });
  };

  showLeftDrawer = () => {
    this.setState({
      left_drawer_visible: true,
    });
  };

  hideLeftDrawer = () => {
    this.setState({
      left_drawer_visible: false,
    });
  };

  rootMenuKeys = ["list", "channel"];

  handleMenuOpenChange = (key: any) => {
    const { list_type } = this.state;
    const open_keys = [list_type];
    const menu_keys: ChannelType[] = [ChannelType.list, ChannelType.channel];
    const latestOpenKey = key.find((k: any) => open_keys.indexOf(k) === -1);
    if (menu_keys.indexOf(latestOpenKey) !== -1) {
      this.setState({
        list_type: latestOpenKey ? latestOpenKey : ChannelType.list,
      });
    }
  };

  handleMenuClick = (e: any) => {
    let { current_channel_id } = this.state;
    if (e.key !== current_channel_id) {
      current_channel_id = e.key;
      const page_title = e.item.props.data_title;
      this.getVideos(current_channel_id, 1, 1).then((data: any) => {
        this.setState({
          left_drawer_visible: false,
          videos: data.list,
          page: data.page,
          current_channel_id: current_channel_id,
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
    }
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
    const { current_channel_id, page, sort, list_type } = this.state;
    localStorage.setItem(
      "page_info",
      JSON.stringify({
        id: current_channel_id,
        page: page.current,
        sort: sort,
        list_type: list_type,
      })
    );
  };
  // 读取页面浏览信息
  getPageStorage = () => {
    const storagePageInfo = localStorage.getItem("page_info") || "";
    let page_info: PageInfo;
    if (storagePageInfo) {
      page_info = JSON.parse(storagePageInfo);
    } else {
      page_info = {
        current_channel_id: "",
        current_page: 1,
        sort: 1,
        list_type: ChannelType.list,
      };
    }
    return page_info;
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
      channel_modal_visible: true,
    });
  };
  handleAddChannelOk = () => {
    const { add_channel_inpu_id } = this.state;
    const token = localStorage.getItem("token") || "";
    if (add_channel_inpu_id.length != 34 && add_channel_inpu_id.length != 24) {
      message.error("错误的ID");
      return false;
    }
    post("/admin/channel_list", { id: add_channel_inpu_id, token: token }).then(
      (data: any) => {
        if (data.status) {
          message.success("添加成功");
        } else {
          message.warning(data.msg);
        }
      }
    );
    this.setState({
      channel_modal_visible: false,
    });
  };
  handleAddChannelCancel = () => {
    this.setState({
      channel_modal_visible: false,
    });
  };
  // 更新当前视频列表服务器缓存
  listUpdate = () => {
    this.getVideos("", 0, null, null, true);
  };

  public render() {
    const token = localStorage.getItem("token") || "";
    const {
      videos,
      left_drawer_visible,
      channel_list,
      page_title,
      sort,
      add_channel_power,
      current_channel_id,
    } = this.state;
    console.log(add_channel_power);
    const { Meta } = Card;
    const { SubMenu } = Menu;
    if (!token) {
      return <Redirect to="/"></Redirect>;
    }
    let pageHeaderExtra: ReactNode[] = [
      <Button onClick={this.logout} key="logout_button">
        退出
      </Button>,
      <Button onClick={this.onSortChange} key="sort_button">
        {sort ? "最新" : "最早"}
      </Button>,
      <Button
        type="primary"
        shape="circle"
        icon={<CloudSyncOutlined />}
        onClick={this.listUpdate}
        key="update_button"
      />,
    ];
    if (add_channel_power) {
      pageHeaderExtra.push(
        <Button
          shape="circle"
          onClick={this.handleAddChange}
          key="addChange_button"
        >
          +
        </Button>
      );
    }

    return (
      <>
        <Affix offsetTop={0}>
          <PageHeader
            className="site-page-header"
            onBack={this.showLeftDrawer}
            title={page_title}
            subTitle=""
            ghost={false}
            backIcon={<BarsOutlined />}
            extra={pageHeaderExtra}
          />
        </Affix>

        <Drawer
          title="播放列表"
          placement="left"
          closable={false}
          onClose={this.hideLeftDrawer}
          visible={left_drawer_visible}
        >
          <Menu
            mode="inline"
            openKeys={[this.state.list_type]}
            onOpenChange={this.handleMenuOpenChange}
            style={{ width: 256 }}
            onClick={this.handleMenuClick}
          >
            <SubMenu
              key="list"
              title={
                <span>
                  <ProfileOutlined />
                  <span>视频列表</span>
                </span>
              }
            >
              {channel_list["list"].map((v, i) => {
                return (
                  <Menu.Item
                    key={v.id}
                    className={
                      current_channel_id === v.id
                        ? "ant-menu-item-selected"
                        : ""
                    }
                    data-title={v.title}
                  >
                    {v.title}
                  </Menu.Item>
                );
              })}
            </SubMenu>
            <SubMenu
              key="channel"
              title={
                <span>
                  <ReadOutlined />
                  <span>频道列表</span>
                </span>
              }
            >
              {channel_list["channel"].map((v, i) => {
                return (
                  <Menu.Item
                    key={v.id}
                    className={
                      current_channel_id === v.id
                        ? "ant-menu-item-selected"
                        : ""
                    }
                    data-title={v.title}
                  >
                    {v.title}
                  </Menu.Item>
                );
              })}
            </SubMenu>
          </Menu>
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
          visible={this.state.channel_modal_visible}
          onOk={this.handleAddChannelOk}
          onCancel={this.handleAddChannelCancel}
        >
          <Input
            placeholder="输入列表ID"
            onChange={(event) => {
              this.setState({ add_channel_inpu_id: event.target.value });
            }}
          />
        </Modal>
      </>
    );
  }
}

export default withRouter(Video);
