import React from 'react'

type InitArguments = {
  itemHeight : number;
  containerHeight: number;
  reserve: number;
  listData: unknown[];
  containerRef: HTMLElement | null;
}

export const useVirtualList = ({ itemHeight, containerHeight, reserve, listData, containerRef}: InitArguments) => {

  const [scrollTop, setScrollTop] = React.useState(0)

  React.useLayoutEffect(()=>{
    if(!containerRef) {
      return
    }
    const handleScroll = () => {
      const scroll = containerRef.scrollTop
      setScrollTop(scroll)
    }
    handleScroll()
    containerRef.addEventListener('scroll', handleScroll)
    return () => containerRef.removeEventListener('scroll', handleScroll)
  },[containerRef])

  const {currentDataRange, firstVisibleIndex, lastVisibleIndex} = React.useMemo(()=>{
    const rangeStart = scrollTop
    const rangeEnd = scrollTop + containerHeight
    const firstVisibleIndex = Math.floor(rangeStart / itemHeight)
    const lastVisibleIndex = Math.ceil(rangeEnd / itemHeight)
    const firstIndex = Math.max(0, firstVisibleIndex - reserve)
    const lastIndex = Math.min(listData.length-1, lastVisibleIndex + reserve)

    const currentDataRange = []
    for(let index = firstIndex; index <= lastIndex; index++){
      currentDataRange.push({
        index,
        offsetTop: index * itemHeight
      })
    }
    return {currentDataRange, firstVisibleIndex, lastVisibleIndex}
  },[scrollTop, containerHeight, listData.length, itemHeight, reserve])

  return { currentDataRange, firstVisibleIndex,  lastVisibleIndex}
}