import {
    AppstoreAddOutlined,
    CloudUploadOutlined,
    CommentOutlined,
    CopyOutlined,
    DeleteOutlined,
    DislikeOutlined,
    EditOutlined,
    EllipsisOutlined,
    FileSearchOutlined,
    HeartOutlined,
    LikeOutlined,
    MenuOutlined,
    PaperClipOutlined,
    PlusOutlined,
    ProductOutlined,
    QuestionCircleOutlined,
    ReloadOutlined,
    ScheduleOutlined,
    ShareAltOutlined,
    SmileOutlined,
    MinusOutlined,
    BorderOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import {
    Attachments,
    Bubble,
    Conversations,
    Prompts,
    Sender,
    Welcome,
    useXAgent,
    useXChat,
} from '@ant-design/x';
import { Avatar, Button, Drawer, Flex, type GetProp, Space, Spin, message } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { isElectron, electronWindowControls } from '../../utils/environment';

type BubbleDataType = {
    role: string;
    content: string;
};

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

const DEFAULT_CONVERSATIONS_ITEMS = [
    {
        key: 'default-0',
        label: '什么是凯哥人工智能?',
        group: 'Today',
    },
    {
        key: 'default-1',
        label: '怎么学习凯哥人工智能?',
        group: 'Today',
    },
    {
        key: 'default-2',
        label: 'New AGI Hybrid Interface',
        group: 'Yesterday',
    },
];

const HOT_TOPICS = {
    key: '1',
    label: 'Hot Topics',
    children: [
        {
            key: '1-1',
            description: 'What has 凯哥人工智能 upgraded?',
            icon: <span style={{ color: '#f93a4a', fontWeight: 700 }}>1</span>,
        },
        {
            key: '1-2',
            description: 'New AGI Hybrid Interface',
            icon: <span style={{ color: '#ff6565', fontWeight: 700 }}>2</span>,
        },
        {
            key: '1-3',
            description: 'What components are in 凯哥人工智能?',
            icon: <span style={{ color: '#ff8f1f', fontWeight: 700 }}>3</span>,
        },
        {
            key: '1-4',
            description: 'Come and discover the new design paradigm of the AI era.',
            icon: <span style={{ color: '#00000040', fontWeight: 700 }}>4</span>,
        },
        {
            key: '1-5',
            description: 'How to quickly install and import components?',
            icon: <span style={{ color: '#00000040', fontWeight: 700 }}>5</span>,
        },
    ],
};

const DESIGN_GUIDE = {
    key: '2',
    label: 'Design Guide',
    children: [
        {
            key: '2-1',
            icon: <HeartOutlined />,
            label: 'Intention',
            description: 'AI understands user needs and provides solutions.',
        },
        {
            key: '2-2',
            icon: <SmileOutlined />,
            label: 'Role',
            description: "AI's public persona and image",
        },
        {
            key: '2-3',
            icon: <CommentOutlined />,
            label: 'Chat',
            description: 'How AI Can Express Itself in a Way Users Understand',
        },
        {
            key: '2-4',
            icon: <PaperClipOutlined />,
            label: 'Interface',
            description: 'AI balances "chat" & "do" behaviors.',
        },
    ],
};

const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
    {
        key: '1',
        description: 'Upgrades',
        icon: <ScheduleOutlined />,
    },
    {
        key: '2',
        description: 'Components',
        icon: <ProductOutlined />,
    },
    {
        key: '3',
        description: 'RICH Guide',
        icon: <FileSearchOutlined />,
    },
    {
        key: '4',
        description: 'Installation Introduction',
        icon: <AppstoreAddOutlined />,
    },
];

