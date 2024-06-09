import React from 'react'
import styles from './Tabs.module.css';
import starIcon from '../../../assets/icons/codicon--star-full.png'

type Props = {
  value: string;
  onChange: (value: string) => void
}

const Tabs = ({ value, onChange}: Props) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={styles['tab-container']}>
      <label className={styles['tab-item']}>
        <img src={starIcon} alt="" width={18} height={18} />
        <span>Favorites</span>
        <input
          type='radio'
          name='category'
          value='Favorites'
          checked={value === 'Favorites'}
          onChange={handleChange}
        />
      </label>
      <label className={styles['tab-item']}>
        <span>All coins</span>
        <input
          type='radio'
          name='category'
          value='All coins'
          checked={value === 'All coins'}
          onChange={handleChange}
        />
      </label>
    </div>
  )
}

export default Tabs