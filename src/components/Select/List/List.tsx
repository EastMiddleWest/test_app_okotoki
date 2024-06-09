import React from 'react'
import styles from './List.module.css';

import starIcon from '../../../assets/icons/codicon--star-empty.png';
import starFilledIcon from '../../../assets/icons/codicon--star-full.png';

import { type Option } from '../types'
import { useVirtualList } from '../../../hooks/useVirtualList';

type Props = {
  options: Option[],
  handleSelectValue: (value: string) => void;
  handleClose: () => void;
  toggleFavorite: (id: string) => void;
  itemHeight?: number;
  itemsCount?: number;
  reserve?: number;
}

const List = ({
    options,
    handleSelectValue,
    handleClose,
    toggleFavorite,
    itemHeight = 40,
    itemsCount = 5,
    reserve = 3
  }: Props) => {

  const containerHeight = itemHeight * itemsCount
  const totalHeight = itemHeight * options.length

  const listRef = React.useRef<HTMLDivElement| null>(null)
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(0)

  const selectOption = (index: number) => {
    setSelectedOptionIndex(index)
  }

  const { currentDataRange, firstVisibleIndex, lastVisibleIndex} = useVirtualList({
    itemHeight,
    containerHeight,
    reserve,
    listData: options,
    containerRef: listRef.current
  })

  React.useEffect(()=>{
    const onKeyPress = (e: KeyboardEvent) => {
      const { key } = e
      switch (key) {
        case 'Escape':
          e.preventDefault()
          handleClose()
          break;
        case 'Enter':
          e.preventDefault()
          handleSelectValue(options[selectedOptionIndex].value)
          break;
        case 'ArrowUp':{
          const nextIndex = selectedOptionIndex === 0 ? options.length - 1 : selectedOptionIndex - 1
          setSelectedOptionIndex(nextIndex)
          if(listRef.current){
            if(nextIndex === options.length - 1){
              listRef.current.scrollTo({top: totalHeight, behavior: 'instant'})
            }
            else if(nextIndex < firstVisibleIndex){
              listRef.current.scrollBy({top: -40, behavior: 'smooth'})
            }
          }
        }
          break;
        case 'ArrowDown':{
          const nextIndex = selectedOptionIndex === options.length - 1 ? 0 : selectedOptionIndex + 1
          setSelectedOptionIndex(nextIndex)
          if(listRef.current){
            if(nextIndex === 0){
              listRef.current.scrollTo({top: 0, behavior: 'instant'})
            }
            else if(nextIndex >= lastVisibleIndex){
              listRef.current.scrollBy({top: 40, behavior: 'smooth'})
            }
          }
        }
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', onKeyPress)

    return () => window.removeEventListener('keydown', onKeyPress)

  },[options, handleSelectValue, selectedOptionIndex, firstVisibleIndex, lastVisibleIndex, totalHeight, handleClose])


  return (
    <div
      ref={listRef}
      className={styles.list}
      style={{
        height: containerHeight
      }}
      >
      <ul
        style={{
          minHeight: totalHeight,
          width: '100%',
          position: 'relative'
        }}
        >
      {currentDataRange.map((virtualItem) =>{
        const item = options[virtualItem.index]
        return(
        <li
          key={item.id}
          style={{
            height: itemHeight,
            transform: `translateY(${virtualItem.offsetTop}px)`
          }}
          onMouseEnter={() => selectOption(virtualItem.index)}
          className={virtualItem.index === selectedOptionIndex ? `${styles.selected} ${styles.item}` : `${styles.item}`}
        >
          <img
            src={item.favorite ? starFilledIcon : starIcon}
            alt=""
            width={18}
            height={18}
            onClick={()=> toggleFavorite(item.id)}
          />
          <span
            onClick={() => handleSelectValue(options[selectedOptionIndex].value)}
          >
            {item.value}
          </span>
        </li>)
        })}
        </ul>
    </div>
  )
}

export default List