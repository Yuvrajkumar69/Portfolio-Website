import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export class SplitText {
  chars: HTMLElement[] = [];
  words: HTMLElement[] = [];
  lines: HTMLElement[] = [];
  elements: HTMLElement[] = [];
  private originalContents: { element: HTMLElement; html: string }[] = [];

  constructor(
    target: string | HTMLElement | (string | HTMLElement)[] | NodeListOf<HTMLElement>,
    options: { type?: string; linesClass?: string } = {}
  ) {
    const typeStr = options.type || "chars,words,lines";
    const types = typeStr.split(",").map((s) => s.trim());
    const linesClass = options.linesClass || "split-line";

    let els: HTMLElement[] = [];
    if (typeof target === "string") {
      els = Array.from(document.querySelectorAll<HTMLElement>(target));
    } else if (target instanceof HTMLElement) {
      els = [target];
    } else if (Array.isArray(target) || target instanceof NodeList) {
      Array.from(target as any).forEach((item: any) => {
        if (typeof item === "string") {
          els.push(...Array.from(document.querySelectorAll<HTMLElement>(item)));
        } else if (item instanceof HTMLElement) {
          els.push(item);
        }
      });
    }

    this.elements = els;

    els.forEach((el) => {
      this.originalContents.push({ element: el, html: el.innerHTML });
      this.splitElement(el, types, linesClass);
    });
  }

  private splitElement(el: HTMLElement, types: string[], linesClass: string) {
    const text = el.textContent || "";
    el.innerHTML = "";

    const rawWords = text.split(" ");
    rawWords.forEach((wordText, wordIdx) => {
      if (!wordText && wordIdx > 0) return;

      const wordSpan = document.createElement("span");
      wordSpan.className = linesClass ? `${linesClass}-word word` : "word";
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap";

      if (types.includes("chars")) {
        const chars = Array.from(wordText);
        chars.forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.className = "char";
          charSpan.style.display = "inline-block";
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
          this.chars.push(charSpan);
        });
      } else {
        wordSpan.textContent = wordText;
      }

      this.words.push(wordSpan);
      el.appendChild(wordSpan);

      if (wordIdx < rawWords.length - 1) {
        const space = document.createTextNode(" ");
        el.appendChild(space);
      }
    });

    const lineSpan = document.createElement("span");
    lineSpan.className = linesClass;
    lineSpan.style.display = "inline-block";
    this.lines.push(lineSpan);
  }

  revert() {
    this.originalContents.forEach(({ element, html }) => {
      element.innerHTML = html;
    });
  }
}

interface ParaElement extends HTMLElement {
  anim?: gsap.core.Animation;
  split?: SplitText;
}

gsap.registerPlugin(ScrollTrigger);

export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (window.innerWidth < 900) return;
  const paras: NodeListOf<ParaElement> = document.querySelectorAll(".para");
  const titles: NodeListOf<ParaElement> = document.querySelectorAll(".title");

  const TriggerStart = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";
  const ToggleAction = "play pause resume reverse";

  paras.forEach((para: ParaElement) => {
    para.classList.add("visible");
    if (para.anim) {
      para.anim.progress(1).kill();
      para.split?.revert();
    }

    para.split = new SplitText(para, {
      type: "lines,words",
      linesClass: "split-line",
    });

    para.anim = gsap.fromTo(
      para.split.words,
      { autoAlpha: 0, y: 80 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: para.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 1,
        ease: "power3.out",
        y: 0,
        stagger: 0.02,
      }
    );
  });

  titles.forEach((title: ParaElement) => {
    if (title.anim) {
      title.anim.progress(1).kill();
      title.split?.revert();
    }
    title.split = new SplitText(title, {
      type: "chars,lines",
      linesClass: "split-line",
    });
    title.anim = gsap.fromTo(
      title.split.chars,
      { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
        stagger: 0.03,
      }
    );
  });

  ScrollTrigger.addEventListener("refresh", () => setSplitText());
}
