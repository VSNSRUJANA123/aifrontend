// // import React, { useEffect, useRef } from "react";
// import Typewriter from "./Typewriter";
// import "./styles/chat.css";

// const Chat = (props) => {
//   const { chatList } = props;

//   return (
//     <div className="chat-container">
//       {chatList.map((item, index) => (
//         <div key={index}>
//           <div className="user-msg-container">
//             <div className="user-msg">
//               <p>
//                 <span className="chat-status">Student</span> : {item.message}
//               </p>
//             </div>
//           </div>
//           <div className="ai-reply">
//             <span className="chat-status">SaAi</span> :
//             <Typewriter text={item.reply} />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Chat;

import React, { useEffect, useRef } from "react";
import Typewriter from "./Typewriter";
import "./styles/chat.css";

const Chat = (props) => {
  const { chatList } = props;
  const chatContainerRef = useRef(null);

  useEffect(() => {
    console.log(
      (chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight)
    );
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatList]);

  return (
    <div className="chat-container" ref={chatContainerRef}>
      {chatList.map((item, index) => (
        <div key={index}>
          <div className="user-msg-container">
            <div className="user-msg">
              <p>
                <span className="chat-status">Student</span> : {item.message}
              </p>
            </div>
          </div>
          <div className="ai-reply">
            <span className="chat-status">SaAi</span> :
            <Typewriter text={item.reply} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chat;
