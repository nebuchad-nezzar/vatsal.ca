import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CountryGeoData {
  code: string;
  name: string;
  flag: string;
  lat: number;
  lng: number;
  requests: number;
  share: number;
}

interface EdgeGlobeVisualProps {
  countries: CountryGeoData[];
  timeRange: '24h' | '7d' | '30d';
  onRangeChange: (range: '24h' | '7d' | '30d') => void;
}

interface HoverTooltipState {
  country: CountryGeoData;
  x: number;
  y: number;
}

const GLOBE_RADIUS = 30;

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function EdgeGlobeVisual({
  countries,
  timeRange,
  onRangeChange
}: EdgeGlobeVisualProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeCountry, setActiveCountry] = useState<CountryGeoData | null>(null);
  const [hoverTooltip, setHoverTooltip] = useState<HoverTooltipState | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (viewMode !== '3d' || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Initial tilt
    globeGroup.rotation.x = 0.2;
    globeGroup.rotation.y = -1.2;

    // Dark Core Sphere
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS - 0.4, 64, 64);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x050811,
      transparent: true,
      opacity: 0.95,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Glowing Atmosphere
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(0.06, 0.71, 0.83, 1.0) * intensity * 0.4;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // Landmass Matrix from /world-dots.json
    fetch('/world-dots.json')
      .then((res) => res.json())
      .then((landCoords: [number, number][]) => {
        const landPositions = new Float32Array(landCoords.length * 3);
        landCoords.forEach(([lat, lng], i) => {
          const vec = latLngToVector3(lat, lng, GLOBE_RADIUS + 0.35);
          landPositions[i * 3] = vec.x;
          landPositions[i * 3 + 1] = vec.y;
          landPositions[i * 3 + 2] = vec.z;
        });

        const landGeo = new THREE.BufferGeometry();
        landGeo.setAttribute('position', new THREE.BufferAttribute(landPositions, 3));
        const landMat = new THREE.PointsMaterial({
          color: 0x475569,
          size: 1.1,
          transparent: true,
          opacity: 0.85,
        });

        const landPointsMesh = new THREE.Points(landGeo, landMat);
        globeGroup.add(landPointsMesh);
      })
      .catch((err) => console.error('Failed to load world dots:', err));

    // Traffic Country Pins & Invisible Raycast Hit Spheres
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    const raycastTargets: { mesh: THREE.Mesh; country: CountryGeoData }[] = [];
    const maxRequests = countries[0]?.requests || 1;

    countries.forEach((country) => {
      if (!country.lat && !country.lng) return;

      const pos = latLngToVector3(country.lat, country.lng, GLOBE_RADIUS + 0.5);
      const normal = pos.clone().normalize();

      // Pin Size based on share
      const radius = Math.max(0.8, Math.min(2.5, 0.8 + Math.sqrt(country.requests / maxRequests) * 1.8));

      // Visual Disc
      const discGeo = new THREE.CircleGeometry(radius, 32);
      const discMat = new THREE.MeshBasicMaterial({
        color: country.share > 10 ? 0x06b6d4 : 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });

      const discMesh = new THREE.Mesh(discGeo, discMat);
      discMesh.position.copy(pos);
      discMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      pinGroup.add(discMesh);

      // Radar Ring
      const ringGeo = new THREE.RingGeometry(radius * 1.1, radius * 1.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      pinGroup.add(ringMesh);

      // Invisible larger hit sphere for smooth raycast hover
      const hitGeo = new THREE.SphereGeometry(Math.max(3.0, radius * 2.2), 16, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(pos);
      pinGroup.add(hitMesh);

      raycastTargets.push({ mesh: hitMesh, country });
    });

    // Raycaster for Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse Interaction (Drag to rotate & Hover raycasting)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let autoRotate = true;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      autoRotate = false;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets.map((t) => t.mesh));

      if (intersects.length > 0) {
        const hitTarget = raycastTargets.find((t) => t.mesh === intersects[0].object);
        if (hitTarget) {
          setHoverTooltip({
            country: hitTarget.country,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          setActiveCountry(hitTarget.country);
          container.style.cursor = 'pointer';
        }
      } else {
        setHoverTooltip(null);
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => { autoRotate = true; }, 3000);
    };

    const onMouseLeave = () => {
      isDragging = false;
      setHoverTooltip(null);
    };

    container.addEventListener('mousedown', onMouseDown);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate && !targetRotationRef.current) {
        globeGroup.rotation.y += 0.0015;
      }

      // Smooth target focus rotation
      if (targetRotationRef.current) {
        globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.05;
        globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.05;
        if (
          Math.abs(targetRotationRef.current.y - globeGroup.rotation.y) < 0.01 &&
          Math.abs(targetRotationRef.current.x - globeGroup.rotation.x) < 0.01
        ) {
          targetRotationRef.current = null;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [viewMode, countries, timeRange]);

  // Focus globe on hovered country
  const focusCountry = (country: CountryGeoData) => {
    setActiveCountry(country);
    if (country.lat && country.lng) {
      const targetY = -((country.lng * Math.PI) / 180) - Math.PI / 2;
      const targetX = (country.lat * Math.PI) / 180 * 0.5;
      targetRotationRef.current = { x: targetX, y: targetY };
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-6 space-y-5">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-blue-900/5 to-transparent pointer-events-none"></div>

      {/* Header with Title, 2D/3D toggle & 24h/7d/30d switch */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <span>Global Edge Traffic Globe</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">
              {countries.length} Active Regions
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time 3D planetary telemetry with live percentage distribution ({timeRange.toUpperCase()})
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Range Toggle */}
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
            {(['24h', '7d', '30d'] as const).map((r) => {
              const isActive = timeRange === r;
              return (
                <button
                  key={r}
                  onClick={() => onRangeChange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Country Banner */}
      {activeCountry && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono w-fit animate-fade-in">
          <span className="text-base">{activeCountry.flag}</span>
          <span className="text-foreground font-bold">{activeCountry.name}:</span>
          <span className="text-cyan-400 font-bold">{activeCountry.requests.toLocaleString()} requests</span>
          <span className="text-muted-foreground">({activeCountry.share}% of {timeRange.toUpperCase()} total traffic)</span>
        </div>
      )}

      {/* Main Visual Container with Interactive Floating Hover Tooltip */}
      <div className="relative w-full h-[420px] bg-[#05070a] rounded-xl border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Dynamic 3D Pin Hover Tooltip Card */}
        {hoverTooltip && (
          <div
            className="absolute pointer-events-none z-30 transition-all duration-75"
            style={{
              left: `${hoverTooltip.x}px`,
              top: `${hoverTooltip.y}px`,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="bg-[#0a0f1d]/95 backdrop-blur-md border border-cyan-500/50 p-3 rounded-xl shadow-2xl space-y-1.5 min-w-[160px] animate-fade-in">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-bold text-xs text-foreground font-mono">
                  <span className="text-base">{hoverTooltip.country.flag}</span>
                  <span>{hoverTooltip.country.name}</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30 font-bold">
                  {hoverTooltip.country.code}
                </span>
              </div>
              
              <div className="border-t border-white/10 pt-1.5 flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">Requests:</span>
                <span className="text-cyan-300 font-bold">{hoverTooltip.country.requests.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">Share:</span>
                <span className="text-emerald-400 font-bold">{hoverTooltip.country.share}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-zinc-500 bg-black/60 px-2.5 py-1 rounded-md border border-white/5 pointer-events-none">
          Hover over nodes for stats &bull; Drag to rotate
        </div>
      </div>

      {/* Ranked Country Leaderboard Cards with Dynamic % */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2.5">
          <span>Top Edge Routing Traffic ({timeRange.toUpperCase()})</span>
          <span>Share of {timeRange.toUpperCase()} Total Hits</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
          {countries.slice(0, 6).map((c) => {
            const isSelected = activeCountry?.code === c.code;
            return (
              <div
                key={c.code}
                onClick={() => focusCountry(c)}
                onMouseEnter={() => focusCountry(c)}
                onMouseLeave={() => setActiveCountry(null)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-lg scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-xs font-mono">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="text-sm shrink-0">{c.flag}</span>
                    <span className="text-foreground font-bold truncate" title={c.name}>{c.name}</span>
                  </span>
                  <span className="text-cyan-400 font-bold shrink-0">{c.share}%</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono mt-2">
                  <span>{c.requests.toLocaleString()} reqs</span>
                  <span className="text-[10px] text-zinc-500">{c.code}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${c.share}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
