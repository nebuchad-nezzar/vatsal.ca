import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface MarketHub {
  id: string;
  name: string;
  exchange: string;
  country: string;
  lat: number;
  lng: number;
  tzOffset: number;
  openHour: number;
  closeHour: number;
}

const FINANCIAL_MARKETS: MarketHub[] = [
  { id: 'ny', name: 'New York', exchange: 'NYSE / NASDAQ', country: 'United States', lat: 40.7128, lng: -74.006, tzOffset: -4, openHour: 9.5, closeHour: 16.0 },
  { id: 'chicago', name: 'Chicago', exchange: 'CME / CBOE', country: 'United States', lat: 41.8781, lng: -87.6298, tzOffset: -5, openHour: 9.5, closeHour: 16.0 },
  { id: 'london', name: 'London', exchange: 'LSE', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, tzOffset: 1, openHour: 8.0, closeHour: 16.5 },
  { id: 'frankfurt', name: 'Frankfurt', exchange: 'XETRA / Deutsche Börse', country: 'Germany', lat: 50.1109, lng: 8.6821, tzOffset: 2, openHour: 9.0, closeHour: 17.5 },
  { id: 'zurich', name: 'Zurich', exchange: 'SIX Swiss Exchange', country: 'Switzerland', lat: 47.3769, lng: 8.5417, tzOffset: 2, openHour: 9.0, closeHour: 17.5 },
  { id: 'mumbai', name: 'Mumbai', exchange: 'NSE / BSE', country: 'India', lat: 19.0760, lng: 72.8777, tzOffset: 5.5, openHour: 9.25, closeHour: 15.5 },
  { id: 'delhi', name: 'Delhi', exchange: 'NSE / Northern Capital Hub', country: 'India', lat: 28.6139, lng: 77.2090, tzOffset: 5.5, openHour: 9.25, closeHour: 15.5 },
  { id: 'tokyo', name: 'Tokyo', exchange: 'TSE (Tokyo Stock Exchange)', country: 'Japan', lat: 35.6762, lng: 139.6503, tzOffset: 9, openHour: 9.0, closeHour: 15.0 },
  { id: 'hk', name: 'Hong Kong', exchange: 'HKEX', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, tzOffset: 8, openHour: 9.5, closeHour: 16.0 },
  { id: 'singapore', name: 'Singapore', exchange: 'SGX', country: 'Singapore', lat: 1.3521, lng: 103.8198, tzOffset: 8, openHour: 9.0, closeHour: 17.0 },
  { id: 'sydney', name: 'Sydney', exchange: 'ASX', country: 'Australia', lat: -33.8688, lng: 151.2093, tzOffset: 10, openHour: 10.0, closeHour: 16.0 },
];

