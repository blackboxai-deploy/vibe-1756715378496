'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Text, Html } from '@react-three/drei'
import { Physics, useBox, useSphere, usePlane } from '@react-three/cannon'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RotateCcw, Download } from 'lucide-react'

// Cricket Ball Component
function CricketBall({ position = [0, 2, -10], onHit }: { position?: [number, number, number], onHit?: () => void }) {
  const [ref, api] = useSphere(() => ({
    mass: 0.16,
    position,
    material: { friction: 0.3, restitution: 0.8 }
  }))

  const ballRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (ballRef.current) {
      ballRef.current.rotation.z += 0.3
      ballRef.current.rotation.x += 0.1
    }
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      api.velocity.set(8, 2, 15)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [api])

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[0.037]} />
      <meshStandardMaterial 
        color="#8B0000" 
        roughness={0.8}
        metalness={0.1}
      />
      <mesh ref={ballRef}>
        <torusGeometry args={[0.037, 0.002, 8, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </mesh>
  )
}

// Cricket Bat Component
function CricketBat({ position = [0, 1, 0] }: { position?: [number, number, number] }) {
  const [ref] = useBox(() => ({
    mass: 1.2,
    position,
    args: [0.1, 1.1, 0.05]
  }))

  const batRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (batRef.current && state.clock.elapsedTime > 4 && state.clock.elapsedTime < 6) {
      const swingProgress = (state.clock.elapsedTime - 4) / 2
      batRef.current.rotation.z = Math.sin(swingProgress * Math.PI) * 0.8
    }
  })

  return (
    <group ref={batRef} position={position}>
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1.1, 0.05]} />
        <meshStandardMaterial 
          color="#DEB887"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Bat Handle */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
    </group>
  )
}

// Batsman Component
function Batsman({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const batsmanRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (batsmanRef.current && state.clock.elapsedTime > 4 && state.clock.elapsedTime < 8) {
      const swingProgress = (state.clock.elapsedTime - 4) / 4
      batsmanRef.current.rotation.y = Math.sin(swingProgress * Math.PI) * 0.2
    }
  })

  return (
    <group ref={batsmanRef} position={position}>
      {/* Body */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Head with Helmet */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#FFE4C4" />
      </mesh>
      
      {/* Helmet */}
      <mesh position={[0, 2.25, 0]} castShadow>
        <sphereGeometry args={[0.18]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Blue Visor */}
      <mesh position={[0, 2.2, 0.15]} castShadow>
        <boxGeometry args={[0.3, 0.1, 0.02]} />
        <meshStandardMaterial color="#0066CC" transparent opacity={0.7} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.35, 1.3, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.6]} />
        <meshStandardMaterial color="#FFE4C4" />
      </mesh>
      <mesh position={[0.35, 1.3, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.6]} />
        <meshStandardMaterial color="#FFE4C4" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.15, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.15, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Cricket Bat */}
      <CricketBat position={[0.4, 1.2, 0]} />
    </group>
  )
}

// Stadium Environment
function Stadium() {
  const [groundRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0]
  }))

  return (
    <group>
      {/* Cricket Pitch */}
      <mesh ref={groundRef} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      
      {/* Stadium Stands */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 25,
            5,
            Math.sin((i / 8) * Math.PI * 2) * 25
          ]}
          castShadow
        >
          <boxGeometry args={[8, 10, 3]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      ))}
      
      {/* Crowd Silhouettes */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 40,
            Math.random() * 3 + 8,
            (Math.random() - 0.5) * 40
          ]}
          castShadow
        >
          <capsuleGeometry args={[0.2, 0.5]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  )
}

