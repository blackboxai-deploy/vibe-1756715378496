'use client'

import React, { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Sky, 
  Text3D, 
  Center,
  useTexture,
  Plane,
  Box,
  Sphere,
  Cylinder
} from '@react-three/drei'
import { Physics, useBox, useSphere, usePlane } from '@react-three/cannon'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useSpring, animated } from '@react-spring/three'

// Cricket Ball Component
function CricketBall({ position, onHit }: { position: [number, number, number], onHit: () => void }) {
  const [ref, api] = useSphere(() => ({
    mass: 0.16, // Cricket ball weight in kg
    position,
    material: { restitution: 0.7, friction: 0.3 }
  }))

  const ballRef = useRef<THREE.Mesh>(null)
  const [isSpinning, setIsSpinning] = useState(true)

  useFrame((state, delta) => {
    if (ballRef.current && isSpinning) {
      ballRef.current.rotation.z += delta * 15 // Spinning motion
    }
  })

  useEffect(() => {
    // Ball trajectory animation
    const timer = setTimeout(() => {
      api.velocity.set(-8, 2, 0) // Ball moving towards batsman
    }, 4000) // Start at 4 seconds

    return () => clearTimeout(timer)
  }, [api])

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[0.037, 32, 32]} />
      <meshStandardMaterial 
        color="#8B0000" 
        roughness={0.8}
        metalness={0.1}
      />
      {/* White stitching */}
      <mesh>
        <ringGeometry args={[0.035, 0.038, 8]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>
    </mesh>
  )
}

// Cricket Bat Component
function CricketBat({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const [ref] = useBox(() => ({
    mass: 1.2, // Cricket bat weight
    position,
    rotation,
    type: 'Static'
  }))

  const { swingRotation } = useSpring({
    swingRotation: [0, 0, 0.3],
    from: { swingRotation: [0, 0, 0] },
    config: { tension: 200, friction: 25 },
    delay: 5800 // Swing timing
  })

  return (
    <animated.group rotation={swingRotation}>
      <mesh ref={ref} castShadow>
        {/* Bat blade */}
        <boxGeometry args={[0.1, 0.9, 0.05]} />
        <meshStandardMaterial 
          color="#DEB887" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Bat handle */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.3, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
    </animated.group>
  )
}

// Batsman Component
function Batsman({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const [isSwinging, setIsSwinging] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSwinging(true)
    }, 5500)
    return () => clearTimeout(timer)
  }, [])

  const { bodyRotation } = useSpring({
    bodyRotation: isSwinging ? [0, 0.2, 0] : [0, 0, 0],
    config: { tension: 300, friction: 30 }
  })

  return (
    <animated.group ref={groupRef} position={position} rotation={bodyRotation}>
      {/* Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Head with helmet */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#FFE4C4" />
      </mesh>
      
      {/* Helmet */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Blue visor */}
      <mesh position={[0, 1.4, 0.15]} castShadow>
        <boxGeometry args={[0.25, 0.08, 0.02]} />
        <meshStandardMaterial color="#0066CC" transparent opacity={0.7} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.25, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.4]} />
        <meshStandardMaterial color="#FFE4C4" />
      </mesh>
      <mesh position={[0.25, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.4]} />
        <meshStandardMaterial color="#FFE4C4" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.1, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Cricket Bat */}
      <CricketBat position={[0.3, 0.8, 0]} rotation={[0, 0, -0.3]} />
    </animated.group>
  )
}

