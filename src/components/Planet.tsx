import { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html, Trail, Float, useTexture, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- Utilitários de Matemática ---
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  var phi = (90 - lat) * Math.PI / 180;
  var theta = (lon + 180) * Math.PI / 180;
  var x = -(radius * Math.sin(phi) * Math.cos(theta));
  var z = (radius * Math.sin(phi) * Math.sin(theta));
  var y = (radius * Math.cos(phi));
  return new THREE.Vector3(x, y, z);
}

// --- Marcador Interativo de Alta Tecnologia (com Miniatura/Logo HD e Texto em Linha) ---
const Hotspot = ({ 
  lat, 
  lon, 
  radius, 
  color, 
  label, 
  url, 
  image,
  imageBg = '#ffffff',
  isLarge = false
}: { 
  lat: number; 
  lon: number; 
  radius: number; 
  color: string; 
  label: string; 
  url: string; 
  image?: string; 
  imageBg?: string;
  isLarge?: boolean;
}) => {
  const ref = useRef<THREE.Group>(null);
  const pos = useMemo(() => latLongToVector3(lat, lon, radius), [lat, lon, radius]);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.lookAt(0, 0, 0); // Aponta para o centro na montagem (elimina 10 useFrame desnecessários)
    }
  }, [pos]);

  return (
    <group position={pos} ref={ref}>
      <Sphere args={[isLarge ? 0.12 : 0.08, 16, 16]}><meshBasicMaterial color={color} /></Sphere>
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[isLarge ? 0.18 : 0.12, isLarge ? 0.25 : 0.16, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, isLarge ? 0.65 : 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[isLarge ? 0.03 : 0.02, isLarge ? 0.14 : 0.1, isLarge ? 1.3 : 1, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>
      <Html distanceFactor={isLarge ? 18 : 15} position={[0, isLarge ? 0.75 : 0.5, 0]} center zIndexRange={[100, 0]}>
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: isLarge ? '12px' : '8px',
            textDecoration: 'none',
            background: isLarge ? 'rgba(7, 12, 30, 0.94)' : 'rgba(5, 10, 24, 0.88)', 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color, 
            padding: isLarge 
              ? (image ? '6px 18px 6px 6px' : '8px 20px') 
              : (image ? '3px 10px 3px 4px' : '5px 12px'), 
            borderRadius: isLarge ? '12px' : '8px', 
            border: isLarge ? `2px solid ${color}` : `1px solid ${color}90`, 
            fontWeight: '900', 
            fontSize: isLarge ? '17px' : '13px', 
            letterSpacing: isLarge ? '0.04em' : 'normal',
            whiteSpace: 'nowrap', 
            pointerEvents: 'auto', 
            cursor: 'pointer',
            textShadow: isLarge ? `0 0 12px ${color}, 0 0 24px ${color}80` : `0 0 8px ${color}`, 
            boxShadow: isLarge 
              ? `0 0 28px ${color}60, inset 0 0 16px ${color}30, 0 4px 14px rgba(0,0,0,0.7)` 
              : `0 0 16px ${color}35, inset 0 0 10px ${color}15`, 
            fontFamily: 'monospace',
            userSelect: 'none',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onPointerEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = isLarge ? `${color}35` : `${color}28`;
            el.style.borderColor = color;
            el.style.boxShadow = isLarge ? `0 0 36px ${color}90, inset 0 0 18px ${color}45` : `0 0 24px ${color}75, inset 0 0 12px ${color}30`;
            el.style.transform = isLarge ? 'scale(1.12)' : 'scale(1.08)';
          }}
          onPointerLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = isLarge ? 'rgba(7, 12, 30, 0.94)' : 'rgba(5, 10, 24, 0.88)';
            el.style.borderColor = isLarge ? color : `${color}90`;
            el.style.boxShadow = isLarge ? `0 0 28px ${color}60, inset 0 0 16px ${color}30, 0 4px 14px rgba(0,0,0,0.7)` : `0 0 16px ${color}35, inset 0 0 10px ${color}15`;
            el.style.transform = 'scale(1.0)';
          }}
        >
          {image && (
            <span
              style={{
                width: isLarge ? '46px' : '26px',
                height: isLarge ? '46px' : '26px',
                borderRadius: isLarge ? '8px' : '5px',
                overflow: 'hidden',
                background: imageBg,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: isLarge 
                  ? `2px solid ${color}cc` 
                  : (imageBg === '#000000' || imageBg === 'black' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.35)'),
                boxShadow: isLarge ? `0 0 14px ${color}60, 0 2px 8px rgba(0,0,0,0.6)` : '0 1px 4px rgba(0,0,0,0.5)',
                padding: isLarge ? '3px' : '1px'
              }}
            >
              <img 
                src={image} 
                alt={label} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  display: 'block'
                }} 
              />
            </span>
          )}
          <span>{label}</span>
        </a>
      </Html>
    </group>
  );
};

