import React, { useState } from 'react'
import '../style/Updater.css'
import useInterval from '@use-it/interval';
import { Header } from 'semantic-ui-react';
import { ApplicationState } from '../store';
import { useSelector } from 'react-redux';

type UpdaterProps = {}

export const Updater: React.FC<UpdaterProps> = () => {

  const [progress, setProgress] = useState(-1)

  useInterval(() => {
    setProgress((progress + 1) % 3)
  }, 500)

  const pref = useSelector(
    (state: ApplicationState) => state.preferences
  )

  return (
    <div className='Updater'>
      <Header as='h2' inverted className='Header'>Nadogradnja u toku...</Header>
      <div className='DotsArray'>
        <div className={progress === 0 ? 'Dot' : 'Dot dark'} />
        <div className={progress === 1 ? 'Dot' : 'Dot dark'} />
        <div className={progress === 2 ? 'Dot' : 'Dot dark'} />
      </div>
    </div>
  )
  
}

export default Updater