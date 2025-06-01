import React, { useState } from 'react';
import { Upload, Button, Spin, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createWorker } from 'tesseract.js';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from './OCRUploader.module.css';

interface OCRUploaderProps {
  onResult?: (text: string) => void;
}

const OCRUploader: React.FC<OCRUploaderProps> = ({ onResult }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleOCR = async (file: File) => {
    setLoading(true);
    try {
      const worker = await createWorker('chi_sim+eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      
      if (onResult) {
        onResult(text);
      }
      message.success('文字识别成功！');
    } catch (error) {
      console.error('OCR错误:', error);
      message.error('文字识别失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // 只保留最后上传的文件
    setFileList(newFileList);

    if (info.file.status === 'done') {
      const file = info.file.originFileObj;
      await handleOCR(file);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
      }
      return true;
    },
    customRequest: ({ file, onSuccess }: any) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    fileList,
    onChange: handleChange
  };

  return (
    <div className={styles.ocrUploader}>
      <Spin spinning={loading} tip="正在识别文字...">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>
            上传图片进行文字识别
          </Button>
        </Upload>
      </Spin>
    </div>
  );
};

export default OCRUploader; 