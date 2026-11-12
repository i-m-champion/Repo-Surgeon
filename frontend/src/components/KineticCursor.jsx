import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Kinetic Desktop Cursor (60-120fps GSAP quickTo)
 * - Outer precision reticle + inner dot + morphing [data-cursor="LABEL"] pill
 * - Pointer click shockwave ripple
 * - Strictly disabled on coarse pointers (touch) or prefers-reduced-motion
 */
export default function KineticCursor() {
  const cursorRef = useRef(null);
  const ringWrapRef = useRef(null);
  const ringPillRef = useRef(null);
  const dotWrapRef = useRef(null);
  const dotElRef = useRef(null);
  const labelRef = useRef(null);
  const pulseWrapRef = useRef(null);
  const pulseElRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || prefersReduced) return;

    const cursorEl = cursorRef.current;
    const ringWrap = ringWrapRef.current;
    const ringPill = ringPillRef.current;
    const dotWrap = dotWrapRef.current;
    const dotEl = dotElRef.current;
    const labelEl = labelRef.current;
    const pulseWrap = pulseWrapRef.current;
    const pulseEl = pulseElRef.current;

    if (!cursorEl || !ringWrap || !ringPill || !dotWrap || !dotEl || !labelEl || !pulseWrap || !pulseEl) {
      return;
    }

    document.body.classList.add('kinetic-cursor-active');
    gsap.set(cursorEl, { opacity: 0 });

    const xToRing = gsap.quickTo(ringWrap, 'x', { duration: 0.28, ease: 'power3.out' });
    const yToRing = gsap.quickTo(ringWrap, 'y', { duration: 0.28, ease: 'power3.out' });
    const xToDot = gsap.quickTo(dotWrap, 'x', { duration: 0.08, ease: 'power3.out' });
    const yToDot = gsap.quickTo(dotWrap, 'y', { duration: 0.08, ease: 'power3.out' });

    let isVisible = false;
    let activeLabel = '';

    const setHoverState = (target) => {
      if (!target || !(target instanceof Element)) return;

      const inputEl = target.closest('input, textarea, select');
      if (inputEl) {
        activeLabel = '';
        labelEl.textContent = '';
        gsap.to([ringPill, dotEl], { opacity: 0.16, scale: 0.65, duration: 0.2, overwrite: 'auto' });
        gsap.to(labelEl, { opacity: 0, duration: 0.12, overwrite: 'auto' });
        return;
      }

      const cursorTarget = target.closest('[data-cursor]');
      const interactiveTarget = target.closest('a, button, [role="button"]');
      const nextLabel = cursorTarget?.getAttribute('data-cursor') || '';

      if (nextLabel) {
        if (activeLabel !== nextLabel) {
          activeLabel = nextLabel;
          labelEl.textContent = nextLabel;
        }
        gsap.to(ringPill, {
          minWidth: 68,
          width: 'auto',
          height: 28,
          paddingLeft: 12,
          paddingRight: 12,
          backgroundColor: 'rgba(10, 17, 40, 0.94)',
          borderColor: 'rgba(56, 189, 248, 0.78)',
          opacity: 1,
          scale: 1,
          duration: 0.22,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(dotEl, { scale: 0, opacity: 0, duration: 0.15, overwrite: 'auto' });
        gsap.to(labelEl, { opacity: 1, duration: 0.18, overwrite: 'auto' });
      } else if (interactiveTarget) {
        activeLabel = '';
        labelEl.textContent = '';
        gsap.to(ringPill, {
          minWidth: 0,
          width: 40,
          height: 40,
          paddingLeft: 0,
          paddingRight: 0,
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          borderColor: 'rgba(96, 165, 250, 0.72)',
          opacity: 1,
          scale: 1,
          duration: 0.22,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(dotEl, { scale: 0.75, opacity: 1, duration: 0.15, overwrite: 'auto' });
        gsap.to(labelEl, { opacity: 0, duration: 0.12, overwrite: 'auto' });
      } else {
        activeLabel = '';
        labelEl.textContent = '';
        gsap.to(ringPill, {
          minWidth: 0,
          width: 30,
          height: 30,
          paddingLeft: 0,
          paddingRight: 0,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(148, 163, 184, 0.45)',
          opacity: 1,
          scale: 1,
          duration: 0.22,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(dotEl, { scale: 1, opacity: 1, duration: 0.15, overwrite: 'auto' });
        gsap.to(labelEl, { opacity: 0, duration: 0.12, overwrite: 'auto' });
      }
    };

    const handlePointerMove = (e) => {
      if (!isVisible) {
        isVisible = true;
        gsap.to(cursorEl, { opacity: 1, duration: 0.2 });
      }
      xToRing(e.clientX);
      yToRing(e.clientY);
      xToDot(e.clientX);
      yToDot(e.clientY);
      setHoverState(e.target);
    };

    const handlePointerDown = (e) => {
      gsap.set(pulseWrap, { x: e.clientX, y: e.clientY });
      gsap.fromTo(
        pulseEl,
        { scale: 0.35, opacity: 0.85 },
        { scale: 2.35, opacity: 0, duration: 0.48, ease: 'power2.out' }
      );
      gsap.to(ringPill, { scale: 0.86, duration: 0.1, yoyo: true, repeat: 1 });
    };

    const handleMouseLeave = () => {
      isVisible = false;
      gsap.to(cursorEl, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.body.classList.remove('kinetic-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
      style={{ opacity: 0 }}
    >
      {/* Expanding Click Shockwave */}
      <div ref={pulseWrapRef} className="fixed top-0 left-0 pointer-events-none">
        <div
          ref={pulseElRef}
          className="w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/80"
          style={{ opacity: 0 }}
        />
      </div>

      {/* Morphing Reticle Ring / Pill */}
      <div ref={ringWrapRef} className="fixed top-0 left-0 pointer-events-none">
        <div
          ref={ringPillRef}
          className="-translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full border border-slate-400/45 flex items-center justify-center backdrop-blur-[2px] shadow-[0_0_20px_rgba(37,99,235,0.22)]"
        >
          <span
            ref={labelRef}
            className="text-[10px] font-mono font-semibold tracking-wider text-cyan-300 uppercase whitespace-nowrap"
            style={{ opacity: 0 }}
          />
        </div>
      </div>

      {/* Crisp Center Precision Dot */}
      <div ref={dotWrapRef} className="fixed top-0 left-0 pointer-events-none">
        <div
          ref={dotElRef}
          className="-translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.95)]"
        />
      </div>
    </div>
  );
}
