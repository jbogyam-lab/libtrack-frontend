// A reusable Logo component for clickable logos
/* Location: src/components/Logo.jsx */
import React from "react";

function Logo({ href, src, alt, className }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <img src={src} alt={alt} className={`logo ${className || ""}`} />
    </a>
  );
}

export default Logo;
