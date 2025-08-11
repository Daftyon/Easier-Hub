import { packageReader } from "@/lib/packageReader"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { packageName: string } }
) {
  try {
    const packageName = params.packageName
    const packages = await packageReader.readAllPackages()
    const pkg = packages.find(p => p.name === packageName)
    
    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(pkg)
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 }
    )
  }
}
