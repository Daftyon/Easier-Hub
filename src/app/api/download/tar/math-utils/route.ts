import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile, stat } from 'fs/promises'
import { join } from 'path'

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
      const packageStat = await stat(packagePath)
      if (!packageStat.isDirectory()) {
        return NextResponse.json(
          { error: 'Package not found' },
          { status: 404 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Read all files in the package directory
    const files = await readdir(packagePath, { recursive: true })
    const tarData = await createSimpleTar(packagePath, files, packageName)
    
    return new NextResponse(tarData, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-tar',
        'Content-Disposition': `attachment; filename="${packageName}.tar"`,
        'Content-Length': tarData.length.toString(),
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

  } catch (error) {
    console.error('Error downloading package:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simple TAR format implementation
async function createSimpleTar(packagePath: string, files: string[], packageName: string): Promise<Buffer> {
  const tarBlocks: Buffer[] = []
  
  for (const file of files) {
    const filePath = join(packagePath, file.toString())
    const fileStat = await stat(filePath)
    
    if (fileStat.isFile()) {
      const content = await readFile(filePath)
      const relativePath = `${packageName}/${file.toString()}`
      
      // Create TAR header (512 bytes)
      const header = Buffer.alloc(512)
      
      // File name (100 bytes)
      Buffer.from(relativePath).copy(header, 0, 0, Math.min(100, relativePath.length))
      
      // File mode (8 bytes) - octal
      Buffer.from('0000644 ').copy(header, 100)
      
      // Owner ID (8 bytes) - octal
      Buffer.from('0000000 ').copy(header, 108)
      
      // Group ID (8 bytes) - octal  
      Buffer.from('0000000 ').copy(header, 116)
      
      // File size (12 bytes) - octal
      const sizeOctal = content.length.toString(8).padStart(11, '0') + ' '
      Buffer.from(sizeOctal).copy(header, 124)
      
      // Modification time (12 bytes) - octal
      const mtimeOctal = Math.floor(fileStat.mtime.getTime() / 1000).toString(8).padStart(11, '0') + ' '
      Buffer.from(mtimeOctal).copy(header, 136)
      
      // Checksum placeholder (8 bytes)
      Buffer.from('        ').copy(header, 148)
      
      // Type flag (1 byte) - '0' for regular file
      header[156] = 0x30
      
      // Calculate checksum
      let checksum = 0
      for (let i = 0; i < 512; i++) {
        checksum += header[i]
      }
      const checksumOctal = checksum.toString(8).padStart(6, '0') + '\0 '
      Buffer.from(checksumOctal).copy(header, 148)
      
      // Add header to TAR
      tarBlocks.push(header)
      
      // Add file content (must be padded to 512-byte boundary)
      const paddedSize = Math.ceil(content.length / 512) * 512
      const paddedContent = Buffer.alloc(paddedSize)
      content.copy(paddedContent)
      tarBlocks.push(paddedContent)
    }
  }
  
  // Add end-of-archive marker (two 512-byte zero blocks)
  tarBlocks.push(Buffer.alloc(512))
  tarBlocks.push(Buffer.alloc(512))
  
  return Buffer.concat(tarBlocks)
}
