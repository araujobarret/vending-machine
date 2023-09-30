import { Card, Col, Row } from "antd";

export const Login: React.FC = () => {
  return (
    <Row style={{ paddingTop: "15vh" }}>
      <Col span={12} offset={6}>
        <Card title="Login">
          <Row>Email</Row>
          <Row>Password</Row>
        </Card>
      </Col>
    </Row>
  );
};
