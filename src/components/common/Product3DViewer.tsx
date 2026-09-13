import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Product } from '../../types';
import { 
  RotateCw, 
  Maximize2, 
  RotateCcw, 
  Compass, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  HelpCircle,
  Move,
  Sparkles,
  ShieldCheck,
  Award
} from 'lucide-react';
import { generateBackNutritionLabelSVG, generateCertificateSVG, generateSidePanelSVG } from '../../utils/productMedia';

interface Product3DViewerProps {
  product: Product;
  activeFace?: 'front' | 'back' | 'certificate' | 'side' | 'custom';
  customImage?: string;
  onFaceChange?: (face: 'front' | 'back' | 'certificate' | 'side') => void;
  className?: string;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  product,
  activeFace = 'front',
  customImage,
  onFaceChange,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotation angles in degrees: yaw (horizontal 0-360), pitch (vertical -75 to 75), roll (0)
  const [yaw, setYaw] = useState<number>(15);
  const [pitch, setPitch] = useState<number>(-8);
  const [zoom, setZoom] = useState<number>(1);
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Refs for drag tracking and momentum
  const dragStartRef = useRef<{ x: number; y: number; yaw: number; pitch: number }>({ x: 0, y: 0, yaw: 15, pitch: -8 });
  const velocityRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const lastPosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const animFrameRef = useRef<number | null>(null);

  const frontImg = customImage || product.images?.[0] || './images/rnd_whey_protein_1789192519698.jpg';
  const backImg = generateBackNutritionLabelSVG(product);
  const certImg = generateCertificateSVG(product);
  const sideImg = generateSidePanelSVG(product);

  // Which face texture is primary or facing camera
  // Normalizing yaw to 0..360
  const normalizedYaw = ((yaw % 360) + 360) % 360;
  const isFacingBack = normalizedYaw > 90 && normalizedYaw < 270;

