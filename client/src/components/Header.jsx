import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
const defaultAvatar = 'https://firebasestorage.googleapis.com/v0/b/upload-img-plagin.appspot.com/o/avatars%2Fvector-users-icon.jpg?alt=media&token=f2bb9718-e195-40d3-9bd4-c7df3ad297c4&_gl=1*c978vh*_ga*MjEyMDc2NTUwNS4xNjkzMDY1NzEx*_ga_CW55HF8NVT*MTY5NzgyMTM0My4xMC4xLjE2OTc4MjU4NTMuNDkuMC4w'


export default function Header() {
    const {currentUser} = useSelector(state => state.user)
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to="/">
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-slate-500'>You</span>
                    <span className='text-slate-700'>Rent</span>
                </h1>
            </Link>
            <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
                <input type="text" placeholder='Search...' 
                className='bg-transparent focus:outline-none w-24 sm:w-64'/>
                <FaSearch className='text-slate-700' />
            </form>
            <ul className='flex gap-4'>
                <Link to="/">
                    <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to="/about">
                    <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
                  
                {currentUser
                ? (
                    <Link to="/profile">
                              <li className=' sm:inline text-slate-700 hover:underline'>
                                  <img src={currentUser.avatar || defaultAvatar} alt=""  className='rounded-full h-7 w-7 object-cover cursor-pointer self-center '/>
                        </li>
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
    </header>
  )
}
