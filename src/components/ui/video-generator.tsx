'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, Play, Settings, Sparkles, Video } from 'lucide-react'

interface VideoGenerationStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  videoUrl?: string
  error?: string
}

export function VideoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<VideoGenerationStatus | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [videoSettings, setVideoSettings] = useState({
    duration: 12,
    quality: '1080p',
    fps: 30,
    style: 'cinematic'
  })

  const defaultPrompt = `Create a cinematic, high-quality 3D cricket intro animation for "Tanish Creates". The scene features a realistic male cricket player in white uniform with blue helmet visor, holding a traditional English willow cricket bat. A red leather cricket ball with white stitching spins and approaches the batsman in a cricket stadium with evening sunset lighting. The ball hits the bat with dramatic camera shake, flies in a realistic arc with motion blur. The stadium has minimalistic stands, orange-purple sunset sky, and spotlights. Camera movements include wide stadium shots, close-ups of the batsman, over-the-shoulder angles, and dynamic ball-following shots. The animation ends with elegant "TANISH CREATES" text reveal with glowing white typography over a semi-transparent overlay. Professional cinematography with warm sunset lighting, realistic shadows, and physics-based ball trajectory. Duration: 12 seconds, cinematic quality.`

  const generateVideo = async () => {
    setIsGenerating(true)
    setGenerationStatus({ id: 'temp', status: 'pending', progress: 0 })

    try {
      const prompt = customPrompt.trim() || defaultPrompt
      
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          settings: videoSettings
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start video generation')
      }

      const { id } = await response.json()
      setGenerationStatus({ id, status: 'processing', progress: 10 })

      // Poll for status updates
      const pollStatus = async () => {
        try {
          const statusResponse = await fetch(`/api/video-status?id=${id}`)
          if (statusResponse.ok) {
            const status = await statusResponse.json()
            setGenerationStatus(status)

            if (status.status === 'processing' && status.progress < 100) {
              setTimeout(pollStatus, 3000) // Poll every 3 seconds
            } else if (status.status === 'completed') {
              setIsGenerating(false)
            } else if (status.status === 'failed') {
              setIsGenerating(false)
            }
          }
        } catch (error) {
          console.error('Error polling status:', error)
          setTimeout(pollStatus, 5000) // Retry after 5 seconds
        }
      }

      setTimeout(pollStatus, 2000) // Start polling after 2 seconds

    } catch (error) {
      console.error('Error generating video:', error)
      setGenerationStatus({
        id: 'error',
        status: 'failed',
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      })
      setIsGenerating(false)
    }
  }

  const downloadVideo = () => {
    if (generationStatus?.videoUrl) {
      const link = document.createElement('a')
      link.href = generationStatus.videoUrl
      link.download = 'tanish-creates-cricket-intro.mp4'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const previewVideo = () => {
    if (generationStatus?.videoUrl) {
      window.open(generationStatus.videoUrl, '_blank')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">AI Video Generator</h2>
        <p className="text-gray-300">Generate your custom cricket intro animation</p>
      </div>

      {/* Video Settings */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Video Settings
          </CardTitle>
          <CardDescription className="text-gray-300">
            Configure your video generation parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-white">Duration</Label>
              <Input
                type="number"
                value={videoSettings.duration}
                onChange={(e) => setVideoSettings(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="bg-white/10 border-white/20 text-white"
                min="8"
                max="30"
              />
            </div>
            <div>
              <Label className="text-white">Quality</Label>
              <select
                value={videoSettings.quality}
                onChange={(e) => setVideoSettings(prev => ({ ...prev, quality: e.target.value }))}
                className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
              >
                <option value="720p">720p HD</option>
                <option value="1080p">1080p Full HD</option>
                <option value="4k">4K Ultra HD</option>
              </select>
            </div>
            <div>
              <Label className="text-white">Frame Rate</Label>
              <select
                value={videoSettings.fps}
                onChange={(e) => setVideoSettings(prev => ({ ...prev, fps: parseInt(e.target.value) }))}
                className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
              >
                <option value="24">24 fps</option>
                <option value="30">30 fps</option>
                <option value="60">60 fps</option>
              </select>
            </div>
            <div>
              <Label className="text-white">Style</Label>
              <select
                value={videoSettings.style}
                onChange={(e) => setVideoSettings(prev => ({ ...prev, style: e.target.value }))}
                className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
              >
                <option value="cinematic">Cinematic</option>
                <option value="realistic">Realistic</option>
                <option value="dramatic">Dramatic</option>
                <option value="artistic">Artistic</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Prompt */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Custom Prompt (Optional)
          </CardTitle>
          <CardDescription className="text-gray-300">
            Customize the animation description or leave blank to use the default
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter your custom animation description..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
          />
          <div className="mt-2 text-sm text-gray-400">
            Leave empty to use the default cinematic cricket animation prompt
          </div>
        </CardContent>
      </Card>

      {/* Generation Status */}
      {generationStatus && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Video className="w-5 h-5" />
              Generation Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    generationStatus.status === 'completed' ? 'default' :
                    generationStatus.status === 'failed' ? 'destructive' :
                    'secondary'
                  }
                >
                  {generationStatus.status.toUpperCase()}
                </Badge>
                <span className="text-white">ID: {generationStatus.id}</span>
              </div>
              <span className="text-white">{generationStatus.progress}%</span>
            </div>

            <Progress value={generationStatus.progress} className="w-full" />

            {generationStatus.status === 'processing' && (
              <div className="text-sm text-gray-300">
                Generating your cricket animation... This may take 3-5 minutes for high quality.
              </div>
            )}

            {generationStatus.status === 'failed' && generationStatus.error && (
              <div className="text-sm text-red-400">
                Error: {generationStatus.error}
              </div>
            )}

            {generationStatus.status === 'completed' && generationStatus.videoUrl && (
              <div className="flex gap-2">
                <Button onClick={previewVideo} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Preview Video
                </Button>
                <Button onClick={downloadVideo} variant="outline" className="flex items-center gap-2 text-white border-white/20">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Separator className="bg-white/10" />

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={generateVideo}
          disabled={isGenerating}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-8 py-3"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Video...
            </>
          ) : (
            <>
              <Video className="w-5 h-5 mr-2" />
              Generate Cricket Animation
            </>
          )}
        </Button>
        
        {!isGenerating && (
          <p className="text-sm text-gray-400 mt-2">
            High-quality video generation typically takes 3-5 minutes
          </p>
        )}
      </div>
    </div>
  )
}