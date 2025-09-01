import * as THREE from 'three'

// Material configurations for cricket elements
export const createBatsmanMaterials = () => {
  const uniformMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0.1,
    normalMap: createClothNormalMap(),
  })

  const helmetMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.3,
    metalness: 0.7,
  })

  const visorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0066cc,
    transparent: true,
    opacity: 0.7,
    roughness: 0.1,
    metalness: 0.9,
    transmission: 0.3,
  })

  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xfdbcb4,
    roughness: 0.9,
    metalness: 0.0,
  })

  return { uniformMaterial, helmetMaterial, visorMaterial, skinMaterial }
}

export const createBatMaterials = () => {
  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0xdeb887,
    roughness: 0.7,
    metalness: 0.0,
    normalMap: createWoodNormalMap(),
    bumpMap: createWoodBumpMap(),
    bumpScale: 0.02,
  })

  const gripMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a2c17,
    roughness: 0.9,
    metalness: 0.0,
    normalMap: createLeatherNormalMap(),
  })

  return { woodMaterial, gripMaterial }
}

export const createBallMaterial = () => {
  const ballMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b0000,
    roughness: 0.8,
    metalness: 0.1,
    normalMap: createLeatherNormalMap(),
  })

  return ballMaterial
}

export const createStadiumMaterials = () => {
  const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x228b22,
    roughness: 0.9,
    metalness: 0.0,
    normalMap: createGrassNormalMap(),
  })

  const pitchMaterial = new THREE.MeshStandardMaterial({
    color: 0x8fbc8f,
    roughness: 0.8,
    metalness: 0.0,
  })

  const standMaterial = new THREE.MeshStandardMaterial({
    color: 0x696969,
    roughness: 0.6,
    metalness: 0.2,
  })

  return { grassMaterial, pitchMaterial, standMaterial }
}