  // Auto-spin animation loop
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isDragging) {
        if (isAutoSpin) {
          // Slow continuous turntable 360 spin
          setYaw(prev => (prev + 30 * delta) % 360);
        } else if (Math.abs(velocityRef.current.vx) > 0.05 || Math.abs(velocityRef.current.vy) > 0.05) {
          // Apply drag momentum inertia damping
          setYaw(prev => prev + velocityRef.current.vx);
          setPitch(prev => Math.max(-75, Math.min(75, prev + velocityRef.current.vy)));
          velocityRef.current.vx *= 0.92;
          velocityRef.current.vy *= 0.92;
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoSpin, isDragging]);

  // Pointer Down (Mouse or Touch)
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      yaw,
      pitch
    };
    lastPosRef.current = {
      x: clientX,
      y: clientY,
      time: performance.now()
    };
    velocityRef.current = { vx: 0, vy: 0 };
  };

  // Pointer Move
  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;

    const newYaw = (dragStartRef.current.yaw + dx * 0.7) % 360;
    const newPitch = Math.max(-75, Math.min(75, dragStartRef.current.pitch - dy * 0.5));

    setYaw(newYaw);
    setPitch(newPitch);

    // Calculate instantaneous velocity for inertia
    const now = performance.now();
    const dt = Math.max(1, now - lastPosRef.current.time);
    const vx = (clientX - lastPosRef.current.x) / dt * 10;
    const vy = -(clientY - lastPosRef.current.y) / dt * 8;

    velocityRef.current = {
      vx: Math.max(-15, Math.min(15, vx)),
      vy: Math.max(-10, Math.min(10, vy))
    };

    lastPosRef.current = { x: clientX, y: clientY, time: now };
  };

  // Pointer Up
  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Directional Nudge controls
  const nudge = (dYaw: number, dPitch: number) => {
    setIsAutoSpin(false);
    setYaw(prev => (prev + dYaw) % 360);
    setPitch(prev => Math.max(-75, Math.min(75, prev + dPitch)));
  };

  // Reset View
  const handleReset = () => {
    setYaw(15);
    setPitch(-8);
    setZoom(1);
    setIsAutoSpin(true);
    velocityRef.current = { vx: 0, vy: 0 };
  };

  // Switch to specific face angle
  const snapToFace = (face: 'front' | 'back' | 'certificate' | 'side') => {
    setIsAutoSpin(false);
    velocityRef.current = { vx: 0, vy: 0 };
    setPitch(0);
    if (face === 'front') setYaw(0);
    if (face === 'side') setYaw(90);
    if (face === 'back') setYaw(180);
    if (face === 'certificate') setYaw(270);
    if (onFaceChange) onFaceChange(face);
  };

  // Dynamic light specular calculation based on yaw angle
  const specularPos = ((normalizedYaw / 360) * 100).toFixed(1);

  return (
    <div 
      id="product-3d-360-viewport"
      ref={containerRef}
      className={`relative w-full aspect-square select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e131f] via-[#080b12] to-[#040609] border border-neutral-800 p-6 flex flex-col items-center justify-center shadow-2xl ${className}`}
      onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={(e) => {
        if (e.touches.length === 1) {
          handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length === 1) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={handlePointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Top HUD Badge: 360° All-Direction Move Status */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-amber-500/40 text-[11px] font-bold text-amber-400 backdrop-blur-md shadow-lg animate-pulse">
            <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>360° ALL-DIRECTION 3D</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-950/80 border border-neutral-800 text-[10px] font-mono text-neutral-400">
            <span>{Math.round(normalizedYaw)}° YAW</span>
            <span className="text-neutral-600">|</span>
            <span>{Math.round(pitch)}° TILT</span>
          </div>
        </div>

        {/* Indicator if currently viewing front, back, side or cert */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700 text-[11px] font-semibold text-neutral-200 backdrop-blur-md">
          <Layers className="w-3 h-3 text-[#D4AF37]" />
          <span>
            {normalizedYaw >= 315 || normalizedYaw < 45 ? 'Front Pack' : 
             normalizedYaw >= 45 && normalizedYaw < 135 ? 'Side Specs & Hologram' : 
             normalizedYaw >= 135 && normalizedYaw < 225 ? 'Back Nutrition Label' : 
             'NABL Lab Certificate'}
          </span>
        </div>
      </div>

      {/* Floating Instruction Tooltip */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 pointer-events-none z-10 transition-opacity duration-500">
        <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-neutral-800/80 text-[10px] font-medium text-neutral-400 flex items-center gap-1.5">
          <Move className="w-3 h-3 text-[#D4AF37]" />
          <span>Drag in any direction (horizontal or vertical) to rotate 360°</span>
        </div>
      </div>

      {/* Studio Radial Background Glow & Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 70%)`
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* 3D Perspective Stage */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {/* Dynamic Studio Shadow underneath product */}
        <div 
          className="absolute bottom-12 w-64 h-12 rounded-[100%] bg-black/80 blur-xl pointer-events-none transition-transform duration-75"
          style={{
            transform: `translateY(${pitch * 0.4}px) scale(${1 - pitch * 0.003}, ${1 + pitch * 0.004})`,
            opacity: Math.max(0.3, 0.8 - Math.abs(pitch) * 0.005)
          }}
        />

        {/* 3D Model Object (Cylindrical Supplement Tub / Card Simulation) */}
        <div
          className="relative w-72 sm:w-80 h-72 sm:h-80 flex items-center justify-center transition-transform duration-75 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `scale(${zoom}) rotateX(${pitch}deg) rotateY(${yaw}deg)`
          }}
        >
          {/* FRONT FACE: Main Product Packshot */}
          <div 
            className="absolute inset-0 flex items-center justify-center rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'translateZ(18px)'
            }}
          >
            <img 
              src={frontImg} 
              alt={`${product.name} 3D Front View`}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.95)] pointer-events-none"
            />
            {/* Dynamic Specular Studio Lighting Reflection on front */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50"
              style={{
                background: `linear-gradient(115deg, transparent ${Math.max(0, Number(specularPos) - 30)}%, rgba(255,255,255,0.7) ${specularPos}%, transparent ${Math.min(100, Number(specularPos) + 30)}%)`
              }}
            />
          </div>

          {/* BACK FACE: Nutrition Facts & Supplement Label */}
          <div 
            className="absolute inset-0 flex items-center justify-center rounded-2xl overflow-hidden bg-neutral-950 p-2 border border-neutral-800 shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) translateZ(18px)'
            }}
          >
            <img 
              src={backImg} 
              alt={`${product.name} Nutrition Facts Back Label`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl pointer-events-none"
            />
          </div>

          {/* SIDE FACE 1 (at 90 deg): Directions & Tamper Hologram */}
          <div 
            className="absolute inset-0 flex items-center justify-center rounded-2xl overflow-hidden bg-neutral-950 p-2 border border-neutral-800 shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(90deg) translateZ(18px)'
            }}
          >
            <img 
              src={sideImg} 
              alt={`${product.name} Directions & Authenticity Hologram`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl pointer-events-none"
            />
          </div>

          {/* SIDE FACE 2 (at 270 deg): NABL Lab Certificate of Analysis */}
          <div 
            className="absolute inset-0 flex items-center justify-center rounded-2xl overflow-hidden bg-white p-2 rounded-xl shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(270deg) translateZ(18px)'
            }}
          >
            <img 
              src={certImg} 
              alt={`${product.name} NABL Laboratory Certificate`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-lg pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Face Quick-Snap Selector Tabs at Bottom */}
      <div className="absolute bottom-16 left-4 right-4 flex items-center justify-center gap-1.5 z-20 overflow-x-auto py-1">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); snapToFace('front'); }}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
            normalizedYaw >= 315 || normalizedYaw < 45
              ? 'bg-[#D4AF37] text-neutral-950 border-[#D4AF37] shadow-md scale-105'
              : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <span>Front Pack</span>
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); snapToFace('back'); }}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
            normalizedYaw >= 135 && normalizedYaw < 225
              ? 'bg-[#D4AF37] text-neutral-950 border-[#D4AF37] shadow-md scale-105'
              : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <span>Back Label</span>
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); snapToFace('certificate'); }}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
            normalizedYaw >= 225 && normalizedYaw < 315
              ? 'bg-[#D4AF37] text-neutral-950 border-[#D4AF37] shadow-md scale-105'
              : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <Award className="w-3 h-3 text-emerald-400" />
          <span>NABL Cert</span>
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); snapToFace('side'); }}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
            normalizedYaw >= 45 && normalizedYaw < 135
              ? 'bg-[#D4AF37] text-neutral-950 border-[#D4AF37] shadow-md scale-105'
              : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <span>Side Panel</span>
        </button>
      </div>

      {/* Floating Control Toolbar at Bottom */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
        {/* Auto-Spin Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsAutoSpin(!isAutoSpin);
          }}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all ${
            isAutoSpin
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
              : 'bg-neutral-900/90 text-neutral-400 border-neutral-800 hover:text-white'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoSpin ? 'animate-spin' : ''}`} />
          <span>{isAutoSpin ? 'Auto-Rotating' : 'Play Spin'}</span>
        </button>

        {/* Directional Nudges & Zoom */}
        <div className="flex items-center gap-1 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-xl p-1">
          <button
            type="button"
            title="Rotate Left"
            onClick={(e) => { e.stopPropagation(); nudge(-45, 0); }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Rotate Right"
            onClick={(e) => { e.stopPropagation(); nudge(45, 0); }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <span className="w-px h-4 bg-neutral-800 mx-0.5" />
          <button
            type="button"
            title="Tilt Up"
            onClick={(e) => { e.stopPropagation(); nudge(0, 15); }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-xs font-bold"
          >
            ▲
          </button>
          <button
            type="button"
            title="Tilt Down"
            onClick={(e) => { e.stopPropagation(); nudge(0, -15); }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-xs font-bold"
          >
            ▼
          </button>
          <span className="w-px h-4 bg-neutral-800 mx-0.5" />
          <button
            type="button"
            title="Zoom In"
            onClick={(e) => { e.stopPropagation(); setZoom(prev => Math.min(1.6, prev + 0.15)); }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Zoom Out"
            onClick={(e) => { e.stopPropagation(); setZoom(prev => Math.max(0.7, prev - 0.15)); }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Reset Angle & Zoom"
            onClick={(e) => { e.stopPropagation(); handleReset(); }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
