import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuthContext } from "../../providers/Auth";
import { LoginBody, LoginPayload } from "../../types/user";
import { AxiosResponse } from "axios";

const { Text } = Typography;

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuthContext();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      // Send them back to the page they tried to visit
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleOnClick = async () => {
    setIsLoading(true);
    try {
      const res = await api.post<LoginBody, AxiosResponse<LoginPayload>>(
        "/login",
        {
          email,
          password,
        }
      );
      login({ ...res.data.user, accessToken: res.data.accessToken });
    } catch (e) {
      messageApi.error("Invalid credentials");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Row style={{ paddingTop: "15vh" }}>
      {contextHolder}

      <Col span={8} offset={8}>
        <Card title="Login">
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Row align="middle">
              <Col span={6}>
                <Text>Email</Text>
              </Col>
              <Col span={18}>
                <Input
                  placeholder="myemail@gmail.com"
                  value={email}
                  size="large"
                  prefix={<UserOutlined />}
                  onChange={({ currentTarget }) =>
                    setEmail(currentTarget.value)
                  }
                />
              </Col>
            </Row>

            <Row align="middle">
              <Col span={6}>
                <Text>Password</Text>
              </Col>
              <Col span={18}>
                <Input.Password
                  value={password}
                  size="large"
                  prefix={<LockOutlined />}
                  onChange={({ currentTarget }) =>
                    setPassword(currentTarget.value)
                  }
                />
              </Col>
            </Row>

            <Row style={{ justifyContent: "flex-end" }}>
              <Spin spinning={isLoading}>
                <Button type="primary" onClick={handleOnClick}>
                  Login
                </Button>
              </Spin>
            </Row>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};
