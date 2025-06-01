import React, { useState } from 'react';
import { Card, Typography } from 'antd';
import OCRUploader from './OCRUploader';
import styles from './OCRPage.module.css';

const { Title, Paragraph } = Typography;

const OCRPage: React.FC = () => {
  const [recognizedText, setRecognizedText] = useState<string>('');

  const handleOCRResult = (text: string) => {
    setRecognizedText(text);
  };

  return (
    <div className={styles.ocrPage}>
      <Card>
        <Title level={3}>图片文字识别</Title>
        <OCRUploader onResult={handleOCRResult} />
        
        {recognizedText && (
          <div className={styles.ocrResult}>
            <Title level={4}>识别结果：</Title>
            <Card>
              <Paragraph copyable>{recognizedText}</Paragraph>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OCRPage; 