// Sequential East-to-West Market Connections
const MARKET_CONNECTIONS: [string, string][] = [
  ['sydney', 'tokyo'],     // Australia -> Tokyo
  ['tokyo', 'hk'],         // Tokyo -> Hong Kong
  ['hk', 'singapore'],     // Hong Kong -> Singapore
  ['singapore', 'mumbai'], // Singapore -> Mumbai
  ['mumbai', 'delhi'],     // Mumbai -> Delhi
  ['delhi', 'frankfurt'],  // Delhi -> Frankfurt
  ['frankfurt', 'london'], // Frankfurt -> London
  ['london', 'ny'],        // London -> New York
  ['ny', 'chicago'],       // New York -> Chicago
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

interface MarketStatusInfo {
  state: 'OPEN' | 'CLOSING_SOON' | 'CLOSED';
  statusText: string;
  localTimeStr: string;
  countdownText: string;
}

function getMarketStatusInfo(market: MarketHub): MarketStatusInfo {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const marketTime = new Date(utcMs + market.tzOffset * 3600000);

  const day = marketTime.getDay();
  const isWeekend = day === 0 || day === 6;

  const hours = marketTime.getHours();
  const mins = marketTime.getMinutes();
  const decTime = hours + mins / 60;

  const localTimeStr = marketTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  if (isWeekend) {
    return {
      state: 'CLOSED',
      statusText: 'CLOSED (Weekend)',
      localTimeStr,
      countdownText: 'Opens Monday 09:15 AM',
    };
  }

  if (decTime >= market.openHour && decTime < market.closeHour) {
    const minsToClose = Math.floor((market.closeHour - decTime) * 60);
    const hrsToClose = Math.floor(minsToClose / 60);
    const remMins = minsToClose % 60;

    if (minsToClose <= 60) {
      return {
        state: 'CLOSING_SOON',
        statusText: 'CLOSING SOON',
        localTimeStr,
        countdownText: `Closes in ${minsToClose} mins`,
      };
    }

    return {
      state: 'OPEN',
      statusText: 'MARKET OPEN',
      localTimeStr,
      countdownText: `Closes in ${hrsToClose}h ${remMins}m`,
    };
  } else {
    let minsToOpen = 0;
    if (decTime < market.openHour) {
      minsToOpen = Math.floor((market.openHour - decTime) * 60);
    } else {
      minsToOpen = Math.floor((24 - decTime + market.openHour) * 60);
    }
    const hrsToOpen = Math.floor(minsToOpen / 60);
    const remMins = minsToOpen % 60;

    return {
      state: 'CLOSED',
      statusText: 'MARKET CLOSED',
      localTimeStr,
      countdownText: `Opens in ${hrsToOpen}h ${remMins}m`,
    };
  }
}

interface TooltipData {
  market: MarketHub;
  status: MarketStatusInfo;
  x: number;
  y: number;
}

export default function ThreeGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 245;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 75;

    // 4. Dark Navy Core Sphere
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS - 0.4, 64, 64);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x020722,
      transparent: true,
      opacity: 0.98,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // 5. Electric Blue Atmosphere Outer Halo
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
          float intensity = pow(0.62 - dot(vNormal, vec3(0, 0, 1.0)), 2.4);
          gl_FragColor = vec4(0.05, 0.45, 0.95, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // 6. Pre-computed Landmass Matrix
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
          color: 0xcccccc,
          size: 1.15,
          transparent: true,
          opacity: 0.9,
        });

        const landPointsMesh = new THREE.Points(landGeo, landMat);
        globeGroup.add(landPointsMesh);
      })
      .catch((err) => console.error('Failed to load pre-computed world dots:', err));

    // 7. Financial Market Pins & Map Lookup
    const raycastTargets: { mesh: THREE.Mesh; market: MarketHub }[] = [];
    const marketMap = new Map<string, { vector: THREE.Vector3; market: MarketHub }>();

    const hitGeo = new THREE.SphereGeometry(4.5, 16, 16);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });

    FINANCIAL_MARKETS.forEach((market) => {
      const pos = latLngToVector3(market.lat, market.lng, GLOBE_RADIUS + 0.5);
      marketMap.set(market.id, { vector: pos, market });

      const statusInfo = getMarketStatusInfo(market);
      const dotColor = statusInfo.state === 'OPEN' ? 0x10b981 : (statusInfo.state === 'CLOSING_SOON' ? 0xf59e0b : 0x0099ff);

      const discGeo = new THREE.CircleGeometry(2.4, 32);
      const discMat = new THREE.MeshBasicMaterial({
        color: dotColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      });
      const discMesh = new THREE.Mesh(discGeo, discMat);
      discMesh.position.copy(pos);
      discMesh.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(discMesh);

      const borderGeo = new THREE.RingGeometry(2.3, 2.9, 32);
      const borderMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      });
      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      borderMesh.position.copy(pos);
      borderMesh.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(borderMesh);

      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(pos);
      globeGroup.add(hitMesh);
      raycastTargets.push({ mesh: hitMesh, market });
    });

    // 8. 3D ARCS & FLYING PULSES
    interface FlyingPulse {
      mesh: THREE.Mesh;
      points: THREE.Vector3[];
      progress: number;
      speed: number;
    }

    const flyingPulses: FlyingPulse[] = [];
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.75,
    });
    const pulseGeo = new THREE.SphereGeometry(1.3, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const upVec = new THREE.Vector3(0, 1, 0);

    MARKET_CONNECTIONS.forEach(([fromId, toId]) => {
      const fromObj = marketMap.get(fromId);
      const toObj = marketMap.get(toId);

      if (!fromObj || !toObj) return;

      const p1 = fromObj.vector.clone().normalize();
      const p2 = toObj.vector.clone().normalize();

      const dist = p1.distanceTo(p2);
      const maxAltitude = Math.min(dist * 0.38, 42);

      const numSegments = 64;
      const arcPoints: THREE.Vector3[] = [];

      const q1 = new THREE.Quaternion().setFromUnitVectors(upVec, p1);
      const q2 = new THREE.Quaternion().setFromUnitVectors(upVec, p2);

      for (let s = 0; s <= numSegments; s++) {
        const t = s / numSegments;
        const q = q1.clone().slerp(q2, t);

        const currentDir = upVec.clone().applyQuaternion(q).normalize();
        const currentAltitude = GLOBE_RADIUS + 0.5 + Math.sin(t * Math.PI) * maxAltitude;

        arcPoints.push(currentDir.multiplyScalar(currentAltitude));
      }

      const curveGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const line = new THREE.Line(curveGeo, arcMat);
      globeGroup.add(line);

      for (let p = 0; p < 2; p++) {
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        globeGroup.add(pulseMesh);
        flyingPulses.push({
          mesh: pulseMesh,
          points: arcPoints,
          progress: Math.random(),
          speed: 0.0035 + Math.random() * 0.003,
        });
      }
    });

    // 9. Controls
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0.002 };

    const MAX_VELOCITY = 0.04;
    const MAX_PITCH = Math.PI / 2.3;

    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
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
          const status = getMarketStatusInfo(hitTarget.market);
          setTooltip({
            market: hitTarget.market,
            status,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          container.style.cursor = 'pointer';
        }
      } else {
        setTooltip(null);
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      const vx = clamp(deltaY * 0.005, -MAX_VELOCITY, MAX_VELOCITY);
      const vy = clamp(deltaX * 0.005, -MAX_VELOCITY, MAX_VELOCITY);

      rotationVelocity.x = vx;
      rotationVelocity.y = vy;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseleave', onMouseUp);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      const vx = clamp(deltaY * 0.005, -MAX_VELOCITY, MAX_VELOCITY);
      const vy = clamp(deltaX * 0.005, -MAX_VELOCITY, MAX_VELOCITY);

      rotationVelocity.x = vx;
      rotationVelocity.y = vy;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    domElem.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 10. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      globeGroup.rotation.y += rotationVelocity.y;
      globeGroup.rotation.x = clamp(globeGroup.rotation.x + rotationVelocity.x, -MAX_PITCH, MAX_PITCH);

      if (!isDragging) {
        rotationVelocity.x *= 0.94;
        rotationVelocity.y += (0.0018 - rotationVelocity.y) * 0.03;
      }

      flyingPulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) pulse.progress = 0;
        
        const idx = Math.floor(pulse.progress * (pulse.points.length - 1));
        if (pulse.points[idx]) {
          pulse.mesh.position.copy(pulse.points[idx]);
        }
      });

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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseleave', onMouseUp);
      domElem.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-full h-[500px] min-h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      />

      {/* Hover Status Blob / Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 transform -translate-x-1/2 -translate-y-full mb-3 px-4 py-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl text-left min-w-[200px]"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-sm text-slate-100">{tooltip.market.name}</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                tooltip.status.state === 'OPEN'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : tooltip.status.state === 'CLOSING_SOON'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              <span
                className={`size-1.5 rounded-full mr-1.5 ${
                  tooltip.status.state === 'OPEN'
                    ? 'bg-emerald-400 animate-pulse'
                    : tooltip.status.state === 'CLOSING_SOON'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-400'
                }`}
              />
              {tooltip.status.state === 'OPEN' ? 'OPEN' : tooltip.status.state === 'CLOSING_SOON' ? 'CLOSING' : 'CLOSED'}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono mb-1">{tooltip.market.exchange}</p>

          <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800/80 mt-1">
            <span className="font-mono text-slate-400">Local Time:</span>
            <span className="font-mono font-medium text-amber-400">{tooltip.status.localTimeStr}</span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono mt-1 text-right">
            {tooltip.status.countdownText}
          </div>
        </div>
      )}
    </div>
  );
}
