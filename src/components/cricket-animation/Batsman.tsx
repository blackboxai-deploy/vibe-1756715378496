'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group, BoxGeometry, CapsuleGeometry, SphereGeometry, MeshStandardMaterial, Color } from 'three'
import { useSpring, animated } from '@react-spring/three'

interface BatsmanProps {
  position?: [number, number, number]
  animationPhase: 'ready' | 'swing' | 'follow-through' | 'celebrate'
  onSwingComplete?: () => void
}

export default function Batsman({ 
  position = [0, 0, 0], 
  animationPhase,
  onSwingComplete 
}: BatsmanProps) {
  const groupRef = useRef<Group>(null)
  const torsoRef = useRef<Mesh>(null)
  const headRef = useRef<Mesh>(null)
  const leftArmRef = useRef<Group>(null)
  const rightArmRef = useRef<Group>(null)
  const leftLegRef = useRef<Group>(null)
  const rightLegRef = useRef<Group>(null)
  const batRef = useRef<Group>(null)

  // Materials
  const materials = useMemo(() => ({
    uniform: new MeshStandardMaterial({ 
      color: new Color(0xffffff),
      roughness: 0.8,
      metalness: 0.1
    }),
    skin: new MeshStandardMaterial({ 
      color: new Color(0xfdbcb4),
      roughness: 0.9,
      metalness: 0.0
    }),
    helmet: new MeshStandardMaterial({ 
      color: new Color(0x2c3e50),
      roughness: 0.3,
      metalness: 0.7
    }),
    visor: new MeshStandardMaterial({ 
      color: new Color(0x3498db),
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      metalness: 0.9
    }),
    bat: new MeshStandardMaterial({ 
      color: new Color(0xdeb887),
      roughness: 0.6,
      metalness: 0.1
    }),
    grip: new MeshStandardMaterial({ 
      color: new Color(0x8b4513),
      roughness: 0.9,
      metalness: 0.0
    })
  }), [])

  // Geometries
  const geometries = useMemo(() => ({
    torso: new BoxGeometry(0.8, 1.2, 0.4),
    head: new SphereGeometry(0.25, 16, 16),
    upperArm: new CapsuleGeometry(0.12, 0.6, 8, 16),
    forearm: new CapsuleGeometry(0.1, 0.5, 8, 16),
    thigh: new CapsuleGeometry(0.15, 0.7, 8, 16),
    shin: new CapsuleGeometry(0.12, 0.6, 8, 16),
    helmet: new SphereGeometry(0.28, 16, 16),
    visor: new BoxGeometry(0.4, 0.15, 0.02),
    batBlade: new BoxGeometry(0.12, 1.2, 0.05),
    batHandle: new CapsuleGeometry(0.04, 0.4, 8, 16)
  }), [])

  // Animation springs based on phase
  const { torsoRotation, headRotation, armRotations, legRotations, batRotation } = useSpring({
    torsoRotation: animationPhase === 'ready' ? [0, 0.2, 0] : 
                   animationPhase === 'swing' ? [0, -0.3, 0] :
                   animationPhase === 'follow-through' ? [0, -0.5, 0] :
                   [0, 0.1, 0], // celebrate
    
    headRotation: animationPhase === 'ready' ? [0, 0.1, 0] :
                  animationPhase === 'swing' ? [0, -0.2, 0] :
                  animationPhase === 'follow-through' ? [0, -0.3, 0] :
                  [0, 0.2, 0], // celebrate
    
    armRotations: {
      leftShoulder: animationPhase === 'ready' ? [-0.3, 0.2, 0] :
                    animationPhase === 'swing' ? [-0.1, -0.5, 0] :
                    animationPhase === 'follow-through' ? [0.2, -0.8, 0] :
                    [0.3, 0.5, 0], // celebrate
      
      rightShoulder: animationPhase === 'ready' ? [-0.5, -0.3, 0] :
                     animationPhase === 'swing' ? [-0.3, 0.2, 0] :
                     animationPhase === 'follow-through' ? [0.1, 0.6, 0] :
                     [0.5, 0.3, 0], // celebrate
      
      leftElbow: animationPhase === 'ready' ? [-0.8, 0, 0] :
                 animationPhase === 'swing' ? [-1.2, 0, 0] :
                 animationPhase === 'follow-through' ? [-0.5, 0, 0] :
                 [-0.3, 0, 0], // celebrate
      
      rightElbow: animationPhase === 'ready' ? [-1.0, 0, 0] :
                  animationPhase === 'swing' ? [-1.4, 0, 0] :
                  animationPhase === 'follow-through' ? [-0.8, 0, 0] :
                  [-0.4, 0, 0] // celebrate
    },
    
    legRotations: {
      leftHip: animationPhase === 'ready' ? [0, 0.1, 0] :
               animationPhase === 'swing' ? [0, -0.2, 0] :
               animationPhase === 'follow-through' ? [0, -0.3, 0] :
               [0, 0.2, 0], // celebrate
      
      rightHip: animationPhase === 'ready' ? [0, -0.1, 0] :
                animationPhase === 'swing' ? [0, 0.3, 0] :
                animationPhase === 'follow-through' ? [0, 0.4, 0] :
                [0, 0.1, 0], // celebrate
      
      leftKnee: animationPhase === 'ready' ? [0.2, 0, 0] :
                animationPhase === 'swing' ? [0.3, 0, 0] :
                animationPhase === 'follow-through' ? [0.1, 0, 0] :
                [0.1, 0, 0], // celebrate
      
      rightKnee: animationPhase === 'ready' ? [0.1, 0, 0] :
                 animationPhase === 'swing' ? [0.4, 0, 0] :
                 animationPhase === 'follow-through' ? [0.2, 0, 0] :
                 [0.1, 0, 0] // celebrate
    },
    
    batRotation: animationPhase === 'ready' ? [0, 0, 0.3] :
                 animationPhase === 'swing' ? [-0.5, 0, -0.2] :
                 animationPhase === 'follow-through' ? [-1.2, 0, -0.8] :
                 [0.2, 0, 0.5], // celebrate
    
    config: { tension: 120, friction: 14 },
    onRest: () => {
      if (animationPhase === 'swing' && onSwingComplete) {
        onSwingComplete()
      }
    }
  })

  // Subtle breathing animation
  useFrame((state) => {
    if (torsoRef.current && animationPhase === 'ready') {
      torsoRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Torso */}
      <animated.mesh 
        ref={torsoRef}
        geometry={geometries.torso}
        material={materials.uniform}
        position={[0, 1.5, 0]}
        rotation={torsoRotation as any}
        castShadow
        receiveShadow
      />

      {/* Head */}
      <animated.group position={[0, 2.4, 0]} rotation={headRotation as any}>
        <mesh
          ref={headRef}
          geometry={geometries.head}
          material={materials.skin}
          castShadow
        />
        
        {/* Helmet */}
        <mesh
          geometry={geometries.helmet}
          material={materials.helmet}
          position={[0, 0.05, 0]}
          castShadow
        />
        
        {/* Blue Visor */}
        <mesh
          geometry={geometries.visor}
          material={materials.visor}
          position={[0, 0, 0.26]}
        />
      </animated.group>

      {/* Left Arm */}
      <animated.group 
        ref={leftArmRef}
        position={[-0.5, 2.1, 0]}
        rotation={armRotations.leftShoulder as any}
      >
        <mesh
          geometry={geometries.upperArm}
          material={materials.uniform}
          position={[0, -0.3, 0]}
          castShadow
        />
        
        <animated.group 
          position={[0, -0.6, 0]}
          rotation={armRotations.leftElbow as any}
        >
          <mesh
            geometry={geometries.forearm}
            material={materials.skin}
            position={[0, -0.25, 0]}
            castShadow
          />
        </animated.group>
      </animated.group>

      {/* Right Arm */}
      <animated.group 
        ref={rightArmRef}
        position={[0.5, 2.1, 0]}
        rotation={armRotations.rightShoulder as any}
      >
        <mesh
          geometry={geometries.upperArm}
          material={materials.uniform}
          position={[0, -0.3, 0]}
          castShadow
        />
        
        <animated.group 
          position={[0, -0.6, 0]}
          rotation={armRotations.rightElbow as any}
        >
          <mesh
            geometry={geometries.forearm}
            material={materials.skin}
            position={[0, -0.25, 0]}
            castShadow
          />
          
          {/* Cricket Bat attached to right hand */}
          <animated.group 
            ref={batRef}
            position={[0, -0.5, 0]}
            rotation={batRotation as any}
          >
            {/* Bat Blade */}
            <mesh
              geometry={geometries.batBlade}
              material={materials.bat}
              position={[0, -0.6, 0]}
              castShadow
            />
            
            {/* Bat Handle */}
            <mesh
              geometry={geometries.batHandle}
              material={materials.grip}
              position={[0, 0, 0]}
              castShadow
            />
          </animated.group>
        </animated.group>
      </animated.group>

      {/* Left Leg */}
      <animated.group 
        ref={leftLegRef}
        position={[-0.3, 0.9, 0]}
        rotation={legRotations.leftHip as any}
      >
        <mesh
          geometry={geometries.thigh}
          material={materials.uniform}
          position={[0, -0.35, 0]}
          castShadow
        />
        
        <animated.group 
          position={[0, -0.7, 0]}
          rotation={legRotations.leftKnee as any}
        >
          <mesh
            geometry={geometries.shin}
            material={materials.uniform}
            position={[0, -0.3, 0]}
            castShadow
          />
        </animated.group>
      </animated.group>

      {/* Right Leg */}
      <animated.group 
        ref={rightLegRef}
        position={[0.3, 0.9, 0]}
        rotation={legRotations.rightHip as any}
      >
        <mesh
          geometry={geometries.thigh}
          material={materials.uniform}
          position={[0, -0.35, 0]}
          castShadow
        />
        
        <animated.group 
          position={[0, -0.7, 0]}
          rotation={legRotations.rightKnee as any}
        >
          <mesh
            geometry={geometries.shin}
            material={materials.uniform}
            position={[0, -0.3, 0]}
            castShadow
          />
        </animated.group>
      </animated.group>
    </group>
  )
}