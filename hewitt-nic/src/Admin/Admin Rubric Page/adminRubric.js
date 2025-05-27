import { Layout, Flex, theme, Typography } from "antd";
import adminRubricStyles from "./adminRubricStyles";
import { Outlet } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography

// This page is the container for the Rubric pages that keeps the header and styling
// Outlet allows for the Browser Router to control the sub page that loads in

const AdminRubric = () => {

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout direction="vertical" className="mainAdminRubric">
      <Header style={adminRubricStyles.header}>
        <Flex justify="space-between" align="center">
          <Title>Rubrics</Title>
        </Flex>
      </Header>

      <div style={{ paddingTop: 12, background: colorBgContainer }}>
        <Outlet />
      </div>
    </Layout>
  );
};

export default AdminRubric;
