import { useNavigate } from 'react-router-dom'

export function EnConstruccion () {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      color: '#333',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🚧 Página en Construcción 🚧</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
        Estamos trabajando para mejorar tu experiencia.
        Vuelve más tarde.
      </p>
      <button
        onClick={goHome}
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Ir al inicio
      </button>
    </div>
  )
}
