import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { appConfig, isDevelopment } from './config/env';
import { ROUTES } from './router';

const { Title } = Typography;

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  /// Display environment info in development mode
  /// 在开发模式下显示环境信息
  if (isDevelopment && appConfig.enableDebug) {
    console.log('🚀 应用启动', {
      title: appConfig.title,
      version: appConfig.version,
      mode: isDevelopment ? '开发模式' : '生产模式'
    });
  }

  /// Menu items configuration
  /// 菜单项配置
  const menuItems = [
    {
      key: ROUTES.HOME,
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: ROUTES.ENV_CONFIG,
      icon: <SettingOutlined />,
      label: '环境配置',
    },
  ];

  /// Handle menu click
  /// 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout >
      {/* <Header style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px'
      }}>
        <Title level={4} style={{ margin: 0, marginRight: 32, color: '#1890ff' }}>
          {appConfig.title}
        </Title>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ flex: 1, border: 'none' }}
        />
      </Header> */}
      {/* <Content style={{ padding: '24px' }}> */}
      <Outlet />
      {/* </Content> */}
    </Layout >
  );
}

export default App;
