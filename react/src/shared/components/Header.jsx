import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Dropdown, Layout, Menu, Row, Space } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
const { Header } = Layout;

const items1 = [
  { label: "Login", key: "login" },
  { label: "Signup", key: "signup" },
];
const items = [
  { label: "Preferences", key: "preferences" },
  { label: "Logout", key: "logout" },
];
export default function CustomHeader() {
  const {
    handleLogout,
    globalState: { isUserLoggedIn },
  } = useContext(GlobalContext);

  const [menu, setMenu] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("login")) {
      setMenu("login");
    } else if (location.pathname.includes("signup")) {
      setMenu("signup");
    } else {
      setMenu("");
    }
  }, [location.pathname]);

  const onClick = ({ key }) => {
    if (key === "preferences") {
      navigate("/preferences");
    } else {
      navigate("/");
      handleLogout();
    }
  };

  return (
    <Header>
      <Row justify={"space-between"}>
        <Col
          style={{
            color: "white",
            cursor: "pointer",
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          <span onClick={() => navigate("/")}>Home</span>
        </Col>
        {isUserLoggedIn && (
          <Col>
            <Dropdown
              menu={{
                items,
                onClick,
              }}
              trigger={["click"]}
              onSele
            >
              <Avatar
                size="large"
                style={{ backgroundColor: "#4096ff", cursor: "pointer" }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Col>
        )}
        {!isUserLoggedIn && (
          <Col>
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[`${menu}`]}
              items={items1}
              onSelect={(e) => navigate(`/${e.key}`)}
            />
          </Col>
        )}
      </Row>
    </Header>
  );
}
