import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const predictionId = searchParams.get('id')

    if (!predictionId) {
      return NextResponse.json(
        { error: 'Prediction ID is required' },
        { status: 400 }
      )
    }

    // Check video generation status using Replicate API
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.status}`)
    }

    const prediction = await response.json()

    // Return status information
    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      progress: prediction.progress || 0,
      output: prediction.output,
      error: prediction.error,
      logs: prediction.logs,
      created_at: prediction.created_at,
      started_at: prediction.started_at,
      completed_at: prediction.completed_at,
      urls: prediction.urls,
      metrics: prediction.metrics
    })

  } catch (error) {
    console.error('Error checking video status:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check video status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { predictionId, action } = body

    if (!predictionId) {
      return NextResponse.json(
        { error: 'Prediction ID is required' },
        { status: 400 }
      )
    }

    // Handle different actions
    switch (action) {
      case 'cancel':
        const cancelResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        })

        if (!cancelResponse.ok) {
          throw new Error(`Failed to cancel prediction: ${cancelResponse.status}`)
        }

        const cancelResult = await cancelResponse.json()
        return NextResponse.json({
          success: true,
          message: 'Video generation cancelled',
          prediction: cancelResult
        })

      case 'retry':
        // Get original prediction details
        const originalResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        })

        if (!originalResponse.ok) {
          throw new Error(`Failed to get original prediction: ${originalResponse.status}`)
        }

        const originalPrediction = await originalResponse.json()

        // Create new prediction with same inputs
        const retryResponse = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: originalPrediction.version,
            input: originalPrediction.input
          })
        })

        if (!retryResponse.ok) {
          throw new Error(`Failed to retry prediction: ${retryResponse.status}`)
        }

        const retryResult = await retryResponse.json()
        return NextResponse.json({
          success: true,
          message: 'Video generation retried',
          prediction: retryResult
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error handling video status action:', error)
    return NextResponse.json(
      { 
        error: 'Failed to handle video status action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}