'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface CricketBatProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  isSwinging?: boolean
  swingProgress?: number
  onSwingComplete?: () => void
}

export default function CricketBat({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  isSwinging = false,
  swingProgress = 0,
  onSwingComplete
}: CricketBatProps) {
  const batRef = useRef<THREE.Group>(null)
  const bladeRef = useRef<THREE.Mesh>(null)
  const handleRef = useRef<THREE.Mesh>(null)
  
  // Create bat geometry
  const batGeometry = useMemo(() => {
    // Bat blade - traditional cricket bat shape
    const bladeShape = new THREE.Shape()
    bladeShape.moveTo(0, 0)
    bladeShape.lineTo(0.05, 0)
    bladeShape.lineTo(0.055, 0.1)
    bladeShape.lineTo(0.055, 0.7)
    bladeShape.lineTo(0.05, 0.8)
    bladeShape.lineTo(0.04, 0.85)
    bladeShape.lineTo(0.025, 0.88)
    bladeShape.lineTo(0, 0.9)
    bladeShape.lineTo(-0.025, 0.88)
    bladeShape.lineTo(-0.04, 0.85)
    bladeShape.lineTo(-0.05, 0.8)
    bladeShape.lineTo(-0.055, 0.7)
    bladeShape.lineTo(-0.055, 0.1)
    bladeShape.lineTo(-0.05, 0)
    bladeShape.lineTo(0, 0)
    
    const extrudeSettings = {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.002,
      bevelThickness: 0.002
    }
    
    return new THREE.ExtrudeGeometry(bladeShape, extrudeSettings)
  }, [])

  // Handle geometry
  const handleGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.015, 0.018, 0.3, 8)
  }, [])

  // Materials
  const bladeMaterial = useMemo(() => {
    // Create wood texture procedurally
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Base wood color
    ctx.fillStyle = '#F5DEB3'
    ctx.fillRect(0, 0, 512, 512)
    
    // Wood grain lines
    ctx.strokeStyle = '#D2B48C'
    ctx.lineWidth = 1
    for (let i = 0; i < 50; i++) {
      ctx.beginPath()
      ctx.moveTo(0, Math.random() * 512)
      ctx.lineTo(512, Math.random() * 512)
      ctx.stroke()
    }
    
    // Darker grain
    ctx.strokeStyle = '#CD853F'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 30; i++) {
      ctx.beginPath()
      ctx.moveTo(0, Math.random() * 512)
      ctx.lineTo(512, Math.random() * 512)
      ctx.stroke()
    }
    
    // Add some scratches
    ctx.strokeStyle = '#A0522D'
    ctx.lineWidth = 0.3
    for (let i = 0; i < 20; i++) {
      const x1 = Math.random() * 512
      const y1 = Math.random() * 512
      const x2 = x1 + (Math.random() - 0.5) * 100
      const y2 = y1 + (Math.random() - 0.5) * 20
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 3)
    
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.1,
      normalScale: new THREE.Vector2(0.5, 0.5)
    })
  }, [])

  const handleMaterial = useMemo(() => {
    // Create leather grip texture
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    // Base leather color
    ctx.fillStyle = '#8B4513'
    ctx.fillRect(0, 0, 256, 256)
    
    // Leather texture pattern
    ctx.fillStyle = '#654321'
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 256
      const size = Math.random() * 3 + 1
      ctx.fillRect(x, y, size, size)
    }
    
    // Grip lines
    ctx.strokeStyle = '#2F1B14'
    ctx.lineWidth = 2
    for (let i = 0; i < 20; i++) {
      const y = (i / 20) * 256
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(256, y)
      ctx.stroke()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.0,
      bumpMap: texture,
      bumpScale: 0.02
    })
  }, [])

  // Animation logic
  useFrame((state, delta) => {
    if (!batRef.current) return

    if (isSwinging) {
      // Bat swing animation
      const swingAngle = Math.sin(swingProgress * Math.PI) * 0.8
      batRef.current.rotation.z = swingAngle
      
      // Add slight upward movement during swing
      const liftAmount = Math.sin(swingProgress * Math.PI) * 0.1
      batRef.current.position.y = position[1] + liftAmount
      
      // Rotate bat slightly during swing for realism
      batRef.current.rotation.x = Math.sin(swingProgress * Math.PI * 2) * 0.1
      
      // Check if swing is complete
      if (swingProgress >= 1 && onSwingComplete) {
        onSwingComplete()
      }
    } else {
      // Idle position with subtle movement
      const time = state.clock.elapsedTime
      batRef.current.rotation.z = Math.sin(time * 0.5) * 0.02
      batRef.current.position.y = position[1] + Math.sin(time * 0.3) * 0.005
    }
  })

  return (
    <group 
      ref={batRef}
      position={position}
      rotation={rotation}
    >
      {/* Bat Blade */}
      <mesh
        ref={bladeRef}
        geometry={batGeometry}
        material={bladeMaterial}
        position={[0, 0.45, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      />
      
      {/* Bat Handle */}
      <mesh
        ref={handleRef}
        geometry={handleGeometry}
        material={handleMaterial}
        position={[0, 0.15, 0]}
        castShadow
        receiveShadow
      />
      
      {/* Handle Cap */}
      <mesh
        geometry={new THREE.CylinderGeometry(0.018, 0.018, 0.02, 8)}
        material={handleMaterial}
        position={[0, 0.31, 0]}
        castShadow
      />
      
      {/* Rubber Grip Bands */}
      {[0.05, 0.1, 0.15, 0.2, 0.25].map((y, index) => (
        <mesh
          key={index}
          geometry={new THREE.TorusGeometry(0.019, 0.002, 4, 8)}
          material={new THREE.MeshStandardMaterial({ 
            color: '#000000',
            roughness: 1.0,
            metalness: 0.0
          })}
          position={[0, y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      ))}
      
      {/* Sweet Spot Marking */}
      <mesh
        geometry={new THREE.PlaneGeometry(0.08, 0.02)}
        material={new THREE.MeshStandardMaterial({
          color: '#FF0000',
          transparent: true,
          opacity: 0.3
        })}
        position={[0, 0.6, 0.021]}
      />
    </group>
  )
}