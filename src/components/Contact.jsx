import { Mail } from "lucide-react";
import { links } from "../data.js";
import { socials } from "./SocialLinks.jsx";
import Reveal from "./Reveal.jsx";
import Button from "./ui/Button.jsx";
import StickyTag from "./ui/StickyTag.jsx";
import { HandArrow, Scribble } from "./ui/Decorations.jsx";
import ContactForm from "./ContactForm.jsx";

const subject = "Alternance opportunity";
const mailto = `mailto:${links.email}?subject=${encodeURIComponent(subject)}`;
const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${links.email}&su=${encodeURIComponent(subject)}`;

// Phones open their mail app via mailto:. On desktop, mailto: often does nothing
// (no mail client configured), so open Gmail's compose window in a new tab instead.
function openMail(e) {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (!isTouch) {
    e.preventDefault();
    window.open(gmail, "_blank", "noopener");
  }
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto grid max-w-page gap-14 px-6 py-20 md:px-10 lg:grid-cols-2 lg:gap-16"
    >
      <div>
        <Reveal>
          <StickyTag>06 — Contact</StickyTag>
          <h2 className="mt-6 text-5xl leading-[1.05] md:text-6xl">
            Let's build something{" "}
            <span className="relative inline-block">
              <span className="relative z-10">together.</span>
              <Scribble className="absolute -bottom-1 left-0 h-4 w-full text-marker" />
            </span>
          </h2>
        </Reveal>

        <Reveal
          as="p"
          delay={120}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-pencil/80 md:text-xl"
        >
          Looking for an alternance or stage alterné in Paris (4 weeks company /
          2 weeks school), in web development or UX/UI.
        </Reveal>

        <Reveal
          delay={220}
          className="relative mt-10 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <Button
            href={mailto}
            onClick={openMail}
            variant="ink"
            className="-rotate-1"
          >
            <Mail strokeWidth={2.5} className="size-5" />
            <span className="hidden sm:inline">{links.email}</span>
            <span className="sm:hidden">Email me</span>
          </Button>
          {socials.map(({ label, href, Icon }, i) => (
            <Button
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
              className={i % 2 ? "-rotate-1" : "rotate-1"}
            >
              <Icon className="size-5" />
              {label} ↗
            </Button>
          ))}
        </Reveal>
      </div>

      <Reveal delay={150} className="relative lg:pt-6">
        {/* Doodled note pointing at the form (desktop only) */}
        <div
          className="pointer-events-none absolute -top-12 -left-28 hidden items-end gap-1 lg:flex"
          aria-hidden
        >
          <span className="-rotate-6 font-hand text-xl text-pen">
            or write here!
          </span>
          <HandArrow className="h-14 w-20 -scale-x-100 text-pencil/70" />
        </div>
        <ContactForm />
      </Reveal>
    </section>
  );
}
