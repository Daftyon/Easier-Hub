// lib/packageReader.ts
import { readdir, readFile, stat } from 'fs/promises'
import { join, extname, basename } from 'path'

export interface EasierPackage {
  id: string
  name: string
  version: string
  description: string
  author: string
  files: string[]
  mainFile: string
  size: string
  lastModified: Date
  dependencies?: string[]
  keywords?: string[]
}

export interface PackageFile {
  name: string
  content: string
  size: number
  extension: string
}

export class EasierPackageReader {
  private packagesDir: string

  constructor(packagesDir: string = './easier-packages') {
    this.packagesDir = packagesDir
  }

  /**
   * Read all packages from the easier-packages directory
   */
  async readAllPackages(): Promise<EasierPackage[]> {
    try {
      const packages: EasierPackage[] = []
      const entries = await readdir(this.packagesDir, { withFileTypes: true })

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const packagePath = join(this.packagesDir, entry.name)
          const packageData = await this.readPackage(packagePath, entry.name)
          if (packageData) {
            packages.push(packageData)
          }
        }
      }

      return packages
    } catch (error) {
      console.error('Error reading packages directory:', error)
      return []
    }
  }

  /**
   * Read a single package from a directory
   */
  private async readPackage(packagePath: string, packageName: string): Promise<EasierPackage | null> {
    try {
      // Read all files in the package directory
      const files = await readdir(packagePath)
      const elFiles = files.filter(file => extname(file) === '.el')
      
      if (elFiles.length === 0) {
        console.warn(`No .el files found in package: ${packageName}`)
        return null
      }

      // Try to find package metadata from package.json or README
      const metadata = await this.readPackageMetadata(packagePath, files)
      
      // Calculate total size
      const stats = await Promise.all(
        files.map(file => stat(join(packagePath, file)))
      )
      const totalSize = stats.reduce((acc, stat) => acc + stat.size, 0)
      const lastModified = new Date(Math.max(...stats.map(s => s.mtime.getTime())))

      // Find main file (usually index.el or the first .el file)
      const mainFile = elFiles.find(file => file === 'index.el') || elFiles[0]

      return {
        id: packageName,
        name: metadata.name || packageName,
        version: metadata.version || '1.0.0',
        description: metadata.description || `Easier language package: ${packageName}`,
        author: metadata.author || 'Unknown',
        files: elFiles,
        mainFile,
        size: this.formatFileSize(totalSize),
        lastModified,
        dependencies: metadata.dependencies,
        keywords: metadata.keywords
      }
    } catch (error) {
      console.error(`Error reading package ${packageName}:`, error)
      return null
    }
  }

  /**
   * Read package metadata from package.json, easier.json, or README files
   */
  private async readPackageMetadata(packagePath: string, files: string[]): Promise<any> {
    const metadata: any = {}

    // Try to read package.json
    if (files.includes('package.json')) {
      try {
        const packageJsonPath = join(packagePath, 'package.json')
        const packageJsonContent = await readFile(packageJsonPath, 'utf-8')
        const packageJson = JSON.parse(packageJsonContent)
        Object.assign(metadata, packageJson)
      } catch (error) {
        console.warn('Error reading package.json:', error)
      }
    }

    // Try to read easier.json (custom metadata file for Easier packages)
    if (files.includes('easier.json')) {
      try {
        const easierJsonPath = join(packagePath, 'easier.json')
        const easierJsonContent = await readFile(easierJsonPath, 'utf-8')
        const easierJson = JSON.parse(easierJsonContent)
        Object.assign(metadata, easierJson)
      } catch (error) {
        console.warn('Error reading easier.json:', error)
      }
    }

    // Try to extract info from README
    const readmeFiles = files.filter(file => 
      file.toLowerCase().startsWith('readme')
    )
    
    if (readmeFiles.length > 0) {
      try {
        const readmePath = join(packagePath, readmeFiles[0])
        const readmeContent = await readFile(readmePath, 'utf-8')
        const extractedInfo = this.extractInfoFromReadme(readmeContent)
        Object.assign(metadata, extractedInfo)
      } catch (error) {
        console.warn('Error reading README:', error)
      }
    }

    return metadata
  }

  /**
   * Extract package information from README content
   */
  private extractInfoFromReadme(content: string): any {
    const metadata: any = {}
    
    // Extract title (first # heading)
    const titleMatch = content.match(/^#\s+(.+)$/m)
    if (titleMatch) {
      metadata.name = titleMatch[1]
    }

    // Extract description (first paragraph after title)
    const lines = content.split('\n')
    let foundTitle = false
    for (const line of lines) {
      if (line.startsWith('#')) {
        foundTitle = true
        continue
      }
      if (foundTitle && line.trim() && !line.startsWith('#')) {
        metadata.description = line.trim()
        break
      }
    }

    // Extract author from common patterns
    const authorMatch = content.match(/(?:author|by|created by)[:\s]+(.+?)(?:\n|$)/i)
    if (authorMatch) {
      metadata.author = authorMatch[1].trim()
    }

    return metadata
  }

  /**
   * Read the content of a specific package file
   */
  async readPackageFile(packageName: string, fileName: string): Promise<PackageFile | null> {
    try {
      const filePath = join(this.packagesDir, packageName, fileName)
      const content = await readFile(filePath, 'utf-8')
      const stats = await stat(filePath)

      return {
        name: fileName,
        content,
        size: stats.size,
        extension: extname(fileName)
      }
    } catch (error) {
      console.error(`Error reading file ${fileName} from package ${packageName}:`, error)
      return null
    }
  }

  /**
   * Search packages by name or description
   */
  async searchPackages(query: string): Promise<EasierPackage[]> {
    const allPackages = await this.readAllPackages()
    const lowercaseQuery = query.toLowerCase()

    return allPackages.filter(pkg => 
      pkg.name.toLowerCase().includes(lowercaseQuery) ||
      pkg.description.toLowerCase().includes(lowercaseQuery) ||
      (pkg.keywords && pkg.keywords.some(keyword => 
        keyword.toLowerCase().includes(lowercaseQuery)
      ))
    )
  }

  /**
   * Format file size in human readable format
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// Export singleton instance
export const packageReader = new EasierPackageReader()
