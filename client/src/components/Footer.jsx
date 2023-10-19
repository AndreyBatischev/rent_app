import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function Footer() {
    const {currentUser} = useSelector(state => state.user)
  return (
    <footer className='bg-slate-200 shadow-md absolute inset-x-0 bottom-0'>
        <div className='flex  justify-between items-start  max-w-6xl mx-auto p-3'>
            <Link to="/">
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-slate-500'>You</span>
                    <span className='text-slate-700'>Rent</span>
                </h1>
            </Link>
            
            <ul className='flex   gap-4'>
                <Link to="/">
                    <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to="/about">
                    <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
                  
                {currentUser
                ? (
                    <Link to="/profile">
                        <li className=' sm:inline text-slate-700 hover:underline'>Profile</li>
                    </Link>
                  )
                : (
                    <Link to="/sign-in">
                        <li className = ' sm:inline text-slate-700 hover:underline'>Sign in</li>
                    </Link>
                  )
                }
                    
                
            </ul>
        </div>
    </footer>
  )
}