// --- Portal Dimensional Estilo Stargate AAA com Textura Mecânica e Vórtice Inward ---
const DimensionalPortal = ({ position }: { position: [number, number, number] }) => {
  const vortexShaderRef = useRef<THREE.ShaderMaterial>(null);
  const streamPointsRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Carregar texturas mecânicas PBR industriais
  const [portalDiffuse, portalNormal, portalRoughness, portalEmissive] = useTexture([
    '/textures/portal_mech_diffuse.jpg',
    '/textures/portal_mech_normal.jpg',
    '/textures/portal_mech_roughness.jpg',
    '/textures/portal_mech_emissive.jpg'
  ]);

  // Geometrias e materiais compartilhados para os Chevrons (Elimina alocações redundantes)
  const chevronBoxGeo = useMemo(() => new THREE.BoxGeometry(0.32, 0.65, 0.35), []);
  const chevronBoxMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1e293b', metalness: 0.95, roughness: 0.25 }), []);
  const chevronConeGeo = useMemo(() => new THREE.ConeGeometry(0.07, 0.22, 6), []);
  const chevronConeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#00f0ff', emissive: '#00f0ff', emissiveIntensity: 4, metalness: 0.8 }), []);

  // Shader do Vórtice de Energia Fluindo da Borda Interna para o Centro
  const vortexShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv - vec2(0.5);
        float dist = length(p) * 2.0; // 0 no centro, 1 na borda
        if (dist > 1.0) discard;
        
        float angle = atan(p.y, p.x);
        
        // FLUXO DE ENERGIA DA BORDA PARA O CENTRO:
        // dist + uTime faz as frentes de onda convergirem diretamente para dist = 0 (centro)
        float speed = 3.2;
        float flow1 = sin(dist * 26.0 + uTime * speed);
        float flow2 = sin(dist * 42.0 + uTime * (speed * 1.5) - angle * 3.0);
        
        // Espirais de plasma giratórias sugadas para o núcleo
        float spiral = sin(angle * 7.0 - dist * 14.0 + uTime * 3.8);
        
        // Efeito de sucção: quanto mais perto do centro, mais concentrada a luz
        float centerSingularity = pow(clamp(1.0 - dist, 0.0, 1.0), 3.5) * 4.0;
        
        // Borda interna de onde parte a energia
        float rimEnergy = pow(clamp(dist, 0.0, 1.0), 3.0) * 2.5;
        
        // Padrão de energia composto
        float pattern = (flow1 * 0.45 + 0.55) * (spiral * 0.4 + 0.6) + (flow2 * 0.25);
        
        // Gradiente: Ciano Elétrico -> Violeta Quântico -> Branco Incandescente no Centro
        vec3 colCyan = vec3(0.0, 0.92, 1.0);
        vec3 colBlue = vec3(0.08, 0.35, 0.95);
        vec3 colViolet = vec3(0.68, 0.28, 0.98);
        vec3 colWhite = vec3(1.0, 1.0, 1.0);
        
        vec3 col = mix(colViolet, colBlue, pattern);
        col = mix(col, colCyan, dist * 0.75);
        col = mix(col, colWhite, clamp(centerSingularity * 0.85, 0.0, 1.0));
        
        col += colCyan * rimEnergy * 0.7;
        
        float alpha = clamp(0.75 + pattern * 0.25 + centerSingularity * 0.25, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `
  }), []);

  // 600 partículas físicas de energia sendo sugadas da borda para o centro (Armazenadas em Ref para mutação em 60fps)
  const { positions, colors, streamData } = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const data: { radius: number; angle: number; speed: number }[] = [];

    for (let i = 0; i < count; i++) {
      const radius = 0.2 + Math.random() * 2.65;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 0.8;
      data.push({ radius, angle, speed });

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.08;

      col[i * 3] = 0.2;
      col[i * 3 + 1] = 0.9;
      col[i * 3 + 2] = 1.0;
    }
    return { positions: pos, colors: col, streamData: data };
  }, []);
  const streamDataRef = useRef(streamData);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Atualizar tempo do shader de energia convergente
    if (vortexShaderRef.current) {
      vortexShaderRef.current.uniforms.uTime.value = t;
    }

    // Mover partículas físicas da borda interna para o centro
    if (streamPointsRef.current) {
      const posAttr = streamPointsRef.current.geometry.attributes.position;
      const colAttr = streamPointsRef.current.geometry.attributes.color;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;
      const streamData = streamDataRef.current;

      for (let i = 0; i < streamData.length; i++) {
        const item = streamData[i];
        // Sucção acelerada em direção ao centro
        item.radius -= delta * item.speed * (1.2 + (2.8 - item.radius) * 1.5);
        item.angle += delta * 2.2;

        // Ao atingir a singularidade central, renasce na borda externa do aro
        if (item.radius <= 0.15) {
          item.radius = 2.82 - Math.random() * 0.15;
          item.angle = Math.random() * Math.PI * 2;
        }

        posArr[i * 3] = Math.cos(item.angle) * item.radius;
        posArr[i * 3 + 1] = Math.sin(item.angle) * item.radius;

        // Fica mais branco e brilhante conforme se aproxima do núcleo
        const factor = Math.min(Math.max(1.0 - (item.radius / 2.85), 0.0), 1.0);
        colArr[i * 3] = 0.1 + factor * 0.9;
        colArr[i * 3 + 1] = 0.85 + factor * 0.15;
        colArr[i * 3 + 2] = 1.0;
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    // Pulsação suave da luz
    if (lightRef.current) {
      lightRef.current.intensity = 35 + Math.sin(t * 7) * 15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1.5}>
      <group position={position} scale={1.5}>
        
        {/* 1. ARO MECÂNICO PRINCIPAL COM TEXTURA PBR INDUSTRIAL */}
        <mesh>
          <torusGeometry args={[3.2, 0.45, 32, 128]} />
          <meshStandardMaterial 
            map={portalDiffuse}
            normalMap={portalNormal}
            roughnessMap={portalRoughness}
            emissiveMap={portalEmissive}
            metalness={0.92}
            roughness={0.35}
          />
        </mesh>

        {/* Aro Interno de Aço com Guias de Onda */}
        <mesh>
          <torusGeometry args={[2.92, 0.1, 16, 96]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Trilho de Descarga de Plasma na Borda Interna */}
        <mesh>
          <torusGeometry args={[2.84, 0.045, 16, 96]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>

        {/* 2. CHEVRONS / INJETORES MECÂNICOS AO REDOR DO ARO (GEOMETRIAS REUTILIZADAS DE ALTA PERFORMANCE) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <group key={i} rotation={[0, 0, rad]}>
              {/* Carcaça mecânica do Chevron */}
              <mesh position={[0, 3.22, 0]} geometry={chevronBoxGeo} material={chevronBoxMat} />
              {/* Cristal injetor apontando para o centro */}
              <mesh position={[0, 2.84, 0]} rotation={[0, 0, Math.PI]} geometry={chevronConeGeo} material={chevronConeMat} />
            </group>
          );
        })}

        {/* 3. VÓRTICE DE ENERGIA CONVERGENTE (DA BORDA INTERNA PARA O CENTRO) */}
        <mesh>
          <circleGeometry args={[2.84, 64]} />
          <shaderMaterial
            ref={vortexShaderRef}
            vertexShader={vortexShader.vertexShader}
            fragmentShader={vortexShader.fragmentShader}
            uniforms={vortexShader.uniforms}
            transparent={true}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* 4. FLUXO FÍSICO DE PARTÍCULAS EM ESPIRAL INWARD COM STREAMING OTIMIZADO */}
        <points ref={streamPointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} usage={THREE.DynamicDrawUsage} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} usage={THREE.DynamicDrawUsage} />
          </bufferGeometry>
          <pointsMaterial
            size={0.065}
            vertexColors
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            sizeAttenuation={true}
          />
        </points>

        {/* 5. NÚCLEO SINGULARIDADE BRANCO INCANDESCENTE */}
        <mesh>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* 6. LUZ GLOBAL DO PORTAL */}
        <pointLight ref={lightRef} color="#00f0ff" distance={60} />
      </group>
    </Float>
  );
};

// --- Nave Mãe (Disco Voador de Cristal Lapidado AAA) ---
const CrystalUFO = ({ position, scale = 1 }: { position: [number, number, number], scale?: number }) => {
  const ufoRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (ufoRef.current) {
      // Nave gira no próprio eixo (efeito de disco)
      ufoRef.current.rotation.y -= delta * 0.5;
      
      // Oscilação de flutuação antigravidade
      const t = state.clock.getElapsedTime();
      ufoRef.current.position.y = position[1] + Math.sin(t * 1.5) * 1.5;
    }
    // Anéis giram enlouquecidos no eixo inclinado
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 1.5;
      ringRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group position={position} ref={ufoRef} scale={scale}>
      
      {/* Casco Principal Facetado (Estilo Diamante Lapidado com 12 lados) */}
      <mesh>
        <cylinderGeometry args={[2.8, 1.5, 0.5, 12]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.98} // Vidro super transparente
          opacity={1} 
          metalness={0.5} // Dá reflexos de metal no vidro
          roughness={0.05} 
          ior={2.4} // Refração real do Diamante
          thickness={2} 
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
      
      {/* Anel de Armadura Metálica (Borda Afiada) */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[3, 3, 0.1, 12]} />
        <meshStandardMaterial color="#0f172a" metalness={1} roughness={0.3} />
      </mesh>

      {/* Cúpula Superior de Safira Lapidada */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1, 2.5, 0.6, 12]} />
        <meshPhysicalMaterial color="#38bdf8" transmission={0.9} opacity={1} metalness={0.2} roughness={0} ior={2.0} thickness={1} clearcoat={1} />
      </mesh>
      
      {/* Grade de Suporte Superior */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.05, 2.55, 0.6, 12]} />
        <meshStandardMaterial color="#334155" wireframe metalness={1} />
      </mesh>

      {/* Cúpula Inferior (Reator Escuro de Obsidiana) */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[1.5, 0.5, 0.4, 12]} />
        <meshPhysicalMaterial color="#020617" transmission={0.5} opacity={1} metalness={0.8} roughness={0.2} ior={1.5} />
      </mesh>

      {/* Núcleo de Energia (Dentro da Nave, brilhando muito através do cristal!) */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#0ea5e9" emissiveIntensity={6} />
      </mesh>
      <pointLight color="#0ea5e9" intensity={20} distance={40} />

      {/* Anel de Propulsão Eletromagnética */}
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[3.5, 0.03, 16, 12]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={10} wireframe />
      </mesh>

      {/* Farol Abdução / Feixe Trator Antigravitacional */}
      <mesh position={[0, -4, 0]}>
        <cylinderGeometry args={[0.5, 3.5, 7, 32, 1, true]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Anéis de Pulso Gravitacional Descendente */}
      <mesh position={[0, -2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.35, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.45} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.6, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.35} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// --- Cometa com Calda Colorida ---
const Comet = ({ color, startPos, speed, orbitRadius }: { color: string, startPos: number, speed: number, orbitRadius: number }) => {
  const cometRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cometRef.current) {
      const t = state.clock.getElapsedTime() * speed + startPos;
      cometRef.current.position.x = Math.sin(t) * orbitRadius;
      cometRef.current.position.y = Math.cos(t * 1.5) * (orbitRadius / 2);
      cometRef.current.position.z = Math.cos(t) * orbitRadius;
    }
  });

  return (
    <group ref={cometRef}>
      <Trail width={2} length={10} color={color} attenuation={(t) => t * t}>
        <Sphere args={[0.2, 16, 16]}><meshBasicMaterial color="#ffffff" /></Sphere>
      </Trail>
      <pointLight color={color} intensity={2} distance={10} />
    </group>
  );
};

// --- Espaçonave Patrulhando (Caça Delta Intergaláctico) ---
const Spaceship = ({ radius, speed, offset, scale = 1 }: { radius: number, speed: number, offset: number, scale?: number }) => {
  const shipRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (shipRef.current) {
      const t = state.clock.getElapsedTime() * speed + offset;
      shipRef.current.position.x = Math.sin(t) * radius;
      shipRef.current.position.z = Math.cos(t) * radius;
      // Nave aponta tangencialmente à órbita (t + 90 graus)
      shipRef.current.rotation.y = t + Math.PI / 2;
    }
  });

  return (
    <group ref={shipRef} scale={scale}>
      
      {/* Fuselagem Principal (Corpo Estendido) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 0.8, 32]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Bico da nave */}
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.3, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cockpit de Vidro Escuro (Meio embutido) */}
      <mesh position={[0, 0.08, 0.1]} scale={[1, 0.6, 1.5]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#020617" metalness={1} roughness={0} />
      </mesh>

      {/* Asas Delta (Aerodinâmicas - Perfeitamente Horizontais) */}
      <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.05]}>
        <coneGeometry args={[0.5, 0.6, 3]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
      </mesh>
      
      {/* Canhões de Laser nas Pontas das Asas */}
      <mesh position={[0.35, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={1} />
      </mesh>
      <mesh position={[-0.35, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={1} />
      </mesh>

      {/* Motores Traseiros Duplos (Exaustores Escuros) */}
      <mesh position={[0.06, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.15, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={1} roughness={0.6} />
      </mesh>
      <mesh position={[-0.06, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.15, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={1} roughness={0.6} />
      </mesh>

      {/* Chamas Iônicas dos Propulsores (Glow Neon Azul que reage ao Bloom) */}
      <mesh position={[0.06, 0, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.03, 0.4, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={5} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[-0.06, 0, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.03, 0.4, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={5} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Trilhas de Plasma Volumétricas Ativas (Plasma Trails) */}
      <group position={[0.06, 0, -0.55]}>
        <Trail width={0.12} length={10} color="#38bdf8" attenuation={(t) => t * t}>
          <mesh>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </Trail>
      </group>
      <group position={[-0.06, 0, -0.55]}>
        <Trail width={0.12} length={10} color="#38bdf8" attenuation={(t) => t * t}>
          <mesh>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </Trail>
      </group>

      {/* Luz guia / Farol embaixo refletindo na água da Terra */}
      <pointLight color="#38bdf8" intensity={2} distance={3} position={[0, -0.2, 0]} />
    </group>
  );
};

// --- Sistema de Anéis de Detritos Espaciais (Asteroid Ring) ---
const AsteroidRing = ({ innerRadius, outerRadius, count = 12000 }: { innerRadius: number, outerRadius: number, count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Computar milhares de partículas apenas uma vez
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorObj = new THREE.Color();
    const palettes = ['#9ca3af', '#6b7280', '#4b5563', '#d1d5db', '#1f2937', '#fcd34d', '#38bdf8'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      let r = innerRadius + Math.random() * (outerRadius - innerRadius);
      
      // Cria falhas/lacunas realistas (Divisão de Cassini)
      if (r > innerRadius + 1.2 && r < innerRadius + 1.6) r += 0.4;
      if (r > outerRadius - 0.5 && r < outerRadius - 0.3) r -= 0.2;

      pos[i * 3] = Math.cos(angle) * r;
      // Variação de altura do anel
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2 * (Math.random() > 0.9 ? 3 : 1);
      pos[i * 3 + 2] = Math.sin(angle) * r;
      
      // Faixas de Gelo
      const isIceBand = (r > innerRadius + 0.3 && r < innerRadius + 0.8) || (r > outerRadius - 0.2);
      colorObj.set(isIceBand ? (Math.random() > 0.5 ? '#e0f2fe' : '#ffffff') : palettes[Math.floor(Math.random() * palettes.length)]);
      
      col[i * 3] = colorObj.r;
      col[i * 3 + 1] = colorObj.g;
      col[i * 3 + 2] = colorObj.b;
    }
    return [pos, col];
  }, [innerRadius, outerRadius, count]);

  useFrame((_state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.05; // Rotação Orbital das pedras
    }
  });

  return (
    <group rotation={[Math.PI / 2.5, 0, 0]}>
      {/* Partículas (Detritos Espaciais 3D) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors={true} transparent={true} opacity={0.9} sizeAttenuation={true} />
      </points>
    </group>
  );
};

// --- Buraco Negro Supermassivo (Interestelar com Vórtice de Partículas) ---
const BlackHole = ({ position }: { position: [number, number, number] }) => {
  const diskRef = useRef<THREE.Group>(null);
  const flashRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Vórtice de 3.000 partículas de matéria sendo engolidas pela gravidade
  const [vortexPositions, vortexColors] = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorObj = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 3.2 + Math.pow(Math.random(), 2) * 8.5; // Mais denso perto do horizonte
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3 * (r - 3);
      pos[i * 3 + 2] = Math.sin(angle) * r;

      if (r < 4.2) colorObj.set('#ffffff');
      else if (r < 6.8) colorObj.set('#c084fc');
      else colorObj.set('#f43f5e');

      col[i * 3] = colorObj.r;
      col[i * 3 + 1] = colorObj.g;
      col[i * 3 + 2] = colorObj.b;
    }
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    // Rotação do disco de acreção
    if (diskRef.current) {
      diskRef.current.rotation.z -= delta * 1.5;
    }
    // Rotação hiper-relativística do vórtice de partículas
    if (particlesRef.current) {
      particlesRef.current.rotation.z -= delta * 2.2;
    }
    // Efeito de pulsação da radiação
    if (flashRef.current) {
      flashRef.current.intensity = 60 + Math.sin(state.clock.getElapsedTime() * 12) * 35;
    }
  });

  return (
    <group position={position}>
      
      {/* 1. SINGULARIDADE (O Vazio Perfeito) */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 2. HALO DO HORIZONTE DE EVENTOS (Glow de Fótons ao redor) */}
      <mesh>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshBasicMaterial color="#d8b4fe" transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.6, 64, 64]} />
        <meshBasicMaterial color="#9333ea" transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>

      {/* 3. VÓRTICE DE MATÉRIA EM ESPIRAL (Partículas Sendo Sugadas) */}
      <points ref={particlesRef} rotation={[Math.PI / 1.7, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[vortexPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[vortexColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.09} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation={true} />
      </points>

      {/* 4. DISCO DE ACREÇÃO PRINCIPAL (Física Limpa de Cinema) */}
      <group ref={diskRef} rotation={[Math.PI / 1.7, 0, 0]}>
        
        {/* Anel de Fótons Branco Puro */}
        <mesh>
          <ringGeometry args={[3.1, 3.8, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.95} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
        
        {/* Plasma Roxo de Altíssima Energia */}
        <mesh>
          <ringGeometry args={[3.8, 6.5, 128]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Fumaça Espacial / Gás Frio na Borda */}
        <mesh>
          <ringGeometry args={[6.5, 12, 128]} />
          <meshBasicMaterial color="#581c87" transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Radiação Gama */}
      <pointLight ref={flashRef} color="#c084fc" distance={220} intensity={80} />
    </group>
  );
};

// --- Estrela Pulsar (Neutron Star com Jatos Polares Relativísticos) ---
const PulsarStar = ({ position }: { position: [number, number, number] }) => {
  const pulsarRef = useRef<THREE.Group>(null);
  
  useFrame((_state, delta) => {
    if (pulsarRef.current) {
      pulsarRef.current.rotation.x += delta * 2;
      pulsarRef.current.rotation.y += delta * 1.5;
      pulsarRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <group position={position}>
      <group ref={pulsarRef}>
        {/* Núcleo superdenso brilhante */}
        <mesh>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial color="#ffffff" emissive="#fde047" emissiveIntensity={18} />
        </mesh>


        
        {/* EFEITO DE ESTRELA DE 8 PONTAS (Lentes de Difração) */}
        {[0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4].map((angle, index) => (
          <mesh key={index} rotation={[0, 0, angle]} scale={[0.15, 15, 0.15]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial 
              color="#fef08a" 
              transparent 
              opacity={0.8} 
              blending={THREE.AdditiveBlending} 
              depthWrite={false}
            />
          </mesh>
        ))}
        
        {/* Mais 8 pontas menores intercaladas */}
        {[Math.PI / 8, (Math.PI * 3) / 8, (Math.PI * 5) / 8, (Math.PI * 7) / 8].map((angle, index) => (
          <mesh key={'minor-'+index} rotation={[0, 0, angle]} scale={[0.08, 7, 0.08]}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.6} 
              blending={THREE.AdditiveBlending} 
              depthWrite={false} 
            />
          </mesh>
        ))}
      </group>
      
      <pointLight color="#fde047" intensity={30} distance={160} />
    </group>
  );
};

// --- Planetas Secundários Texturizados com Superfícies Dedicadas ---
const BackgroundPlanets = ({ colorMap: _colorMap, normalMap: _normalMap }: { colorMap: THREE.Texture, normalMap: THREE.Texture }) => {
  const groupRef = useRef<THREE.Group>(null);

  // 1. Textura Dedicada do Planeta Vulcânico (Basalto + Fissuras de Magma)
  const lavaTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#080302';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 45; i++) {
      ctx.beginPath();
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      ctx.moveTo(x, y);
      for (let j = 0; j < 8; j++) {
        x += (Math.random() - 0.5) * 120;
        y += (Math.random() - 0.5) * 70;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = Math.random() > 0.4 ? '#ff4500' : '#ff9900';
      ctx.lineWidth = Math.random() * 4 + 1.5;
      ctx.shadowColor = '#ff2200';
      ctx.shadowBlur = 12;
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }, []);

  // 2. Textura Dedicada do Gigante Gasoso (Bandas de Júpiter + Grande Mancha)
  const gasGiantTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const palette = ['#7c2d12', '#b45309', '#d97706', '#fef3c7', '#92400e', '#451a03', '#fbbf24', '#fde68a'];
    for (let y = 0; y < canvas.height; y++) {
      const freq = Math.sin(y * 0.09) * 0.5 + Math.sin(y * 0.02) * 0.5;
      const idx = Math.floor(Math.abs(freq * palette.length)) % palette.length;
      ctx.fillStyle = palette[idx];
      ctx.fillRect(0, y, canvas.width, 1);
    }
    // Grande Mancha Vermelha
    ctx.beginPath();
    ctx.ellipse(360, 310, 80, 40, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#991b1b';
    ctx.shadowColor = '#450a0a';
    ctx.shadowBlur = 15;
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }, []);

  // 3. Textura Dedicada do Planeta Glacial (Calotas e Cristais de Gelo)
  const iceTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0c4a6e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 35; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 90 + 20, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.5 ? '#e0f2fe' : '#bae6fd';
      ctx.globalAlpha = 0.45;
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  // 4. Textura Dedicada do Planeta Tóxico (Vórtices de Metano e Amônia)
  const toxicTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#052e16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const grad = ctx.createRadialGradient(x, y, 10, x, y, 110);
      grad.addColorStop(0, '#84cc16');
      grad.addColorStop(0.7, '#15803d');
      grad.addColorStop(1, '#052e16');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 110, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);
  
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.15; 
    }
  });

  return (
    <group ref={groupRef}>
      
      {/* 0. Fenômenos Cósmicos Extremos */}
      <BlackHole position={[15, 25, -70]} />
      <PulsarStar position={[-60, -15, 30]} />

      {/* 1. Planeta Vulcânico (Basalto Negro + Magma Incandescente) */}
      <group position={[-20, -5, -30]}>
        <Sphere args={[2.2, 64, 64]}>
          <meshStandardMaterial 
            map={lavaTexture} 
            emissiveMap={lavaTexture}
            emissive="#ff3b00"
            emissiveIntensity={1.8}
            roughness={0.7} 
          />
        </Sphere>
      </group>

      {/* 2. Gigante Gasoso (Bandas Jovianas + Grande Mancha + Campo de Asteroides) */}
      <group position={[35, 10, -40]}>
        <Sphere args={[6.2, 64, 64]}>
          <meshStandardMaterial map={gasGiantTexture} roughness={0.4} />
        </Sphere>
        {/* Campo de 12.000 Asteroides Tridimensional */}
        <AsteroidRing innerRadius={8.2} outerRadius={15.5} count={12000} />
      </group>

      {/* 3. Planeta de Gelo (Glacial Cristalino Reflexivo) */}
      <group position={[-40, 20, 10]}>
        <Sphere args={[1.6, 64, 64]}>
          <meshStandardMaterial 
            map={iceTexture} 
            roughness={0.15} 
            metalness={0.65} 
          />
        </Sphere>
        {/* Atmosfera Glacial Fina */}
        <Sphere args={[1.68, 32, 32]}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </Sphere>
      </group>

      {/* 4. Planeta Tóxico (Vórtices de Metano Ácido) */}
      <group position={[15, -15, -25]}>
        <Sphere args={[1.9, 64, 64]}>
          <meshStandardMaterial map={toxicTexture} roughness={0.5} />
        </Sphere>
        {/* Névoa de Ácido Sulfúrico */}
        <Sphere args={[2.0, 32, 32]}>
          <meshBasicMaterial color="#84cc16" transparent opacity={0.22} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </Sphere>
      </group>
    </group>
  );
};

// --- Sol de Magma Azul (Centro de Iluminação AAA com Corona & Ejeções Magnéticas) ---
const BlueSun = ({ position }: { position: [number, number, number] }) => {
  const coronaRef = useRef<THREE.Mesh>(null);
  const flaresRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (coronaRef.current) {
      coronaRef.current.rotation.y += delta * 0.1;
      coronaRef.current.rotation.z += delta * 0.05;
      const s = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.03;
      coronaRef.current.scale.set(s, s, s);
    }
    if (flaresRef.current) {
      flaresRef.current.rotation.z += delta * 0.22;
      flaresRef.current.rotation.y -= delta * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Luz intensa que ilumina TODO o sistema solar a partir do sol */}
      <pointLight intensity={24} color="#60a5fa" distance={380} />
      
      {/* Luz direcional para forçar sombras nos planetas saindo do sol */}
      <directionalLight position={[0, 0, 0]} intensity={3.5} color="#93c5fd" />

      {/* Camada Interna Brilhante (Glow super quente azul claro) */}
      <Sphere args={[7.8, 64, 64]}>
        <MeshDistortMaterial 
          color="#93c5fd" 
          emissive="#60a5fa"
          emissiveIntensity={4.5} 
          distort={0.18} 
          speed={4} 
        />
      </Sphere>

      {/* Núcleo do Sol - Fervendo/Distorcendo (Magma Escuro/Azul) */}
      <Sphere args={[8.0, 64, 64]}>
        <MeshDistortMaterial 
          color="#1e40af" 
          emissive="#1d4ed8" 
          emissiveIntensity={1.8}
          distort={0.28}
          speed={2.5} 
          roughness={0.8}
          transparent={true}
          opacity={0.85}
        />
      </Sphere>

      {/* Corona Solar / Ejeções de Plasma Externo */}
      <Sphere ref={coronaRef} args={[8.5, 32, 32]}>
        <meshBasicMaterial 
          color="#38bdf8" 
          transparent 
          opacity={0.18} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide} 
        />
      </Sphere>

      {/* Ejeções Coronais de Plasma Magnético (Solar Prominences) */}
      <group ref={flaresRef}>
        {[
          { rot: [0, 0, 0], scale: 1.1 },
          { rot: [1.2, 0.8, 0.4], scale: 1.2 },
          { rot: [-0.9, 1.4, -0.6], scale: 1.05 }
        ].map((f, i) => (
          <group key={i} rotation={f.rot as [number, number, number]}>
            <mesh position={[0, 7.8, 0]} rotation={[Math.PI / 2, 0, 0]} scale={f.scale}>
              <torusGeometry args={[1.8, 0.12, 16, 32, Math.PI * 0.9]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Halo Externo Esférico Cinemático (Isotrópico em 3D, sem bordas duras ou polígonos planos) */}
      <Sphere args={[9.4, 32, 32]}>
        <meshBasicMaterial 
          color="#0284c7" 
          transparent 
          opacity={0.1} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide} 
        />
      </Sphere>
    </group>
  );
};

interface DebrisItemData {
  type: number;
  pos: [number, number, number];
  rot: [number, number, number];
  scale: [number, number, number];
  color: string;
  emissive?: string;
  metalness: number;
  roughness: number;
}

// Subcomponente de instanciamento em lote para cada tipo de destroço cósmico
const DebrisTypeMesh = ({
  geometry,
  material,
  items
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  items: DebrisItemData[];
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!meshRef.current || items.length === 0) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      dummy.position.set(item.pos[0], item.pos[1], item.pos[2]);
      dummy.rotation.set(item.rot[0], item.rot[1], item.rot[2]);
      dummy.scale.set(item.scale[0], item.scale[1], item.scale[2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      color.set(item.color);
      meshRef.current.setColorAt(i, color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [items]);

  if (items.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, items.length]}
    />
  );
};

// --- Anel de Destroços Cósmicos, Peças de Carros & Naves Espaciais (Scrapyard Ring com InstancedMesh) ---
const CosmicJunkRing = () => {
  const ringRef = useRef<THREE.Group>(null);

  // 10 Geometrias e Materiais compartilhados em lote (InstancedMesh: apenas 10 Draw Calls no total)
  const typeConfigs = useMemo(() => [
    {
      geo: new THREE.TorusGeometry(0.08, 0.03, 8, 16),
      mat: new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.3 })
    },
    {
      geo: new THREE.BoxGeometry(0.13, 0.09, 0.11),
      mat: new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.85 })
    },
    {
      geo: new THREE.BoxGeometry(0.2, 0.11, 0.015),
      mat: new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.75 })
    },
    {
      geo: new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8),
      mat: new THREE.MeshStandardMaterial({ roughness: 0.2, metalness: 0.95 })
    },
    {
      geo: new THREE.ConeGeometry(0.14, 0.28, 3),
      mat: new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.8 })
    },
    {
      geo: new THREE.CylinderGeometry(0.07, 0.045, 0.15, 12, 1, true),
      mat: new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.9, side: THREE.DoubleSide })
    },
    {
      geo: new THREE.BoxGeometry(0.22, 0.13, 0.008),
      mat: new THREE.MeshStandardMaterial({ roughness: 0.1, metalness: 0.95 })
    },
    {
      geo: new THREE.CylinderGeometry(0.015, 0.015, 0.35, 4),
      mat: new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0.4 })
    },
    {
      geo: new THREE.CylinderGeometry(0.045, 0.045, 0.15, 10),
      mat: new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.6, emissive: '#f97316', emissiveIntensity: 1.8 })
    },
    {
      geo: new THREE.BoxGeometry(0.09, 0.06, 0.04),
      mat: new THREE.MeshStandardMaterial({ roughness: 0.2, metalness: 0.8, emissive: '#00f0ff', emissiveIntensity: 3 })
    }
  ], []);

  // 280 destroços detalhados distribuídos em órbita de anel
  const debrisList = useMemo<DebrisItemData[]>(() => {
    const list: DebrisItemData[] = [];
    const count = 280;
    
    // Paleta de cores realistas (lataria, ferrugem, titânio, borracha, chassi e hazard)
    const carColors = ['#0284c7', '#dc2626', '#b45309', '#1e293b', '#475569', '#cbd5e1'];
    const rustColors = ['#78350f', '#92400e', '#57534e'];
    const shipColors = ['#64748b', '#94a3b8', '#334155', '#0f172a'];

    for (let i = 0; i < count; i++) {
      const type = Math.floor(Math.random() * 10);
      
      // Distribuição orbital realista (raio de 2.65 a 4.25)
      const r = 2.65 + Math.sqrt(Math.random()) * 1.6;
      const theta = Math.random() * Math.PI * 2;
      
      // Espessura do disco orbital
      const y = (Math.random() - 0.5) * 0.22;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      const rot: [number, number, number] = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ];

      const s = 0.65 + Math.random() * 0.7;
      const scale: [number, number, number] = [s, s, s];

      let color = '#64748b';
      let emissive: string | undefined = undefined;
      let metalness = 0.7;
      let roughness = 0.4;

      if (type === 0) {
        color = '#1e293b';
        metalness = 0.3;
        roughness = 0.8;
      } else if (type === 1) {
        color = '#334155';
        metalness = 0.85;
        roughness = 0.5;
      } else if (type === 2) {
        color = carColors[i % carColors.length];
        metalness = 0.75;
        roughness = 0.35;
      } else if (type === 3) {
        color = '#94a3b8';
        metalness = 0.95;
        roughness = 0.2;
      } else if (type === 4) {
        color = shipColors[i % shipColors.length];
        metalness = 0.8;
        roughness = 0.35;
      } else if (type === 5) {
        color = '#1e293b';
        metalness = 0.9;
        roughness = 0.3;
      } else if (type === 6) {
        color = '#1e3a8a';
        metalness = 0.95;
        roughness = 0.1;
      } else if (type === 7) {
        color = rustColors[i % rustColors.length];
        metalness = 0.4;
        roughness = 0.9;
      } else if (type === 8) {
        color = '#ea580c';
        emissive = '#f97316';
        metalness = 0.6;
        roughness = 0.4;
      } else {
        color = '#0f172a';
        emissive = '#00f0ff';
        metalness = 0.8;
        roughness = 0.2;
      }

      list.push({ type, pos: [x, y, z], rot, scale, color, emissive, metalness, roughness });
    }
    return list;
  }, []);

  // Agrupamento dos 280 destroços nos 10 tipos para instanciamento em lote
  const groupedDebris = useMemo(() => {
    const groups: DebrisItemData[][] = Array.from({ length: 10 }, () => []);
    debrisList.forEach(item => {
      groups[item.type].push(item);
    });
    return groups;
  }, [debrisList]);

  useFrame((_state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.12;
    }
  });

  return (
    <group ref={ringRef} rotation={[Math.PI / 3, 0.35, 0]}>
      {typeConfigs.map((cfg, t) => (
        <DebrisTypeMesh
          key={t}
          geometry={cfg.geo}
          material={cfg.mat}
          items={groupedDebris[t]}
        />
      ))}
    </group>
  );
};

// --- Aura Atmosférica Suave e Cinemática (Fresnel Rayleigh/Mie) ---
const AlienAtmosphere = ({ radius }: { radius: number }) => {
  const shaderArgs = useMemo(() => ({
    uniforms: {
      uColorInner: { value: new THREE.Color('#06b6d4') },
      uColorOuter: { value: new THREE.Color('#a855f7') }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform vec3 uColorInner;
      uniform vec3 uColorOuter;
      void main() {
        vec3 viewDir = normalize(-vPosition);
        vec3 n = normalize(vNormal);
        float d = clamp(dot(viewDir, n), 0.0, 1.0);
        float rim = clamp(1.0 - d, 0.0, 1.0);
        float glow = clamp(pow(rim, 3.0), 0.0, 1.0);
        vec3 color = mix(uColorInner, uColorOuter, rim * 0.85);
        gl_FragColor = vec4(color, glow * 0.85);
      }
    `
  }), []);

  return (
    <mesh>
      <sphereGeometry args={[radius * 1.04, 64, 64]} />
      <shaderMaterial
        vertexShader={shaderArgs.vertexShader}
        fragmentShader={shaderArgs.fragmentShader}
        uniforms={shaderArgs.uniforms}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
};

