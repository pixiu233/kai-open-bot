/// Router configuration
/// 路由配置

import { createHashRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Home from '../components/ui';
import OCRPage from '../components/OCRPage';
import TextOverlay from '../pages/TextOverlay';

/// Router configuration
/// 路由配置
export const router = createHashRouter([
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
            {
                path: 'ocr',
                element: <OCRPage />,
            },
            {
                path: 'text-overlay',
                element: <TextOverlay />,
            },
        ],
    },
    {
        path: '/index',
        element: <Home />,
    },
    {
        path: '/ocr',
        element: <OCRPage />,
    },
    {
        path: '/text-overlay',
        element: <TextOverlay />,
    }
]);

/// Route paths constants
/// 路由路径常量
export const ROUTES = {
    HOME: '/index',
    ENV_CONFIG: '/env-config',
    OCR: '/ocr',
    TEXT_OVERLAY: '/text-overlay',
} as const; 