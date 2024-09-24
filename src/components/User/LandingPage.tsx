import React from 'react'
import { Button } from '../ui/button'
import { NavLink } from 'react-router-dom'

function LandingPage() {
  return (
    <div className='flex justify-center items-center h-[500px] select-none'>
      <div className="">
        <h1 className='text-6xl text-center'>Credit App.</h1>
        <p className='pl-1 hidden md:block'>Get loans now, easily</p>
        <section className='text-center'>
          <div className="mt-24">
            <Button variant='default' className='text-xl'><NavLink to='/signup' className="p-2">Signup now</NavLink></Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LandingPage