const useStyle = createStyles(({ token, css }) => {
    return {
        layout: css`
        width: 100%;
        height: 100dvh;
        display: flex;
        background: ${token.colorBgContainer};
        font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
        position: relative;
        overflow: hidden;
        
        &.electron-layout {
          height: calc(100dvh - 32px);
        }
        
        /* 全局隐藏滚动条样式 */
        * {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
          
          &::-webkit-scrollbar {
            display: none; /* Chrome/Safari/Webkit */
          }
        }
        
        /* iOS安全区域支持 */
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
        
        @media (max-width: 768px) {
          flex-direction: column;
        }
      `,
        // 手机端顶部菜单栏
        mobileHeader: css`
        display: none;
        
        @media (max-width: 768px) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          background: ${token.colorBgContainer};
          border-bottom: 1px solid ${token.colorBorderSecondary};
          height: 48px;
          flex-shrink: 0;
          z-index: 100;
          
          .logo {
            display: flex;
            align-items: center;
            gap: 8px;
            
            span {
              font-weight: bold;
              color: ${token.colorText};
              font-size: 14px;
            }
          }
        }
      `,
        // sider 样式
        sider: css`
        background: ${token.colorBgLayout}80;
        width: 280px;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 0 12px;
        box-sizing: border-box;
        
        @media (max-width: 768px) {
          display: none;
        }
      `,
        // 手机端抽屉样式
        drawerContent: css`
        background: ${token.colorBgLayout}80;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 0 12px;
        box-sizing: border-box;
      `,
        logo: css`
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 0 24px;
        box-sizing: border-box;
        gap: 8px;
        margin: 24px 0;
  
        span {
          font-weight: bold;
          color: ${token.colorText};
          font-size: 16px;
        }
        
        @media (max-width: 768px) {
          margin: 12px 0;
          padding: 0 16px;
        }
      `,
        addBtn: css`
        background: #1677ff0f;
        border: 1px solid #1677ff34;
        height: 40px;
        
        @media (max-width: 768px) {
          height: 32px;
          font-size: 12px;
        }
      `,
        conversations: css`
        flex: 1;
        overflow-y: auto;
        margin-top: 12px;
        padding: 0;
        
        /* 隐藏滚动条但保持滚动功能 */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
        
        &::-webkit-scrollbar {
          display: none; /* Chrome/Safari/Webkit */
        }
  
        .ant-conversations-list {
          padding-inline-start: 0;
        }
      `,
        siderFooter: css`
        border-top: 1px solid ${token.colorBorderSecondary};
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        @media (max-width: 768px) {
          height: 32px;
          padding: 0 8px;
        }
      `,
        // chat list 样式
        chat: css`
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding-block: ${token.paddingLG}px;
        gap: 16px;
        
        @media (max-width: 768px) {
          padding: 8px;
          gap: 8px;
          overflow: hidden;
        }
      `,
        chatPrompt: css`
        .ant-prompts-label {
          color: #000000e0 !important;
        }
        .ant-prompts-desc {
          color: #000000a6 !important;
          width: 100%;
        }
        .ant-prompts-icon {
          color: #000000a6 !important;
        }
        
        @media (max-width: 768px) {
          .ant-prompts-label {
            font-size: 12px !important;
          }
          .ant-prompts-desc {
            font-size: 10px !important;
          }
        }
      `,
        chatList: css`
        flex: 1;
        overflow: auto;
        
        /* 隐藏滚动条但保持滚动功能 */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
        
        &::-webkit-scrollbar {
          display: none; /* Chrome/Safari/Webkit */
        }
        
        @media (max-width: 768px) {
          min-height: 0;
        }
      `,
        loadingMessage: css`
        background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
        background-size: 100% 2px;
        background-repeat: no-repeat;
        background-position: bottom;
      `,
        placeholder: css`
        padding-top: 32px;
        
        @media (max-width: 768px) {
          padding-top: 8px;
        }
      `,
        // sender 样式
        sender: css`
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        flex-shrink: 0;
        
        @media (max-width: 768px) {
          max-width: 100%;
          margin: 0;
        }
      `,
        speechButton: css`
        font-size: 18px;
        color: ${token.colorText} !important;
        
        @media (max-width: 768px) {
          font-size: 14px;
        }
      `,
        senderPrompt: css`
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        color: ${token.colorText};
        flex-shrink: 0;
        
        @media (max-width: 768px) {
          max-width: 100%;
          margin: 0;
          
          .ant-prompts-item {
            padding: 2px 6px !important;
            font-size: 10px !important;
          }
        }
      `,
        // 手机端特殊样式
        mobileWelcome: css`
        @media (max-width: 768px) {
          .ant-welcome-title {
            font-size: 16px !important;
          }
          .ant-welcome-description {
            font-size: 12px !important;
          }
          .ant-welcome-icon {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `,
        mobilePrompts: css`
        @media (max-width: 768px) {
          flex-direction: column !important;
          gap: 4px !important;
          
          .ant-prompts-item {
            margin-bottom: 0 !important;
            padding: 8px !important;
          }
          
          .ant-prompts-subitem {
            padding: 4px 8px !important;
          }
        }
      `,
        mobileBubbleList: css`
        @media (max-width: 768px) {
          padding-inline: 4px !important;
          
          .ant-bubble {
            font-size: 14px;
            margin-bottom: 8px;
          }
          
          .ant-bubble-footer {
            .ant-btn {
              font-size: 10px;
              padding: 0 2px;
              height: 20px;
            }
          }
        }
      `,
        // 手机端输入区域
        mobileInputArea: css`
        @media (max-width: 768px) {
          flex-shrink: 0;
          padding: 4px 0;
        }
      `,
    };
});

