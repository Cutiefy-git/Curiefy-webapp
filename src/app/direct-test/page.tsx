'use client'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default function DirectTestPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function directTest() {
      try {
        console.log('🔥 Starting direct Firebase test...')
        
        // Test 0: Check environment variables
        console.log('🔍 Environment Variables:')
        console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
        console.log('API Key (first 10 chars):', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10))
        console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
        
        // Test 1: Raw collection reference
        console.log('📋 Testing raw collection reference...')
        const categoriesRef = collection(db, 'categories')
        console.log('✅ Collection reference created:', categoriesRef)
        
        // Test 2: Try different collection names
        console.log('📊 Testing different collection names...')
        
        const testCollections = ['categories', 'Categories', 'CATEGORIES']
        let finalDocs: any[] = []
        
        for (const collectionName of testCollections) {
          console.log(`🔍 Testing collection: "${collectionName}"`)
          const testRef = collection(db, collectionName)
          const testSnapshot = await getDocs(testRef)
          console.log(`📈 "${collectionName}" size:`, testSnapshot.size)
          
          if (testSnapshot.size > 0) {
            console.log(`✅ Found data in "${collectionName}"!`)
            testSnapshot.forEach((doc) => {
              const docData = { id: doc.id, data: doc.data() }
              console.log('📄 Document:', docData)
              finalDocs.push(docData)
            })
            break // Stop after finding data
          }
        }
        
        setResults(finalDocs)
        console.log('✅ Final results:', finalDocs)
        
      } catch (err: any) {
        console.error('❌ Direct test error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    directTest()
  }, [])

  if (loading) {
    return (
      <div className="p-8 bg-cutie-bg min-h-screen">
        <h1 className="text-3xl font-elegant mb-6">🔥 Direct Firebase Test</h1>
        <div className="bg-white p-6 rounded-lg">
          <p className="text-lg">Testing direct Firebase connection...</p>
          <p className="text-sm text-gray-600 mt-2">Check console (F12) for detailed logs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-cutie-bg min-h-screen">
      <h1 className="text-3xl font-elegant mb-6">🔥 Direct Firebase Test Results</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Results:</h2>
        <p className="mb-4"><strong>Documents found:</strong> {results.length}</p>
        
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded">
                <h3 className="font-bold">Document {index + 1}:</h3>
                <p><strong>ID:</strong> {result.id}</p>
                <p><strong>Data:</strong></p>
                <pre className="bg-gray-200 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded">
            <p>❌ No documents found! This means there's a connection or permissions issue.</p>
          </div>
        )}
      </div>
      
      <div className="space-x-4">
        <a href="/shop" className="btn-primary inline-block px-6 py-3 no-underline">
          Test Shop Again
        </a>
        <a href="/simple-test" className="btn-secondary inline-block px-6 py-3 no-underline">
          Firebase Connection Test
        </a>
      </div>
    </div>
  )
}