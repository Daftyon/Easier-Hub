'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Package, 
  Download, 
  Star, 
  User, 
  Copy, 
  Check, 
  ChevronRight,
  Home,
  HardDrive,
  Tag,
  Code,
  Calendar,
  FileCode,
  ArrowLeft,
  ExternalLink,
  AlertCircle
} from 'lucide-react'

interface PackageFile {
  name: string
  content: string
  size: number
  extension: string
}

interface PackageDetail {
  id: string
  name: string
  version: string
  description: string
  author: string
  size?: string
  lastModified?: string
  files?: string[]
  mainFile?: string
  dependencies?: string[]
  keywords?: string[]
  downloads?: string
  likes?: string
  type: 'local' | 'remote'
}

// Mock package data for when API isn't available
const mockPackageData: { [key: string]: PackageDetail } = {
  'math-utils': {
    id: 'math-utils',
    name: 'math-utils',
    version: '1.2.0',
    description: 'Essential mathematical utilities and functions for Easier language',
    author: 'Ahmed Hafdi',
    size: '2.4 KB',
    lastModified: new Date().toISOString(),
    files: ['index.el', 'constants.el'],
    mainFile: 'index.el',
    keywords: ['math', 'utilities', 'algorithms', 'fibonacci', 'prime'],
    type: 'local'
  },
  'math-core': {
    id: 'math-core',
    name: 'math-core',
    version: '2.1.0',
    description: 'Essential mathematical functions and algorithms for Easier language. Includes advanced calculus, linear algebra, and statistical operations.',
    author: 'EasierHub Team',
    downloads: '45K',
    likes: '1.2K',
    type: 'remote'
  },
  'proof-assistant': {
    id: 'proof-assistant',
    name: 'proof-assistant',
    version: '1.0.0-beta',
    description: 'Formal verification and theorem proving tools for mathematical reasoning. AI-powered proof assistance and automated verification.',
    author: 'Ahmed Hafdi',
    downloads: '12K',
    likes: '892',
    type: 'remote'
  },
  'algorithms-std': {
    id: 'algorithms-std',
    name: 'algorithms-std',
    version: '3.2.1',
    description: 'Standard algorithm implementations: sorting, searching, graph algorithms, and data structures optimized for Easier language.',
    author: 'Algorithm Contributors',
    downloads: '38K',
    likes: '956',
    type: 'remote'
  }
}

const mockFileContent = `# Math Utilities Package
# A collection of mathematical functions for the Easier language

func fibonacci(n: Number) -> Number {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func factorial(n: Number) -> Number {
    if n <= 1 {
        return 1
    }
    return n * factorial(n-1)
}

func gcd(a: Number, b: Number) -> Number {
    while b != 0 {
        let temp = b
        b = a % b
        a = temp
    }
    return a
}

func isPrime(n: Number) -> Boolean {
    if n <= 1 return false
    if n <= 3 return true
    if n % 2 == 0 || n % 3 == 0 return false
    
    let i = 5
    while i * i <= n {
        if n % i == 0 || n % (i + 2) == 0 {
            return false
        }
        i += 6
    }
    return true
}

export { fibonacci, factorial, gcd, isPrime }`

const CodeViewer = ({ file }: { file: PackageFile }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(file.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gray-900/80 rounded-xl overflow-hidden border border-gray-700/50 backdrop-blur">
      <div className="flex justify-between items-center px-6 py-4 bg-gray-800/50 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <FileCode className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-mono text-gray-300">{file.name}</span>
          <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
            {file.size} bytes
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-2 px-3 py-2 text-xs bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-6 overflow-x-auto max-h-96">
        <pre className="text-sm text-gray-300 leading-relaxed">
          <code className="language-easier">{file.content}</code>
        </pre>
      </div>
    </div>
  )
}

