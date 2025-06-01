/// <reference path="../types/global.d.ts" />

import { useEffect } from 'react';
import { message } from 'antd';

export const useGlobalTextActions = (
  onTranslate?: (text: string) => void,
  onExplain?: (text: string) => void,
  onSpeak?: (text: string) => void
) => {
  useEffect(() => {
    // 检查是否在Electron环境中
    if (!window.electronAPI) {
      return;
    }

    // 使用类型断言确保TypeScript识别完整的ElectronAPI接口
    const electronAPI = window.electronAPI as any;

    // 翻译文字处理
    const handleTranslate = (event: any, text: string) => {
      console.log('📝 收到翻译请求:', text);
      message.info(`正在翻译: ${text.substring(0, 30)}...`);
      if (onTranslate) {
        onTranslate(text);
      } else {
        // 默认翻译处理
        defaultTranslateHandler(text);
      }
    };

    // 解释文字处理
    const handleExplain = (event: any, text: string) => {
      console.log('📖 收到解释请求:', text);
      message.info(`正在解释: ${text.substring(0, 30)}...`);
      if (onExplain) {
        onExplain(text);
      } else {
        // 默认解释处理
        defaultExplainHandler(text);
      }
    };

    // 语音播报处理
    const handleSpeak = (event: any, text: string) => {
      console.log('🔊 收到语音播报请求:', text);
      message.info(`正在播报: ${text.substring(0, 30)}...`);
      if (onSpeak) {
        onSpeak(text);
      } else {
        // 默认语音播报处理
        defaultSpeakHandler(text);
      }
    };

    // 注册事件监听器
    if (electronAPI.onTranslateText) {
      electronAPI.onTranslateText(handleTranslate);
    }
    if (electronAPI.onExplainText) {
      electronAPI.onExplainText(handleExplain);
    }
    if (electronAPI.onSpeakText) {
      electronAPI.onSpeakText(handleSpeak);
    }

    // 清理函数
    return () => {
      if (electronAPI.removeAllListeners) {
        electronAPI.removeAllListeners('translate-text');
        electronAPI.removeAllListeners('explain-text');
        electronAPI.removeAllListeners('speak-text');
      }
    };
  }, [onTranslate, onExplain, onSpeak]);
};

// 默认翻译处理函数
const defaultTranslateHandler = (text: string) => {
  // 这里可以集成翻译API
  console.log('默认翻译处理:', text);
  message.success('翻译功能需要在主页面中自定义实现');
};

// 默认解释处理函数
const defaultExplainHandler = (text: string) => {
  // 这里可以集成AI解释功能
  console.log('默认解释处理:', text);
  message.success('解释功能需要在主页面中自定义实现');
};

// 默认语音播报处理函数
const defaultSpeakHandler = (text: string) => {
  // 使用Web Speech API进行语音播报
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    speechSynthesis.speak(utterance);
    message.success('开始语音播报');
  } else {
    message.error('当前浏览器不支持语音播报功能');
  }
}; 