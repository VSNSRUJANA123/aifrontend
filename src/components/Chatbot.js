// import { useState, useEffect, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import { IoIosArrowForward } from "react-icons/io";
// import { IoArrowUpCircleSharp } from "react-icons/io5";
// import { baseUrl } from "../../src/url";
// import { HiMenuAlt4 } from "react-icons/hi";
// import { FaRegStopCircle } from "react-icons/fa";
// import { GrPowerCycle } from "react-icons/gr";
// import axios from "axios";
// import { IoIosCopy } from "react-icons/io";
// import { IoPauseCircleOutline } from "react-icons/io5";
// import "./styles/chatbot.css";
// import { TiTick } from "react-icons/ti";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import { useSpeechSynthesis } from "react-speech-kit";
// import Typewriter from "./Typewriter";
// import { FiMic, FiShare2 } from "react-icons/fi";
// import { v4 as uuidv4 } from "uuid";
// import { FaBookOpen } from "react-icons/fa";
// import { LuClipboardEdit } from "react-icons/lu";
// import { IoMdHeadset } from "react-icons/io";
// import { MdHeadsetOff } from "react-icons/md";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import { FaClipboardList } from "react-icons/fa";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { CiCirclePlus } from "react-icons/ci";
// import { FaHistory } from "react-icons/fa";

// const Chatbot = () => {
//   const { search } = useParams();
//   const [result, setResults] = useState("");
//   const [error, setError] = useState("");
//   const [topic, setTopic] = useState([]);
//   const [input, setInput] = useState("");
//   const [chat, setChat] = useState([]);
//   const chatEndRef = useRef(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [currentRequestId, setCurrentRequestId] = useState(null);
//   const [isListening, setIsListening] = useState(false);
//   const recognitionRef = useRef(null);
//   const [isSharing, setIsSharing] = useState(false);
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [editedMessage, setEditedMessage] = useState("");
//   const [copySuccess, setCopySuccess] = useState(null);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [activeTopics, setActiveTopics] = useState("");
//   const { speak, cancel, speaking, voices } = useSpeechSynthesis();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [chats, setChats] = useState([]);
//   const [currentChatId, setCurrentChatId] = useState(null);

//   const toggleDropdown = (dropdown) => {
//     setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
//   };

//   const circleIcon = async () => {
//     const chatName = prompt("Enter a name for the new chat:");
//     if (chatName) {
//       try {
//         const res = await axios.post(`${baseUrl}/api/chat/new`, {
//           name: chatName,
//         });
//         setCurrentChatId(res.data.id);
//         setChat([]);
//       } catch (error) {
//         console.error("Error creating new chat:", error);
//       }
//     }
//   };
//   const fetchChatHistory = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/api/chat/history`);
//       setChats(res.data);
//     } catch (error) {
//       console.error("Error fetching chat history:", error);
//     }
//   };

//   const openChat = async (chatId) => {
//     try {
//       const res = await axios.get(`${baseUrl}/api/chat/${chatId}`);
//       setCurrentChatId(chatId);
//       setChat(res.data.messages);
//     } catch (error) {
//       console.error("Error opening chat:", error);
//     }
//   };

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
//   const handleShare = async (text) => {
//     if (navigator.share) {
//       if (isSharing) {
//         return;
//       }
//       setIsSharing(true);
//       try {
//         await navigator.share({
//           title: "Chat Message",
//           text,
//         });
//       } catch (error) {
//         console.error("Error sharing message:", error);
//       } finally {
//         setIsSharing(false);
//       }
//     } else {
//       console.log("Web Share API not supported in this browser.");
//     }
//   };
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
//       const res = await axios.post(`${baseUrl}/api/message`, {
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
//       try {
//         await axios.post(`${baseUrl}/api/chat/stop`, {
//           requestId: currentRequestId,
//         });
//         console.log("chat stopped");
//         setIsGenerating(false);
//       } catch (error) {
//         console.error("Failed to stop generation:", error);
//       }
//     }
//   };

