'use client'

import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useBox } from '@react-three/cannon'
import * as THREE from 'three'

interface CricketBallProps {
  position: [number, number, number]
  velocity: [number, number, number]
  onHit?: () => void
  isMoving: boolean
}

export default function CricketBall({ position, velocity, onHit, isMoving }: CricketBallProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [ref, api] = useBox(() => ({
    mass: 0.16, // Cricket ball weight in kg
    position,
    args: [0.073, 0.073, 0.073], // Cricket ball radius
    material: {
      friction: 0.4,
      restitution: 0.7,
    },
  }))

  // Ball spinning animation
  useFrame((state, delta) => {
    if (meshRef.current && isMoving) {
      // Spin on z-axis for realistic cricket ball rotation
      meshRef.current.rotation.z += delta * 15
      meshRef.current.rotation.x += delta * 8
    }
  })

  // Apply initial velocity when ball starts moving
  useEffect(() => {
    if (isMoving) {
      api.velocity.set(...velocity)
      api.angularVelocity.set(0, 0, 15) // Spinning motion
    }
  }, [isMoving, velocity, api])

  // Handle collision detection
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((vel) => {
      // Detect significant velocity change (collision)
      if (Math.abs(vel[0]) > 20 || Math.abs(vel[1]) > 20) {
        onHit?.()
      }
    })
    return unsubscribe
  }, [api, onHit])

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[0.0365, 32, 32]} />
      <meshStandardMaterial
        color="#8B0000"
        roughness={0.8}
        metalness={0.1}
        normalScale={new THREE.Vector2(0.5, 0.5)}
      />
      
      {/* White stitching lines */}
      <group>
        {/* Primary seam */}
        <mesh position={[0, 0, 0.037]}>
          <torusGeometry args={[0.035, 0.001, 8, 32]} />
          <meshStandardMaterial color="white" />
        </mesh>
        
        {/* Secondary seam */}
        <mesh position={[0, 0, -0.037]} rotation={[Math.PI, 0, 0]}>
          <torusGeometry args={[0.035, 0.001, 8, 32]} />
          <meshStandardMaterial color="white" />
        </mesh>
        
        {/* Stitching details */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 3) * 0.035,
              Math.sin((i * Math.PI) / 3) * 0.035,
              0
            ]}
            rotation={[0, 0, (i * Math.PI) / 3]}
          >
            <cylinderGeometry args={[0.0005, 0.0005, 0.074]} />
            <meshStandardMaterial color="white" />
          </mesh>
        ))}
      </group>
      
      {/* Motion blur effect when moving fast */}
      {isMoving && (
        <mesh>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial
            color="#8B0000"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </mesh>
  )
}