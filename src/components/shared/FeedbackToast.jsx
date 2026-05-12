export function FeedbackToast ({ toast, onClose }) {
  if (!toast) return null

  return (
    <div className='position-fixed top-0 end-0 p-3' style={{ zIndex: 2000 }}>
      <div className={`toast show align-items-center text-bg-${toast.variant} border-0`} role='alert' aria-live='assertive' aria-atomic='true'>
        <div className='d-flex'>
          <div className='toast-body'>
            {toast.title && <strong className='me-2'>{toast.title}</strong>}
            {toast.message}
          </div>
          <button type='button' className='btn-close btn-close-white me-2 m-auto' onClick={onClose} />
        </div>
      </div>
    </div>
  )
}