const InstallCommand = ({ packageName }: { packageName: string }) => {
  const [copied, setCopied] = useState(false)
  const command = `easier install ${packageName}`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-slate-900/80 rounded-xl p-6 border border-gray-700/50 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-slate-400 text-sm mb-2">📦 Install this package</div>
          <code className="text-cyan-400 font-mono text-lg">{command}</code>
        </div>
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-colors flex items-center space-x-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-gray-800/50 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
    <div className="container flex h-16 items-center justify-between px-4">
      <Link href="/" className="flex items-center space-x-2">
        <Package className="h-6 w-6 text-blue-500" />
        <span className="text-xl font-bold text-white">EasierHub</span>
      </Link>
      
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="/packages" className="text-sm font-medium text-blue-400">
          Packages
        </Link>
        <Link href="/docs" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors">
          Docs
        </Link>
        <Link href="/community" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors">
          Community
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        <Link href="/login" className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors">
          Sign In
        </Link>
        <Link href="/publish" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Publish
        </Link>
      </div>
    </div>
  </header>
)

export default function PackageDetailPage() {
  const params = useParams()
  const packageName = params?.packageName as string
  
  const [packageData, setPackageData] = useState<PackageDetail | null>(null)
  const [selectedFile, setSelectedFile] = useState<PackageFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!packageName) return

    const loadPackage = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to load from API first
        const response = await fetch(`/api/packages/${packageName}`)
        
        if (response.ok) {
          const data = await response.json()
          setPackageData({
            ...data,
            type: 'local'
          })

          // Load the main file
          if (data.mainFile) {
            const fileResponse = await fetch(`/api/packages/${packageName}/files/${data.mainFile}`)
            if (fileResponse.ok) {
              const fileData = await fileResponse.json()
              setSelectedFile(fileData)
            }
          }
        } else {
          // Fallback to mock data
          const mockData = mockPackageData[packageName]
          if (mockData) {
            setPackageData(mockData)
            // Create mock file content
            setSelectedFile({
              name: mockData.mainFile || 'index.el',
              content: mockFileContent,
              size: mockFileContent.length,
              extension: '.el'
            })
          } else {
            throw new Error('Package not found')
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load package')
      } finally {
        setLoading(false)
      }
    }

    loadPackage()
  }, [packageName])

  const loadFile = async (fileName: string) => {
    try {
      const response = await fetch(`/api/packages/${packageName}/files/${fileName}`)
      if (response.ok) {
        const fileData = await response.json()
        setSelectedFile(fileData)
      } else {
        // Fallback to mock content
        setSelectedFile({
          name: fileName,
          content: mockFileContent,
          size: mockFileContent.length,
          extension: '.el'
        })
      }
    } catch (err) {
      console.error('Error loading file:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header />
        <div className="container py-16 text-center">
          <div className="animate-pulse text-gray-400">Loading package details...</div>
        </div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header />
        <div className="container py-16 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Package Not Found</h2>
          <p className="text-gray-400 mb-6">
            The package "{packageName}" could not be found.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link 
              href="/packages" 
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Browse Packages</span>
            </Link>
            <Link 
              href="/" 
              className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      
      {/* Package Header */}
      <div className="bg-gray-900/50 border-b border-gray-800/50 backdrop-blur">
        <div className="container py-8 px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-blue-400 flex items-center space-x-1 transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/packages" className="hover:text-blue-400 transition-colors">Packages</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{packageData.name}</span>
          </nav>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center space-x-4">
                <Package className="h-10 w-10 text-blue-500" />
                <span>{packageData.name}</span>
                <span className="text-xl font-normal text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg border border-gray-700/50">
                  v{packageData.version}
                </span>
              </h1>
              <p className="text-gray-300 text-lg mb-6 max-w-3xl leading-relaxed">
                {packageData.description}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-gray-300">{packageData.author}</span>
                </div>
                {packageData.lastModified && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {new Date(packageData.lastModified).toLocaleDateString()}</span>
                  </div>
                )}
                {packageData.size && (
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4" />
                    <span>{packageData.size}</span>
                  </div>
                )}
                {packageData.files && (
                  <div className="flex items-center space-x-2">
                    <FileCode className="h-4 w-4" />
                    <span>{packageData.files.length} files</span>
                  </div>
                )}
              </div>

              {packageData.keywords && packageData.keywords.length > 0 && (
                <div className="flex items-center space-x-3">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {packageData.keywords.map(keyword => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-4 ml-8">
              <span className="px-4 py-2 bg-green-500/20 text-green-400 text-sm rounded-lg font-medium text-center flex items-center space-x-2 border border-green-500/30">
                <span>📁</span>
                <span>{packageData.type === 'local' ? 'Local Package' : 'Remote Package'}</span>
              </span>
              
              {packageData.type === 'remote' && packageData.downloads && packageData.likes && (
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700/50">
                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span className="text-gray-300">{packageData.downloads} downloads</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span className="text-gray-300">{packageData.likes} stars</span>
                    </div>
                  </div>
                </div>
              )}

              <Link
                href="/packages"
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Packages</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8 px-4">
        {/* Install Command */}
        <div className="mb-8">
          <InstallCommand packageName={packageData.name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - File List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 sticky top-24 backdrop-blur">
              <div className="p-4 border-b border-gray-700/50 bg-gray-800/30 rounded-t-xl">
                <h3 className="font-semibold text-white flex items-center space-x-2">
                  <Code className="h-5 w-5 text-blue-400" />
                  <span>Package Files</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {packageData.files?.length || 0} .el files
                </p>
              </div>
              <div className="p-2 max-h-96 overflow-y-auto">
                {packageData.files?.map(fileName => (
                  <button
                    key={fileName}
                    onClick={() => loadFile(fileName)}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm hover:bg-gray-700/50 transition-colors flex items-center justify-between group ${
                      selectedFile?.name === fileName ? 'bg-blue-500/20 text-blue-400 border-l-4 border-blue-500' : 'text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <FileCode className="h-4 w-4" />
                      <span className="font-mono">{fileName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {fileName === packageData.mainFile && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">
                          main
                        </span>
                      )}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                )) || (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No files available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - File Viewer */}
          <div className="lg:col-span-3">
            {selectedFile ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white flex items-center space-x-3">
                    <FileCode className="h-6 w-6 text-blue-400" />
                    <span>File: {selectedFile.name}</span>
                  </h2>
                  <div className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg border border-gray-700/50">
                    {selectedFile.size} bytes • .el file
                  </div>
                </div>
                <CodeViewer file={selectedFile} />
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-12 text-center backdrop-blur">
                <FileCode className="h-20 w-20 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-medium text-white mb-3">Select a file to view</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Choose a file from the sidebar to see its content and explore the package implementation
                </p>
                {packageData.mainFile && (
                  <button
                    onClick={() => loadFile(packageData.mainFile!)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto transition-colors"
                  >
                    <FileCode className="h-4 w-4" />
                    <span>View {packageData.mainFile}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Package Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dependencies */}
          {packageData.dependencies && packageData.dependencies.length > 0 && (
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 backdrop-blur">
              <h3 className="font-semibold text-white mb-4 flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-400" />
                <span>Dependencies</span>
              </h3>
              <div className="space-y-3">
                {packageData.dependencies.map(dep => (
                  <div key={dep} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                    <span className="font-mono text-sm text-gray-300">{dep}</span>
                    <Link href={`/packages/${dep}`} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                      View →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Stats */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 backdrop-blur">
            <h3 className="font-semibold text-white mb-4">📊 Package Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="text-gray-400">Version:</span>
                <span className="font-mono text-gray-300">{packageData.version}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                <span className="text-gray-400">Author:</span>
                <span className="text-gray-300">{packageData.author}</span>
              </div>
              {packageData.size && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-gray-300">{packageData.size}</span>
                </div>
              )}
              {packageData.files && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Files:</span>
                  <span className="text-gray-300">{packageData.files.length} .el files</span>
                </div>
              )}
              {packageData.lastModified && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-gray-300">{new Date(packageData.lastModified).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Type:</span>
                <span className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${packageData.type === 'local' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                  <span className="text-gray-300">{packageData.type === 'local' ? 'Local Package' : 'Remote Package'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
