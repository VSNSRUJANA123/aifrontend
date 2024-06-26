import "./styles/subject.css";
import { Link } from "react-router-dom";
const Subjects = (props) => {
  const { values, index } = props;
  const { title, desc, subjects, images } = values;
  const { name1, name2, name3, name4 } = subjects;
  const { image1, image2, image3, image4 } = images;
  //  gspaper2: Indian Polity & Governace
  // Public Administration
  // International Relation & Security
  // Social Justice
  console.log("images:", subjects);
  if (index % 2 !== 0) {
    return (
      <div className="subject" key={index}>
        <div className="subject-desc-container order-subject ">
          <h1 className="subject-tittle">{title}</h1>
          <ul>
            <li>{name1}</li>
            <li>{name2}</li>
            <li>{name3}</li>
            <li>{name4}</li>
          </ul>
        </div>
        <div className="cards card-order">
          <div className="container">
            <div className="row">
              <div className="sub-cards col-6">
                <Link to={`${name1}`} className="link">
                  <div className="name name1">
                    <img src={image1} alt={name1} className="card-image" />
                    <p className="card-text">{name1} </p>
                  </div>
                </Link>
                <Link to={`${name2}`} className="link">
                  <div className="name name2">
                    <img src={image2} alt={name1} className="card-image" />
                    <p className="card-text">{name2} </p>
                  </div>
                </Link>
              </div>
              <div className="sub-cards-left col-6">
                <Link to={`${name3}`} className="link">
                  <div className="name name3">
                    <img src={image3} alt={name1} className="card-image" />
                    <p className="card-text">{name3} </p>
                  </div>
                </Link>
                <Link to={`${name4}`} className="link">
                  <div className="name name4">
                    <img src={image4} alt={name1} className="card-image" />
                    <p className="card-text"> {name4} </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="subject" key={index}>
      <div className="subject-desc-container">
        <h1 className="subject-tittle">{title}</h1>
        <ul>
          <li>{name1}</li>
          <li>{name2}</li>
          <li>{name3}</li>
          <li>{name4}</li>
        </ul>
      </div>
      <div className="cards">
        <div className="container">
          <div className="row">
            <div className="sub-cards col-6">
              <Link to={`${name1}`} className="link">
                <div className="name name1">
                  <img src={image1} alt={name1} className="card-image" />
                  <p className="card-text">{name1} </p>
                </div>
              </Link>
              <Link to={`${name2}`} className="link">
                <div className="name name2">
                  <img src={image2} alt={name2} className="card-image" />
                  <p className="card-text"> {name2} </p>
                </div>
              </Link>
            </div>
            <div className="sub-cards-left col-6">
              <Link to={`${name3}`} className="link">
                <div className="name name3">
                  <img src={image3} alt={name3} className="card-image" />
                  <p className="card-text"> {name3} </p>
                </div>
              </Link>
              <Link to={`${name4}`} className="link">
                <div className="name name4">
                  <img src={image4} alt={name1} className="card-image" />
                  <p className="card-text">{name4} </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
