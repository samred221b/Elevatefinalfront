import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react'

export function ApiDebugger() {
  const [results, setResults] = useState<any>({})
  const [testing, setTesting] = useState(false)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const testEndpoints = async () => {
    setTesting(true)
    const endpoints = [
      { name: 'Health Check', url: `${apiUrl}/health`, method: 'GET' },
      { name: 'Auth Login', url: `${apiUrl}/auth/login`, method: 'POST' }
    ]

    const testResults: any = {}

    for (const endpoint of endpoints) {
      try {
        console.log(`Testing ${endpoint.name}: ${endpoint.url}`)
        
        const options: RequestInit = {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
          },
        }

        if (endpoint.method === 'POST') {
          options.body = JSON.stringify({
            email: 'test@test.com',
            password: 'testpass'
          })
        }

        const response = await fetch(endpoint.url, options)
        
        testResults[endpoint.name] = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          url: endpoint.url,
          headers: Object.fromEntries(response.headers.entries())
        }

        if (response.ok) {
          try {
            const data = await response.json()
            testResults[endpoint.name].data = data
          } catch (e) {
            testResults[endpoint.name].data = 'Non-JSON response'
          }
        } else {
          try {
            const errorText = await response.text()
            testResults[endpoint.name].error = errorText
          } catch (e) {
            testResults[endpoint.name].error = 'Could not read error'
          }
        }
      } catch (error) {
        testResults[endpoint.name] = {
          error: error instanceof Error ? error.message : 'Unknown error',
          url: endpoint.url
        }
      }
    }

    setResults(testResults)
    setTesting(false)
  }

  const getStatusIcon = (result: any) => {
    if (!result) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    if (result.ok) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (result.status) return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    return <XCircle className="w-4 h-4 text-red-500" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Endpoint Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Current API URL:</p>
          <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
            {apiUrl}
          </p>
        </div>

        <Button onClick={testEndpoints} disabled={testing} className="w-full">
          {testing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Test API Endpoints
        </Button>

        {Object.keys(results).length > 0 && (
          <div className="space-y-3">
            {Object.entries(results).map(([name, result]: [string, any]) => (
              <div key={name} className="border rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(result)}
                  <span className="font-medium">{name}</span>
                </div>
                
                <div className="text-sm space-y-1">
                  <p><strong>URL:</strong> {result.url}</p>
                  {result.status && <p><strong>Status:</strong> {result.status} {result.statusText}</p>}
                  {result.error && (
                    <p className="text-red-600"><strong>Error:</strong> {result.error}</p>
                  )}
                  {result.data && (
                    <details>
                      <summary className="cursor-pointer text-blue-600">Response Data</summary>
                      <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Debug Info:</p>
          <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
            <li>• Health check should return status 200</li>
            <li>• Login endpoint should return 400 (bad credentials) or 401</li>
            <li>• 404 means the endpoint doesn't exist</li>
            <li>• Network errors mean backend is not accessible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
