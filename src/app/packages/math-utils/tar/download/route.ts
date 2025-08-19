import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile, stat } from 'fs/promises'
import { join, basename } from 'path'
import * as tar from 'tar-stream'
import { Readable } from 'stream'

export async function GET(
  request: NextRequest,
  { params }: { params: { packageName: string } }
) {
  try {
    const packageName = params.packageName
    const packagesDir = './easier-packages'
    const packagePath = join(packagesDir, packageName)

    // Verify package exists
    try {
      await stat(packagePath)
    } catch (error) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Create tar stream
    const pack = tar.pack()
    
    // Read all files in the package directory
    const files = await readdir(packagePath, { recursive: true })
    
    for (const file of files) {
      const filePath = join(packagePath, file)
      const fileStat = await stat(filePath)
      
      if (fileStat.isFile()) {
        const content = await readFile(filePath)
        const relativePath = file.toString()
        
        pack.entry(
          { 
            name: relativePath,
            size: content.length,
            mtime: fileStat.mtime,
            mode: fileStat.mode
          },
          content
        )
      }
    }
    
    // Finalize the tar stream
    pack.finalize()

    // Convert tar stream to Response
    const chunks: Buffer[] = []
    
    return new Promise((resolve) => {
      pack.on('data', (chunk: Buffer<ArrayBufferLike>) => {
        chunks.push(chunk)
      })
      
      pack.on('end', () => {
        const tarBuffer = Buffer.concat(chunks)
        
        resolve(new NextResponse(tarBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/x-tar',
            'Content-Disposition': `attachment; filename="${packageName}.tar"`,
            'Content-Length': tarBuffer.length.toString(),
            'Cache-Control': 'public, max-age=3600'
          }
        }))
      })
      
      pack.on('error', (error: any) => {
        console.error('Error creating tar:', error)
        resolve(NextResponse.json(
          { error: 'Failed to create tar file' },
          { status: 500 }
        ))
      })
    })

  } catch (error) {
    console.error('Error downloading package:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
