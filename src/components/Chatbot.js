import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { IoIosArrowForward } from "react-icons/io";
import { IoArrowUpCircleSharp } from "react-icons/io5";
import { baseUrl } from "../../src/url";
import { HiMenuAlt4 } from "react-icons/hi";
import { FaRegStopCircle } from "react-icons/fa";
import { GrPowerCycle } from "react-icons/gr";
import axios from "axios";
import { IoIosCopy } from "react-icons/io";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { IoPauseCircleOutline } from "react-icons/io5";
import "./styles/chatbot.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
// import { useSpeechSynthesis } from "@speechly/react-speech-recognition";
import { FiMic, FiShare2 } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
const Chatbot = () => {
  const { search } = useParams();
  const [result, setResults] = useState("");
  const [error, setError] = useState("");
  const [topic, setTopic] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  // const { speak, voices } = useSpeechSynthesis();
  const chatEndRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [displayedText, setDisplayedText] = useState([]);

  // const typewriterRef = useRef(null);

  // useEffect(() => {
  //   let paragraphs = text.split("\n");

  //   let interval;
  //   let currentIndex = 0;
  //   let currentText = "";

  //   const typeText = () => {
  //     if (currentIndex < paragraphs.length) {
  //       let paragraph = paragraphs[currentIndex];
  //       if (currentText.length < paragraph.length) {
  //         currentText += paragraph[currentText.length];
  //         setDisplayedText((prev) => [...prev.slice(0, -1), currentText]);
  //       } else {
  //         currentIndex++;
  //         currentText = "";
  //         setDisplayedText((prev) => [...prev, ""]);
  //       }
  //     } else {
  //       clearInterval(interval);
  //     }

  //     if (typewriterRef.current) {
  //       typewriterRef.current.scrollTop = typewriterRef.current.scrollHeight;
  //     }
  //   };

  //   interval = setInterval(typeText, speed);

  //   return () => clearInterval(interval);
  // }, [text, speed]);
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Web Speech API is not supported by this browser.");
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setInput(event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setChat([...chat, userMessage]);

    const requestId = uuidv4();
    setCurrentRequestId(requestId);
    setIsGenerating(true);

    try {
      const res = await axios.post(`${baseUrl}/api/message`, {
        message: input,
        requestId,
      });
      const botMessage = { sender: "bot", text: res.data.reply };
      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }

    setInput("");
  };

  const handleStop = async () => {
    if (currentRequestId) {
      await axios.post(`http://localhost:5000/api/chat/stop`, {
        requestId: currentRequestId,
      });
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async (message) => {
    const requestId = uuidv4();
    setCurrentRequestId(requestId);
    setIsGenerating(true);

    try {
      const res = await axios.post(`${baseUrl}/api/message`, {
        message,
        requestId,
      });
      const botMessage = { sender: "bot", text: res.data.reply };
      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const menuIcon = (sidebar) => {
    setSidebar(!sidebar);
  };
  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/search`, {
          params: { subjectName: search },
        });
        setResults(response.data[0].title);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    handleSearch();
  }, []);

  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleFetchTopics = async () => {
      try {
        const response = await axios.post(`${baseUrl}/api/topics`, {
          subject: search,
        });
        setTopic(response.data.topics);
      } catch (error) {
        setError("Error fetching topics");
        console.error("Error fetching topics:", error);
      }
    };
    handleFetchTopics();
  }, []);
  const user = "student : ";
  const bot = "chatbot : ";
  return (
    <div className="chatbot-container">
      <div className="direction-container">
        <HiMenuAlt4
          onClick={() => menuIcon(sidebar)}
          className="chat-menu-icon"
        />
        <h3 className="small-title-iasai">SaAi</h3>
        <div className="direction">
          <h3>
            UPSC <IoIosArrowForward /> {result}
          </h3>
        </div>
        <HiMenuAlt4 className="chat-menu-disable" />
      </div>
      <div className="sidebar-chatbot-container">
        <Sidebar
          topic={topic}
          search={search}
          sidebar={sidebar}
          onClose={() => setSidebar(false)}
        />
        <div className="chatbot">
          <h2>{search}</h2>
          <hr className="hr" />
          <div className="bot-text">
            <p>
              Welcome to the IASAI {search} Guide! I'm here to help you
              understand the intricacies on {search} and related topics. Whether
              you're preparing for the IAS exams or simply curious about{" "}
              {search}, I'm here to provide insights and explanations.
            </p>
          </div>
          <div className="chat-container">
            {chat.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender}`}
                // ref={message.sender === "bot" && typewriterRef}
              >
                <p className="ai-reply">
                  <span className="chat-status">
                    {message.sender === "bot" ? "SaAi : " : "Student : "}
                  </span>
                  {message.sender === "bot"
                    ? `${message.text}`
                    : `${message.text}`}
                </p>
                {message.sender === "bot" && (
                  <div className="message-actions">
                    {/* <button
                    onClick={() =>
                      speak({ text: message.text, voice: voices[0] })
                    }
                  >
                    Read Aloud
                  </button> */}
                    <button className="icon-btn-style">
                      <HiMiniSpeakerWave className="mic-icon-1" />
                    </button>
                    <CopyToClipboard text={message.text}>
                      <button className="icon-btn-style">
                        <IoIosCopy className="mic-icon-1" />
                      </button>
                    </CopyToClipboard>
                    <button
                      className="icon-btn-style"
                      onClick={() => handleRegenerate(chat[index - 1].text)}
                    >
                      <GrPowerCycle className="mic-icon-1" />
                    </button>
                    <button className="icon-btn-style">
                      <FiShare2 className="mic-icon-1" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
          <div className="mic-input-btn-container">
            <button
              className="icon-btn-style"
              type="button"
              onClick={handleVoiceInput}
            >
              {isListening ? (
                <IoPauseCircleOutline className="mic-icon" />
              ) : (
                <FiMic className="mic-icon" />
              )}
            </button>
            <form className="form-container" onSubmit={handleSubmit}>
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                className="text-area"
                placeholder="Enter your message"
                rows="1"
                style={{ resize: "none", overflow: "hidden" }}
              />

              {isGenerating ? (
                <button
                  className="icon-btn-style"
                  type="button"
                  onClick={handleStop}
                >
                  <FaRegStopCircle className="icon-size" />
                </button>
              ) : (
                <button className="icon-btn-style" type="submit">
                  <IoArrowUpCircleSharp className="icon-size" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chatbot;

// function Chatbot() {
//   const [input, setInput] = useState("");
//   const [chat, setChat] = useState([]);
//   // const { speak, voices } = useSpeechSynthesis();
//   const chatEndRef = useRef(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [currentRequestId, setCurrentRequestId] = useState(null);
//   const [isListening, setIsListening] = useState(false);
//   const recognitionRef = useRef(null);
//   useEffect(() => {
//     if (!("webkitSpeechRecognition" in window)) {
//       console.error("Web Speech API is not supported by this browser.");
//     } else {
//       const recognition = new window.webkitSpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.onresult = (event) => {
//         let interimTranscript = "";
//         for (let i = event.resultIndex; i < event.results.length; ++i) {
//           if (event.results[i].isFinal) {
//             setInput(event.results[i][0].transcript);
//           } else {
//             interimTranscript += event.results[i][0].transcript;
//           }
//         }
//       };
//       recognitionRef.current = recognition;
//     }
//   }, []);

//   const handleVoiceInput = () => {
//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setChat([...chat, userMessage]);

//     const requestId = uuidv4();
//     setCurrentRequestId(requestId);
//     setIsGenerating(true);

//     try {
//       const res = await axios.post("http://localhost:5000/api/message", {
//         message: input,
//         requestId,
//       });
//       const botMessage = { sender: "bot", text: res.data.reply };
//       setChat((prevChat) => [...prevChat, botMessage]);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsGenerating(false);
//     }

//     setInput("");
//   };

//   const handleStop = async () => {
//     if (currentRequestId) {
//       await axios.post("http://localhost:5000/api/chat/stop", {
//         requestId: currentRequestId,
//       });
//       setIsGenerating(false);
//     }
//   };

//   const handleRegenerate = async (message) => {
//     const requestId = uuidv4();
//     setCurrentRequestId(requestId);
//     setIsGenerating(true);

//     try {
//       const res = await axios.post("http://localhost:5000/api/message", {
//         message,
//         requestId,
//       });
//       const botMessage = { sender: "bot", text: res.data.reply };
//       setChat((prevChat) => [...prevChat, botMessage]);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   return (
//     <div className="chatbot-container">
//       <header className="chatbot-header">
//         <h1>GPT Chatbot</h1>
//         <div className="chat-container">
//           {chat.map((message, index) => (
//             <div key={index} className={`chat-message ${message.sender}`}>
//               <p>{message.text}</p>
//               {message.sender === "bot" && (
//                 <div className="message-actions">
//                   {/* <button
//                     onClick={() =>
//                       speak({ text: message.text, voice: voices[0] })
//                     }
//                   >
//                     Read Aloud
//                   </button> */}
//                   <CopyToClipboard text={message.text}>
//                     <button>Copy</button>
//                   </CopyToClipboard>
//                   <button
//                     onClick={() => handleRegenerate(chat[index - 1].text)}
//                   >
//                     Regenerate
//                   </button>
//                   <CopyToClipboard text={message.text}>
//                     <button>
//                       <FiShare2 /> Share
//                     </button>
//                   </CopyToClipboard>
//                 </div>
//               )}
//             </div>
//           ))}
//           <div ref={chatEndRef}></div>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <textarea
//             value={input}
//             onChange={(e) => {
//               setInput(e.target.value);
//               e.target.style.height = "auto";
//               e.target.style.height = e.target.scrollHeight + "px";
//             }}
//             placeholder="Enter your message"
//             rows="1"
//             style={{ resize: "none", overflow: "hidden" }}
//           />
//           <button type="button" onClick={handleVoiceInput}>
//             <FiMic />
//           </button>
//           {isGenerating ? (
//             <button type="button" onClick={handleStop}>
//               Stop
//             </button>
//           ) : (
//             <button type="submit">Send</button>
//           )}
//         </form>
//       </header>
//     </div>
//   );
// }
