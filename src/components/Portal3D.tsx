import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Environment, Lightformer, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import Planet from './Planet';

export default function Portal3D() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'absolute', top: 0, left: 0, zIndex: 50 }}>
      {/* Título Principal (Responsivo: canto superior esquerdo com gradiente metálico) */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-10 z-[60] pointer-events-none select-none">
        <h1 className="text-xl sm:text-3xl md:text-[2.4rem] font-black uppercase tracking-[3px] sm:tracking-[5px] m-0 font-mono bg-gradient-to-br from-slate-100 via-sky-400 to-slate-900 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] drop-shadow-[0_0_16px_rgba(56,189,248,0.45)]">
          Sistema Yvion
        </h1>
      </div>

      {/* Texto de Instrução (No desktop fica no topo; no mobile vai para o rodapé para nunca sobrepor) */}
      <div className="absolute bottom-6 sm:bottom-auto sm:top-7 left-1/2 -translate-x-1/2 z-[60] text-center pointer-events-none select-none whitespace-nowrap">
        <p className="text-white m-0 text-xs sm:text-sm md:text-[0.95rem] font-medium tracking-[2px] font-sans opacity-90 bg-slate-900/70 backdrop-blur-md px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-white/12 shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Arraste para girar a órbita
        </p>
      </div>

      <Canvas 
        camera={{ position: [0, 0, 16.8], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: 'high-performance'
        }}
      >
        {/* Adicionando Post-Processing (Efeito de Cinema / Glow / Bloom Calibrado com multisampling=0 para zero gargalo de VRAM) */}
        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={1.1} mipmapBlur intensity={1.6} radius={0.65} />
        </EffectComposer>

        {/* Otimizações Dinâmicas de Performance durante interação do usuário */}
        <AdaptiveDpr pixelated={false} />
        <AdaptiveEvents />

        <Suspense fallback={
          <Html center zIndexRange={[200, 0]}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              background: 'rgba(5, 10, 24, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: '20px 32px',
              borderRadius: '16px',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              boxShadow: '0 0 35px rgba(56, 189, 248, 0.25), inset 0 0 20px rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              fontSize: '13px',
              userSelect: 'none',
              whiteSpace: 'nowrap'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '3px solid rgba(56, 189, 248, 0.2)',
                borderTopColor: '#38bdf8',
                animation: 'yvionSpin 0.9s linear infinite'
              }} />
              <span>CARREGANDO UNIVERSO YVION...</span>
              <style>{`@keyframes yvionSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          </Html>
        }>
          {/* Estúdio de Iluminação e Reflexão Procedural (Inicialização ultrarrápida sem downloads pesados) */}
          <Environment resolution={256}>
            <Lightformer form="ring" intensity={3} color="#38bdf8" scale={12} position={[0, 6, -10]} />
            <Lightformer form="rect" intensity={4} color="#c084fc" scale={10} position={[-8, 2, -2]} rotation-y={Math.PI / 2} />
            <Lightformer form="rect" intensity={3} color="#ffffff" scale={10} position={[10, 2, 0]} rotation-y={-Math.PI / 2} />
          </Environment>
          
          {/* Fundo estrelado imersivo */}
          <Stars radius={150} depth={50} count={8000} factor={6} saturation={0.5} fade speed={1} />
          
          {/* O Sistema Solar e Planeta */}
          <Planet />
          
          {/* Controles de Navegação Balanceados (Limite de zoom seguro para não perder o Universo de vista) */}
          <OrbitControls 
            enableZoom={true} 
            maxDistance={140} 
            minDistance={4.5} 
            autoRotate={true}
            autoRotateSpeed={0.1} 
            enablePan={true}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
