import { readdir, readFile, stat } from "fs/promises"
import { NextResponse } from "next/server"
import { join } from "path/posix"

export async function GET() {
  try {
    const packagesDir = './easier-packages'
    
    let entries
    try {
      entries = await readdir(packagesDir, { withFileTypes: true })
    } catch (error) {
      return NextResponse.json({
        packages: [],
        total: 0,
        message: 'easier-packages directory not found'
      })
    }
    
    const packages = []
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const packagePath = join(packagesDir, entry.name)
          const files = await readdir(packagePath)
          const elFiles = files.filter(file => file.endsWith('.el'))
          
          if (elFiles.length > 0) {
            // Try to read package metadata
            let metadata = { 
              name: entry.name, 
              version: '1.0.0', 
              author: 'Unknown',
              description: `Easier package: ${entry.name}`,
              keywords: []
            }
            
            // Try easier.json first, then package.json
            for (const metadataFile of ['easier.json', 'package.json']) {
              if (files.includes(metadataFile)) {
                try {
                  const metadataPath = join(packagePath, metadataFile)
                  const metadataContent = await readFile(metadataPath, 'utf-8')
                  const parsedMetadata = JSON.parse(metadataContent)
                  metadata = { ...metadata, ...parsedMetadata }
                  break
                } catch (error) {
                  console.warn(`Could not parse ${metadataFile} for ${entry.name}`)
                }
              }
            }
            
            // Calculate package size
            const stats = await Promise.all(
              files.map(async file => {
                try {
                  return await stat(join(packagePath, file))
                } catch {
                  return { size: 0, mtime: new Date() }
                }
              })
            )
            const totalSize = stats.reduce((acc, stat) => acc + stat.size, 0)
            const lastModified = new Date(Math.max(...stats.map(s => s.mtime.getTime())))
            
            packages.push({
              name: entry.name,
              version: metadata.version,
              author: metadata.author,
              description: metadata.description,
              keywords: metadata.keywords,
              files: elFiles.length,
              totalFiles: files.length,
              elFiles: elFiles,
              allFiles: files,
              size: formatFileSize(totalSize),
              sizeBytes: totalSize,
              lastModified: lastModified.toISOString(),
              downloadUrl: `/api/download/tar/${entry.name}`,
              tarUrl: `/api/download/tar/${entry.name}`
            })
          }
        } catch (error) {
          console.warn(`Error processing package ${entry.name}:`, error)
        }
      }
    }
    
    return NextResponse.json({
      packages,
      total: packages.length,
      timestamp: new Date().toISOString(),
      message: packages.length > 0 ? 'Packages loaded successfully' : 'No packages found'
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300'
      }
    })
    
  } catch (error) {
    console.error('Error listing packages for download:', error)
    return NextResponse.json(
      { error: 'Failed to list packages' },
      { status: 500 }
    )
  }
}

// Utility function
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
