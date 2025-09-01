import * as THREE from 'three'
import { gsap } from 'gsap'

export interface AnimationPhase {
  name: string
  startTime: number
  duration: number
  cameraPosition: THREE.Vector3
  cameraTarget: THREE.Vector3
  description: string
}

export interface AnimationState {
  currentPhase: number
  totalDuration: number
  isPlaying: boolean
  progress: number
}

export class CricketAnimationTimeline {
  private timeline: gsap.core.Timeline
  private phases: AnimationPhase[]
  private state: AnimationState
  private callbacks: Map<string, Function[]>

  constructor() {
    this.timeline = gsap.timeline({ paused: true })
    this.callbacks = new Map()
    this.state = {
      currentPhase: 0,
      totalDuration: 12,
      isPlaying: false,
      progress: 0
    }

    this.phases = [
      {
        name: 'Stadium Introduction',
        startTime: 0,
        duration: 2,
        cameraPosition: new THREE.Vector3(0, 15, 50),
        cameraTarget: new THREE.Vector3(0, 0, 0),
        description: 'Wide establishing shot of cricket stadium with evening sunset'
      },
      {
        name: 'Batsman Focus',
        startTime: 2,
        duration: 2,
        cameraPosition: new THREE.Vector3(-5, 3, 8),
        cameraTarget: new THREE.Vector3(0, 1.5, 0),
        description: 'Camera zooms to medium shot of batsman in batting stance'
      },
      {
        name: 'Ball Approach',
        startTime: 4,
        duration: 2,
        cameraPosition: new THREE.Vector3(0, 2, -15),
        cameraTarget: new THREE.Vector3(0, 1, 5),
        description: 'Ball approaches from bowler end with spinning motion'
      },
      {
        name: 'The Impact',
        startTime: 6,
        duration: 2,
        cameraPosition: new THREE.Vector3(3, 1.5, 2),
        cameraTarget: new THREE.Vector3(0, 1, 0),
        description: 'Ball hits bat with camera shake and collision physics'
      },
      {
        name: 'Ball Flight',
        startTime: 8,
        duration: 2,
        cameraPosition: new THREE.Vector3(-8, 8, 12),
        cameraTarget: new THREE.Vector3(0, 5, 0),
        description: 'Dramatic ball arc with batsman celebration'
      },
      {
        name: 'Text Reveal',
        startTime: 10,
        duration: 2,
        cameraPosition: new THREE.Vector3(0, 10, 20),
        cameraTarget: new THREE.Vector3(0, 8, 0),
        description: 'TANISH CREATES text reveal with elegant typography'
      }
    ]

    this.setupTimeline()
  }

  private setupTimeline(): void {
    this.timeline.clear()

    // Phase 1: Stadium Introduction (0-2s)
    this.timeline.to({}, { duration: 2, onComplete: () => this.onPhaseComplete(0) })

    // Phase 2: Batsman Focus (2-4s)
    this.timeline.to({}, { duration: 2, onComplete: () => this.onPhaseComplete(1) })

    // Phase 3: Ball Approach (4-6s)
    this.timeline.to({}, { duration: 2, onComplete: () => this.onPhaseComplete(2) })

    // Phase 4: The Impact (6-8s)
    this.timeline.to({}, { duration: 2, onComplete: () => this.onPhaseComplete(3) })

    // Phase 5: Ball Flight (8-10s)
    this.timeline.to({}, { duration: 2, onComplete: () => this.onPhaseComplete(4) })

    // Phase 6: Text Reveal (10-12s)
    this.timeline.to({}, { duration: 2, onComplete: () => this.onPhaseComplete(5) })

    // Timeline progress tracking
    this.timeline.eventCallback('onUpdate', () => {
      this.state.progress = this.timeline.progress()
      this.updateCurrentPhase()
      this.emit('progress', this.state.progress)
    })

    this.timeline.eventCallback('onComplete', () => {
      this.state.isPlaying = false
      this.emit('complete')
    })
  }

  public play(): void {
    this.state.isPlaying = true
    this.timeline.play()
    this.emit('play')
  }

  public pause(): void {
    this.state.isPlaying = false
    this.timeline.pause()
    this.emit('pause')
  }

  public restart(): void {
    this.timeline.restart()
    this.state.isPlaying = true
    this.state.currentPhase = 0
    this.emit('restart')
  }

  public seek(time: number): void {
    this.timeline.seek(time)
    this.updateCurrentPhase()
    this.emit('seek', time)
  }

  public seekToPhase(phaseIndex: number): void {
    if (phaseIndex >= 0 && phaseIndex < this.phases.length) {
      const phase = this.phases[phaseIndex]
      this.seek(phase.startTime)
    }
  }

