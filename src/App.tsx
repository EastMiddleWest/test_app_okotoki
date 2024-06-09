import React from 'react';
import './App.css'

import Select from './components/Select/Select'
import optionsData from './utils/coins.json';

const options = optionsData.map(el => ({
  id: el,
  value: el,
  favorite: false
}))


function App() {

  const [data, setData] = React.useState(options)
  const [value, setValue] = React.useState('')

  const setSelectedValue = (value: string) => {
    setValue(value)
  }

  const addToFavorite = (id: string) => {
    const element = options.find(el => el.id === id)
    if(element){
      element.favorite = !element.favorite
      setData([...options])
    }
  }

  const [position, setPosition] = React.useState<'center' | 'right' | 'left'>('left')
  const [mount, setMount] = React.useState(true)

  React.useEffect(() => {
    setMount(true)
  },[position])

  const togglePosition = () => {
    setMount(false)
    setPosition(prev => {
      return prev === 'left' ? 'center' : prev === 'center' ? 'right' : 'left'
    })
  }

  return (
    <main>
      <div className='control'>
        <h2>Selected value: {value}</h2>
        <div>
          <span>Position: </span>
          <button onClick={togglePosition} >{position}</button>
        </div>
      </div>
      <div className={`container align-${position}`}>
        {mount &&
        <Select
          options={data}
          onChange={setSelectedValue}
          toggleFavorite={addToFavorite}
        />}
      </div>
    </main>
  )
}

export default App