//   const handleRegenerate = async (message) => {
//     const requestId = uuidv4();
//     setCurrentRequestId(requestId);
//     setIsGenerating(true);

//     try {
//       const res = await axios.post(`${baseUrl}/api/message`, {
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

//   useEffect(() => {
//     const handleSearch = async () => {
//       try {
//         const response = await axios.get(`${baseUrl}/api/search`, {
//           params: { subjectName: search },
//         });
//         setResults(response.data[0].title);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     handleSearch();
//   }, []);

//   const inputRef = useRef(null);
//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);

//   useEffect(() => {
//     const handleFetchTopics = async () => {
//       try {
//         const response = await axios.post(`${baseUrl}/api/topics`, {
//           subject: search,
//         });
//         setTopic(response.data.topics);
//       } catch (error) {
//         setError("Error fetching topics");
//         console.error("Error fetching topics:", error);
//       }
//     };
//     handleFetchTopics();
//   }, []);

//   const handleEdit = (message) => {
//     setEditingMessageId(message.id);
//     setEditedMessage(message.text);
//   };

//   const handleSave = (id) => {
//     const updatedChat = chat.map((msg) =>
//       msg.id === id ? { ...msg, text: editedMessage } : msg
//     );
//     setChat(updatedChat);
//     setEditingMessageId(null);
//     setEditedMessage("");
//   };

//   const handleCancel = () => {
//     setEditingMessageId(null);
//     setEditedMessage("");
//   };

