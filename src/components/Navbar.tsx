import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

export interface Smoother {
  paused: (isPaused: boolean) => void;
  scrollTop: (value?: number) => void;
  scrollTo: (target: string | HTMLElement | null, smooth?: boolean, position?: string) => void;
  refresh: (force?: boolean) => void;
}

export const smoother: Smoother = {
  paused(isPaused: boolean) {
    document.body.style.overflow = isPaused ? "hidden" : "auto";
  },
  scrollTop(value: number = 0) {
    window.scrollTo({ top: value, behavior: "instant" as ScrollBehavior });
  },
  scrollTo(target: string | HTMLElement | null, smooth: boolean = true) {
    if (!target) return;
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el) {
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    }
  },
  refresh() {
    ScrollTrigger.refresh();
  },
};

const Navbar = () => {
  useEffect(() => {
    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      });
    });
    window.addEventListener("resize", () => {
      smoother.refresh();
    });
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          Yuvraj Kumar
        </a>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=yuvrajkumar262402@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-connect"
          data-cursor="disable"
        >
          yuvrajkumar262402@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>
      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
