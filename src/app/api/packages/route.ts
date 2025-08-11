// app/api/packages/route.ts
import { packageReader } from '@/lib/packageReader'
import { NextRequest, NextResponse } from 'next/server'
// import { packageReader } from '@/lib/packageReader'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('search')
    
    let packages
    
    if (query) {
      packages = await packageReader.searchPackages(query)
    } else {
      packages = await packageReader.readAllPackages()
    }
    
    // Transform to match your existing package interface
    const transformedPackages = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      downloads: '0', // Local packages don't have download counts
      likes: '0', // Local packages don't have likes
      author: pkg.author,
      badge: 'local', // Special badge for local packages
      size: pkg.size,
      lastModified: pkg.lastModified.toISOString(),
      files: pkg.files,
      mainFile: pkg.mainFile,
      dependencies: pkg.dependencies,
      keywords: pkg.keywords
    }))

    return NextResponse.json({
      packages: transformedPackages,
      total: transformedPackages.length
    })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}
