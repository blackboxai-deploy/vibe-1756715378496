import { Vector3 } from 'three'

export interface PhysicsConfig {
  gravity: Vector3
  ballMass: number
  batMass: number
  ballRadius: number
  ballRestitution: number
  ballFriction: number
  airResistance: number
  spinDecay: number
  collisionThreshold: number
}

export interface BallTrajectoryConfig {
  initialVelocity: Vector3
  spinVelocity: Vector3
  launchAngle: number
  launchHeight: number
  targetDistance: number
}

export interface BatSwingConfig {
  swingDuration: number
  swingAngle: number
  impactPoint: Vector3
  followThroughDuration: number
  maxSwingSpeed: number
}

export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
  gravity: new Vector3(0, -9.81, 0),
  ballMass: 0.163, // Standard cricket ball weight in kg
  batMass: 1.2, // Standard cricket bat weight in kg
  ballRadius: 0.036, // Cricket ball radius in meters
  ballRestitution: 0.7, // Bounce coefficient
  ballFriction: 0.3,
  airResistance: 0.02,
  spinDecay: 0.98,
  collisionThreshold: 0.1
}

export const BALL_TRAJECTORY_CONFIG: BallTrajectoryConfig = {
  initialVelocity: new Vector3(0, 2, -25), // Bowler delivery speed
  spinVelocity: new Vector3(0, 0, 15), // Spin on z-axis
  launchAngle: -5, // Slight downward angle
  launchHeight: 1.8, // Bowler release height
  targetDistance: 20 // Distance to batsman
}

export const BAT_SWING_CONFIG: BatSwingConfig = {
  swingDuration: 0.3, // Time for bat swing in seconds
  swingAngle: Math.PI / 3, // 60 degrees swing arc
  impactPoint: new Vector3(0.5, 1.2, 0), // Bat impact position
  followThroughDuration: 0.4,
  maxSwingSpeed: 35 // m/s at impact
}

export const STADIUM_DIMENSIONS = {
  pitchLength: 22, // Cricket pitch length in meters
  pitchWidth: 3.05, // Cricket pitch width in meters
  boundaryRadius: 65, // Stadium boundary radius
  stadiumHeight: 15,
  creaseLine: 1.22 // Distance from stumps to crease
}

export const LIGHTING_CONFIG = {
  sunPosition: new Vector3(50, 30, 20), // Evening sun position
  sunIntensity: 1.2,
  sunColor: 0xffa500, // Orange sunset color
  ambientIntensity: 0.3,
  ambientColor: 0x404080, // Blue ambient
  spotlightIntensity: 0.8,
  spotlightColor: 0xffffff,
  shadowMapSize: 2048,
  shadowCameraNear: 0.1,
  shadowCameraFar: 100
}

export const ANIMATION_TIMING = {
  totalDuration: 12, // Total animation duration in seconds
  phases: {
    stadiumIntro: { start: 0, end: 2 },
    batsmanFocus: { start: 2, end: 4 },
    ballApproach: { start: 4, end: 6 },
    impact: { start: 6, end: 8 },
    ballFlight: { start: 8, end: 10 },
    textReveal: { start: 10, end: 12 }
  }
}

export const CAMERA_POSITIONS = {
  wideShot: new Vector3(0, 8, 30),
  mediumShot: new Vector3(-3, 2, 8),
  closeUp: new Vector3(-1, 1.5, 3),
  overShoulder: new Vector3(-2, 1.8, 2),
  lowAngle: new Vector3(0, 0.5, 5),
  ballFollow: new Vector3(0, 3, 15),
  celebration: new Vector3(-5, 3, 10)
}

export const MATERIAL_PROPERTIES = {
  ball: {
    color: 0x8B0000, // Dark red leather
    roughness: 0.8,
    metalness: 0.1,
    normalScale: 0.5
  },
  bat: {
    wood: {
      color: 0xDEB887, // Burlywood
      roughness: 0.7,
      metalness: 0.0
    },
    grip: {
      color: 0x654321, // Dark brown
      roughness: 0.9,
      metalness: 0.0
    }
  },
  uniform: {
    color: 0xFFFFFF, // White
    roughness: 0.6,
    metalness: 0.0
  },
  helmet: {
    color: 0xFFFFFF,
    roughness: 0.3,
    metalness: 0.1,
    visorColor: 0x0066CC // Blue visor
  },
  pitch: {
    color: 0x228B22, // Forest green
    roughness: 0.8,
    metalness: 0.0
  }
}

export function calculateBallTrajectory(
  initialPos: Vector3,
  initialVel: Vector3,
  time: number,
  config: PhysicsConfig
): Vector3 {
  const position = new Vector3()
  const gravity = config.gravity
  const airRes = config.airResistance

  // Apply gravity and air resistance
  position.x = initialPos.x + initialVel.x * time * (1 - airRes * time)
  position.y = initialPos.y + initialVel.y * time + 0.5 * gravity.y * time * time
  position.z = initialPos.z + initialVel.z * time * (1 - airRes * time)

  return position
}

export function calculateBatSwingPosition(
  time: number,
  config: BatSwingConfig
): { position: Vector3; rotation: Vector3 } {
  const progress = Math.min(time / config.swingDuration, 1)
  const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease-out cubic

  const swingAngle = config.swingAngle * easeProgress
  const position = new Vector3(
    Math.sin(swingAngle) * 0.5,
    config.impactPoint.y - Math.cos(swingAngle) * 0.2,
    config.impactPoint.z
  )

  const rotation = new Vector3(0, 0, -swingAngle)

  return { position, rotation }
}

export function detectBallBatCollision(
  ballPos: Vector3,
  batPos: Vector3,
  config: PhysicsConfig
): boolean {
  const distance = ballPos.distanceTo(batPos)
  return distance <= (config.ballRadius + config.collisionThreshold)
}

export function calculatePostImpactVelocity(
  ballVel: Vector3,
  batVel: Vector3,
  config: PhysicsConfig
): Vector3 {
  const restitution = config.ballRestitution
  const massRatio = config.ballMass / (config.ballMass + config.batMass)

  // Simplified collision response
  const relativeVel = new Vector3().subVectors(ballVel, batVel)
  const impulse = relativeVel.multiplyScalar(-(1 + restitution) * massRatio)

  return new Vector3().addVectors(ballVel, impulse)
}