// Procedural texture generation
export const createClothNormalMap = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  
  ctx.fillStyle = '#8080ff'
  ctx.fillRect(0, 0, 512, 512)
  
  // Add cloth weave pattern
  for (let i = 0; i < 512; i += 4) {
    for (let j = 0; j < 512; j += 4) {
      const intensity = Math.random() * 20 + 120
      ctx.fillStyle = `rgb(${intensity}, ${intensity}, 255)`
      ctx.fillRect(i, j, 2, 2)
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  return texture
}

export const createWoodNormalMap = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  
  ctx.fillStyle = '#8080ff'
  ctx.fillRect(0, 0, 512, 512)
  
  // Wood grain pattern
  for (let i = 0; i < 512; i++) {
    const grain = Math.sin(i * 0.1) * 20 + 128
    ctx.fillStyle = `rgb(${grain}, ${grain}, 255)`
    ctx.fillRect(0, i, 512, 1)
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return texture
}

export const createWoodBumpMap = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 512, 512)
  
  // Wood scratches and imperfections
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const length = Math.random() * 100 + 20
    const angle = Math.random() * Math.PI * 2
    
    ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`
    ctx.lineWidth = Math.random() * 2 + 1
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
    ctx.stroke()
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

export const createLeatherNormalMap = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  
  ctx.fillStyle = '#8080ff'
  ctx.fillRect(0, 0, 512, 512)
  
  // Leather texture pattern
  for (let i = 0; i < 512; i += 8) {
    for (let j = 0; j < 512; j += 8) {
      const intensity = Math.random() * 40 + 100
      ctx.fillStyle = `rgb(${intensity}, ${intensity}, 255)`
      ctx.fillRect(i + Math.random() * 2, j + Math.random() * 2, 4, 4)
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

export const createGrassNormalMap = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  
  ctx.fillStyle = '#8080ff'
  ctx.fillRect(0, 0, 512, 512)
  
  // Grass blade pattern
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const intensity = Math.random() * 30 + 110
    
    ctx.fillStyle = `rgb(${intensity}, ${intensity}, 255)`
    ctx.fillRect(x, y, 1, Math.random() * 3 + 1)
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(8, 8)
  return texture
}

// Lighting setup utilities
export const createStadiumLighting = (scene: THREE.Scene) => {
  // Main directional light (sunset)
  const sunLight = new THREE.DirectionalLight(0xffa500, 1.2)
  sunLight.position.set(-50, 30, 20)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.width = 2048
  sunLight.shadow.mapSize.height = 2048
  sunLight.shadow.camera.near = 0.5
  sunLight.shadow.camera.far = 100
  sunLight.shadow.camera.left = -50
  sunLight.shadow.camera.right = 50
  sunLight.shadow.camera.top = 50
  sunLight.shadow.camera.bottom = -50
  scene.add(sunLight)

  // Stadium spotlights
  const spotLight1 = new THREE.SpotLight(0xffffff, 0.8, 100, Math.PI / 6, 0.3)
  spotLight1.position.set(-30, 25, 30)
  spotLight1.target.position.set(0, 0, 0)
  spotLight1.castShadow = true
  scene.add(spotLight1)
  scene.add(spotLight1.target)

  const spotLight2 = new THREE.SpotLight(0xffffff, 0.8, 100, Math.PI / 6, 0.3)
  spotLight2.position.set(30, 25, 30)
  spotLight2.target.position.set(0, 0, 0)
  spotLight2.castShadow = true
  scene.add(spotLight2)
  scene.add(spotLight2.target)

  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
  scene.add(ambientLight)

  // Hemisphere light for sky illumination
  const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x228b22, 0.4)
  scene.add(hemiLight)

  return { sunLight, spotLight1, spotLight2, ambientLight, hemiLight }
}

// Camera animation utilities
export const createCameraPositions = () => {
  return {
    wideShot: new THREE.Vector3(0, 15, 50),
    mediumShot: new THREE.Vector3(5, 8, 25),
    closeUp: new THREE.Vector3(2, 6, 12),
    overShoulder: new THREE.Vector3(-3, 7, 8),
    lowAngle: new THREE.Vector3(0, 2, 15),
    ballPerspective: new THREE.Vector3(0, 5, -20),
    celebration: new THREE.Vector3(-10, 12, 20),
    textReveal: new THREE.Vector3(0, 20, 30)
  }
}

// Physics utilities
export const calculateBallTrajectory = (
  startPos: THREE.Vector3,
  targetPos: THREE.Vector3,
  gravity: number = -9.81,
  initialVelocity: number = 25
) => {
  const distance = startPos.distanceTo(targetPos)
  const angle = Math.atan2(targetPos.y - startPos.y, distance)
  
  const velocityX = initialVelocity * Math.cos(angle)
  const velocityY = initialVelocity * Math.sin(angle)
  
  return { velocityX, velocityY, angle }
}

// Animation easing functions
export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export const easeOutBounce = (t: number): number => {
  const n1 = 7.5625
  const d1 = 2.75
  
  if (t < 1 / d1) {
    return n1 * t * t
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375
  }
}

// Geometry utilities
export const createBatsmanGeometry = () => {
  const group = new THREE.Group()
  
  // Torso
  const torsoGeometry = new THREE.BoxGeometry(1.2, 1.8, 0.6)
  const torso = new THREE.Mesh(torsoGeometry)
  torso.position.y = 1.5
  group.add(torso)
  
  // Head
  const headGeometry = new THREE.SphereGeometry(0.4, 16, 16)
  const head = new THREE.Mesh(headGeometry)
  head.position.y = 2.8
  group.add(head)
  
  // Arms
  const armGeometry = new THREE.CapsuleGeometry(0.15, 1.2, 8, 16)
  const leftArm = new THREE.Mesh(armGeometry)
  leftArm.position.set(-0.8, 1.5, 0)
  leftArm.rotation.z = Math.PI / 6
  group.add(leftArm)
  
  const rightArm = new THREE.Mesh(armGeometry)
  rightArm.position.set(0.8, 1.5, 0)
  rightArm.rotation.z = -Math.PI / 6
  group.add(rightArm)
  
  // Legs
  const legGeometry = new THREE.CapsuleGeometry(0.2, 1.5, 8, 16)
  const leftLeg = new THREE.Mesh(legGeometry)
  leftLeg.position.set(-0.3, 0.3, 0)
  group.add(leftLeg)
  
  const rightLeg = new THREE.Mesh(legGeometry)
  rightLeg.position.set(0.3, 0.3, 0)
  group.add(rightLeg)
  
  return group
}

export const createBatGeometry = () => {
  const batShape = new THREE.Shape()
  
  // Bat blade outline
  batShape.moveTo(0, 0)
  batShape.lineTo(0.5, 0)
  batShape.lineTo(0.5, 2.5)
  batShape.lineTo(0.4, 2.7)
  batShape.lineTo(-0.4, 2.7)
  batShape.lineTo(-0.5, 2.5)
  batShape.lineTo(-0.5, 0)
  batShape.lineTo(0, 0)
  
  const extrudeSettings = {
    depth: 0.15,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.02,
    bevelThickness: 0.02
  }
  
  const batGeometry = new THREE.ExtrudeGeometry(batShape, extrudeSettings)
  
  // Handle
  const handleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16)
  const handle = new THREE.Mesh(handleGeometry)
  handle.position.y = -0.4
  
  const batGroup = new THREE.Group()
  const blade = new THREE.Mesh(batGeometry)
  blade.position.y = 1.35
  
  batGroup.add(blade)
  batGroup.add(handle)
  
  return batGroup
}

// Particle system for impact effects
export const createImpactParticles = (position: THREE.Vector3) => {
  const particleCount = 20
  const particles = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    
    positions[i3] = position.x + (Math.random() - 0.5) * 0.2
    positions[i3 + 1] = position.y + (Math.random() - 0.5) * 0.2
    positions[i3 + 2] = position.z + (Math.random() - 0.5) * 0.2
    
    velocities[i3] = (Math.random() - 0.5) * 2
    velocities[i3 + 1] = Math.random() * 2
    velocities[i3 + 2] = (Math.random() - 0.5) * 2
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8
  })
  
  return new THREE.Points(particles, particleMaterial)
}

// Sky gradient creation
export const createSkyGradient = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 512)
  gradient.addColorStop(0, '#ff6b35') // Orange sunset
  gradient.addColorStop(0.5, '#f7931e') // Golden
  gradient.addColorStop(1, '#4a148c') // Deep purple
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)
  
  const texture = new THREE.CanvasTexture(canvas)
  return texture
}