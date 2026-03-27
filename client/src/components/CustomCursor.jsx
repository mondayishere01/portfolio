import React, { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hoverState, setHoverState] = useState({ active: false, text: "" });
  const mouse = useRef({ x: 0, y: 0 });
  const circle = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      if (!visible) setVisible(true);
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    // Animate the circle to follow with delay
    const animate = () => {
      const speed = 0.15;
      circle.current.x += (mouse.current.x - circle.current.x) * speed;
      circle.current.y += (mouse.current.y - circle.current.y) * speed;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${circle.current.x}px, ${circle.current.y}px)`;
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    // ── Hover detection ────────────────────────────────────
    // Determine cursor label text from the hovered element
    const getCursorText = (el) => {
      if (!el || !el.closest) return "";
      
      // Explicit data attribute takes priority
      const explicit = el.closest("[data-cursor-text]");
      if (explicit) return explicit.getAttribute("data-cursor-text");

      // Card wrapper (group relative) → "View"
      const card = el.closest(".group.relative");
      if (card) return "View";

      // Anchor tags
      const anchor = el.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href") || "";
        if (anchor.target === "_blank" || href.startsWith("http"))
          return "Visit";
        return "View";
      }

      // Buttons
      if (el.closest("button")) return "Click";

      return "";
    };

    const onMouseOver = (e) => {
      const text = getCursorText(e.target);
      if (text) {
        setHoverState({ active: true, text });
      }
    };

    const onMouseOut = (e) => {
      const text = getCursorText(e.relatedTarget);
      if (!text) {
        setHoverState({ active: false, text: "" });
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [visible]);

  if (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  ) {
    return null;
  }

  const isHovering = hoverState.active;

  return (
    <>
      {/* Small dot — instant follow */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "0px" : "8px",
          height: isHovering ? "0px" : "8px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          pointerEvents: "none",
          zIndex: 9999,
          marginLeft: "-4px",
          marginTop: "-4px",
          opacity: visible ? 1 : 0,
          transition:
            "width 0.35s cubic-bezier(0.25,0.1,0.25,1), height 0.35s cubic-bezier(0.25,0.1,0.25,1), opacity 0.3s ease",
        }}
      />

      {/* Outer circle — follows with delay, expands on hover */}
      <div
        ref={circleRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHovering ? "90px" : "40px",
          height: isHovering ? "90px" : "40px",
          borderRadius: "50%",
          border: isHovering
            ? "1.5px solid rgba(255, 255, 255, 0.6)"
            : "1.5px solid rgba(255, 255, 255, 0.5)",
          backgroundColor: isHovering
            ? "rgba(255, 255, 255, 0.08)"
            : "transparent",
          pointerEvents: "none",
          zIndex: 9998,
          marginLeft: isHovering ? "-45px" : "-20px",
          marginTop: isHovering ? "-45px" : "-20px",
          opacity: visible ? 1 : 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition:
            "width 0.35s cubic-bezier(0.25,0.1,0.25,1), height 0.35s cubic-bezier(0.25,0.1,0.25,1), margin 0.35s cubic-bezier(0.25,0.1,0.25,1), background-color 0.35s ease, border-color 0.35s ease, opacity 0.3s ease",
        }}
      >
        {/* Hover label */}
        <span
          ref={textRef}
          style={{
            color: "#fff",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: isHovering ? 1 : 0,
            transform: isHovering ? "scale(1)" : "scale(0.5)",
            transition:
              "opacity 0.25s ease 0.1s, transform 0.3s cubic-bezier(0.25,0.1,0.25,1) 0.05s",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          {hoverState.text}
        </span>
      </div>
    </>
  );
};

export default CustomCursor;
