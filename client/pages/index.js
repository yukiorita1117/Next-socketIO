import { useState } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import useSocket from "../hooks/useSocket";
import axios from "axios";

export default function ChatOne(props) {
  const [field, setField] = useState("");
  const [newMessage, setNewMessage] = useState(0);
  const [messages, setMessages] = useState(props.messages || []);

  const socket = useSocket("message.chat1", message => {
    setMessages(messages => [...messages, message]);
  });

  useSocket("message.chat2", () => {
    setNewMessage(newMessage => newMessage + 1);
  });

  const handleSubmit = event => {
    event.preventDefault();

    // create message object
    const message = {
      id: new Date().getTime(),
      value: field
    };

    // send object to WS server
    socket.emit("message.chat1", message);
    setField("");
    setMessages(messages => [...messages, message]);
  };

  var _resultArray = [];

  // axios handler
  const handleFetch = () => {
    // store.dispatch(requestData()); // axios.get()を呼ぶ前にisFetchingをtrueに！
    axios
      .get("/api/test")
      .then(response => {
        console.log("response");
        // データ受け取りに成功
        _resultArray.push(response.data);
        // store.dispatch(receiveDataSuccess(_resultArray)); // データをstoreに保存するとともにisFetchingをfalseに
      })
      .catch(err => {
        // データ受け取りに失敗
        console.log("fetch失敗");
        // console.error(new Error(err));
      });
  };

  return (
    <main>
      <div>
        <Link href="/">
          <a>{"Chat One"}</a>
        </Link>
        <br />
        <Link href="/clone">
          <a>
            {`Chat Two${
              newMessage > 0 ? ` ( ${newMessage} new message )` : ""
            }`}
          </a>
        </Link>
        <ul>
          {messages.map(message => (
            <li key={message.id}>{message.value}</li>
          ))}
        </ul>
        <form onSubmit={e => handleSubmit(e)}>
          <input
            onChange={e => setField(e.target.value)}
            type="text"
            placeholder="入力してください"
            value={field}
          />
          <button>Send</button>
        </form>
        {/* test */}
        <div>
          <button onClick={() => handleFetch()}>fetch data</button>
          <ul>
            {_resultArray.map(result => (
              <Item key={result.id}>{`${result.inputText}`}</Item>
            ))}
          </ul>
          {props.test}
        </div>
      </div>
    </main>
  );
}

ChatOne.getInitialProps = async () => {
  const response = await fetch("http://localhost:3000/messages/chat1");
  const messages = await response.json();
  const test = await "テスト";

  return { messages, test };
};