const Independent: React.FC = () => {
    const { styles } = useStyle();
    const abortController = useRef<AbortController>(null);
    // 判断是否在 Electron 环境中
    const electronEnv = isElectron();

    // ==================== State ====================
    const [messageHistory, setMessageHistory] = useState<Record<string, any>>({});
    const [conversations, setConversations] = useState(DEFAULT_CONVERSATIONS_ITEMS);
    const [curConversation, setCurConversation] = useState(DEFAULT_CONVERSATIONS_ITEMS[0].key);
    const [attachmentsOpen, setAttachmentsOpen] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<GetProp<typeof Attachments, 'items'>>([]);
    const [inputValue, setInputValue] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);

    // ==================== Runtime ====================
    const [agent] = useXAgent<BubbleDataType>({
        baseURL: 'https://api.x.ant.design/api/llm_siliconflow_deepSeek-r1-distill-1wen-7b',
        model: 'DeepSeek-R1-Distill-Qwen-7B',
        dangerouslyApiKey: 'Bearer sk-xxxxxxxxxxxxxxxxxxxx',
    });
    const loading = agent.isRequesting();

    const { onRequest, messages, setMessages } = useXChat({
        agent,
        requestFallback: (_, { error }) => {
            if (error.name === 'AbortError') {
                return {
                    content: 'Request is aborted',
                    role: 'assistant',
                };
            }
            return {
                content: 'Request failed, please try again!',
                role: 'assistant',
            };
        },
        transformMessage: (info) => {
            const { originMessage, chunk } = info || {};
            let currentContent = '';
            let currentThink = '';
            try {
                if (chunk?.data && !chunk?.data.includes('DONE')) {
                    const message = JSON.parse(chunk?.data);
                    currentThink = message?.choices?.[0]?.delta?.reasoning_content || '';
                    currentContent = message?.choices?.[0]?.delta?.content || '';
                }
            } catch (error) {
                console.error(error);
            }

            let content = '';

            if (!originMessage?.content && currentThink) {
                content = `<think>${currentThink}`;
            } else if (
                originMessage?.content?.includes('<think>') &&
                !originMessage?.content.includes('</think>') &&
                currentContent
            ) {
                content = `${originMessage?.content}</think>${currentContent}`;
            } else {
                content = `${originMessage?.content || ''}${currentThink}${currentContent}`;
            }

            return {
                content: content,
                role: 'assistant',
                status: info.status,
            };
        },
        resolveAbortController: (controller) => {
            abortController.current = controller;
        },
    });

    // ==================== Event ====================
    const onSubmit = (val: string) => {
        if (!val) return;

        if (loading) {
            message.error('Request is in progress, please wait for the request to complete.');
            return;
        }

        onRequest({
            stream: true,
            message: { role: 'user', content: val },
        });
    };


    // ==================== Nodes ====================
    // 提取侧边栏内容为独立组件
    const siderContent = (
        <div className={styles.drawerContent}>
            {/* 🌟 Logo */}
            <div className={styles.logo}>
                <img
                    src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
                    draggable={false}
                    alt="logo"
                    width={24}
                    height={24}
                />
                <span>凯哥人工智能</span>
            </div>

            {/* 🌟 添加会话 */}
            <Button
                onClick={() => {
                    const now = dayjs().valueOf().toString();
                    setConversations([
                        {
                            key: now,
                            label: `新对话 ${conversations.length + 1}`,
                            group: 'Today',
                        },
                        ...conversations,
                    ]);
                    setCurConversation(now);
                    setMessages([]);
                    setDrawerOpen(false); // 手机端创建新对话后关闭抽屉
                }}
                type="link"
                className={styles.addBtn}
                icon={<PlusOutlined />}
            >
                新对话
            </Button>

            {/* 🌟 会话管理 */}
            <Conversations
                items={conversations}
                className={styles.conversations}
                activeKey={curConversation}
                onActiveChange={async (val) => {
                    abortController.current?.abort();
                    // The abort execution will trigger an asynchronous requestFallback, which may lead to timing issues.
                    // In future versions, the sessionId capability will be added to resolve this problem.
                    setTimeout(() => {
                        setCurConversation(val);
                        setMessages(messageHistory?.[val] || []);
                        setDrawerOpen(false); // 手机端切换对话后关闭抽屉
                    }, 100);
                }}
                groupable
                styles={{ item: { padding: '0 8px' } }}
                menu={(conversation) => ({
                    items: [
                        {
                            label: '重命名',
                            key: 'rename',
                            icon: <EditOutlined />,
                        },
                        {
                            label: '删除',
                            key: 'delete',
                            icon: <DeleteOutlined />,
                            danger: true,
                            onClick: () => {
                                const newList = conversations.filter((item) => item.key !== conversation.key);
                                const newKey = newList?.[0]?.key;
                                setConversations(newList);
                                // The delete operation modifies curConversation and triggers onActiveChange, so it needs to be executed with a delay to ensure it overrides correctly at the end.
                                // This feature will be fixed in a future version.
                                setTimeout(() => {
                                    if (conversation.key === curConversation) {
                                        setCurConversation(newKey);
                                        setMessages(messageHistory?.[newKey] || []);
                                    }
                                }, 200);
                            },
                        },
                    ],
                })}
            />

            <div className={styles.siderFooter}>
                <Avatar size={24} />
                <Button type="text" icon={<QuestionCircleOutlined />} />
            </div>
        </div>
    );

    const chatSider = (
        <div className={styles.sider}>
            {siderContent}
        </div>
    );

    // 手机端顶部栏
    const mobileHeader = (
        <div className={styles.mobileHeader}>
            <div className="logo">
                <img
                    src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
                    draggable={false}
                    alt="logo"
                    width={16}
                    height={16}
                />
                <span>凯哥人工智能</span>
            </div>
            <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                size="small"
            />
        </div>
    );

    const chatList = (
        <div className={styles.chatList}>
            {messages?.length ? (
                /* 🌟 消息列表 */
                <Bubble.List
                    items={messages?.map((i) => ({
                        ...i.message,
                        classNames: {
                            content: i.status === 'loading' ? styles.loadingMessage : '',
                        },
                        typing: i.status === 'loading' ? { step: 5, interval: 20, suffix: <>💗</> } : false,
                    }))}
                    style={{ height: '100%', paddingInline: 'calc(calc(100% - 700px) /2)' }}
                    className={styles.mobileBubbleList}
                    roles={{
                        assistant: {
                            placement: 'start',
                            footer: (
                                <div style={{ display: 'flex' }}>
                                    <Button type="text" size="small" icon={<ReloadOutlined />} />
                                    <Button type="text" size="small" icon={<CopyOutlined />} />
                                    <Button type="text" size="small" icon={<LikeOutlined />} />
                                    <Button type="text" size="small" icon={<DislikeOutlined />} />
                                </div>
                            ),
                            loadingRender: () => <Spin size="small" />,
                        },
                        user: { placement: 'end' },
                    }}
                />
            ) : (
                <Space
                    direction="vertical"
                    size={16}
                    style={{ paddingInline: 'calc(calc(100% - 700px) /2)', width: '100%' }}
                    className={`${styles.placeholder} ${styles.mobileWelcome}`}
                >
                    <Welcome
                        variant="borderless"
                        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                        title="你好，我是世界上最牛逼的凯哥人工智能"
                        description="基于 BAt Design，AGI   产品界面解决方案，创造更好的智能视觉~"
                        extra={
                            <Space>
                                <Button icon={<ShareAltOutlined />} />
                                <Button icon={<EllipsisOutlined />} />
                            </Space>
                        }
                    />
                    <Flex gap={16} className={styles.mobilePrompts}>
                        <Prompts
                            items={[HOT_TOPICS]}
                            styles={{
                                list: { height: '100%' },
                                item: {
                                    flex: 1,
                                    backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                                    borderRadius: 12,
                                    border: 'none',
                                },
                                subItem: { padding: 0, background: 'transparent' },
                            }}
                            onItemClick={(info) => {
                                onSubmit(info.data.description as string);
                            }}
                            className={styles.chatPrompt}
                        />

                        <Prompts
                            items={[DESIGN_GUIDE]}
                            styles={{
                                item: {
                                    flex: 1,
                                    backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                                    borderRadius: 12,
                                    border: 'none',
                                },
                                subItem: { background: '#ffffffa6' },
                            }}
                            onItemClick={(info) => {
                                onSubmit(info.data.description as string);
                            }}
                            className={styles.chatPrompt}
                        />
                    </Flex>
                </Space>
            )}
        </div>
    );
    const senderHeader = (
        <Sender.Header
            title="上传文件"
            open={attachmentsOpen}
            onOpenChange={setAttachmentsOpen}
            styles={{ content: { padding: 0 } }}
        >
            <Attachments
                beforeUpload={() => false}
                items={attachedFiles}
                onChange={(info) => setAttachedFiles(info.fileList)}
                placeholder={(type) =>
                    type === 'drop'
                        ? { title: '将文件拖到这里' }
                        : {
                            icon: <CloudUploadOutlined />,
                            title: '上传文件',
                            description: '点击或拖拽文件到此区域上传',
                        }
                }
            />
        </Sender.Header>
    );
    const chatSender = (
        <div className={styles.mobileInputArea}>
            {/* 🌟 提示词 */}
            <Prompts
                items={SENDER_PROMPTS}
                onItemClick={(info) => {
                    onSubmit(info.data.description as string);
                }}
                styles={{
                    item: { padding: '6px 12px', marginBottom: '10px' },
                }}
                className={styles.senderPrompt}
            />
            {/* 🌟 输入框 */}
            <Sender
                value={inputValue}
                header={senderHeader}
                onSubmit={() => {
                    onSubmit(inputValue);
                    setInputValue('');
                }}
                onChange={setInputValue}
                onCancel={() => {
                    abortController.current?.abort();
                }}
                prefix={
                    <Button
                        type="text"
                        icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
                        onClick={() => setAttachmentsOpen(!attachmentsOpen)}
                    />
                }
                loading={loading}
                className={styles.sender}
                allowSpeech
                actions={(_, info) => {
                    const { SendButton, LoadingButton, SpeechButton } = info.components;
                    return (
                        <Flex gap={4}>
                            <SpeechButton className={styles.speechButton} />
                            {loading ? <LoadingButton type="default" /> : <SendButton type="primary" />}
                        </Flex>
                    );
                }}
                placeholder="询问或输入 / 使用技能"
            />
        </div>
    );

    useEffect(() => {
        // history mock
        if (messages?.length) {
            setMessageHistory((prev) => ({
                ...prev,
                [curConversation]: messages,
            }));
        }
    }, [messages]);

    // ==================== Render =================
    return (
        <div className={`${styles.layout} ${electronEnv ? 'electron-layout' : ''}`}>
            {mobileHeader}
            {chatSider}

            {/* 手机端抽屉 */}
            <Drawer
                title={null}
                placement="left"
                closable={false}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                bodyStyle={{ padding: 0 }}
                width={280}
            >
                {siderContent}
            </Drawer>

            <div className={styles.chat}>
                {chatList}
                {chatSender}
            </div>
        </div>
    );
};

export default Independent;