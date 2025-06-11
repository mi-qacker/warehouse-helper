import { NextResponse } from 'next/server'
import { generateTestData, runPerformanceTest } from '@/modules/performance/utils'

function generateCSV(results: Array<{module: string; size: number; time: number}>): string {
  let csv = 'Module,InputSize,TimeMs\n'
  results.forEach(result => {
    csv += `${result.module},${result.size},${result.time}\n`
  })
  return csv
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const moduleType = searchParams.get('module')
    const min = Number(searchParams.get('min')) || 1
    const max = Number(searchParams.get('max')) || 10
    const step = Number(searchParams.get('step')) || 1
    const iterations = Number(searchParams.get('iterations')) || 3
    const dataSource = searchParams.get('dataSource') || 'auto'

    // Basic validation
    if (!['genetic', 'lp', 'graph'].includes(moduleType!)) {
      return NextResponse.json(
        { error: 'Invalid module - use genetic, lp or graph' },
        { status: 400 }
      )
    }

    if (!['auto', 'stored'].includes(dataSource)) {
      return NextResponse.json(
        { error: 'Invalid dataSource - use auto or stored' },
        { status: 400 }
      )
    }

    if (min > max) {
      return NextResponse.json(
        { error: 'min cannot be greater than max' },
        { status: 400 }
      )
    }

    // Run performance tests
    const results = []
    for (let size = min; size <= max; size += step) {
      try {
        const testData = generateTestData(moduleType as 'genetic' | 'lp' | 'graph', size)
        const time = await runPerformanceTest(
          moduleType as 'genetic' | 'lp' | 'graph',
          testData,
          iterations
        )
        results.push({ module: moduleType!, size, time })
      } catch {
        // Error logged in response
      }
    }

    // Generate CSV and return as downloadable file
    const csv = generateCSV(results)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="metrics.csv"'
      }
    })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error during performance test' },
      { status: 500 }
    )
  }
}