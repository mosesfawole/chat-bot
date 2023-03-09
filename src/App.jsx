import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useEffect, useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

function App() {
  const [messages, setMessages] = useState([]);

  const [typing, setTyping] = useState(false);
  const apiKey = import.meta.env.VITE_OPENAI_KEY;

  // get saved messages
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("messages"));

    if (items) setMessages(items);
  }, []);

  const handleSubmit = async (message) => {
    //  open ai
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
  };

  // process mesaage to chatgpt
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
      content: "Speak with british slangs",
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

        let message = data.choices[0].message.content;

        setMessages([
          ...chatMessages,
          {
            message: message,
            sender: "ChatGPT",
          },
        ]);

        setTyping(false);
        // save to local storage
        localStorage.setItem("messages", JSON.stringify(messages));
      })

      .catch((error) => {
        console.error(error);
      });
  };

  const clearChats = () => {
    setMessages([]);
  };

  return (
    <div className="App">
      <div className="header">
        <h1 style={{ textAlign: "center" }}>Welcome to ChatGeePeeTee 😃</h1>
        <div className="btn">
          <button onClick={clearChats} className="btn">
            New Chat
          </button>
        </div>
      </div>
      <div className="box">
        <MainContainer>
          <ChatContainer>
            <MessageList
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