  private updateCurrentPhase(): void {
    const currentTime = this.timeline.time()
    const newPhase = this.phases.findIndex(phase => 
      currentTime >= phase.startTime && currentTime < phase.startTime + phase.duration
    )
    
    if (newPhase !== -1 && newPhase !== this.state.currentPhase) {
      this.state.currentPhase = newPhase
      this.emit('phaseChange', newPhase, this.phases[newPhase])
    }
  }

  private onPhaseComplete(phaseIndex: number): void {
    this.emit('phaseComplete', phaseIndex, this.phases[phaseIndex])
  }

  public getCurrentPhase(): AnimationPhase {
    return this.phases[this.state.currentPhase]
  }

  public getPhases(): AnimationPhase[] {
    return [...this.phases]
  }

  public getState(): AnimationState {
    return { ...this.state }
  }

  public getDuration(): number {
    return this.state.totalDuration
  }

  public getCurrentTime(): number {
    return this.timeline.time()
  }

  public getProgress(): number {
    return this.timeline.progress()
  }

  // Event system
  public on(event: string, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, [])
    }
    this.callbacks.get(event)!.push(callback)
  }

  public off(event: string, callback: Function): void {
    const callbacks = this.callbacks.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private emit(event: string, ...args: any[]): void {
    const callbacks = this.callbacks.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(...args))
    }
  }

  // Camera animation helpers
  public animateCamera(
    camera: THREE.Camera,
    targetPosition: THREE.Vector3,
    targetLookAt: THREE.Vector3,
    duration: number = 1,
    ease: string = 'power2.inOut'
  ): gsap.core.Tween {
    return gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration,
      ease,
      onUpdate: () => {
        camera.lookAt(targetLookAt)
      }
    })
  }

  // Camera shake effect for ball impact
  public addCameraShake(
    camera: THREE.Camera,
    intensity: number = 0.1,
    duration: number = 0.3
  ): gsap.core.Timeline {
    const originalPosition = camera.position.clone()
    const shakeTimeline = gsap.timeline()

    for (let i = 0; i < 10; i++) {
      shakeTimeline.to(camera.position, {
        x: originalPosition.x + (Math.random() - 0.5) * intensity,
        y: originalPosition.y + (Math.random() - 0.5) * intensity,
        z: originalPosition.z + (Math.random() - 0.5) * intensity,
        duration: duration / 10,
        ease: 'none'
      })
    }

    shakeTimeline.to(camera.position, {
      x: originalPosition.x,
      y: originalPosition.y,
      z: originalPosition.z,
      duration: 0.1,
      ease: 'power2.out'
    })

    return shakeTimeline
  }

  // Ball trajectory animation
  public animateBallTrajectory(
    ball: THREE.Object3D,
    startPos: THREE.Vector3,
    endPos: THREE.Vector3,
    height: number = 5,
    duration: number = 2,
    spin: boolean = true
  ): gsap.core.Timeline {
    const trajectoryTimeline = gsap.timeline()
    
    // Calculate arc points
    const midPoint = new THREE.Vector3(
      (startPos.x + endPos.x) / 2,
      Math.max(startPos.y, endPos.y) + height,
      (startPos.z + endPos.z) / 2
    )

    // Position animation along arc
    trajectoryTimeline.to(ball.position, {
      motionPath: {
        path: [
          { x: startPos.x, y: startPos.y, z: startPos.z },
          { x: midPoint.x, y: midPoint.y, z: midPoint.z },
          { x: endPos.x, y: endPos.y, z: endPos.z }
        ],
        curviness: 2
      },
      duration,
      ease: 'power2.out'
    })

    // Spinning animation
    if (spin) {
      trajectoryTimeline.to(ball.rotation, {
        z: Math.PI * 8, // 4 full rotations
        duration,
        ease: 'none'
      }, 0)
    }

    return trajectoryTimeline
  }

  // Text reveal animation
  public animateTextReveal(
    textElement: HTMLElement,
    delay: number = 0
  ): gsap.core.Timeline {
    const textTimeline = gsap.timeline({ delay })

    textTimeline.fromTo(textElement, 
      { 
        opacity: 0, 
        scale: 0.8,
        y: 50
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: 'back.out(1.7)'
      }
    )

    return textTimeline
  }

  public dispose(): void {
    this.timeline.kill()
    this.callbacks.clear()
  }
}

// Singleton instance
export const cricketAnimationTimeline = new CricketAnimationTimeline()

// Animation presets
export const ANIMATION_PRESETS = {
  CAMERA_EASES: {
    SMOOTH: 'power2.inOut',
    DRAMATIC: 'back.out(1.7)',
    QUICK: 'power3.out',
    BOUNCE: 'bounce.out'
  },
  DURATIONS: {
    QUICK: 0.5,
    NORMAL: 1,
    SLOW: 2,
    DRAMATIC: 3
  },
  CAMERA_SHAKE: {
    LIGHT: 0.05,
    MEDIUM: 0.1,
    HEAVY: 0.2
  }
}