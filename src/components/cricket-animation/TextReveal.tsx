'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { gsap } from 'gsap'
import * as THREE from 'three'

interface TextRevealProps {
  isVisible: boolean
  onComplete?: () => void
}

export default function TextReveal({ isVisible, onComplete }: TextRevealProps) {
  const tanishRef = useRef<THREE.Group>(null)
  const createsRef = useRef<THREE.Group>(null)
  const overlayRef = useRef<THREE.Mesh>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!tanishRef.current || !createsRef.current || !overlayRef.current) return

    // Initialize positions - hidden state
    tanishRef.current.scale.set(0, 0, 0)
    tanishRef.current.position.set(0, 0, -10)
    createsRef.current.scale.set(0, 0, 0)
    createsRef.current.position.set(0, -1.5, -10)
    overlayRef.current.material.opacity = 0

    if (isVisible && !timelineRef.current) {
      // Create animation timeline
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete()
        }
      })

      // Phase 1: Fade in overlay (0.5s)
      tl.to(overlayRef.current.material, {
        opacity: 0.7,
        duration: 0.5,
        ease: "power2.out"
      })

      // Phase 2: TANISH text reveal (1s)
      tl.to(tanishRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.2")
      
      tl.to(tanishRef.current.position, {
        z: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.6")

      // Phase 3: CREATES text reveal (0.8s)
      tl.to(createsRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.6,
        ease: "back.out(1.4)"
      }, "-=0.3")
      
      tl.to(createsRef.current.position, {
        z: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.5")

      // Phase 4: Hold for 2 seconds
      tl.to({}, { duration: 2 })

      // Phase 5: Fade out (0.8s)
      tl.to([tanishRef.current.scale, createsRef.current.scale], {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.6,
        ease: "power2.in"
      })
      
      tl.to(overlayRef.current.material, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.in"
      }, "-=0.4")

      timelineRef.current = tl
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }
    }
  }, [isVisible, onComplete])

  // Subtle floating animation for text
  useFrame((state) => {
    if (tanishRef.current && createsRef.current && isVisible) {
      const time = state.clock.elapsedTime
      tanishRef.current.rotation.z = Math.sin(time * 0.5) * 0.01
      createsRef.current.rotation.z = Math.sin(time * 0.3) * 0.008
    }
  })

  return (
    <group>
      {/* Semi-transparent dark overlay */}
      <mesh ref={overlayRef} position={[0, 0, -5]}>
        <planeGeometry args={[50, 30]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0}
        />
      </mesh>

      {/* TANISH text */}
      <group ref={tanishRef}>
        <Text
          position={[0, 1, 0]}
          fontSize={2.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
          letterSpacing={0.1}
          outlineWidth={0.02}
          outlineColor="#ff6b35"
        >
          TANISH
          <meshStandardMaterial 
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </Text>
      </group>

      {/* CREATES text */}
      <group ref={createsRef}>
        <Text
          position={[0, -1.5, 0]}
          fontSize={1.2}
          color="#e0e0e0"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.woff"
          letterSpacing={0.15}
          outlineWidth={0.01}
          outlineColor="#8b5cf6"
        >
          CREATES
          <meshStandardMaterial 
            emissive="#e0e0e0"
            emissiveIntensity={0.2}
          />
        </Text>
      </group>

      {/* Subtle glow effect */}
      <pointLight
        position={[0, 0, 2]}
        intensity={0.5}
        color="#ffffff"
        distance={10}
        decay={2}
      />
    </group>
  )
}