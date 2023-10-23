import { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
	getStorage,
	uploadBytesResumable,
	ref,
	getDownloadURL,
} from 'firebase/storage'
import { app } from '../firebase.js'
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signOutUserStart,
	signOutUserFailure,
	signOutUserSuccess,
} from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const defaultAvatar =
	'https://firebasestorage.googleapis.com/v0/b/upload-img-plagin.appspot.com/o/avatars%2Fvector-users-icon.jpg?alt=media&token=f2bb9718-e195-40d3-9bd4-c7df3ad297c4&_gl=1*c978vh*_ga*MjEyMDc2NTUwNS4xNjkzMDY1NzEx*_ga_CW55HF8NVT*MTY5NzgyMTM0My4xMC4xLjE2OTc4MjU4NTMuNDkuMC4w'

export default function Profile() {
	const { currentUser, loading, error } = useSelector((state) => state.user)
	const fileRef = useRef(null)
	const [file, setFile] = useState(undefined)
	const [filePerc, setFilePerc] = useState(0)
	const [fileUploadError, setFileUploadError] = useState(false)
	const [formData, setFormData] = useState({})
	const [updateSuccess, setUpdateSuccess] = useState(false)
	const [showListingError, setShowListingError] = useState(false)
	const [userListing, setUserListing] = useState(false)

	const dispatch = useDispatch()

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

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				setFilePerc(Math.round(progress))
			},

			(error) => {
				setFileUploadError(true)
			},

			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setFormData({ ...formData, avatar: downloadURL }),
				)
			},
		)
	}

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			dispatch(updateUserStart())
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: 'Post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})

			const data = await res.json()
			if (data.success === false) {
				dispatch(updateUserFailure(data.message))
				return
			}
			dispatch(updateUserSuccess(data))
			setUpdateSuccess(true)
		} catch (error) {
			dispatch(updateUserFailure(error.message))
		}
	}

	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart())
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: 'DELETE',
			})

			const data = await res.json()
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message))
			}

			dispatch(deleteUserSuccess(data))
		} catch (error) {
			dispatch(deleteUserFailure(error.message))
		}
	}

	const handleLogOutUser = async () => {
		try {
			dispatch(signOutUserStart())
			const res = await fetch(`/api/auth/signout/`, {
				method: 'GET',
			})

			const data = await res.json()

			if (data.success === false) {
				dispatch(signOutUserFailure(error.message))
			}

			dispatch(signOutUserSuccess(data))
		} catch (error) {
			dispatch(signOutUserFailure(error.message))
		}
	}

	const handleShowListing = async () => {
		try {
			setShowListingError(false)
			const res = await fetch(`/api/user/listings/${currentUser._id}`)

			const data = await res.json()
			if (data.success === false) {
				setShowListingError(true)
				return
			}

			setUserListing(data)
		} catch (error) {
			setShowListingError(true)
		}
	}

	const handleListingDelete = async (listingId) => {
		try {
			const res = await fetch(`/api/listing/delete/${listingId}`, {
				method: 'DELETE',
			})

			const data = await res.json()
			if (data.success === false) {
				console.log(data.message)
				return
			}

			setUserListing((prev) =>
				prev.filter((listing) => listing._id !== listingId),
			)
		} catch (error) {}
	}

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="file"
					onChange={(e) => setFile(e.target.files[0])}
					ref={fileRef}
					hidden
					accept="image/*"
				/>
				<img
					onClick={() => fileRef.current.click()}
					src={formData.avatar || currentUser.avatar || defaultAvatar}
					alt="User avatar"
					className="rounded-full h-28 w-28 object-cover cursor-pointer self-center mt-2 p-3"
				/>

				<p className="text-center text-sm">
					{fileUploadError ? (
						<span className="text-red-700">Error image upload</span>
					) : filePerc > 0 && filePerc < 100 ? (
						<span className="text-slate-700">
							Uploading {filePerc}%
						</span>
					) : filePerc === 100 ? (
						<span className="text-green-700">Image uploaded!</span>
					) : (
						''
					)}
				</p>
				<input
					type="text"
					onChange={handleChange}
					placeholder="username"
					id="username"
					defaultValue={currentUser.username}
					className="border p-3 rounded-lg"
				/>
				<input
					type="text"
					onChange={handleChange}
					placeholder="email"
					id="email"
					defaultValue={currentUser.email}
					className="border p-3 rounded-lg"
				/>
				<input
					type="password"
					onChange={handleChange}
					placeholder="New password"
					id="password"
					className="border p-3 rounded-lg"
				/>

				<button
					disabled={loading}
					className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
				>
					{loading ? 'Loading...' : 'Update'}
				</button>
				<Link
					to="/create-listing"
					className="bg-green-700 text-white text-center rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
				>
					Create listing
				</Link>
			</form>

			<div className="flex justify-between mt-5">
				<span
					onClick={handleDeleteUser}
					className="text-red-700 cursor-pointer"
				>
					Delete account
				</span>
				<span
					onClick={handleLogOutUser}
					className="text-red-700 cursor-pointer"
				>
					Sign out
				</span>
			</div>
			<p className="text-red-700 mt-5">{error ? error : ''}</p>
			<p className="text-green-700 mt-5">
				{updateSuccess ? 'Update success' : ''}
			</p>
			<button
				onClick={handleShowListing}
				type="button"
				className="text-green-700"
			>
				Show listing
			</button>
			<p className="text-red-700 mt-5">
				{showListingError ? 'Error showing listing' : ''}
			</p>

			{userListing && userListing.length > 0 && (
				<div className="gap-4 flex flex-col">
					<h2 className="text-center mt-7 text-2xl font-semibold">
						Your listing
					</h2>
					{userListing.map((listing) => (
						<div
							key={listing._id}
							className="flex border rounded-lg p-3 gap-4 justify-between items-center"
						>
							<Link to={`/listing/${listing._id}`}>
								<img
									src={listing.imageUrls[0]}
									alt="listing"
									className="h-16 w-16 object-contain "
								/>
							</Link>
							<Link
								className="flex-1 text-slate-700 font-semibold  hover:underline truncate"
								to={`/listing/${listing._id}`}
							>
								<p>{listing.name}</p>
							</Link>
							<div className="flex flex-col">
								<button
									onClick={() =>
										handleListingDelete(listing._id)
									}
									type="button"
									className="text-red-700"
								>
									Delete
								</button>
								<Link to={`/update-listing/${listing._id}`}>
									<button
										type="button"
										className="text-green-700"
									>
										Edit
									</button>
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
