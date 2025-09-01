'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="p-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white">Tanish Creates</div>
          <div className="flex gap-4">
            <Link href="/animation">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                View Animation
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-600 text-white">3D Cricket Animation</Badge>
          <h1 className="text-6xl font-bold text-white mb-6">
            Cinematic Cricket
            <span className="block bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
              Intro Animation
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience a high-quality, 3D cricket intro animation featuring realistic physics, 
            dynamic camera movements, and professional-grade visual effects.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/animation">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
                Watch Animation
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10">
              Generate Video
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Realistic 3D Models</CardTitle>
              <CardDescription className="text-gray-300">
                Detailed batsman, cricket bat, and ball with authentic textures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Male cricket player with realistic proportions</li>
                <li>• Helmet with blue visor</li>
                <li>• Traditional English willow bat</li>
                <li>• Red leather ball with white stitching</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Physics Simulation</CardTitle>
              <CardDescription className="text-gray-300">
                Realistic ball trajectory and collision detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Ball spin on z-axis for realism</li>
                <li>• Gravity and arc trajectory</li>
                <li>• Bat-ball collision physics</li>
                <li>• Motion blur during flight</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Cinematic Camera</CardTitle>
              <CardDescription className="text-gray-300">
                Dynamic angles and professional cinematography
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Wide stadium establishing shot</li>
                <li>• Over-the-shoulder perspectives</li>
                <li>• Camera shake on ball impact</li>
                <li>• Smooth zoom and pan transitions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Animation Timeline */}
        <Card className="bg-white/5 border-white/10 text-white mb-16">
          <CardHeader>
            <CardTitle>Animation Timeline (12 seconds)</CardTitle>
            <CardDescription className="text-gray-300">
              Professional sequence breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-orange-500 to-purple-600 flex items-center justify-center font-bold">
                  0-2s
                </div>
                <div>
                  <h4 className="font-semibold">Stadium Introduction</h4>
                  <p className="text-sm text-gray-300">Wide shot with evening sunset sky and stadium environment</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center font-bold">
                  2-4s
                </div>
                <div>
                  <h4 className="font-semibold">Batsman Focus</h4>
                  <p className="text-sm text-gray-300">Camera zooms to batsman in batting stance</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-blue-500 to-green-600 flex items-center justify-center font-bold">
                  4-6s
                </div>
                <div>
                  <h4 className="font-semibold">Ball Approach</h4>
                  <p className="text-sm text-gray-300">Dynamic ball trajectory with spinning motion</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-green-500 to-yellow-600 flex items-center justify-center font-bold">
                  6-8s
                </div>
                <div>
                  <h4 className="font-semibold">The Impact</h4>
                  <p className="text-sm text-gray-300">Ball hits bat with camera shake and physics</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-yellow-500 to-red-600 flex items-center justify-center font-bold">
                  8-10s
                </div>
                <div>
                  <h4 className="font-semibold">Ball Flight</h4>
                  <p className="text-sm text-gray-300">Dramatic arc with batsman celebration</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 flex items-center justify-center font-bold">
                  10-12s
                </div>
                <div>
                  <h4 className="font-semibold">Text Reveal</h4>
                  <p className="text-sm text-gray-300">"TANISH CREATES" with elegant typography</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2024 Tanish Creates. Professional 3D Cricket Animation.</p>
        </div>
      </footer>
    </div>
  )
}