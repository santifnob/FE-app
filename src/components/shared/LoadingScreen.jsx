export function LoadingScreen({
  title = 'Cargando...',
  subtitle = 'Un momento por favor',
  className = ''
}) {
  return (
    <div className={`d-flex align-items-center justify-content-center vh-100 ${className}`}>
      <div className='text-center'>
        <div className='spinner-border text-primary mb-3' role='status'>
          <span className='visually-hidden'>Cargando...</span>
        </div>
        <p className='mb-0 fw-semibold'>{title}</p>
        <small className='text-muted'>{subtitle}</small>
      </div>
    </div>
  )
}
