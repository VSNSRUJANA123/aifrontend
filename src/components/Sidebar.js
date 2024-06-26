import React, { useState, useEffect, useRef } from "react";
import { FaBookOpen } from "react-icons/fa";
import { LuClipboardEdit } from "react-icons/lu";
import "./styles/sidebar.css";

const Sidebar = (props) => {
  const { topic, handleStatusTopics } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleStatusTopicsHere = (value) => {
    handleStatusTopics(value);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sidebar">
      <button className="sidebar__toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <div ref={sidebarRef} className={`sidebar__menu ${isOpen ? "open" : ""}`}>
        <ul className="sidebar__list">
          <li>
            <button
              className="sidebar__open_toggle-btn"
              onClick={toggleSidebar}
            >
              ☰
            </button>
          </li>
          <li className="sidebar__item">
            <button
              className="sidebar-btn"
              onClick={() => {
                toggleDropdown("dropdown1");
              }}
            >
              <FaBookOpen className="sidebar-icon" />
              Topics
            </button>
            {activeDropdown === "dropdown1" && (
              <ul className="sidebar__dropdown">
                {topic.map((items) => {
                  return (
                    <li
                      className="sidebar_dropdown_list"
                      onClick={() => {
                        handleStatusTopicsHere(items);
                        toggleSidebar();
                      }}
                    >
                      {items}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
          <li className="sidebar__item">
            <button
              className="sidebar-btn"
              onClick={() => {
                toggleDropdown("dropdown2");
              }}
            >
              <LuClipboardEdit className="sidebar-icon" />
              Tests
            </button>
            {activeDropdown === "dropdown2" && (
              <ul className="sidebar__dropdown">
                <li
                  className="sidebar_dropdown_list"
                  onClick={() => {
                    handleStatusTopicsHere("PYQs");
                    toggleSidebar();
                  }}
                >
                  PYQs
                </li>
                <li
                  className="sidebar_dropdown_list"
                  onClick={() => {
                    handleStatusTopicsHere("PTQs");
                    toggleSidebar();
                  }}
                >
                  PTQs
                </li>
                <li
                  className="sidebar_dropdown_list"
                  onClick={() => {
                    handleStatusTopicsHere("TTS");
                    toggleSidebar();
                  }}
                >
                  TTS
                </li>
                <li
                  className="sidebar_dropdown_list"
                  onClick={() => {
                    handleStatusTopicsHere("TAS");
                    toggleSidebar();
                  }}
                >
                  TAS
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
