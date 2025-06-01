import React, { useEffect, useState } from 'react';
import { Button, Typography, Space } from 'antd';
import { TranslationOutlined, QuestionCircleOutlined, SearchOutlined, SoundOutlined } from '@ant-design/icons';
import './TextOverlay.css';

const { Text } = Typography;

interface TextOverlayProps {
  text?: string;
}

const TextOverlay: React.FC<TextOverlayProps> = () => {
  const [selectedText, setSelectedText] = useState<string>('');

  useEffect(() => {
    // 从URL哈希参数获取文本
    const hash = window.location.hash; // 例如: #/text-overlay?text=Hello%20World
    const searchPart = hash.split('?')[1]; // 获取 ?text=Hello%20World 部分
    if (searchPart) {
      const urlParams = new URLSearchParams(searchPart);
      const text = urlParams.get('text') || '';
      setSelectedText(decodeURIComponent(text));
      console.log('从URL获取的文字:', text);
    }

    // 监听来自主进程的消息
    if (window.electronAPI?.onTextSelected) {
      window.electronAPI.onTextSelected((text: string) => {
        // 确保只设置字符串值，过滤掉事件对象
        if (typeof text === 'string') {
          setSelectedText(text);
          console.log('从IPC获取的文字:', text);
        }
      });
    }
  }, []);

  const handleAction = (action: string) => {
    //todo:現在這個有問題，需要解決
    debugger;
    console.log(`执行操作: ${action}`);
    
    if (window.electronAPI?.sendTextAction) {
      window.electronAPI.sendTextAction({
        action,
        text: selectedText
      });
    } else {
      // 如果不在Electron环境中，使用ipcRenderer
      try {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('text-action', {
          action,
          text: selectedText
        });
      } catch (e) {
        console.error('无法发送IPC消息:', e);
      }
    }
  };

  const handleTranslate = () => handleAction('translate');
  const handleExplain = () => handleAction('explain');
  const handleSearch = () => handleAction('search');
  const handleSpeak = () => handleAction('speak');

  const displayText = selectedText && selectedText.length > 80 
    ? selectedText.substring(0, 80) + '...' 
    : selectedText || '';

  // 确保selectedText是字符串
  const safeSelectedText = typeof selectedText === 'string' ? selectedText : '';

  return (
    <div className="text-overlay">
      <div className="overlay-header">
        <Text type="secondary" style={{ fontSize: 12 }}>📝 文字助手</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>已选中</Text>
      </div>
      
      <div className="overlay-content">
        <Text className="selected-text" title={safeSelectedText}>
          {displayText}
        </Text>
      </div>
      
      <div className="overlay-actions">
        <Space size="small" wrap>
          <Button 
            type="primary" 
            size="small" 
            icon={<TranslationOutlined />}
            onClick={handleTranslate}
          >
            翻译
          </Button>
          <Button 
            size="small" 
            icon={<QuestionCircleOutlined />}
            onClick={handleExplain}
          >
            解释
          </Button>
          <Button 
            size="small" 
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            搜索
          </Button>
          <Button 
            size="small" 
            icon={<SoundOutlined />}
            onClick={handleSpeak}
          >
            朗读
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default TextOverlay; 