'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Plane, Box, Cylinder, Sky } from '@react-three/drei'
import * as THREE from 'three'

interface StadiumProps {
  lightingIntensity?: number
}

export default function Stadium({ lightingIntensity = 1 }: StadiumProps) {
  const stadiumRef = useRef<THREE.Group>(null)
  const grassRef = useRef<THREE.Mesh>(null)
  const crowdRef = useRef<THREE.Group>(null)

  // Animate subtle crowd movement
  useFrame((state) => {
    if (crowdRef.current) {
      crowdRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
    }
  })

  // Create grass texture
  const grassTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,' + btoa(`
    <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grass" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect width="32" height="32" fill="#2d5016"/>
          <rect x="0" y="0" width="16" height="16" fill="#3a6b1a"/>
          <rect x="16" y="16" width="16" height="16" fill="#3a6b1a"/>
          <circle cx="8" cy="8" r="2" fill="#4a7c2a"/>
          <circle cx="24" cy="24" r="2" fill="#4a7c2a"/>
        </pattern>
      </defs>
      <rect width="256" height="256" fill="url(#grass)"/>
    </svg>
  `))
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(50, 50)

  // Create pitch texture
  const pitchTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,' + btoa(`
    <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" fill="#8B7355"/>
      <rect x="0" y="120" width="256" height="16" fill="#A0845C"/>
      <rect x="120" y="0" width="16" height="256" fill="#A0845C"/>
    </svg>
  `))

  // Stadium stands geometry
  const createStandSection = (position: [number, number, number], rotation: [number, number, number]) => (
    <group position={position} rotation={rotation} key={`${position[0]}-${position[2]}`}>
      {/* Main stand structure */}
      <Box args={[40, 15, 8]} position={[0, 7.5, 0]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>
      
      {/* Seating tiers */}
      {[0, 1, 2, 3, 4].map((tier) => (
        <Box 
          key={tier}
          args={[38, 1, 6]} 
          position={[0, 2 + tier * 2.5, 2 - tier * 0.5]}
        >
          <meshStandardMaterial color={tier % 2 === 0 ? "#1a4d3a" : "#2a5d4a"} />
        </Box>
      ))}
      
      {/* Crowd silhouettes */}
      {Array.from({ length: 20 }, (_, i) => (
        <Cylinder
          key={i}
          args={[0.3, 0.3, 1.5]}
          position={[
            -18 + (i * 2),
            4 + Math.random() * 2,
            1 + Math.random() * 2
          ]}
        >
          <meshStandardMaterial color="#1a1a1a" />
        </Cylinder>
      ))}
    </group>
  )

  return (
    <group ref={stadiumRef}>
      {/* Sky with evening gradient */}
      <Sky
        distance={450000}
        sunPosition={[-1, 0.4, -1]}
        inclination={0.6}
        azimuth={0.25}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        rayleigh={0.5}
        turbidity={10}
      />

      {/* Main cricket ground */}
      <Plane 
        ref={grassRef}
        args={[200, 200]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          map={grassTexture} 
          color="#2d5016"
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>

      {/* Cricket pitch */}
      <Plane 
        args={[22, 3]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.01, 0]}
      >
        <meshStandardMaterial 
          map={pitchTexture}
          color="#8B7355"
          roughness={0.9}
          metalness={0.05}
        />
      </Plane>

      {/* Wickets */}
      {/* Batsman's end wickets */}
      <group position={[0, 0, 10]}>
        {[-0.3, 0, 0.3].map((x, i) => (
          <Cylinder key={i} args={[0.02, 0.02, 0.7]} position={[x, 0.35, 0]}>
            <meshStandardMaterial color="#D2B48C" />
          </Cylinder>
        ))}
        {/* Bails */}
        <Cylinder args={[0.01, 0.01, 0.6]} position={[0, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#8B4513" />
        </Cylinder>
      </group>

      {/* Bowler's end wickets */}
      <group position={[0, 0, -10]}>
        {[-0.3, 0, 0.3].map((x, i) => (
          <Cylinder key={i} args={[0.02, 0.02, 0.7]} position={[x, 0.35, 0]}>
            <meshStandardMaterial color="#D2B48C" />
          </Cylinder>
        ))}
        <Cylinder args={[0.01, 0.01, 0.6]} position={[0, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#8B4513" />
        </Cylinder>
      </group>

      {/* Stadium stands */}
      <group ref={crowdRef}>
        {createStandSection([0, 0, 80], [0, 0, 0])}
        {createStandSection([0, 0, -80], [0, Math.PI, 0])}
        {createStandSection([80, 0, 0], [0, -Math.PI / 2, 0])}
        {createStandSection([-80, 0, 0], [0, Math.PI / 2, 0])}
      </group>

      {/* Stadium floodlights */}
      {[
        [60, 25, 60],
        [-60, 25, 60],
        [60, 25, -60],
        [-60, 25, -60]
      ].map((position, i) => (
        <group key={i} position={position as [number, number, number]}>
          {/* Light pole */}
          <Cylinder args={[0.5, 0.8, 25]} position={[0, -12.5, 0]}>
            <meshStandardMaterial color="#333333" />
          </Cylinder>
          
          {/* Light fixture */}
          <Box args={[3, 2, 3]} position={[0, 1, 0]}>
            <meshStandardMaterial color="#444444" />
          </Box>
          
          {/* Actual spotlight */}
          <spotLight
            position={[0, 0, 0]}
            target-position={[0, 0, 0]}
            angle={Math.PI / 6}
            penumbra={0.3}
            intensity={lightingIntensity * 0.8}
            color="#FFE5B4"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={1}
            shadow-camera-far={100}
          />
        </group>
      ))}

      {/* Main directional light (sunset) */}
      <directionalLight
        position={[-50, 30, -30]}
        intensity={lightingIntensity * 1.2}
        color="#FF8C42"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-near={1}
        shadow-camera-far={100}
      />

      {/* Ambient lighting */}
      <ambientLight intensity={lightingIntensity * 0.3} color="#4A5568" />

      {/* Hemisphere light for realistic sky lighting */}
      <hemisphereLight
        skyColor="#87CEEB"
        groundColor="#2d5016"
        intensity={lightingIntensity * 0.4}
      />

      {/* Boundary rope */}
      <group>
        {Array.from({ length: 64 }, (_, i) => {
          const angle = (i / 64) * Math.PI * 2
          const radius = 70
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          return (
            <Cylinder
              key={i}
              args={[0.1, 0.1, 0.5]}
              position={[x, 0.25, z]}
            >
              <meshStandardMaterial color={i % 2 === 0 ? "#FF0000" : "#FFFFFF"} />
            </Cylinder>
          )
        })}
      </group>

      {/* Sight screens */}
      <Box args={[15, 8, 0.5]} position={[0, 4, 85]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
      <Box args={[15, 8, 0.5]} position={[0, 4, -85]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
    </group>
  )
}