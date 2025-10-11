import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

export function ApiHealthCheck() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [apiUrl, setApiUrl] = useState('')

  const checkHealth = async () => {
    setStatus('loading')
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    setApiUrl(baseUrl)
    
    try {
      console.log('🔍 Checking API health at:', `${baseUrl}/health`)
      
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('📡 Health check response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Health check data:', data)
        setStatus('success')
        setMessage(data.message || 'API is healthy')
      } else {
        console.error('❌ Health check failed with status:', response.status)
        setStatus('error')
        setMessage(`API returned status ${response.status}`)
      }
    } catch (error) {
      console.error('💥 Health check error:', error)
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to connect to API')
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'border-blue-500/50'
      case 'success':
        return 'border-green-500/50'
      case 'error':
        return 'border-red-500/50'
    }
  }

  return (
    <Card className={`${getStatusColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          API Health Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">API URL:</p>
          <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
            {apiUrl}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Status:</p>
          <p className={`font-medium ${
            status === 'success' ? 'text-green-600' : 
            status === 'error' ? 'text-red-600' : 
            'text-blue-600'
          }`}>
            {message}
          </p>
        </div>

        <Button 
          onClick={checkHealth} 
          disabled={status === 'loading'}
          className="w-full"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${status === 'loading' ? 'animate-spin' : ''}`} />
          Refresh Health Check
        </Button>

        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium">Troubleshooting Tips:</p>
            <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
              <li>• Check if the backend server is running</li>
              <li>• Verify the VITE_API_URL environment variable</li>
              <li>• Check for CORS issues in browser console</li>
              <li>• Ensure the backend is accessible at the URL above</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
