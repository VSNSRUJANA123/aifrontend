import "./styles/navbar.css";
import { IoMenu } from "react-icons/io5";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { IoIosCloseCircle } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const menuIcon = () => {
    setMenu(!menu);
  };
  const sumbit = (e) => {
    e.preventDefault();
  };

  const redirectToWhatsApp = () => {
    const phoneNumber = "9972968390";
    const message = " I want to know about IASAi. My name is";

    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.location.href = whatsappLink;
  };

  return (
    <section className="logo-container">
      <div className="logo-nav">
        <IoMenu onClick={menuIcon} className="menu-icon" />
        <h3 className="logo">SaAi</h3>
        <ul className={`nav-ul ${menu && "small-nav"} `}>
          <li>UPSC </li>
          <li>Syllabus</li>
          <li>Strategy</li>
          <li>Teacher</li>
          <li>Student</li>
          <li className="big-screen-help">Help</li>
        </ul>
      </div>
      <div className="sub-nav-container">
        <ul className="sub-nav">
          <li>
            <FaWhatsapp
              onClick={redirectToWhatsApp}
              className="whatsapp-icon"
            />
          </li>
          <li className="help-small-screen">Help</li>
          <li>
            <Popup
              modal
              trigger={
                <button type="button " className=" big-button trigger-button">
                  Sign Up
                </button>
              }
            >
              {(close) => (
                <>
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => close()}
                  >
                    <IoIosCloseCircle className="close-icon" />
                  </button>
                  <h1 className="form-head">User Signup</h1>
                  <form className="login-form" onSubmit={sumbit}>
                    <input placeholder="enter username" type="text" />
                    <input placeholder="enter mail" type="mail" />
                    <input placeholder="enter password" type="password" />
                    <button>Signup</button>
                    <button onClick={redirectToWhatsApp}>Whatsapp</button>
                  </form>
                </>
              )}
            </Popup>
          </li>
        </ul>
      </div>
    </section>
  );
};
export default Navbar;
