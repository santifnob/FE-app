import InfiniteScroll from 'react-infinite-scroll-component'

export function CrudInfiniteScroll({
  items,
  fetchNextPage,
  hasNextPage,
  loaderText = 'Cargando...',
  endText = 'No hay más elementos',
  children
}) {
  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>{loaderText}</h4>}
      endMessage={<p className='text-center'>{endText}</p>}
      scrollThreshold={0.8}
      scrollableTarget='scrollableDiv'
    >
      {children}
    </InfiniteScroll>
  )
}