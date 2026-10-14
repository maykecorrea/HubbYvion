import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Environment, Lightformer, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import Planet from './Planet';

export default function Portal3D() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'absolute', top: 0, left: 0, zIndex: 50 }}>
      {/* Título Principal à Esquerda (Azul com Metálico Escuro) */}
      <div style={{ position: 'absolute', top: '32px', left: '40px', zIndex: 60, pointerEvents: 'none', userSelect: 'none' }}>
        <h1 style={{ 
          fontSize: '2.4rem', 
          fontWeight: '900', 
          textTransform: 'uppercase', 
          letterSpacing: '5px', 
          margin: 0, 
          fontFamily: 'monospace',
          background: 'linear-gradient(135deg, #e2e8f0 0%, #38bdf8 35%, #0284c7 70%, #0f172a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 16px rgba(56, 189, 248, 0.45))'
        }}>
          Sistema Yvion
        </h1>
      </div>

      {/* Texto de Instrução Centralizado no Topo */}
      <div style={{ position: 'absolute', top: '28px', left: '50%', transform: 'translateX(-50%)', zIndex: 60, textAlign: 'center', pointerEvents: 'none', userSelect: 'none' }}>
        <p style={{ 
          color: '#ffffff', 
          margin: 0, 
          fontSize: '0.95rem', 
          fontWeight: '500',
          letterSpacing: '2px', 
          fontFamily: 'sans-serif',
          opacity: 0.9,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '6px 18px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
        }}>
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

        <Suspense fallback={<Html center><div style={{color:'white', fontFamily:'sans-serif'}}>Carregando Universo AAA...</div></Html>}>
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
          
          {/* Controles para o usuário girar com o mouse */}
          <OrbitControls 
            enableZoom={true} 
            maxDistance={1000} 
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
