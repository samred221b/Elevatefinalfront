
export default function TestApp() {
  console.log('🧪 TestApp rendering...');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>🎉 App is Working!</h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          This is a test component to verify React is rendering properly.
        </p>
        <button 
          onClick={() => window.location.href = window.location.origin}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
