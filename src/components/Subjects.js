import "./styles/subject.css";
import { Link } from "react-router-dom";
const Subjects = (props) => {
  const { values, index } = props;
  const { title, desc, subjects } = values;
  const { name1, name2, name3, name4 } = subjects;
  if (index % 2 !== 0) {
    return (
      <div className="subject" key={index}>
        <div className="subject-desc-container order-subject ">
          <h1 className="subject-tittle">{title}</h1>
          <p className="subject-desc">{desc}</p>
        </div>
        <div className="cards card-order">
          <div className="container">
            <div className="row">
              <div className="sub-cards col-6">
                <Link to={`${name1}`} className="link">
                  <div className="name name1">{name1}</div>
                </Link>
                <Link to={`${name2}`} className="link">
                  <div className="name name2">{name2}</div>
                </Link>
              </div>
              <div className="col-6">
                <Link to={`${name3}`} className="link">
                  <div className="name name3">{name3}</div>
                </Link>
                <Link to={`${name4}`} className="link">
                  <div className="name name4">{name4}</div>
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
        <p className="subject-desc">{desc}</p>
      </div>
      <div className="cards">
        <div className="container">
          <div className="row">
            <div className="sub-cards col-6">
              <Link to={`${name1}`} className="link">
                <div className="name name1">{name1}</div>
              </Link>
              <Link to={`${name2}`} className="link">
                <div className="name name2">{name2}</div>
              </Link>
            </div>
            <div className="col-6">
              <Link to={`${name3}`} className="link">
                <div className="name name3">{name3}</div>
              </Link>
              <Link to={`${name4}`} className="link">
                <div className="name name4">{name4}</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
