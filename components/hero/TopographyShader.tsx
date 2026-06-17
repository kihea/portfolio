"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    uniforms: Record<string, { value: unknown }>;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    // 3-D ray-marched terrain shader.
    //
    // A perspective camera casts rays against a smoothly-animated FBM height
    // field. The camera sits above the terrain looking forward-downward, so
    // the full frame is filled with terrain (no sky visible). Contour lines
    // are drawn at equal height intervals, giving the topographic-map look
    // while the perspective projection makes the 3-D shape unmistakable.
    const fragmentShader = `
      precision highp float;
      uniform vec2  resolution;
      uniform float time;

      // ── Gradient noise ────────────────────────────────────────────────────
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      float gnoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(dot(hash2(i),             f            ),
              dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
          mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
              dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x),
          u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 5; i++) {
          v += a * gnoise(p);
          p  = rot * p * 2.01;
          a *= 0.52;
        }
        return v;
      }

      // ── Height field ──────────────────────────────────────────────────────
      const float MAX_H = 1.9;

      float terrain(vec2 p) {
        float drift = time * 0.006;
        // Light domain warp gives organic, irregular hill shapes
        vec2 q = vec2(
          fbm(p * 0.80 + vec2(0.0,  drift * 0.35)),
          fbm(p * 0.80 + vec2(5.2,  drift * 0.28))
        );
        float h = fbm(p * 0.85 + 1.5 * q + vec2(drift, 0.0));
        h = h * 0.5 + 0.5;
        // Aggressive peak/valley contrast — flat valleys, tall prominent peaks
        h = pow(h, 0.65);
        return h * MAX_H;
      }

      // ── Ray–terrain intersection ──────────────────────────────────────────
      float castRay(vec3 ro, vec3 rd) {
        float t = 0.20;
        for (int i = 0; i < 96; i++) {
          vec3  p  = ro + rd * t;
          float ht = terrain(p.xz);
          float d  = p.y - ht;
          if (d < 0.004) return t;
          t += max(0.005, d * 0.48);
          if (t > 16.0) break;
        }
        return -1.0;
      }

      void main() {
        vec2 p = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;

        // ── Camera ────────────────────────────────────────────────────────
        float cd = time * 0.05;
        vec3 ro = vec3(cd * 0.08,  3.2, -1.5 + cd * 0.03);
        vec3 ta = vec3(cd * 0.08,  0.1,  5.0 + cd * 0.03);

        vec3 ww = normalize(ta - ro);
        vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
        vec3 vv = normalize(cross(ww, uu));
        vec3 rd = normalize(p.x * uu + p.y * vv + 1.55 * ww);

        if (rd.y > 0.0) {
          gl_FragColor = vec4(vec3(0.022, 0.003, 0.002), 1.0);
          return;
        }

        // ── March ─────────────────────────────────────────────────────────
        float t   = castRay(ro, rd);
        vec3  col = vec3(0.05, 0.007, 0.004);

        if (t > 0.0) {
          vec3  hit = ro + rd * t;
          float h   = terrain(hit.xz);
          float hn  = clamp(h / MAX_H, 0.0, 1.0);

          // ── 22 contour bands — dense rings like the reference ──────────
          float lf = fract(hn * 22.0);
          float ld = min(lf, 1.0 - lf) * 2.0; // 0 = on line, 1 = midpoint

          float gp = 0.65 + 0.28 * sin(time * 0.48 + hn * 10.0);

          // Wider halos so lines glow broadly across each band
          float lineCore  = smoothstep(0.042, 0.000, ld);
          float innerGlow = pow(clamp(1.0 - ld / 0.30, 0.0, 1.0), 2.2) * gp * 1.10;
          float outerGlow = pow(clamp(1.0 - ld / 0.65, 0.0, 1.0), 1.8) * gp * 0.55;

          // ── Palette: orange-dominant — dark only at valley floors ──────
          // Transition to orange fast (hn 0.18) so terrain reads warm
          vec3 c0 = vec3(0.022, 0.004, 0.003); // deep valley — near black
          vec3 c1 = vec3(0.390, 0.090, 0.022); // lower slope — already orange
          vec3 c2 = vec3(0.680, 0.200, 0.028); // upper slope
          vec3 c3 = vec3(0.840, 0.320, 0.042); // summit

          col = mix(c0,  c1,  smoothstep(0.00, 0.18, hn));
          col = mix(col, c2,  smoothstep(0.18, 0.60, hn));
          col = mix(col, c3,  smoothstep(0.60, 1.00, hn));

          // Minimal valley darkening — valleys are small dark circles, not floods
          col *= 0.50 + 0.50 * smoothstep(0.0, 0.16, hn);

          // ── Glow composite ─────────────────────────────────────────────
          col += vec3(0.92, 0.38, 0.062) * outerGlow * 0.60;
          col  = mix(col, vec3(1.00, 0.78, 0.50), clamp(innerGlow, 0.0, 1.0));
          col  = mix(col, vec3(1.00, 0.97, 0.93), lineCore);

          // ── Mild distance fog only in far field ────────────────────────
          float fog = smoothstep(6.0, 14.0, t);
          col = mix(col, vec3(0.04, 0.006, 0.003), fog * 0.60);
        }

        // ── Vignette ──────────────────────────────────────────────────────
        vec2  vq  = gl_FragCoord.xy / resolution.xy;
        float vig = vq.x * (1.0 - vq.x) * vq.y * (1.0 - vq.y);
        col *= mix(0.10, 1.0, smoothstep(0.0, 0.09, vig));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene    = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time:       { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    scene.add(new THREE.Mesh(geometry, material));

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onResize();
    window.addEventListener("resize", onResize, false);

    const animate = () => {
      const id = requestAnimationFrame(animate);
      uniforms.time.value += 0.01;
      renderer.render(scene, camera);
      if (sceneRef.current) sceneRef.current.animationId = id;
    };

    sceneRef.current = { renderer, uniforms, animationId: 0 };
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        if (container.contains(renderer.domElement))
          container.removeChild(renderer.domElement);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ background: "#050000", overflow: "hidden" }}
    />
  );
}
