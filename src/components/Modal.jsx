export function Modal ({ children, onClose, title }) {
  return (
    <div
      className='modal fade show d-block'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
    >
      <div className='modal-dialog modal-dialog-centered modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{title}</h5>
            <button
              type='button'
              className='btn-close'
              onClick={onClose}
            />
          </div>
          <div className='modal-body'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
