import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGeePeeTee",
      sender: "ChatGeePeeTEe",
    },
  ]);

  const handleSubmit = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];
    // update messages state
    setMessages(newMessages);

    // process mesaage to chatgpt
  };
  return (
    <div className="App">
      <div className="box">
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {messages.map((message, index) => (
                <Message key={index} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Enter message" onSend={handleSubmit} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
