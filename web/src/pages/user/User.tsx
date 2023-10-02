import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  InputNumber,
  Row,
  Spin,
  Typography,
  notification,
} from "antd";
import { useUser } from "../../hooks/useUser";
import { RolesToggle } from "../../components/RolesToggle";
import { User } from "../../types/user";
import { useUpdateUser } from "./hooks/useUpdateUser";

const { Text } = Typography;

export const UserPage: React.FC = () => {
  const { user } = useUser();
  const [_user, setUser] = useState<User | undefined>(() => user);
  const [api, contextHolder] = notification.useNotification();
  const { updateUser, isLoading } = useUpdateUser();

  useEffect(() => {
    if (!_user && !!user) {
      setUser(user);
    }
  }, [_user, user]);

  const onSubmit = async () => {
    if (!_user) {
      return;
    }

    const data = await updateUser(_user);
    if (data) {
      api.success({ message: "User updated with success." });
    } else {
      api.error({ message: "Error updating the user." });
    }
  };

  if (!user || !_user) {
    return null;
  }

  const isTouched = user.deposit !== _user.deposit || user.role !== _user.role;

  return (
    <Row>
      {contextHolder}
      <Col span={12}>
        <Card title="Personal Information">
          <Divider orientation="left">Information</Divider>

          <Row>
            <Col span={4}>
              <Text strong>{"Id: "}</Text>
            </Col>

            <Text>{user?.id}</Text>
          </Row>

          <Row>
            <Col span={4}>
              <Text strong>{"Email: "}</Text>
            </Col>

            <Text>{user?.email}</Text>
          </Row>

          <Spin spinning={isLoading}>
            <Divider orientation="left">Edit</Divider>

            <Row>
              <Col span={6}>Role</Col>
              <Col span={16}>
                <RolesToggle
                  role={_user.role}
                  onSelect={(role) => setUser({ ..._user, role })}
                />
              </Col>
            </Row>

            <Row style={{ marginTop: "20px" }}>
              <Col span={6}>Deposit</Col>
              <Col span={12}>
                <InputNumber
                  step="0.05"
                  min="0.05"
                  max="999.99"
                  value={_user.deposit.toString()}
                  onChange={(value) => {
                    if (value) {
                      setUser({ ..._user, deposit: parseFloat(value) });
                    }
                  }}
                />
              </Col>
            </Row>

            <Row style={{ marginTop: "20px" }}>
              <Button type="primary" onClick={onSubmit} disabled={!isTouched}>
                Save
              </Button>
            </Row>
          </Spin>
        </Card>
      </Col>
    </Row>
  );
};
