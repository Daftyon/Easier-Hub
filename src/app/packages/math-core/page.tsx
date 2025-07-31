'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Star, GitBranch, Calendar, User, Copy, Check, ExternalLink } from 'lucide-react'

// Mock package data
const packageData = {
  'math-core': {
    name: 'math-core',
    version: '2.1.0',
    description: 'Essential mathematical functions and algorithms for Easier language',
    longDescription: `
# Math Core

A comprehensive mathematical library for the Easier programming language, providing essential functions and algorithms for mathematical computations.

## Features

- **Advanced Calculus**: Derivatives, integrals, and series calculations
- **Linear Algebra**: Matrix operations, vector calculations, eigenvalues
- **Statistics**: Statistical functions, probability distributions
- **Number Theory**: Prime numbers, GCD, LCM, and modular arithmetic
- **Optimization**: Numerical optimization algorithms

## Installation

\`\`\`bash
easier install math-core
\`\`\`

## Usage

\`\`\`easier
PROGRAM MathExample {
    import "math-core";
    
    var x: real = 16.0;
    var result: real;
    
    // Square root
    result = MathCore.sqrt(x);
    SHOW("Square root of " + x + " = " + result);
    
    // Factorial
    result = MathCore.factorial(5);
    SHOW("5! = " + result);
    
    // GCD
    result = MathCore.gcd(48, 18);
    SHOW("GCD(48, 18) = " + result);
}
\`\`\`
    `,
    author: 'EasierHub Team',
    downloads: '45,234',
    likes: '1,234',
    repository: 'https://github.com/easierhub/math-core',
    homepage: 'https://easierhub.dev/packages/math-core',
    license: 'MIT',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-28',
    tags: ['mathematics', 'algorithms', 'calculus', 'statistics'],
    dependencies: {},
    versions: ['2.1.0', '2.0.3', '2.0.2', '2.0.1', '2.0.0', '1.9.1'],
    files: [
      { name: 'math-core.eas', size: '15.2 KB' },
      { name: 'algorithms.eas', size: '8.7 KB' },
      { name: 'constants.eas', size: '2.1 KB' },
      { name: 'README.md', size: '4.3 KB' },
      { name: 'LICENSE', size: '1.1 KB' }
    ]
  }
}

export default function PackagePage({ params }: { params: { name: string } }) {
  const [activeTab, setActiveTab] = useState('readme')
  const [selectedVersion, setSelectedVersion] = useState('2.1.0')
  const [copied, setCopied] = useState(false)
  
  const pkg = packageData[params.name as keyof typeof packageData]
  
  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Package Not Found</h1>
          <p className="text-muted-foreground mb-8">The package you're looking for doesn't exist.</p>
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const copyInstallCommand = async () => {
    await navigator.clipboard.writeText(`easier install ${pkg.name}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-primary rounded"></div>
            <span className="text-xl font-bold">EasierHub</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/login" className="btn btn-outline">
              Sign In
            </Link>
            <Link href="/publish" className="btn btn-primary">
              Publish
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/packages" className="hover:text-foreground">
            Packages
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{pkg.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Package Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold">{pkg.name}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">{pkg.downloads}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span className="text-sm">{pkg.likes}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xl text-muted-foreground mb-4">
                {pkg.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {pkg.tags.map(tag => (
                  <span key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Install Command */}
            <div className="bg-slate-900 text-white rounded-lg p-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Install command</div>
                  <code className="text-cyan-400">easier install {pkg.name}</code>
                </div>
                <button
                  onClick={copyInstallCommand}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'readme', label: 'README' },
                  { id: 'versions', label: 'Versions' },
                  { id: 'dependencies', label: 'Dependencies' },
                  { id: 'files', label: 'Files' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="prose prose-slate max-w-none">
              {activeTab === 'readme' && (
                <div className="whitespace-pre-wrap">
                  {pkg.longDescription}
                </div>
              )}
              
              {activeTab === 'versions' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Version History</h3>
                  <div className="space-y-3">
                    {pkg.versions.map(version => (
                      <div key={version} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <code className="bg-muted px-2 py-1 rounded text-sm">{version}</code>
                          {version === pkg.version && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              Latest
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Published 2 weeks ago
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'dependencies' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dependencies</h3>
                  {Object.keys(pkg.dependencies).length === 0 ? (
                    <p className="text-muted-foreground">This package has no dependencies.</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(pkg.dependencies).map(([name, version]) => (
                        <div key={name} className="flex items-center justify-between p-3 border rounded-lg">
                          <Link href={`/packages/${name}`} className="text-primary hover:underline">
                            {name}
                          </Link>
                          <code className="text-sm">{"version"}</code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'files' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Package Files</h3>
                  <div className="space-y-2">
                    {pkg.files.map(file => (
                      <div key={file.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-mono text-sm">{file.name}</span>
                        <span className="text-sm text-muted-foreground">{file.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Package Info */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Package Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <code className="bg-muted px-2 py-1 rounded">{pkg.version}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License</span>
                  <span>{pkg.license}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span>{new Date(pkg.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{new Date(pkg.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Author */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Author</h3>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                  {pkg.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{pkg.author}</div>
                  <div className="text-sm text-muted-foreground">Package maintainer</div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Links</h3>
              <div className="space-y-3">
                <a
                  href={pkg.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm hover:text-primary"
                >
                  <GitBranch className="h-4 w-4" />
                  <span>Repository</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={pkg.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Homepage</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Downloads</span>
                  </div>
                  <span className="font-medium">{pkg.downloads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Likes</span>
                  </div>
                  <span className="font-medium">{pkg.likes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
