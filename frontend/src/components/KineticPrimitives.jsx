import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * SpotlightCard (21st.dev Style + Zero React Re-Renders)
 * Updates CSS variables --mx and --my directly on DOM node in onPointerMove.
 * Optional subtle 3D perspective tilt driven by GSAP quickTo.
 */
export function SpotlightCard({
  children,
  className = '',
  tilt = false,
  tiltStrength = 6,
  onClick,
  ...rest
}) {
  const cardRef = useRef(null);
  const rxTo = useRef(null);
  const ryTo = useRef(null);

  useEffect(() => {
    if (!tilt || typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReduced || isCoarse) return;

    const el = cardRef.current;
    if (!el) return;

    gsap.set(el, { transformPerspective: 950, transformStyle: 'preserve-3d' });
    rxTo.current = gsap.quickTo(el, 'rotateX', { duration: 0.45, ease: 'power3.out' });
    ryTo.current = gsap.quickTo(el, 'rotateY', { duration: 0.45, ease: 'power3.out' });

    return () => {
      gsap.killTweensOf(el);
    };
  }, [tilt]);

  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);

    if (tilt && rxTo.current && ryTo.current) {
      // Skip tilt if hovering inputs/sliders so controls remain rock-solid
      if (e.target instanceof Element && e.target.closest('input, textarea, select')) {
        rxTo.current(0);
        ryTo.current(0);
        return;
      }
      const nx = (x / rect.width) * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;
      rxTo.current(-ny * tiltStrength);
      ryTo.current(nx * tiltStrength);
    }
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (el) {
      el.style.setProperty('--mx', '-999px');
      el.style.setProperty('--my', '-999px');
    }
    if (tilt && rxTo.current && ryTo.current) {
      rxTo.current(0);
      ryTo.current(0);
    }
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      className={`spotlight-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * MagneticButton
 * GSAP quickTo magnetic attraction wrapper for primary CTAs.
 */
export function MagneticButton({
  children,
  className = '',
  strength = 0.28,
  onClick,
  disabled = false,
  ...rest
}) {
  const btnRef = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReduced || isCoarse) return;

    const el = btnRef.current;
    if (!el) return;

    xTo.current = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    return () => {
      gsap.killTweensOf(el);
    };
  }, []);

  const handlePointerMove = (e) => {
    if (disabled || !xTo.current || !yTo.current || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    xTo.current(dx * strength);
    yTo.current(dy * strength);
  };

  const handlePointerLeave = () => {
    if (xTo.current && yTo.current) {
      xTo.current(0);
      yTo.current(0);
    }
  };

  return (
    <button
      ref={btnRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
}
