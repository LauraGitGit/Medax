import "../styles/CallToAction.css";
import { useNavigate } from "react-router";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CallToAction() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`cta-wrap${isVisible ? " cta-in" : ""}`}
    >
      <div className="cta-d cta-d--l1" />
      <div className="cta-d cta-d--l2" />
      <div className="cta-d cta-d--l3" />
      <div className="cta-d cta-d--l4" />
      <div className="cta-d cta-d--l5" />

      <div className="cta-d cta-d--r1" />
      <div className="cta-d cta-d--r2" />
      <div className="cta-d cta-d--r3" />
      <div className="cta-d cta-d--r4" />
      <div className="cta-d cta-d--r5" />

      <div className="cta-content">
        <motion.span
          className="cta-eyebrow"
          initial={{ opacity: 0, y: 18 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Ready to Start?
        </motion.span>

        <motion.h2
          className="cta-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Take Control of Your <em>Medication</em> Today
        </motion.h2>

        <motion.div
          className="cta-btns"
          initial={{ opacity: 0, y: 18 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <button
            className="cta-btn-primary"
            onClick={() => navigate("/steps")}
          >
            Start Checking
          </button>
          <button
            className="cta-btn-outline"
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  );
}
