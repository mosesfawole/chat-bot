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
  const [typing, setTyping] = useState(false);

  const apiKey = import.meta.env.VITE_OPENAI_KEY;

  const handleSubmit = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];
    // update messages state
    setMessages(newMessages);

    // set typing indicator
    setTyping(true);
    await processMessages(newMessages);
    // process mesaage to chatgpt
  };

  const processMessages = async (chatMessages) => {
    let apiMessages = chatMessages.map((messageObj) => {
      let role = "";
      if (messageObj.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObj.message };
    });

    // role: "user" =. a message from the user, 'assistant' =. a response from chatGpt
    // system == generally one initial message defining How we want chat gpt to talk
    const systemMessage = {
      role: "system",
      content: "Speak like a pirate",
    };
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        // console.log(data);
        // console.log(data.choices[0].message.content);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setTyping(false);
      });
  };
  return (
    <div className="App">
      <div className="box">
        <MainContainer>
          <ChatContainer>
            <MessageList
              color="green"
              scrollBehavior="smooth"
              typingIndicator={
                typing ? (
                  <TypingIndicator content="ChatGeePeeTee is typing" />
                ) : null
              }
            >
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
