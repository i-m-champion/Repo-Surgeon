import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec2 uClickPos;
  uniform float uClickAge;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      val += amp * noise(p);
      p = rot * p * 2.02;
      amp *= 0.5;
    }
    return val;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    // Subtle pointer parallax offset
    vec2 mouseOffset = (uMouse - 0.5) * 0.25;
    vec2 flowUv = p * 1.45 - mouseOffset;

    float t = uTime * 0.14;
    float q = fbm(flowUv + vec2(t, -t * 0.6));
    float r = fbm(flowUv + q * 1.35 + vec2(1.7 - t * 0.5, 9.2 + t * 0.35));
    float f = fbm(flowUv + r * 1.15);

    // Bolt.new calibrated cobalt/navy/cyan palette
    vec3 abyssNavy = vec3(0.008, 0.043, 0.145);     // #020b25
    vec3 royalBlue = vec3(0.004, 0.251, 0.608);     // #01409b
    vec3 electricBlue = vec3(0.0, 0.608, 0.969);    // #009bf7
    vec3 skyCyan = vec3(0.024, 0.620, 0.914);       // #069ee9
    vec3 softFlare = vec3(0.635, 0.816, 0.949);     // #a2d0f2

    vec3 col = mix(abyssNavy, royalBlue, clamp(f * 1.45, 0.0, 1.0));
    col = mix(col, electricBlue, smoothstep(0.45, 0.92, r) * 0.65);

    // Upper-center studio spotlight beam
    float topBeam = exp(-length((uv - vec2(0.5 + mouseOffset.x * 0.3, 0.12)) * vec2(1.1, 1.8)) * 2.2);
    col += skyCyan * topBeam * 0.36;

    // Interactive cursor luminescence
    float distMouse = length((uv - uMouse) * vec2(aspect, 1.0));
    float pointerHalo = exp(-distMouse * 3.8);
    col += softFlare * pointerHalo * 0.22;

    // Click shockwave ripple wave
    if (uClickAge > 0.0 && uClickAge < 2.2) {
      float clickDist = length((uv - uClickPos) * vec2(aspect, 1.0));
      float waveRadius = uClickAge * 0.65;
      float ring = exp(-abs(clickDist - waveRadius) * 28.0) * exp(-uClickAge * 1.7);
      col += softFlare * ring * 0.55;
    }

    // Bottom vignette fading smoothly into dark workbench (#090A0F)
    float bottomFade = smoothstep(0.0, 0.32, uv.y);
    vec3 baseCanvas = vec3(0.035, 0.039, 0.059); // #090A0F
    col = mix(baseCanvas, col, bottomFade);

    gl_FragColor = vec4(col, 0.85);
  }
`;

export default function HeroWebGLCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    let scene;
    let camera;
    let geometry;
    let material;
    let mesh;
    let rafId = 0;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.6) },
      uClickPos: { value: new THREE.Vector2(0.5, 0.5) },
      uClickAge: { value: 99.0 },
    };

    geometry = new THREE.PlaneGeometry(2, 2);
    material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const targetMouse = new THREE.Vector2(0.5, 0.6);
    let lastClickTimestamp = -999;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      targetMouse.x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      targetMouse.y = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    };

    const handlePointerDown = (e) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      uniforms.uClickPos.value.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      );
      lastClickTimestamp = performance.now() * 0.001;
    };

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        renderer.setSize(w, h);
        uniforms.uResolution.value.set(w, h);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('resize', handleResize);

    const startTime = performance.now() * 0.001;

    const animate = () => {
      const now = performance.now() * 0.001;
      uniforms.uTime.value = now - startTime;
      uniforms.uMouse.value.lerp(targetMouse, 0.06);
      uniforms.uClickAge.value = lastClickTimestamp > 0 ? now - lastClickTimestamp : 99.0;

      renderer.render(scene, camera);
      if (!prefersReduced) {
        rafId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);

      if (mesh) scene.remove(mesh);
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
}