// Dynamic Camera Controller
function CameraController({ animationPhase }: { animationPhase: number }) {
  const { camera } = useThree()
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Phase 1: Stadium Introduction (0-2s)
    if (time < 2) {
      camera.position.lerp(new THREE.Vector3(0, 15, 30), 0.02)
      camera.lookAt(0, 0, 0)
    }
    // Phase 2: Batsman Focus (2-4s)
    else if (time < 4) {
      camera.position.lerp(new THREE.Vector3(3, 3, 8), 0.02)
      camera.lookAt(0, 1.5, 0)
    }
    // Phase 3: Ball Approach (4-6s)
    else if (time < 6) {
      camera.position.lerp(new THREE.Vector3(-2, 2, 5), 0.02)
      camera.lookAt(0, 2, -5)
    }
    // Phase 4: The Hit (6-8s)
    else if (time < 8) {
      // Camera shake effect
      const shake = Math.sin(time * 50) * 0.1
      camera.position.lerp(new THREE.Vector3(1 + shake, 1.5 + shake, 3), 0.02)
      camera.lookAt(0, 1.5, 0)
    }
    // Phase 5: Ball Flight (8-10s)
    else if (time < 10) {
      camera.position.lerp(new THREE.Vector3(0, 8, 15), 0.02)
      camera.lookAt(0, 5, 0)
    }
    // Phase 6: Text Reveal (10-12s)
    else {
      camera.position.lerp(new THREE.Vector3(0, 5, 20), 0.02)
      camera.lookAt(0, 0, 0)
    }
  })
  
  return null
}

// Text Reveal Component
function TextReveal() {
  const [visible, setVisible] = useState(false)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    setVisible(time > 10)
  })
  
  if (!visible) return null
  
  return (
    <group position={[0, 3, 0]}>
      <Text
        fontSize={2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        TANISH
      </Text>
      <Text
        position={[0, -1, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-regular.woff"
      >
        CREATES
      </Text>
    </group>
  )
}

// Main Cricket Scene
function CricketScene() {
  const [animationPhase, setAnimationPhase] = useState(0)
  
  return (
    <Physics gravity={[0, -9.81, 0]}>
      <CameraController animationPhase={animationPhase} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[-10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        color="#FFA500"
      />
      <spotLight
        position={[10, 20, 10]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
        color="#FFFFFF"
      />
      
      {/* Environment */}
      <Stadium />
      <Batsman position={[0, 0, 0]} />
      <CricketBall position={[0, 2, -15]} />
      <TextReveal />
      
      {/* Sky Environment */}
      <Environment preset="sunset" />
    </Physics>
  )
}

// Loading Component
function LoadingFallback() {
  return (
    <Html center>
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading Cricket Animation...</p>
      </div>
    </Html>
  )
}

// Main Animation Page
export default function AnimationPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  
  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }
  
  const handleReset = () => {
    window.location.reload()
  }
  
  const handleDownload = () => {
    // Trigger video generation
    alert('Video generation feature coming soon!')
  }
  
  return (
    <div className="min-h-screen bg-black relative">
      {/* Animation Canvas */}
      <div className="w-full h-screen">
        <Canvas
          shadows
          camera={{ position: [0, 15, 30], fov: 60 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <CricketScene />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute top-6 left-6 right-6 z-10">
          <div className="flex justify-between items-start">
            {/* Title */}
            <Card className="bg-black/50 border-white/20 text-white backdrop-blur-sm">
              <div className="p-4">
                <h1 className="text-2xl font-bold mb-2">Cricket Intro Animation</h1>
                <Badge className="bg-orange-600">3D Cinematic Experience</Badge>
              </div>
            </Card>
            
            {/* Controls */}
            <Card className="bg-black/50 border-white/20 backdrop-blur-sm">
              <div className="p-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={handlePlay}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {/* Timeline Indicator */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <Card className="bg-black/50 border-white/20 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex justify-between text-sm text-white mb-2">
              <span>Animation Timeline</span>
              <span>12 seconds</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '0%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-300 mt-2">
              <span>Stadium</span>
              <span>Batsman</span>
              <span>Ball</span>
              <span>Impact</span>
              <span>Flight</span>
              <span>Text</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Hide Controls Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-6 right-6 z-20 bg-black/50 text-white p-2 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/10"
      >
        {showControls ? 'Hide UI' : 'Show UI'}
      </button>
    </div>
  )
}