//   const handleStatusTopics = (value) => {
//     setActiveTopics(value);
//   };
//   const handlePlayPause = (text) => {
//     if (isPlaying) {
//       cancel();
//       setIsPlaying(false);
//     } else {
//       speak({ text, voice: voices[0] });
//       setIsPlaying(true);
//     }
//   };
//   const toggleSidebar = () => setIsOpen(!isOpen);
//   return (
//     <div>
//       <nav className="direction-container">
//         <Sidebar topic={topic} handleStatusTopics={handleStatusTopics} />
//         <button className="sidebar_toggle-btn" onClick={toggleSidebar}>
//           ☰
//         </button>
//         <h3 className="small-title-iasai">SaAi</h3>
//         <div className="direction">
//           <div>
//             <Link to="/" className="link">
//               <IoMdArrowRoundBack className="arrow-icon" />
//             </Link>
//             <h3 className="upsc-paper">
//               <Link className="link" to="/">
//                 UPSC
//               </Link>
//               <IoIosArrowForward /> {result}
//             </h3>
//           </div>
//           <div className="upsc-icon-container">
//             <FaClipboardList className="syllabus" />
//             <BsThreeDotsVertical className="syllabus" />
//           </div>
//         </div>
//         <hr className="hr" />
//         <HiMenuAlt4 className="chat-menu-disable" />
//       </nav>
//       <div className="sidebar-chatbot-container">
//         <div
//           className={`big-screen-navbar  ${isOpen && "big-screen-bar-open"}`}
//         >
//           <ul className="sidebar__list">
//             <li className="sidebar__item">
//               <div
//                 className="btn-arrow"
//                 onClick={() => {
//                   toggleDropdown("dropdown1");
//                 }}
//               >
//                 <button className="sidebar-btn">
//                   <FaBookOpen className="sidebar-icon" />
//                   Topics
//                 </button>
//               </div>
//               {activeDropdown === "dropdown1" && (
//                 <ul className="sidebar__dropdown">
//                   {topic.map((items) => {
//                     return (
//                       <li
//                         className="sidebar_dropdown_list"
//                         onClick={() => {
//                           handleStatusTopics(items);
//                           toggleDropdown("");
//                         }}
//                       >
//                         {items}
//                       </li>
//                     );
//                   })}
//                 </ul>
//               )}
//             </li>
//             <li className=" sidebar__item">
//               <div className="btn-arrow">
//                 <button
//                   className="sidebar-btn"
//                   onClick={() => {
//                     toggleDropdown("dropdown2");
//                   }}
//                 >
//                   <LuClipboardEdit className="sidebar-icon" />
//                   Tests
//                 </button>
//               </div>
//               {activeDropdown === "dropdown2" && (
//                 <ul className=" sidebar__dropdown">
//                   <li
//                     className="sidebar_dropdown_list"
//                     onClick={() => {
//                       handleStatusTopics("PYQs");
//                       toggleDropdown("");
//                     }}
//                   >
//                     PYQs
//                   </li>
//                   <li
//                     className="sidebar_dropdown_list"
//                     onClick={() => {
//                       handleStatusTopics("PTQs");
//                       toggleDropdown("");
//                     }}
//                   >
//                     PTQs
//                   </li>
//                   <li
//                     className="sidebar_dropdown_list"
//                     onClick={() => {
//                       handleStatusTopics("TTS");
//                       toggleDropdown("");
//                     }}
//                   >
//                     TTS
//                   </li>
//                   <li
//                     className="sidebar_dropdown_list"
//                     onClick={() => {
//                       handleStatusTopics("TAS");
//                       toggleDropdown("");
//                     }}
//                   >
//                     TAS
//                   </li>
//                 </ul>
//               )}
//             </li>
//           </ul>
//         </div>
//         <div className={`chatbot ${!isOpen && "chatbot-width"} `}>
//           <div className="search-circle-plus-icon">
//             <h2>{search}</h2>
//             <div className="circle-icon-container">
//               <CiCirclePlus onClick={circleIcon} className="circle-icon" />
//               <FaHistory className="circle-icon" />
//             </div>
//           </div>
//           <p className="chatbot-active-topic">{activeTopics}</p>
//           <hr className="hr" />
//           <div className="bot-text">
//             <p>
//               Welcome to the SaAi {search} Guide! I'm here to help you
//               understand the intricacies on {search} and related topics. Whether
//               you're preparing for the UPSC exams or simply curious about{" "}
//               {search}, I'm here to provide insights and explanations.
//             </p>
//           </div>
//           <div className="chat-container">
//             {chat.map((message, index) => (
//               <div key={index} className={`chat-message ${message.sender}`}>
//                 <p className="ai-reply">
//                   <span className="chat-status">
//                     {message.sender === "bot" ? "SaAi : " : "Student : "}
//                   </span>
//                   {message.sender === "bot" ? (
//                     <Typewriter text={message.text} />
//                   ) : (
//                     `${message.text}`
//                   )}
//                 </p>
//                 {message.sender === "bot" && (
//                   <div>
//                     <button
//                       className="icon-btn-style"
//                       onClick={() => handlePlayPause(message.text)}
//                     >
//                       {isPlaying ? (
//                         <MdHeadsetOff className="mic-icon-1" />
//                       ) : (
//                         <IoMdHeadset className="mic-icon-1" />
//                       )}
//                     </button>
//                     <CopyToClipboard
//                       text={message.text}
//                       onCopy={() => {
//                         setCopySuccess(message.id);
//                         setTimeout(() => setCopySuccess(null), 1000);
//                       }}
//                     >
//                       <button className="icon-btn-style">
//                         {copySuccess === message.id ? (
//                           <span>
//                             <TiTick className="mic-icon-1" />
//                           </span>
//                         ) : (
//                           <IoIosCopy className="mic-icon-1" />
//                         )}
//                       </button>
//                     </CopyToClipboard>
//                     <button
//                       className="icon-btn-style"
//                       onClick={() => handleRegenerate(chat[index - 1].text)}
//                     >
//                       <GrPowerCycle className="mic-icon-1" />
//                     </button>
//                     <button
//                       onClick={() => handleShare(message.text)}
//                       disabled={isSharing}
//                       className="icon-btn-style"
//                     >
//                       <FiShare2 className="mic-icon-1" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//             <div ref={chatEndRef} />
//           </div>
//           <div className={`mic-input-btn-container ${isOpen && "mic-width"}`}>
//             <button
//               className="icon-btn-style"
//               type="button"
//               onClick={handleVoiceInput}
//             >
//               {isListening ? (
//                 <IoPauseCircleOutline className="mic-icon" />
//               ) : (
//                 <FiMic className="mic-icon" />
//               )}
//             </button>
//             <form className="form-container" onSubmit={handleSubmit}>
//               <textarea
//                 ref={inputRef}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 rows="1"
//                 cols="26"
//                 style={{
//                   height: "60px",
//                   resize: "none",
//                   overflowY: "auto",
//                 }}
//                 placeholder="Type your message here..."
//                 className="text-area"
//               />

