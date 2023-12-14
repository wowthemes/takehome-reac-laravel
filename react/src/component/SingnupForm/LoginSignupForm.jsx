import React, { useContext } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import "../../shared/styles/styles.css";
import { Form, Input, Button, Typography, Col, Row } from "antd";
import { Link, Navigate } from "react-router-dom";
import {
  CHANGE_PASSWORD,
  LOGIN,
  SIGNUP,
} from "../../shared/constants/constant";
import { GlobalContext } from "../../context/GlobalContext";
import { Login, Register } from "../../api/LoginPage/LoginPage";
import { setLoggedinUser, valuesToStore } from "../../shared/helperFunc/utils";
import { toast } from "../../shared/helperFunc/toast";

function LoginSignupForm({ type = SIGNUP }) {
  const { setUserLoginInfo, setLoginFailed } = useContext(GlobalContext);

  const { Title } = Typography;
  const [form] = Form.useForm();
  const onFinish = (values) => {
    if (type === LOGIN) {
      Login(values)
        .then((res) => {
          let modifiedValues = valuesToStore(res);
          setUserLoginInfo(modifiedValues);
          setLoggedinUser(modifiedValues);
          <Navigate to={"/"} replace />;
        })
        .catch((error) => {
          setLoginFailed();
          setLoggedinUser(null);
          toast(error.error, "error", "email or password is incorrect");
        });
    } else if (type === SIGNUP) {
      Register(values)
        .then((res) => {
          let modifiedValues = valuesToStore(res);
          setUserLoginInfo(modifiedValues);
          setLoggedinUser(modifiedValues);
          <Navigate to={"/"} replace />;
        })
        .catch((error) => {
          setUserLoginInfo("");
          setLoggedinUser("");
          toast(error.error, "error", "email already exist");
        });
    }
  };

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  return (
    <div className="form-container">
      <Row gutter={[0, 5]} className="login-form" justify={"center"}>
        <Col>
          <Title level={2}>
            {type === SIGNUP
              ? "Sign Up"
              : type === LOGIN
              ? "Log In"
              : "Change Password"}
          </Title>
        </Col>
        <Col span={24}>
          <Form
            name="login-signup-form"
            form={form}
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            {type === SIGNUP && (
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Name!",
                  },
                ]}
              >
                <Input size="large" placeholder="Name" />
              </Form.Item>
            )}
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>
            {(type === CHANGE_PASSWORD || type === SIGNUP) && (
              <Form.Item
                name="password_confirmation"
                label="Confirm Password"
                style={{ marginBottom: 10 }}
                labelCol={{ span: 24 }}
                dependencies={["password"]}
                rules={[
                  {
                    required: true,
                    message: "Please input your Confirm Password!",
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Confirm Password"
                />
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                {type === SIGNUP
                  ? "Sign Up"
                  : type === LOGIN
                  ? "Log In"
                  : "Change Password"}
              </Button>
              {type === LOGIN && (
                <span>
                  Or <Link to={"/signup"}>register now!</Link>
                </span>
              )}
              {type === SIGNUP && (
                <span>
                  already have an account? <Link to={"/login"}>Login now!</Link>
                </span>
              )}
              {type === CHANGE_PASSWORD && (
                <span>
                  Want to <Link to={"/login"}>Login ?</Link>
                </span>
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default LoginSignupForm;
