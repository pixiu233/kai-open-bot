/// Router configuration
/// 路由配置

import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Home from '../components/ui';

/// Router configuration
/// 路由配置
export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/index" replace />,
            },
            {
                path: 'index',
                element: <Home />,
            },

        ],
    },
]);

/// Route paths constants
/// 路由路径常量
export const ROUTES = {
    HOME: '/index',
    ENV_CONFIG: '/env-config',
} as const; 