// Stadium Environment
function Stadium() {
  return (
    <group>
      {/* Cricket Pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 30]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
      
      {/* Stadium stands - simplified */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh 
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 12,
            2,
            Math.sin((i / 8) * Math.PI * 2) * 12
          ]}
          castShadow
        >
          <boxGeometry args={[2, 4, 1]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      ))}
      
      {/* Crowd silhouettes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            3 + Math.random() * 2,
            8 + Math.random() * 4
          ]}
          castShadow
        >
          <capsuleGeometry args={[0.1, 0.3]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  )
}

// Dynamic Camera Controller
function CameraController() {
  const { camera } = useThree()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const phases = [
      // Phase 1: Stadium wide shot (0-2s)
      () => {
        camera.position.set(0, 8, 15)
        camera.lookAt(0, 0, 0)
      },
      // Phase 2: Batsman focus (2-4s)
      () => {
        camera.position.set(-2, 2, 5)
        camera.lookAt(0, 1, 0)
      },
      // Phase 3: Ball approach (4-6s)
      () => {
        camera.position.set(5, 1, 2)
        camera.lookAt(-2, 1, 0)
      },
      // Phase 4: Impact shot (6-8s)
      () => {
        camera.position.set(-1, 1.5, 3)
        camera.lookAt(0, 1, 0)
      },
      // Phase 5: Ball flight (8-10s)
      () => {
        camera.position.set(-3, 4, 8)
        camera.lookAt(2, 3, -5)
      }
    ]

    const timers = phases.map((phaseFunc, index) => 
      setTimeout(() => {
        setPhase(index)
        phaseFunc()
      }, index * 2000)
    )

    return () => timers.forEach(clearTimeout)
  }, [camera])

  return null
}

// Text Reveal Component
function TextReveal() {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true)
    }, 10000) // Show at 10 seconds
    return () => clearTimeout(timer)
  }, [])

  const { scale, opacity } = useSpring({
    scale: showText ? 1 : 0,
    opacity: showText ? 1 : 0,
    config: { tension: 200, friction: 25 }
  })

  if (!showText) return null

  return (
    <animated.group scale={scale}>
      <Center position={[0, 3, -2]}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.8}
          height={0.1}
          curveSegments={12}
        >
          TANISH
          <meshStandardMaterial 
            color="white" 
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </Text3D>
      </Center>
      
      <Center position={[0, 2, -2]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.4}
          height={0.05}
          curveSegments={12}
        >
          CREATES
          <meshStandardMaterial 
            color="white" 
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </Text3D>
      </Center>
    </animated.group>
  )
}

// Main Cricket Scene Component
export default function CricketScene() {
  const [animationStarted, setAnimationStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-screen bg-gradient-to-b from-orange-400 via-purple-500 to-slate-900">
      <Canvas shadows camera={{ position: [0, 8, 15], fov: 60 }}>
        <Suspense fallback={null}>
          {/* Lighting Setup */}
          <ambientLight intensity={0.3} />
          
          {/* Sunset directional light */}
          <directionalLight
            position={[-10, 10, 5]}
            intensity={1.2}
            color="#FFA500"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          
          {/* Stadium spotlights */}
          <spotLight
            position={[10, 15, 10]}
            angle={0.3}
            penumbra={0.5}
            intensity={0.8}
            castShadow
          />
          <spotLight
            position={[-10, 15, 10]}
            angle={0.3}
            penumbra={0.5}
            intensity={0.8}
            castShadow
          />
          
          {/* Evening Sky */}
          <Sky
            distance={450000}
            sunPosition={[-1, 0.2, 0]}
            inclination={0.6}
            azimuth={0.25}
          />
          
          {/* Physics World */}
          <Physics gravity={[0, -9.81, 0]}>
            {/* Ground plane */}
            <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} />
            
            {/* Stadium Environment */}
            <Stadium />
            
            {/* Batsman */}
            <Batsman position={[0, 0, 0]} />
            
            {/* Cricket Ball */}
            <CricketBall 
              position={[8, 1, 0]} 
              onHit={() => console.log('Ball hit!')} 
            />
          </Physics>
          
          {/* Camera Controller */}
          <CameraController />
          
          {/* Text Reveal */}
          <TextReveal />
          
          {/* Environment lighting */}
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
      
      {/* Animation Controls Overlay */}
      <div className="absolute top-4 left-4 text-white">
        <div className="bg-black/50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Cricket Animation Timeline</h3>
          <div className="text-sm space-y-1">
            <div>0-2s: Stadium Introduction</div>
            <div>2-4s: Batsman Focus</div>
            <div>4-6s: Ball Approach</div>
            <div>6-8s: Impact & Swing</div>
            <div>8-10s: Ball Flight</div>
            <div>10-12s: Text Reveal</div>
          </div>
        </div>
      </div>
    </div>
  )
}