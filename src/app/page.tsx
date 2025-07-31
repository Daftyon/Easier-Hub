'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Package, Download, Star, User, Copy, Check } from 'lucide-react'

// Mock data
const packages = [
  {
    id: 1,
    name: 'math-core',
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
    author: 'Security Team'
  },
  {
    id: 5,
    name: 'ml-toolkit',
    version: '2.0.3',
    description: 'Machine learning algorithms and statistical methods. Neural networks, regression models, and data analysis tools for Easier.',
    downloads: '31K',
    likes: '1.1K',
    author: 'ML Contributors'
  },
  {
    id: 6,
    name: 'web-framework',
    version: '1.8.0',
    description: 'Modern web development framework for Easier language. RESTful APIs, middleware, and database integration made simple.',
    downloads: '19K',
    likes: '543',
    author: 'Web Team'
  }
]

const categories = [
  { id: 1, name: 'Mathematics', icon: '🧮', count: 342 },
  { id: 2, name: 'Algorithms', icon: '🔍', count: 256 },
  { id: 3, name: 'Cryptography', icon: '🔐', count: 89 },
  { id: 4, name: 'AI & ML', icon: '🤖', count: 167 },
  { id: 5, name: 'Web Development', icon: '🌐', count: 134 },
  { id: 6, name: 'Data Science', icon: '📊', count: 198 }
]

const commands = [
  { title: 'Install a package', command: 'easier install math-core' },
  { title: 'Search packages', command: 'easier search algorithms' },
  { title: 'Publish package', command: 'easier publish' },
]

// Components
const Header = () => (
  <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <Package className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">EasierHub</span>
      </Link>
      
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="/packages" className="text-sm font-medium hover:text-primary">
          Packages
        </Link>
        <Link href="/docs" className="text-sm font-medium hover:text-primary">
          Docs
        </Link>
        <Link href="/community" className="text-sm font-medium hover:text-primary">
          Community
        </Link>
      </nav>

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
)

const Hero = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery)
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
      <div className="container py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          The Easier Package Repository
        </h1>
        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Discover, share, and use packages for the Easier programming language. 
          From mathematical algorithms to proof assistants.
        </p>
        
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search packages..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold">1</div>
            <div className="text-blue-200">Packages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">1</div>
            <div className="text-blue-200">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">1</div>
            <div className="text-blue-200">Publishers</div>
          </div>
        </div>
      </div>
    </section>
  )
}

const PackageCard = ({ pkg }: { pkg: typeof packages[0] }) => {
  const getBadgeClass = (badge?: string) => {
    switch (badge) {
      case 'trending': return 'badge-trending'
      case 'new': return 'badge-new'
      case 'popular': return 'badge-popular'
      default: return ''
    }
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <Link href={`/packages/${pkg.name}`} className="text-xl font-semibold hover:text-primary group-hover:text-primary">
          {pkg.name}
        </Link>
        <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm font-mono">
          v{pkg.version}
        </span>
      </div>
      
      {pkg.badge && (
        <span className={`badge ${getBadgeClass(pkg.badge)} mb-3`}>
          {pkg.badge}
        </span>
      )}
      
      <p className="text-muted-foreground mb-4 line-clamp-2">
        {pkg.description}
      </p>
      
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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

const CategoryCard = ({ category }: { category: typeof categories[0] }) => (
  <Link href={`/categories/${category.name.toLowerCase()}`}>
    <div className="card p-6 text-center hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div className="text-4xl mb-3">{category.icon}</div>
      <h3 className="font-semibold mb-2">{category.name}</h3>
      <p className="text-sm text-muted-foreground">{category.count} packages</p>
    </div>
  </Link>
)

const InstallSection = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <section className="bg-slate-900 text-white rounded-2xl p-8 my-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">🚀 Get Started with EasierHub</h2>
        <p className="text-slate-300">Install and manage packages for your Easier language projects</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {commands.map((cmd, index) => (
          <div key={index} className="bg-slate-800 rounded-lg p-4 relative">
            <div className="text-slate-400 text-sm mb-2">{cmd.title}</div>
            <div className="font-mono text-cyan-400">{cmd.command}</div>
            <button
              onClick={() => copyToClipboard(cmd.command, index)}
              className="absolute top-3 right-3 p-1 hover:bg-slate-700 rounded transition-colors"
            >
              {copiedIndex === index ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-slate-400" />
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

const Footer = () => (
  <footer className="bg-slate-900 text-white mt-20">
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4">EasierHub</h3>
          <ul className="space-y-2 text-slate-300">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
            <li><Link href="/api" className="hover:text-white">API</Link></li>
            <li><Link href="/status" className="hover:text-white">Status</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Community</h3>
          <ul className="space-y-2 text-slate-300">
            <li><Link href="/discord" className="hover:text-white">Discord</Link></li>
            <li><Link href="/github" className="hover:text-white">GitHub</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/newsletter" className="hover:text-white">Newsletter</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Developers</h3>
          <ul className="space-y-2 text-slate-300">
            <li><Link href="/publish" className="hover:text-white">Publishing Guide</Link></li>
            <li><Link href="/policies" className="hover:text-white">Policies</Link></li>
            <li><Link href="/security" className="hover:text-white">Security</Link></li>
            <li><Link href="/support" className="hover:text-white">Support</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Daftyon</h3>
          <ul className="space-y-2 text-slate-300">
            <li><Link href="/ecosystem" className="hover:text-white">Ecosystem</Link></li>
            <li><Link href="/easier-cli" className="hover:text-white">Easier CLI</Link></li>
            <li><Link href="/language" className="hover:text-white">Language Hub</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
        <p>&copy; 2025 EasierHub - Part of the Daftyon Ecosystem</p>
        <p>Created by Ahmed Hafdi • Made in Morocco 🇲🇦</p>
      </div>
    </div>
  </footer>
)

export default function HomePage() {
  const [filteredPackages, setFilteredPackages] = useState(packages)

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPackages(packages)
      return
    }
    
    const filtered = packages.filter(pkg => 
      pkg.name.toLowerCase().includes(query.toLowerCase()) ||
      pkg.description.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredPackages(filtered)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Hero onSearch={handleSearch} />
      
      <main className="container py-16">
        <InstallSection />
        
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">📂 Browse by Category</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">🏆 Most Popular Packages</h2>
            <Link href="/packages" className="text-primary hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
