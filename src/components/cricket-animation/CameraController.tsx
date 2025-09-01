'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface CameraControllerProps {
  phase: number
  ballPosition: THREE.Vector3
  batsmanPosition: THREE.Vector3
  onPhaseComplete?: (phase: number) => void
}

export default function CameraController({ 
  phase, 
  ballPosition, 
  batsmanPosition, 
  onPhaseComplete 
}: CameraControllerProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const { scene, gl } = useThree()
  const shakeIntensity = useRef(0)
  const shakeDecay = useRef(0.95)
  const currentPhase = useRef(0)
  const phaseStartTime = useRef(0)

  // Camera positions for different phases
  const cameraPositions = {
    // Phase 1: Stadium Introduction (0-2s)
    phase1: {
      position: new THREE.Vector3(0, 15, 50),
      target: new THREE.Vector3(0, 0, 0),
      fov: 60
    },
    // Phase 2: Batsman Focus (2-4s)
    phase2: {
      position: new THREE.Vector3(-5, 3, 8),
      target: batsmanPosition,
      fov: 45
    },
    // Phase 3: Ball Approach (4-6s)
    phase3: {
      position: new THREE.Vector3(ballPosition.x - 2, ballPosition.y + 1, ballPosition.z + 3),
      target: ballPosition,
      fov: 35
    },
    // Phase 4: The Hit (6-8s) - Over-the-shoulder shot
    phase4: {
      position: new THREE.Vector3(batsmanPosition.x - 1, batsmanPosition.y + 2, batsmanPosition.z + 2),
      target: new THREE.Vector3(batsmanPosition.x + 1, batsmanPosition.y, batsmanPosition.z),
      fov: 40
    },
    // Phase 5: Ball Flight & Celebration (8-10s)
    phase5: {
      position: new THREE.Vector3(0, 8, 15),
      target: ballPosition,
      fov: 50
    },
    // Phase 6: Text Reveal (10-12s)
    phase6: {
      position: new THREE.Vector3(0, 5, 20),
      target: new THREE.Vector3(0, 3, 0),
      fov: 45
    }
  }

  // Initialize camera shake effect
  const triggerCameraShake = (intensity: number = 0.5, duration: number = 0.3) => {
    shakeIntensity.current = intensity
    gsap.to(shakeIntensity, {
      current: 0,
      duration: duration,
      ease: "power2.out"
    })
  }

  // Smooth camera transition between phases
  const transitionToPhase = (newPhase: number) => {
    if (!cameraRef.current || newPhase === currentPhase.current) return

    const targetConfig = cameraPositions[`phase${newPhase}` as keyof typeof cameraPositions]
    if (!targetConfig) return

    currentPhase.current = newPhase
    phaseStartTime.current = Date.now()

    // Animate camera position
    gsap.to(cameraRef.current.position, {
      x: targetConfig.position.x,
      y: targetConfig.position.y,
      z: targetConfig.position.z,
      duration: 1.5,
      ease: "power2.inOut"
    })

    // Animate camera FOV
    gsap.to(cameraRef.current, {
      fov: targetConfig.fov,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (cameraRef.current) {
          cameraRef.current.updateProjectionMatrix()
        }
      }
    })

    // Trigger phase completion callback after transition
    setTimeout(() => {
      onPhaseComplete?.(newPhase)
    }, 1500)
  }

  // Handle phase changes
  useEffect(() => {
    if (phase !== currentPhase.current) {
      transitionToPhase(phase)
    }
  }, [phase])

  // Special effects for specific phases
  useEffect(() => {
    switch (phase) {
      case 4: // Ball impact - trigger camera shake
        setTimeout(() => {
          triggerCameraShake(0.8, 0.5)
        }, 1000) // Delay for impact timing
        break
      case 5: // Ball flight - follow ball
        // Dynamic camera following will be handled in useFrame
        break
    }
  }, [phase])

  // Frame-by-frame camera updates
  useFrame((state, delta) => {
    if (!cameraRef.current) return

    const camera = cameraRef.current
    const time = state.clock.elapsedTime

    // Apply camera shake effect
    if (shakeIntensity.current > 0) {
      const shakeX = (Math.random() - 0.5) * shakeIntensity.current
      const shakeY = (Math.random() - 0.5) * shakeIntensity.current
      const shakeZ = (Math.random() - 0.5) * shakeIntensity.current * 0.5

      camera.position.x += shakeX
      camera.position.y += shakeY
      camera.position.z += shakeZ

      shakeIntensity.current *= shakeDecay.current
    }

    // Phase-specific camera behaviors
    switch (currentPhase.current) {
      case 1: // Stadium introduction - slow zoom
        const targetPos1 = cameraPositions.phase1.target
        camera.lookAt(targetPos1.x, targetPos1.y, targetPos1.z)
        break

      case 2: // Batsman focus - slight orbit
        const orbitRadius = 0.5
        const orbitSpeed = 0.3
        const orbitX = Math.sin(time * orbitSpeed) * orbitRadius
        const orbitZ = Math.cos(time * orbitSpeed) * orbitRadius
        
        camera.position.x += orbitX * delta
        camera.position.z += orbitZ * delta
        camera.lookAt(batsmanPosition.x, batsmanPosition.y + 1, batsmanPosition.z)
        break

      case 3: // Ball approach - follow ball
        const ballTarget = ballPosition.clone()
        ballTarget.y += 0.5 // Look slightly above ball
        camera.lookAt(ballTarget.x, ballTarget.y, ballTarget.z)
        
        // Dynamically adjust camera position to follow ball
        const followDistance = 3
        const followHeight = 1
        const ballDirection = ballPosition.clone().sub(batsmanPosition).normalize()
        const cameraFollowPos = ballPosition.clone().sub(ballDirection.multiplyScalar(followDistance))
        cameraFollowPos.y += followHeight
        
        camera.position.lerp(cameraFollowPos, delta * 2)
        break

      case 4: // The hit - dramatic angles
        const impactTarget = new THREE.Vector3(
          batsmanPosition.x + 1,
          batsmanPosition.y,
          batsmanPosition.z
        )
        camera.lookAt(impactTarget.x, impactTarget.y, impactTarget.z)
        break

      case 5: // Ball flight - wide shot following ball
        const flightTarget = ballPosition.clone()
        camera.lookAt(flightTarget.x, flightTarget.y, flightTarget.z)
        
        // Smooth camera movement to keep ball in frame
        const idealCameraPos = new THREE.Vector3(
          ballPosition.x * 0.3,
          Math.max(5, ballPosition.y + 3),
          15 + ballPosition.z * 0.2
        )
        camera.position.lerp(idealCameraPos, delta * 1.5)
        break

      case 6: // Text reveal - stable shot
        const textTarget = cameraPositions.phase6.target
        camera.lookAt(textTarget.x, textTarget.y, textTarget.z)
        break
    }

    // Subtle camera breathing effect for cinematic feel
    const breathingIntensity = 0.02
    const breathingSpeed = 0.5
    const breathing = Math.sin(time * breathingSpeed) * breathingIntensity
    camera.position.y += breathing * delta

    // Ensure camera constraints
    camera.position.y = Math.max(0.5, camera.position.y) // Don't go below ground
    camera.position.z = Math.max(-30, Math.min(50, camera.position.z)) // Reasonable bounds

    // Update camera matrix
    camera.updateMatrixWorld()
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={60}
      aspect={window.innerWidth / window.innerHeight}
      near={0.1}
      far={1000}
      position={[0, 15, 50]}
    />
  )
}