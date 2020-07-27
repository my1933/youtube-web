import React, { Component } from "react";
import "./style.css";
import { Form, Input, Button, message } from "antd";
import { get, post } from "./utils/http";
import { withRouter, Redirect, RouteComponentProps } from "react-router-dom";

interface State {
  token: string;
}

class Login extends Component {
  state: State = {
    token: "",
  };

  componentDidMount() {
    const token = localStorage.getItem("token") || "";
    this.setState({
      token: token,
    });
  }
  onFinish = (values: any) => {
    post("/token", { username: values.username })
      .then((data: any) => {
        if (data.status) {
          const token: string = data.data.token;
          localStorage.setItem("token", token);
          localStorage.setItem("isManager", data.data.isManager);
          this.setState({
            token: token,
          });
        } else {
          message.error("错误的用户名");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  public render() {
    const { token } = this.state;

    if (token) {
      return <Redirect to="/Video"></Redirect>;
    } else {
      const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };
      const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
      };

      return (
        <div className="login-page">
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
          >
            <Form.Item
              label="您是？"
              name="username"
              rules={[{ required: true, message: "输入登录用户名" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                好的
              </Button>
            </Form.Item>
          </Form>
        </div>
      );
    }
  }
}

export default Login;
