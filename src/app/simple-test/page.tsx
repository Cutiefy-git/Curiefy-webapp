'use client'
import { useEffect, useState } from 'react'

export default function SimpleTestPage() {
  const [status, setStatus] = useState('🔄 Testing Firebase...')
  const [details, setDetails] = useState<string[]>([])

  useEffect(() => {
    async function testFirebase() {
      const testDetails: string[] = []
      
      try {
        // Test environment variables
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        
        if (!apiKey || !projectId) {
          throw new Error('Environment variables missing')
        }
        
        testDetails.push(`✅ Environment variables loaded`)
        testDetails.push(`📝 Project ID: ${projectId}`)
        
        // Test Firebase imports
        const { app, db, auth } = await import('../../lib/firebase')
        testDetails.push(`✅ Firebase modules imported successfully`)
        
        // Test Firestore connection
        const { collection, getDocs } = await import('firebase/firestore')
        const categoriesRef = collection(db, 'categories')
        const snapshot = await getDocs(categoriesRef)
        
        testDetails.push(`✅ Firestore connected successfully`)
        testDetails.push(`📊 Found ${snapshot.size} categories`)
        
        setStatus('🎉 Firebase is working perfectly!')
        setDetails(testDetails)
        
      } catch (error: any) {
        setStatus('❌ Firebase connection failed')
        testDetails.push(`❌ Error: ${error.message}`)
        setDetails(testDetails)
      }
    }

    testFirebase()
  }, [])

  return (
    <div className="min-h-screen bg-cutie-bg p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-elegant mb-6 text-cutie-charcoal text-center">
            Firebase Connection Test
          </h1>
          
          <div className="text-center mb-6">
            <div className="text-2xl mb-4">{status}</div>
          </div>
          
          <div className="space-y-3">
            {details.map((detail, index) => (
              <div 
                key={index} 
                className="bg-cutie-bg p-3 rounded-lg font-elegant text-cutie-charcoal"
              >
                {detail}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <a 
              href="/"
              className="btn-primary inline-block text-lg font-elegant px-8 py-3 no-underline"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}