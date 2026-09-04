import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FaGithub } from "react-icons/fa6";
import { MdArrowOutward } from "react-icons/md";

gsap.registerPlugin(useGSAP);

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  github: string;
  image: string;
}

const projects: ProjectItem[] = [
  {
    id: "01",
    title: "Rail Bharat",
    category: "Railway Reservation System",
    description:
      "Full-stack railway reservation platform for train search, booking, cancellation, PNR management, notifications, and secure online transactions.",
    github: "https://github.com/YuvrajKumar69/Rail-Bharat",
    image: "/images/rail-bharat.jpg",
  },
  {
    id: "02",
    title: "North & Vine",
    category: "E-Commerce Web Application",
    description:
      "Full-stack e-commerce application with secure authentication, product management, shopping cart, order processing, checkout, and database integration.",
    github:
      "https://github.com/YuvrajKumar69/North-wine-E-commerce-web-Application",
    image: "/images/north-vine.jpg",
  },
  {
    id: "03",
    title: "3D Interactive Portfolio",
    category: "Interactive Developer Portfolio",
    description:
      "Interactive 3D developer portfolio built with React, TypeScript, Three.js, React Three Fiber, and GSAP, featuring immersive animations and physics-based interactions.",
    github: "https://github.com/YuvrajKumar69",
    image: "/images/portfolio-3d.jpg",
  },
];

const Work = () => {
  useGSAP(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      if (box.length === 0) return;
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`, // Use actual scroll width
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>{project.id}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <p className="work-desc">{project.description}</p>
                <div className="work-actions">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-btn"
                    data-cursor="disable"
                  >
                    <FaGithub /> GitHub <MdArrowOutward />
                  </a>
                </div>
              </div>
              <WorkImage
                image={project.image}
                alt={project.title}
                link={project.github}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
