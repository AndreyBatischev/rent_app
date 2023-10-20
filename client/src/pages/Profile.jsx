import {useRef,useState, useEffect} from 'react'
import { useSelector  } from 'react-redux'
import {getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage'
import {app} from '../firebase.js'

const defaultAvatar = 'https://firebasestorage.googleapis.com/v0/b/upload-img-plagin.appspot.com/o/avatars%2Fvector-users-icon.jpg?alt=media&token=f2bb9718-e195-40d3-9bd4-c7df3ad297c4&_gl=1*c978vh*_ga*MjEyMDc2NTUwNS4xNjkzMDY1NzEx*_ga_CW55HF8NVT*MTY5NzgyMTM0My4xMC4xLjE2OTc4MjU4NTMuNDkuMC4w'

export default function Profile() {
  const { currentUser } = useSelector(state => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})

  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, `avatars/${fileName}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      // console.log('Upload is ' + progress + '% done');
      setFilePerc(Math.round(progress))
    },
      
    (error) => {
      setFileUploadError(true)
      },
    
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
      setFormData({ ...formData, avatar: downloadURL}))
    }
    );
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef } hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || defaultAvatar || currentUser.avatar} alt="User avatar"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 p-3'
        />
        
        <p className='text-center text-sm'>
          {fileUploadError
            ? <span className='text-red-700'>Error image upload</span>
            : filePerc > 0 && filePerc < 100
              ? (<span className='text-slate-700'>Uploading {filePerc}%</span>)
              : filePerc === 100
                ? <span className='text-green-700'>Image uploaded!</span>
                : ''
          }
        </p>
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg' />
        <input type="text" placeholder='email' id='email' className='border p-3 rounded-lg' />
        <input type="text" placeholder='password' id='password' className='border p-3 rounded-lg' />

        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}
