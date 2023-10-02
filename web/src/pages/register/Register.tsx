import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Spin,
  Typography,
  notification,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useRegisterUser } from "./hooks/useRegisterUser";
import { RolesToggle } from "../../components/RolesToggle";
import { UserRole } from "../../types/user";

const { Text } = Typography;

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const navigate = useNavigate();
  const { register } = useRegisterUser();
  const [api, contextHolder] = notification.useNotification();

  const handleOnClick = () => {
    setIsLoading(true);
    register({ email, password, role })
      .then(() => {
        api.success({
          message:
            "Successfully registered the user, now log in to start using the vending machine",
          onClose: () => navigate("/login"),
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Spin spinning={isLoading}>
      <Row style={{ paddingTop: "15vh" }}>
        {contextHolder}
        <Col span={8} offset={8}>
          <Card title="Register">
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
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

              <Row align="middle">
                <Col span={6}>
                  <Text>Role</Text>
                </Col>
                <Col span={18}>
                  <RolesToggle role={role} onSelect={setRole} />
                </Col>
              </Row>

              <Row style={{ justifyContent: "flex-end" }}>
                <Spin spinning={isLoading}>
                  <Button type="primary" onClick={handleOnClick}>
                    Register
                  </Button>
                </Spin>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};