//               {isGenerating ? (
//                 <button
//                   className="icon-btn-style"
//                   type="button"
//                   onClick={handleStop}
//                 >
//                   <FaRegStopCircle className="icon-size" />
//                 </button>
//               ) : (
//                 <button className="icon-btn-style" type="submit">
//                   <IoArrowUpCircleSharp className="icon-size" />
//                 </button>
//               )}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Chatbot;

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { IoIosArrowForward } from "react-icons/io";
import { IoArrowUpCircleSharp } from "react-icons/io5";
import { baseUrl } from "../../src/url";
import { HiMenuAlt4 } from "react-icons/hi";
import { FaRegStopCircle, FaHistory, FaBookOpen } from "react-icons/fa";
import { GrPowerCycle } from "react-icons/gr";
import axios from "axios";
import { IoIosCopy } from "react-icons/io";
import { IoPauseCircleOutline } from "react-icons/io5";
import "./styles/chatbot.css";
import { TiTick } from "react-icons/ti";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSpeechSynthesis } from "react-speech-kit";
import Typewriter from "./Typewriter";
import { FiMic, FiShare2 } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import { LuClipboardEdit } from "react-icons/lu";
import { IoMdHeadset, IoMdArrowRoundBack } from "react-icons/io";
import { MdHeadsetOff } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { FaClipboardList } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoIosSend } from "react-icons/io";

