import React from 'react';
import styles from './Select.module.css';

import searchIcon from '../../assets/icons/codicon--search.png';
import closeIcon from '../../assets/icons/close-fill.png'

import List from './List/List';
import Tabs from './Tabs/Tabs';

import { type Option } from './types';
import Fuse from 'fuse.js';


type Props = {
  options: Option[],
  onChange: (value: string) => void;
  toggleFavorite: (id: string) => void;
}

const Select = ({ options, onChange, toggleFavorite }: Props) => {

  const [optionList, setOptionList] = React.useState<Props['options']>(options)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')
  const [category, setCategory] = React.useState('All coins')

  const parentRef = React.useRef<HTMLDivElement| null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const listPosition = React.useRef<'center' | 'right' | 'left'>('center')

  React.useEffect(() => {
    const setFilteredOptions = (value: string, category: string) => {
      const fuseOptions = {
        keys: ['value'],
        threshold: 0
      }
      const fuse = new Fuse(options, fuseOptions)
      const data = value ? fuse.search(value).map(el => el.item) : options
      setOptionList(category === 'Favorites' ? data.filter(el => el.favorite) : data )
    }
    setFilteredOptions(searchValue, category)
  },[searchValue, category, options])

  React.useLayoutEffect(() => {
    const displayWidth = window.innerWidth
    if(parentRef.current){
      const { left, width } = parentRef.current.getBoundingClientRect()
      const center = left + width/2
      center > 2 * displayWidth / 3 ? listPosition.current = 'right' :
      center > displayWidth / 3 ? listPosition.current = 'center' :
      listPosition.current = 'left'
    }
  },[])

  React.useEffect(()=>{
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if(parentRef.current && !parentRef.current.contains(target)){

        setIsMenuOpen(false)
      }
    }
    isMenuOpen && window.addEventListener('click', handleOutsideClick)
    inputRef.current?.focus()

    return () => window.removeEventListener('click', handleOutsideClick)
  },[isMenuOpen])

  const togleMenu = () =>{
    //console.log('toggle')
    setIsMenuOpen(prev => !prev)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleClearInput = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSearchValue('')
  }

  const handleSelectValue = (value: string) => {
    onChange(value)
    setIsMenuOpen(false)
  }

  const handleChangeCategory = (category: string) => {
    setCategory(category)
  }


  return (
    <div className={styles.wrapper} ref={parentRef}>
      <button
        type='button'
        tabIndex={0}
        className={isMenuOpen ? `${styles.btn} ${styles['btn_active']}` :styles.btn}
        onClick={togleMenu}
      >
        <img src={searchIcon} alt="" width={24} height={24} />
        <span>Search</span>
      </button>
      {isMenuOpen &&
      <div
        className={`${styles.menu} ${styles[`align-${listPosition.current}`]}`}
      >
        <div className={styles.search}>
          <img src={searchIcon} alt="" width={24} height={24} />
          <input
            tabIndex={0}
            ref={inputRef}
            type='text'
            value={searchValue}
            onChange={handleInputChange}
            placeholder='Search...'
          />
          {searchValue &&
            <img
              src={closeIcon}
              alt=""
              width={18}
              height={18}
              onClick={handleClearInput}
            />
          }
        </div>
        <Tabs value={category} onChange={handleChangeCategory} />
        <List
          options={optionList}
          handleSelectValue={handleSelectValue}
          handleClose={() => setIsMenuOpen(false)}
          toggleFavorite={toggleFavorite}
        />
      </div>}
    </div>
  )
}

export default Select