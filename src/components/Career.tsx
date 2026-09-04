import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Java Full Stack Developer Intern</h4>
                <h5>Code for Success</h5>
              </div>
              <h3>2025</h3>
            </div>
            <div className="career-details">
              <p>• Developed a full-stack E-Commerce web application using Java, Spring Boot, React, and MySQL.</p>
              <p>• Built RESTful APIs for user, product, cart, and order management.</p>
              <p>• Implemented Spring Security authentication and integrated MySQL using Spring Data JPA.</p>
              <p>• Used Git, Maven, Postman, and IntelliJ IDEA for development, testing, and version control.</p>
            </div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Computer Science & Engineering</h4>
                <h5>Roorkee Institute of Technology, Roorkee</h5>
              </div>
              <h3>2022 – 2026</h3>
            </div>
            <div className="career-details">
              <p>
                Undergraduate degree covering core computer science fundamentals, data structures & algorithms, database management systems, operating systems, computer networks, and full-stack software development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