// --- Planeta Irmão Alienígena (Dimensão Fóssil Cyber-Dino & Florestas Titânicas) ---
const AlienSisterPlanet = () => {
  const planetOrbitRef = useRef<THREE.Group>(null);
  const planetRotRef = useRef<THREE.Group>(null);

  const [alienTexture, alienEmissive, alienBump] = useTexture([
    '/textures/alien_sister_planet.jpg',
    '/textures/alien_sister_planet_emissive.jpg',
    '/textures/alien_sister_planet_bump.jpg'
  ]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime() * 0.14; // Velocidade orbital majestosa
    
    // Órbita Binária ao redor da Terra (com inclinação de 15 graus)
    if (planetOrbitRef.current) {
      const radius = 13.5;
      planetOrbitRef.current.position.x = Math.sin(t) * radius;
      planetOrbitRef.current.position.z = Math.cos(t) * radius;
      planetOrbitRef.current.position.y = Math.sin(t * 1.3) * 3.2; // Ondulação gravitacional suave
    }

    // Rotação axial própria do planeta e seus elementos
    if (planetRotRef.current) {
      planetRotRef.current.rotation.y += delta * 0.16;
    }
  });

  return (
    <group ref={planetOrbitRef}>
      {/* Grupo com rotação axial própria do planeta (superfície, torres e hotspot de topo) */}
      <group ref={planetRotRef}>
        {/* Corpo Principal (Superfície Alienígena Hiper-Realista, Dinossauros Cibernéticos e Relevo 3D) */}
        <Sphere args={[2.1, 64, 64]}>
          <meshStandardMaterial 
            map={alienTexture} 
            bumpMap={alienBump}
            bumpScale={0.06}
            emissiveMap={alienEmissive}
            emissive="#22d3ee"
            emissiveIntensity={1.8}
            roughness={0.42} 
            metalness={0.35} 
          />
        </Sphere>

        {/* Megaspíres Megalopolitanas 3D que se elevam da superfície para o espaço */}
        <group>
          {[
            { pos: [1.8, 0.9, 0.5], rot: [0.4, 0.2, -0.6], h: 0.65 },
            { pos: [-1.4, 1.4, 0.6], rot: [-0.6, 0.3, 0.7], h: 0.8 },
            { pos: [0.7, -1.8, 0.8], rot: [0.8, -0.4, -0.3], h: 0.7 },
            { pos: [-1.2, -1.2, -1.1], rot: [-0.8, 0.6, 0.8], h: 0.9 }
          ].map((spire, idx) => (
            <group key={idx} position={spire.pos as [number, number, number]} rotation={spire.rot as [number, number, number]}>
              <mesh position={[0, spire.h / 2, 0]}>
                <cylinderGeometry args={[0.015, 0.045, spire.h, 6]} />
                <meshStandardMaterial color="#0ea5e9" emissive="#00f0ff" emissiveIntensity={2.5} metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[0, spire.h, 0]}>
                <sphereGeometry args={[0.035, 12, 12]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>
          ))}
        </group>

        {/* Hotspot de Destaque no Topo do Planeta dos Dinossauros (Grande) */}
        <Hotspot 
          lat={78} 
          lon={0} 
          radius={2.1} 
          color="#ec4899" 
          label="Dino Drag Race" 
          url="https://dinodragrace.yvion.com.br/" 
          image="/imagen/dino-drag-race.png" 
          imageBg="#0f172a" 
          isLarge={true} 
        />
      </group>

      {/* Aura Atmosférica Suave e Cinemática sem bordas duras */}
      <AlienAtmosphere radius={2.1} />

      {/* Anel de Lixo Cósmico, Peças de Carros e Destroços de Naves Espaciais */}
      <CosmicJunkRing />

      {/* Brilho próprio das cidades e reatores de plasma alienígenas */}
      <pointLight color="#22d3ee" intensity={25} distance={35} />
    </group>
  );
};

