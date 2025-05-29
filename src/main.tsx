import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'

// 移动端调试工具配置
if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_VCONSOLE === 'true') {
  // 检测是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile || window.innerWidth <= 768) {
    import('vconsole').then(({ default: VConsole }) => {
      new VConsole({
        theme: 'dark', // 主题：light 或 dark
        defaultPlugins: ['system', 'network', 'element', 'storage'], // 默认插件
        maxLogNumber: 1000, // 最大日志数量
        onReady: () => {
          console.log('📱 vConsole 移动端调试工具已启动');
        }
      });
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
