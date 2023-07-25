import './App.css';
import Chat, { Bubble, useMessages } from '@chatui/core';
import "@chatui/core/dist/index.css";

import {
  Typography, Space, Card,
  Input, Layout, Menu,
  theme, Breadcrumb, ConfigProvider,
  Button, Form, message
} from 'antd';

import {
  useState,
  useRef,
  useEffect,
  createRef
} from 'react';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  RocketOutlined,
  CopyOutlined,
  PaperClipOutlined
} from '@ant-design/icons';

import formStyles from "./chatForm/style";
import { fetchMessage } from "./actions/chatActions";

import { CopyToClipboard } from "react-copy-to-clipboard";
import moment from "moment";

import styles from "./components/chatView/style"

const { Header, Content, Footer, Sider } = Layout;
const { TextArea } = Input;
const { Paragraph } = Typography;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Travis', '3')
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('X', '8')]),
  getItem('Files', '9', <FileOutlined />),
];
const onChange = (e) => {

};

const App = () => {

  const { messages, appendMsg, setTyping } = useMessages([]);

  const [copied, setCopied] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState();
  const [currentBulletin, setCurrentBulletin] = useState();

  const messageRefs = useRef([]);
  //const { messages, loading, error } = useSelector((state) => state.chat);
  const [dataField] = Form.useForm();
  const dispatchNow = useDispatch();
  const messageInputRef = useRef(null);
  const { loadingNow } = useSelector((state) => state.chat);
  const [collapsed, setCollapsed] = useState(false);
  messageRefs.current = [...Array(messages.length).keys()].map(
    (_, i) => messageRefs.current[i] ?? createRef()
  );


  


  const onSubmit = (e) => {
    if (!e.target.value) {
      return;
    }
    //const currentPromptNow = e.target.value
    //dataField.resetFields();
  }

  const setPrompt = async (currentPrompt) => {
    try {
      const req = await fetch('api/setprompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentPrompt, })
      });
      console.log(req)
      return req

    } catch (err) {
      console.log(err)
    };
  }

  const getBulletin = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/bulletin');
      const cleaned = await res.json();
      let bulletin = cleaned[0];
      setCurrentBulletin(bulletin)
      return bulletin
      
      

    } catch (err) {
      console.log(err)
    }
  }

  const getLLMResponse = async (currentResponse) => {
    try {
      const res = await fetch('api/getLLMRes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ llmResponse: currentResponse })
      });

      return res

    } catch (err) {
      console.log(err)
    }
  }

  const onSubmitNow = (event) => {

    if (event.target.value) {
      console.log(event)
    }
  }

  function handleSend(type, val) {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right"
      });

      setTyping(true);

      const latestBulletin = getBulletin()
      console.log(latestBulletin)

      setTimeout(() => {
        appendMsg({
          type: "text",
          content: { text: currentBulletin }
        });
      }, 1000);
    }
  }

  function renderMessageContent(msg) {
    const { content } = msg;
    return <Bubble content={content.text} />
  }

  return (
    <div className="App">
      <ConfigProvider theme={{
        components: {
          Menu: {
            colorPrimary: '#FFAC1C',
          },
        },
      }}>
        <Layout style={{
          height: 860
        }}>
          <Sider style={{
            overflow: 'auto',
          }} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className="demo-logo-vertical" />
            <Menu defaultSelectedKeys={['1']} mode="inline" items={items} />
          </Sider>
          <Card style={{ height: '100vh', width: '100%' }}>

            <Chat messages={messages}
              renderMessageContent={renderMessageContent}
              onSend={handleSend}
            >
            </Chat>
          </Card>
        </Layout>
      </ConfigProvider>
    </div>
  );
}

/*


useEffect(() => {
    const bulletinNow = getBulletin()
    console.log(bulletinNow)
  setCurrentPrompt(bulletinNow)
    appendMsg({
      type: "text",
      content: {
        text: currentPrompt
      }
    });
  }, []);

const {
    token: { colorBgContainer },
  } = theme.useToken();

useEffect(() => {
    if (message.length) {
      setTimeout(() => {
        messageRefs.current[messageRefs.length - 1].current.scrollIntoView({
          behavior: "smooth",
        })
      }, 1)
    }

    if (error && !loading) {
      messageApi.open({
        type: "error",
        content: error,
      });
    }
  }, [message, error, loading])

useEffect(() => {

    if (!loadingNow) {

      setTimeout(() => {
        messageInputRef.current.focus()
      }, 0);
    }
  }, [loading]);

<div style={styles.chatViewStyle}>
              {contextHolder}
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  ref={messageRefs.current[idx]}
                  style={msg.type === "a" ? null : styles.sentMsgContainerStyle}>
                  <Space
                    style={msg.type === "a" ? styles.receivedMsgStyle : styles.sentMsgStyle}
                    align="start">
                    <div
                      style={styles.msgTextStyle}
                      dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br />") }}></div>
                    {msg.type === "a" ?
                      (<CopyToClipboard onCopy={() => setCopied(true)} text={msg.text}>
                        <CopyOutlined />
                      </CopyToClipboard>) : (<></>)}
                  </Space>
                </div>
              ))}
            </div>

<Form layout="inline" form={dataField} name="message-form" style={formStyles.formStyle}>
              <Form.Item style={formStyles.inputStyle} name="message">
                <Input size="large"
                  shape="circle"
                  disabled={loadingNow}
                  onPressEnter={onSubmit}
                  ref={messageInputRef}
                  suffix={<PaperClipOutlined />}>
                </Input>
              </Form.Item>
              <Form.Item>
                <Button type="primary"
                  size="large"
                  style={formStyles.btnStyle}>
                  <RocketOutlined></RocketOutlined>
                </Button>
              </Form.Item>
            </Form>

*/






export default App;
