import { HomeOutlined, SettingOutlined, MinusOutlined, BorderOutlined, CloseOutlined } from '@ant-design/icons';
import { Layout, Typography, Button } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { appConfig, isDevelopment } from './config/env';
import { ROUTES } from './router';
import { isElectron, electronWindowControls } from './utils/environment';

const { Title } = Typography;

// 声明 window.electronAPI 类型
declare global {
  interface Window {
    electronAPI?: {
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
    };
  }
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 判断是否在 Electron 环境中
  const electronEnv = isElectron();

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
    <Layout style={{ height: '100vh' }}>
      {/* 只在 Electron 环境下显示标题栏 */}
      {electronEnv && (
        <div className="titlebar-container">
          <div className="window-controls">
            <Button 
              type="text" 
              icon={<MinusOutlined />} 
              onClick={electronWindowControls.minimize}
            />
            <Button 
              type="text" 
              icon={<BorderOutlined />} 
              onClick={electronWindowControls.maximize}
            />
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={electronWindowControls.close}
              className="close-button"
            />
          </div>
        </div>
      )}
      
      {/* 主内容区域 */}
      <div className={`main-content ${electronEnv ? 'electron-content' : ''}`}>
        <Outlet />
      </div>
    </Layout>
  );
}

export default App;
