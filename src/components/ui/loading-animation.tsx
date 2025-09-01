'use client'

import { motion } from 'framer-motion'
import { Loader2, Play, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingAnimationProps {
  type?: 'spinner' | 'cricket' | 'video' | 'progress'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  progress?: number
  status?: 'loading' | 'success' | 'error' | 'idle'
  message?: string
}

export function LoadingAnimation({ 
  type = 'spinner', 
  size = 'md', 
  className,
  progress = 0,
  status = 'loading',
  message
}: LoadingAnimationProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  if (type === 'cricket') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="relative">
          {/* Cricket Ball */}
          <motion.div
            className={cn(
              'rounded-full bg-gradient-to-br from-red-600 to-red-800 border-2 border-white/20',
              sizeClasses[size]
            )}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Cricket ball stitching */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-white/60 rounded-full" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center rotate-90">
              <div className="w-full h-0.5 bg-white/60 rounded-full" />
            </div>
          </motion.div>
          
          {/* Bat swing animation */}
          <motion.div
            className="absolute -right-8 top-1/2 transform -translate-y-1/2"
            animate={{
              rotate: [-45, 0, -45],
              x: [0, 4, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-1 h-8 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full" />
          </motion.div>
        </div>
        
        {message && (
          <motion.p 
            className="text-sm text-gray-400 text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {message}
          </motion.p>
        )}
      </div>
    )
  }

  if (type === 'video') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
        <div className="relative">
          {/* Video generation animation */}
          <motion.div
            className={cn(
              'rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center',
              size === 'sm' ? 'w-12 h-8' : size === 'md' ? 'w-16 h-12' : 'w-20 h-16'
            )}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 0 rgba(147, 51, 234, 0.4)',
                '0 0 0 10px rgba(147, 51, 234, 0)',
                '0 0 0 0 rgba(147, 51, 234, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {status === 'loading' && <Play className="w-4 h-4 text-white" />}
            {status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
            {status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
          </motion.div>
          
          {/* Progress dots */}
          <div className="flex space-x-1 mt-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
        
        {message && (
          <p className="text-sm text-gray-400 text-center max-w-xs">
            {message}
          </p>
        )}
      </div>
    )
  }

  if (type === 'progress') {
    return (
      <div className={cn('w-full max-w-md space-y-4', className)}>
        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        {/* Progress text */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">{message || 'Processing...'}</span>
          <span className="text-white font-medium">{Math.round(progress)}%</span>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center justify-center space-x-2">
          {status === 'loading' && (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span className="text-sm text-gray-400">Generating video...</span>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Video ready!</span>
            </>
          )}
          {status === 'error' && (
            <>
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">Generation failed</span>
            </>
          )}
        </div>
      </div>
    )
  }

  // Default spinner
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-purple-400', sizeClasses[size])} />
      {message && (
        <span className="ml-2 text-sm text-gray-400">{message}</span>
      )}
    </div>
  )
}

export function CricketBallLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      <div className="relative">
        {/* Main cricket ball */}
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-800 shadow-lg"
          animate={{
            rotate: 360,
            y: [0, -10, 0]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            y: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Cricket ball seam */}
          <div className="absolute inset-2 border border-white/40 rounded-full">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/60 transform -translate-y-0.5" />
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/60 transform -translate-x-0.5" />
          </div>
        </motion.div>
        
        {/* Motion trail */}
        <motion.div
          className="absolute top-1/2 -left-8 w-6 h-1 bg-gradient-to-r from-transparent to-red-400/50 rounded-full"
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
}

export function VideoGenerationProgress({ 
  progress, 
  stage, 
  className 
}: { 
  progress: number
  stage: string
  className?: string 
}) {
  const stages = [
    'Initializing 3D scene...',
    'Loading cricket models...',
    'Setting up physics...',
    'Rendering animation...',
    'Processing video...',
    'Finalizing output...'
  ]
  
  const currentStageIndex = stages.indexOf(stage)
  
  return (
    <div className={cn('w-full max-w-lg space-y-6', className)}>
      {/* Main progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Generating Cricket Animation</span>
          <span className="text-white font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Stage indicators */}
      <div className="space-y-3">
        {stages.map((stageName, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3"
            initial={{ opacity: 0.3 }}
            animate={{ 
              opacity: index <= currentStageIndex ? 1 : 0.3,
              scale: index === currentStageIndex ? 1.02 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <div className={cn(
              'w-3 h-3 rounded-full border-2',
              index < currentStageIndex 
                ? 'bg-green-500 border-green-500' 
                : index === currentStageIndex
                ? 'bg-purple-500 border-purple-500 animate-pulse'
                : 'bg-transparent border-gray-500'
            )} />
            <span className={cn(
              'text-sm',
              index <= currentStageIndex ? 'text-white' : 'text-gray-500'
            )}>
              {stageName}
            </span>
            {index === currentStageIndex && (
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}