export default function YvionPlanet() {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const sunAnchorRef = useRef<THREE.Group>(null);
  const earthRadius = 4;

  // Carregando texturas locais otimizadas (zero latência de rede)
  const [colorMap, normalMap, specularMap, cloudsMap, lightsMap] = useTexture([
    '/textures/earth_atmos_2048.jpg',
    '/textures/earth_normal_2048.jpg',
    '/textures/earth_specular_2048.jpg',
    '/textures/earth_clouds_1024.png',
    '/textures/earth_lights_2048.png'
  ]);

  useFrame((_state, delta) => {
    // A Terra gira em seu próprio eixo
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.15; 
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.20; 
    
    // O Sol (e tudo que orbita ele) orbita a Terra de forma relativa
    if (sunAnchorRef.current) {
      sunAnchorRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group>
      {/* Iluminação Global Balanceada: impede qualquer planeta ou face de ficar breu total */}
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#60a5fa', '#0f172a', 0.4]} />
      <directionalLight position={[15, 20, 25]} intensity={1.4} color="#f0f9ff" />

      {/* PLANETA TERRA (Fixo no centro absoluto [0,0,0] para foco perfeito da câmera) */}
      <group ref={earthRef}>
        {/* Superfície Terrestre com Specular e Luzes Noturnas das Cidades (Night Lights) */}
        <Sphere args={[earthRadius, 64, 64]}>
          <meshStandardMaterial 
            map={colorMap} 
            normalMap={normalMap} 
            roughnessMap={specularMap}
            roughness={0.65} 
            metalness={0.15}
            emissiveMap={lightsMap}
            emissive="#fde047"
            emissiveIntensity={1.6}
          />
        </Sphere>
        {/* Nuvens Dinâmicas de Alta Densidade */}
        <Sphere ref={cloudsRef} args={[earthRadius * 1.012, 64, 64]}>
          <meshPhongMaterial map={cloudsMap} transparent={true} opacity={0.82} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </Sphere>
        {/* Atmosfera Rayleigh Interna (Borda Azul Suave) */}
        <Sphere args={[earthRadius * 1.035, 64, 64]}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.22} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </Sphere>
        {/* Atmosfera Rayleigh Externa (Glow Azul-Celeste Cinematográfico) */}
        <Sphere args={[earthRadius * 1.07, 64, 64]}>
          <meshBasicMaterial color="#0284c7" transparent opacity={0.12} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </Sphere>

        <Hotspot lat={25} lon={-45} radius={earthRadius} color="#38bdf8" label="Yvion ERP IA" url="https://www.yvion.com.br/home" image="/imagen/yvion-erp-ia.png" imageBg="#000000" />
        <Hotspot lat={-20} lon={-55} radius={earthRadius} color="#10b981" label="Portal Xamânico" url="https://portalxamanico.yvion.com.br/" image="/imagen/portal-xamanico.jpg" />
        <Hotspot lat={-5} lon={-15} radius={earthRadius} color="#818cf8" label="Céu of Mercy" url="https://ceuofmercy.com.br/" image="/imagen/ceu-of-mercy.png" />
        <Hotspot lat={15} lon={25} radius={earthRadius} color="#f97316" label="Mopia" url="https://www.mopia.com.br/" image="/imagen/mopia.png" />
        <Hotspot lat={-15} lon={75} radius={earthRadius} color="#a855f7" label="Coruja Mística" url="https://corujamistica.yvion.com.br/" image="/imagen/corujamistica.png" imageBg="#000000" />
        <Hotspot lat={40} lon={125} radius={earthRadius} color="#facc15" label="TradeBot" url="https://tradebot.yvion.com.br" image="/imagen/tradebot.jpg" imageBg="#000000" />
        <Hotspot lat={-30} lon={-130} radius={earthRadius} color="#ec4899" label="Auto Clicker" url="https://autoclicker.yvion.com.br" />
        <Hotspot lat={55} lon={-10} radius={earthRadius} color="#4ade80" label="Baixa Tudo" url="https://baixatudo.yvion.com.br/" image="/imagen/baixa-tudo.png" imageBg="#000000" />

        <Spaceship radius={earthRadius * 1.15} speed={0.5} offset={0} scale={0.8} />
        <Spaceship radius={earthRadius * 1.25} speed={0.7} offset={Math.PI} scale={0.8} />
      </group>

      {/* PLANETA IRMÃO ALIENÍGENA (Órbita Binária ao Redor da Terra) */}
      <AlienSisterPlanet />

      {/* SISTEMA SOLAR (Ancorado na Terra, mas contendo o Sol no centro local dele) */}
      <group ref={sunAnchorRef}>
        
        {/* O Sol fica afastado a 40 unidades da Terra. Como o SunAnchor gira, o Sol orbita a Terra (Relatividade) */}
        <group position={[-40, 0, 0]}>
          <BlueSun position={[0, 0, 0]} />

          {/* Tudo que está AQUI orbita o Sol! (Verdadeiro Heliocentrismo gravimétrico) */}
          <Comet color="#ec4899" startPos={0} speed={0.8} orbitRadius={25} />
          <Comet color="#06b6d4" startPos={Math.PI} speed={0.5} orbitRadius={15} />
          <Comet color="#facc15" startPos={Math.PI / 2} speed={1.2} orbitRadius={30} />
          
          <DimensionalPortal position={[-15, 10, -10]} />
          
          {/* Nova Nave Mãe Diamante / Cristal UFO (Substituindo o segundo portal) */}
          <CrystalUFO position={[25, -15, 20]} scale={1.2} />

          {/* Planetas Secundários orbitando o Sol */}
          <BackgroundPlanets colorMap={colorMap} normalMap={normalMap} />
        </group>

      </group>
    </group>
  );
}

// Pré-carregamento de todas as texturas em segundo plano para eliminar qualquer pop-in
useTexture.preload([
  '/textures/earth_atmos_2048.jpg',
  '/textures/earth_normal_2048.jpg',
  '/textures/earth_specular_2048.jpg',
  '/textures/earth_clouds_1024.png',
  '/textures/earth_lights_2048.png',
  '/textures/alien_sister_planet.jpg',
  '/textures/alien_sister_planet_emissive.jpg',
  '/textures/alien_sister_planet_bump.jpg',
  '/textures/portal_mech_diffuse.jpg',
  '/textures/portal_mech_normal.jpg',
  '/textures/portal_mech_roughness.jpg',
  '/textures/portal_mech_emissive.jpg'
]);