const Chatbot = () => {
  const { search } = useParams();
  const [result, setResults] = useState("");
  const [error, setError] = useState("");
  const [topic, setTopic] = useState([]);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const chatEndRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeTopics, setActiveTopics] = useState("");
  const { speak, cancel, speaking, voices } = useSpeechSynthesis();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

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

  const handleShare = async (text) => {
    if (navigator.share) {
      if (isSharing) {
        return;
      }
      setIsSharing(true);
      try {
        await navigator.share({
          title: "Chat Message",
          text,
        });
      } catch (error) {
        console.error("Error sharing message:", error);
      } finally {
        setIsSharing(false);
      }
    } else {
      console.log("Web Share API not supported in this browser.");
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  // useEffect(() => {
  //   const fetchDefault = async () => {
  //     const chatName = "default";
  //     try {
  //       const res = await axios.get(`${baseUrl}/api/chat/${chatName}`);
  //       // setCurrentChatId(chatId);
  //       setChat(res.data.message);
  //     } catch (error) {
  //       console.error("Error opening chat:", error);
  //     }
  //   };
  //   fetchDefault();
  // }, []);

  const handleDefaultStore = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/chat/history`, {
        name: "default",
        message: chat,
      });
      setCurrentChatId(res.data.id);
      setChat([]);
    } catch (error) {
      console.error("Error creating new chat:", error);
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
        sender: "user",
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
    // handleDefaultStore();
  };

  const handleStop = async () => {
    if (currentRequestId) {
      try {
        await axios.post(`${baseUrl}/api/chat/stop`, {
          requestId: currentRequestId,
        });
        console.log("chat stopped");
        setIsGenerating(false);
      } catch (error) {
        console.error("Failed to stop generation:", error);
      }
    }
  };

  const handleRegenerate = async (message) => {
    const requestId = uuidv4();
    setCurrentRequestId(requestId);
    setIsGenerating(true);

    try {
      const res = await axios.post(`${baseUrl}/api/message`, {
        message,
        chatId: currentChatId,
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

  const handleEdit = (message) => {
    setEditingMessageId(message.id);
    setEditedMessage(message.text);
  };

  const handleSave = (id) => {
    const updatedChat = chat.map((msg) =>
      msg.id === id ? { ...msg, text: editedMessage } : msg
    );
    setChat(updatedChat);
    setEditingMessageId(null);
    setEditedMessage("");
  };

  const handleCancel = () => {
    setEditingMessageId(null);
    setEditedMessage("");
  };

  const handleStatusTopics = (value) => {
    setActiveTopics(value);
  };

  const handlePlayPause = (text) => {
    if (isPlaying) {
      cancel();
      setIsPlaying(false);
    } else {
      speak({ text, voice: voices[0] });
      setIsPlaying(true);
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const circleIcon = async () => {
    const chatName = prompt("Enter a name for the new chat:");
    if (chatName) {
      try {
        const res = await axios.post(`${baseUrl}/api/chat/new`, {
          name: chatName,
          message: chat,
        });
        setCurrentChatId(res.data.id);
        setChat([]);
      } catch (error) {
        console.error("Error creating new chat:", error);
      }
    }
  };

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/chat/history`);
      setChats(res.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const openChat = async (chatId) => {
    try {
      const res = await axios.get(`${baseUrl}/api/chat/${chatId}`);
      setCurrentChatId(chatId);
      setChat(res.data.message);
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };
  // console.log(chats);
  return (
    <div>
      <nav className="direction-container">
        <Sidebar topic={topic} handleStatusTopics={handleStatusTopics} />
        <button className="sidebar_toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <h3 className="small-title-iasai">SaAi</h3>
        <div className="direction">
          <div>
            <Link to="/" className="link">
              <IoMdArrowRoundBack className="arrow-icon" />
            </Link>
            <h3 className="upsc-paper">
              <Link className="link" to="/">
                UPSC
              </Link>
              <IoIosArrowForward /> {result}
            </h3>
          </div>
          <div className="upsc-icon-container">
            <FaClipboardList className="syllabus" />
            <BsThreeDotsVertical className="syllabus" />
          </div>
        </div>
        <hr className="hr" />
        <HiMenuAlt4 className="chat-menu-disable" />
      </nav>
      <div className="sidebar-chatbot-container">
        <div
          className={`big-screen-navbar  ${isOpen && "big-screen-bar-open"}`}
        >
          <ul className="sidebar__list">
            <li className="sidebar__item">
              <div
                className="btn-arrow"
                onClick={() => {
                  toggleDropdown("dropdown1");
                }}
              >
                <button className="sidebar-btn">
                  <FaBookOpen className="sidebar-icon" />
                  Topics
                </button>
              </div>
              {activeDropdown === "dropdown1" && (
                <ul className="sidebar__dropdown">
                  {topic.map((items) => {
                    return (
                      <li
                        className="sidebar_dropdown_list"
                        onClick={() => {
                          handleStatusTopics(items);
                          toggleDropdown("");
                        }}
                      >
                        {items}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
            <li className=" sidebar__item">
              <div className="btn-arrow">
                <button
                  className="sidebar-btn"
                  onClick={() => {
                    toggleDropdown("dropdown2");
                  }}
                >
                  <LuClipboardEdit className="sidebar-icon" />
                  Tests
                </button>
              </div>
              {activeDropdown === "dropdown2" && (
                <ul className=" sidebar__dropdown">
                  <li
                    className="sidebar_dropdown_list"
                    onClick={() => {
                      handleStatusTopics("PYQs");
                      toggleDropdown("");
                    }}
                  >
                    PYQs
                  </li>
                  <li
                    className="sidebar_dropdown_list"
                    onClick={() => {
                      handleStatusTopics("PTQs");
                      toggleDropdown("");
                    }}
                  >
                    PTQs
                  </li>
                  <li
                    className="sidebar_dropdown_list"
                    onClick={() => {
                      handleStatusTopics("TTS");
                      toggleDropdown("");
                    }}
                  >
                    TTS
                  </li>
                  <li
                    className="sidebar_dropdown_list"
                    onClick={() => {
                      handleStatusTopics("TAS");
                      toggleDropdown("");
                    }}
                  >
                    TAS
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
        <div className={`chatbot ${!isOpen && "chatbot-width"} `}>
          <div className="search-circle-plus-icon">
            <h2>{search}</h2>
            <div className="circle-icon-container">
              <CiCirclePlus onClick={circleIcon} className="circle-icon" />
              <FaHistory onClick={fetchChatHistory} className="circle-icon" />
            </div>
          </div>
          <div className="history-container">
            {chats.length > 0 &&
              chats.map((items) => {
                console.log(items.name);
                return (
                  <div className="">
                    <h6 onClick={() => openChat(items.id)}>{items.name}</h6>
                  </div>
                );
              })}
          </div>
          <p className="chatbot-active-topic">{activeTopics}</p>
          <hr className="hr" />
          <div className="bot-text">
            <p>
              Welcome to the SaAi {search} Guide! I'm here to help you
              understand the intricacies on {search} and related topics. Whether
              you're preparing for the UPSC exams or simply curious about{" "}
              {search}, I'm here to provide insights and explanations.
            </p>
          </div>
          <div className="chat-container">
            {chat.map((message, index) => (
              <div key={index} className={`chat-message ${message.sender}`}>
                <p className="ai-reply">
                  <span className="chat-status">
                    {message.sender === "bot" ? "SaAi : " : "Student : "}
                  </span>
                  {message.sender === "bot" ? (
                    <Typewriter text={message.text} />
                  ) : (
                    `${message.text}`
                  )}
                </p>
                {/* {message.sender === "user" && (
                  <button
                    className="icon-btn-style"
                    onClick={() => handleEdit(message)}
                  >
                    <MdEdit className="mic-icon-1" />
                  </button>
                )} */}
                {message.sender === "bot" && (
                  <div>
                    <button
                      className="icon-btn-style"
                      onClick={() => handlePlayPause(message.text)}
                    >
                      {isPlaying ? (
                        <MdHeadsetOff className="mic-icon-1" />
                      ) : (
                        <IoMdHeadset className="mic-icon-1" />
                      )}
                    </button>
                    <CopyToClipboard
                      text={message.text}
                      onCopy={() => {
                        setCopySuccess(message.id);
                        setTimeout(() => setCopySuccess(null), 1000);
                      }}
                    >
                      <button className="icon-btn-style">
                        {copySuccess === message.id ? (
                          <span>
                            <TiTick className="mic-icon-1" />
                          </span>
                        ) : (
                          <IoIosCopy className="mic-icon-1" />
                        )}
                      </button>
                    </CopyToClipboard>
                    <button
                      className="icon-btn-style"
                      onClick={() => handleRegenerate(message.text)}
                    >
                      <GrPowerCycle className="mic-icon-1" />
                    </button>
                    <button
                      onClick={() => handleShare(message.text)}
                      disabled={isSharing}
                      className="icon-btn-style"
                    >
                      <FiShare2 className="mic-icon-1" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className={`mic-input-btn-container ${isOpen && "mic-width"}`}>
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
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows="1"
                cols="26"
                style={{
                  height: "60px",
                  resize: "none",
                  overflowY: "auto",
                }}
                placeholder="Type your message here..."
                className="text-area"
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
            {editingMessageId && (
              <div className="edit-message-container">
                <input
                  type="text"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  className="edit-input"
                />
                <button onClick={() => handleSave(editingMessageId)}>
                  Save
                </button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
