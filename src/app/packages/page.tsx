'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Package, 
  Download, 
  Star, 
  User, 
  Home,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'

// Simple mock data to get started
const packages = [
  {
    id: 1,
    name: 'math-utils',
    version: '2.1.0',
    description: 'Essential mathematical functions and algorithms for Easier language. Includes advanced calculus, linear algebra, and statistical operations.',
    downloads: '45K',
    likes: '1.2K',
    author: 'EasierHub Team',
    badge: 'popular'
  },
  {
    id: 2,
    name: 'proof-assistant',
    version: '1.0.0-beta',
    description: 'Formal verification and theorem proving tools for mathematical reasoning. AI-powered proof assistance and automated verification.',
    downloads: '12K',
    likes: '892',
    author: 'Ahmed Hafdi',
    badge: 'new'
  },
  {
    id: 3,
    name: 'algorithms-std',
    version: '3.2.1',
    description: 'Standard algorithm implementations: sorting, searching, graph algorithms, and data structures optimized for Easier language.',
    downloads: '38K',
    likes: '956',
    author: 'Algorithm Contributors',
    badge: 'trending'
  },
  {
    id: 4,
    name: 'crypto-lib',
    version: '1.5.2',
    description: 'Cryptographic functions and security utilities. RSA, AES, hash functions, and digital signatures with formal verification support.',
    downloads: '23K',
    likes: '667',
    author: 'Security Team',
    badge: ''
  },
  {
    id: 5,
    name: 'ml-toolkit',
    version: '2.0.3',
    description: 'Machine learning algorithms and statistical methods. Neural networks, regression models, and data analysis tools for Easier.',
    downloads: '31K',
    likes: '1.1K',
    author: 'ML Contributors',
    badge: ''
  },
  {
    id: 6,
    name: 'web-framework',
    version: '1.8.0',
    description: 'Modern web development framework for Easier language. RESTful APIs, middleware, and database integration made simple.',
    downloads: '19K',
    likes: '543',
    author: 'Web Team',
    badge: ''
  }
]

const PackageCard = ({ pkg }: { pkg: typeof packages[0] }) => {
  const getBadgeClass = (badge: string) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full"
    
    switch (badge) {
      case 'trending': return `${baseClasses} bg-orange-500/20 text-orange-400 border border-orange-500/30`
      case 'new': return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`
      case 'popular': return `${baseClasses} bg-purple-500/20 text-purple-400 border border-purple-500/30`
      default: return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`
    }
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group backdrop-blur-sm">
      <div className="flex justify-between items-start mb-4">
        <Link 
          href={`/packages/${pkg.name}`} 
          className="text-xl font-semibold text-white hover:text-blue-400 group-hover:text-blue-400 transition-colors"
        >
          {pkg.name}
        </Link>
        <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-lg text-sm font-mono border border-gray-600/50">
          v{pkg.version}
        </span>
      </div>
      
      {pkg.badge && (
        <div className="mb-3">
          <span className={getBadgeClass(pkg.badge)}>
            {pkg.badge}
          </span>
        </div>
      )}
      
      <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
        {pkg.description}
      </p>
      
      <div className="flex items-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-1">
          <Download className="h-4 w-4" />
          <span>{pkg.downloads}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4" />
          <span>{pkg.likes}</span>
        </div>
        <div className="flex items-center space-x-1">
          <User className="h-4 w-4" />
          <span className="truncate">{pkg.author}</span>
        </div>
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
        <Link href="/packages" className="text-sm font-medium text-blue-400 border-b-2 border-blue-500 pb-4">
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

export default function PackagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPackages, setFilteredPackages] = useState(packages)

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPackages(packages)
      return
    }
    
    const filtered = packages.filter(pkg => 
      pkg.name.toLowerCase().includes(query.toLowerCase()) ||
      pkg.description.toLowerCase().includes(query.toLowerCase()) ||
      pkg.author.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredPackages(filtered)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />
      
      {/* Breadcrumb and Title */}
      <div className="bg-gray-900/50 border-b border-gray-800/50 backdrop-blur">
        <div className="container py-8 px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-blue-400 flex items-center space-x-1 transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Packages</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center space-x-3">
                <span className="text-5xl">📦</span>
                <span>Package Repository</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Explore {packages.length} packages for the Easier programming language
              </p>
            </div>
            
            <Link 
              href="/"
              className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="container py-8 px-4">
        {/* Search Section */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 mb-8 backdrop-blur">
          <h2 className="text-lg font-semibold mb-4 text-white flex items-center space-x-2">
            <span>🔍</span>
            <span>Search Packages</span>
          </h2>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search packages..."
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-colors"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                handleSearch(e.target.value)
              }}
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-300">
            Showing {filteredPackages.length} of {packages.length} packages
            {searchQuery && <span className="text-blue-400"> for "{searchQuery}"</span>}
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No packages found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? `No packages match "${searchQuery}". Try adjusting your search terms.`
                : 'No packages available.'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilteredPackages(packages)
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}

        {/* Notice about local packages */}
        {/* <div className="mt-12 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center space-x-2">
            <span>🏗️</span>
            <span>Development Notice</span>
          </h3>
          <p className="text-blue-300 mb-4">
            This is currently showing demo packages. To enable local package reading from your 
            <code className="bg-blue-500/20 px-2 py-1 rounded font-mono text-blue-200">easier-packages</code> folder, 
            you need to:
          </p>
          <ol className="list-decimal list-inside text-blue-300 space-y-1 text-sm">
            <li>Create the <code className="bg-blue-500/20 px-1 rounded text-blue-200">lib/packageReader.ts</code> file</li>
            <li>Add the API routes in <code className="bg-blue-500/20 px-1 rounded text-blue-200">app/api/packages/</code></li>
            <li>Create the <code className="bg-blue-500/20 px-1 rounded text-blue-200">easier-packages/</code> directory with .el files</li>
            <li>Restart your development server</li>
          </ol>
        </div> */}
      </main>
    </div>
  )
}
