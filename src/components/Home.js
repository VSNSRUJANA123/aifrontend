import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Subjects from "./Subjects";
import { IoIosCloseCircle } from "react-icons/io";
import { BallTriangle } from "react-loader-spinner";
import axios from "axios";
import Navbar from "./Navbar";
import image1 from "./images/img1.png";
import image2 from "./images/img2.png";
import image3 from "./images/img3.png";
import image4 from "./images/img4.png";
// import image5 from "./images/image1.png";
import mobishaala from "./styles/mobishaala-loggo-white.png";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./styles/home.css";
import { baseUrl } from "../../src/url";
const carouselImages = [
  {
    src: image1,
    alt: "image1",
  },
  {
    src: image2,
    alt: "image2",
  },
  {
    src: image3,
    alt: "image3",
  },
  {
    src: image4,
    alt: "image4",
  },
  // {
  //   src: image5,
  //   alt: "image5",
  // },
];

const Home = () => {
  const [mockdata, setMockdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/`);
        setLoading(false);
        setMockdata(response.data);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const redirectToWhatsApp = () => {
    const phoneNumber = "9972968390";
    const message = " I want to know about IASAi. My name is";

    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.location.href = whatsappLink;
  };
  const submit = (e) => {
    e.preventDefault();
  };
  const whatsapp = () => {
    redirectToWhatsApp();
  };
  return (
    <div className="bg-layer">
      <Navbar />
      <div className="heading-section">
        <div className="container">
          <div className="row">
            <div className=" col-md-12 col-lg-6">
              <div className="heading-container">
                <h1 className="heading">
                  Ignite Your <span className="">IAS</span> Preparation With Ai
                  Innovation
                </h1>
                <p className="description">
                  Harness the power of Student assistant Ai (SaAi) for a
                  smarter,
                  <br className="break" /> faster IAS preparation. Get
                  personalized test analysis and <br className="break" /> a
                  guided path with your personal assistant.
                </p>
                <div className="start-now-container">
                  <Popup
                    modal
                    trigger={
                      <button
                        type="button "
                        className="start-now-btn small-button trigger-button"
                      >
                        Start Now
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
                        <h1 className="form-head">User Login</h1>
                        <form className="login-form" onSubmit={submit}>
                          <input placeholder="enter mail" type="mail" />
                          <input placeholder="enter password" type="password" />
                          <button>Login</button>
                          <button onClick={whatsapp}>Whatsapp</button>
                        </form>
                      </>
                    )}
                  </Popup>
                  <span className="span">Already have an Account? Sign in</span>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-6">
              <div className="carousel-container">
                <Carousel
                  showThumbs={false}
                  showArrows={false}
                  showStatus={false}
                  autoPlay
                  infiniteLoop
                  transitionTime="20"
                  className="custom-carousel"
                >
                  {carouselImages.map((image, index) => {
                    return (
                      <div key={index}>
                        <img src={image.src} alt={image.alt} />
                      </div>
                    );
                  })}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="subject-section">
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <BallTriangle
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="ball-triangle-loading"
              visible={true}
            />
          </div>
        )}
        {mockdata.map((items, index) => (
          <Subjects key={items._id} values={items} index={index} />
        ))}
      </div>
      <footer className="footer">
        <div className="">
          <div className="container">
            <div className="row">
              <div className="footer-para col-12 col-md-6">
                <img className="footer-title" src={mobishaala} />

                <h5 className="footer-sub-title">Vision</h5>
                <p>
                  Empowering educators and students with AI-driven solutions for
                  personalized, efficient, and engaging learning experiences.
                </p>
              </div>
              <div className="footer-para  col-12 col-md-2">
                <h4>Address</h4>
                <p className="footer-paragraph">
                  <span className="footer-span">Registered Office </span>: 804,
                  5th Cross, 9th main, 4th Block Koramangala, Bangalore,
                  Karnataka 560034
                </p>
                <p className="footer-paragraph">
                  <span className="footer-span">Corporate Office </span>: 293,
                  Westend Marg, near Saket, Saidulajab, Saket, New Delhi, 110030
                </p>
              </div>
              <div className=" footer-para  col-12 col-md-2">
                <h4>Quick Links</h4>
                <ul className="footer-ul">
                  <li>Blog</li>
                  <li>Android App </li>
                  <li>IOS App</li>
                  <li>Careers</li>
                </ul>
              </div>
              <div className="footer-para  col-12 col-md-2">
                <h4>Legal Stuff</h4>
                <ul className="footer-ul">
                  <li>Privacy Policy </li>
                  <li>Terms of Service </li>
                  <li>Refunds/Cancellations</li>
                  <li>Disclaimer</li>
                </ul>
              </div>
            </div>
            <p className="copyright">
              © 2024 Mobishaala Edutech Private Limited.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Home;
