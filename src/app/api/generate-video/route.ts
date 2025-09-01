import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, customizations } = await request.json()

    // Enhanced prompt for cricket animation
    const enhancedPrompt = `
      Create a cinematic, high-quality 3D cricket intro animation for "Tanish Creates". 
      
      Scene: ${prompt || 'Professional cricket stadium with evening sunset lighting'}
      
      Animation sequence (12 seconds):
      - Wide establishing shot of cricket stadium with orange-purple sunset sky
      - Camera zooms to male batsman in white cricket uniform with blue helmet visor
      - Batsman in batting stance holding traditional English willow cricket bat
      - Red leather cricket ball with white stitching spins and approaches batsman
      - Dynamic camera angles: over-shoulder, low-angle, side perspectives
      - Ball hits bat with realistic physics and camera shake effect
      - Ball flies in dramatic arc while batsman celebrates
      - Camera follows ball trajectory with motion blur
      - Text reveal: "TANISH" in large bold glowing white text
      - "CREATES" appears below in elegant smaller font
      - Semi-transparent dark overlay with fade-in scale-up text animation
      
      Visual style: Cinematic, realistic 3D graphics, professional sports broadcast quality
      Lighting: Evening stadium spotlights, warm sunset tones, dramatic shadows
      Camera work: Smooth transitions, dynamic movements, professional cinematography
      
      ${customizations?.additionalDetails || ''}
    `

    // Call video generation API
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'bhatttanish40@gmail.com',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'replicate/google/veo-3',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        video_generation: {
          duration: 12,
          fps: 30,
          resolution: '1080p',
          style: 'cinematic',
          quality: 'high'
        },
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Video generation failed: ${response.statusText}`)
    }

    const result = await response.json()

    // Return video generation job ID and status
    return NextResponse.json({
      success: true,
      jobId: result.id || `cricket_${Date.now()}`,
      status: 'processing',
      estimatedTime: '3-5 minutes',
      message: 'Cricket intro animation generation started',
      videoUrl: result.video_url || null,
      thumbnailUrl: result.thumbnail_url || null
    })

  } catch (error) {
    console.error('Video generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate cricket animation video',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')

  if (!jobId) {
    return NextResponse.json({
      success: false,
      error: 'Job ID is required'
    }, { status: 400 })
  }

  try {
    // Check video generation status
    const response = await fetch(`https://oi-server.onrender.com/video/status/${jobId}`, {
      headers: {
        'customerId': 'bhatttanish40@gmail.com',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      }
    })

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`)
    }

    const status = await response.json()

    return NextResponse.json({
      success: true,
      jobId,
      status: status.status || 'processing',
      progress: status.progress || 0,
      videoUrl: status.video_url || null,
      thumbnailUrl: status.thumbnail_url || null,
      estimatedTimeRemaining: status.estimated_time || null
    })

  } catch (error) {
    console.error('Status check error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check video status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}