import { useState } from "react";
import { Button, Card, Col, Input, Row, Space, Spin, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../providers/Auth";

const { Text } = Typography;

export const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthContext();

  const from = location.state?.from?.pathname || "/";

  const handleOnClick = () => {
    setIsLoading(true);
    auth.login(email, () => {
      // Send them back to the page they tried to visit
      navigate(from, { replace: true });
    });
  };

  return (
    <Row style={{ paddingTop: "15vh" }}>
      <Col span={8} offset={8}>
        <Card title="Register">
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
