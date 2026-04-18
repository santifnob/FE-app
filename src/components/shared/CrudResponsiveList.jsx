export function CrudResponsiveList({ desktop, mobile }) {
  return (
    <>
      <div className='d-none d-md-block'>
        {desktop}
      </div>

      <div className='d-md-none'>
        {mobile}
      </div>
    </>
  )
}