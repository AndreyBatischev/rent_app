import React, { useEffect, useState } from 'react'
import {
	getStorage,
	uploadBytesResumable,
	ref,
	getDownloadURL,
} from 'firebase/storage'
import { app } from '../firebase.js'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function UpdateListing() {
	const navigate = useNavigate()
	const params = useParams()
	const { currentUser } = useSelector((state) => state.user)
	const [files, setFiles] = useState([])
	const [formData, setFormData] = useState({
		imageUrls: [],
		name: '',
		description: '',
		address: '',
		regularPrice: 50,
		discountPrice: 0,
		bathrooms: 1,
		badrooms: 1,
		furnished: false,
		parking: false,
		type: 'rent',
		offer: false,
	})
	const [imageUploadError, setImageUploadError] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [errorSubmit, setErrorSubmit] = useState(false)
	const [loadingSubmit, setLoadingSubmit] = useState(false)

	useEffect(() => {
		const fetchListing = async () => {
			const listingId = params.listingId
			const res = await fetch(`/api/listing/get/${listingId}`)

			const data = await res.json()

			if (data.success === false) {
				console.log(
					'useEffect: fetch has data.success error',
					data.message,
				)

				return
			}

			setFormData(data)
		}

		fetchListing()
	}, [])

	const handleImageSubmit = (e) => {
		if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
			setUploading(true)
			setImageUploadError(false)
			const promises = []

			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]))
			}

			Promise.all(promises)
				.then((urls) => {
					setFormData({
						...formData,
						imageUrls: formData.imageUrls.concat(urls),
					})
					setImageUploadError(false)
					setUploading(false)
				})
				.catch((error) => {
					setImageUploadError(
						'Image upload failed (2 Mb max per image',
					)
				})
		} else if (files.length === 0) {
			setImageUploadError('You must upload at least 1 image')
			setUploading(false)
		} else {
			setImageUploadError('You can upload only 6 image')
			setUploading(false)
		}
	}

	const storeImage = async (file) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app)
			const fileName = new Date().getTime() + file.name
			const storageRef = ref(storage, fileName)
			const uploadTask = uploadBytesResumable(storageRef, file)
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					console.log(progress + ' %')
				},
				(error) => {
					reject(error)
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(
						(downloadURL) => {
							resolve(downloadURL)
						},
					)
				},
			)
		})
	}

	const handleRemoveImage = (index) => {
		setFormData({
			imageUrls: formData.imageUrls.filter((_, i) => i !== index),
		})
	}

	const handleChange = (e) => {
		const { id, checked, type, value } = e.target
		if (id === 'sell' || id === 'rent') {
			setFormData({
				...formData,
				type: id,
			})
		}

		if (id === 'parking' || id === 'furnished' || id === 'offer') {
			setFormData({
				...formData,
				[id]: checked,
			})
		}

		if (type === 'number' || type === 'text' || type === 'textarea') {
			setFormData({
				...formData,
				[id]: value,
			})
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			if (formData.imageUrls.length < 1) {
				return setErrorSubmit('You must upload at least 1 image')
			}
			if (+formData.regularPrice < +formData.discountPrice) {
				return setErrorSubmit(
					'Discount price must be lower than regular price',
				)
			}
			setLoadingSubmit(true)
			setErrorSubmit(false)
			const res = await fetch(`/api/listing/update/${params.listingId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id,
				}),
			})
			const data = await res.json()

			setLoadingSubmit(false)
			if (data.success === false) {
				setErrorSubmit(data.message)
			}
			navigate(`/listing/${data._id}`)
		} catch (error) {
			setErrorSubmit(error.message)
			setLoadingSubmit(false)
		}
	}

	return (
		<main className="p-3 max-w-4xl mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">
				Update a Listing
			</h1>

			<form
				onSubmit={handleSubmit}
				className="flex flex-col sm:flex-row gap-4  "
			>
				<div className="flex flex-col gap-4 flex-1 ">
					<input
						onChange={handleChange}
						value={formData.name}
						type="text"
						placeholder="Name"
						className="border p-3 rounded-lg"
						id="name"
						maxLength="62"
						minLength="10"
						required
					/>
					<textarea
						onChange={handleChange}
						value={formData.description}
						type="text"
						placeholder="Description"
						className="border p-3 rounded-lg"
						id="description"
						required
					/>
					<input
						onChange={handleChange}
						value={formData.address}
						type="text"
						placeholder="Address"
						className="border p-3 rounded-lg"
						id="address"
						maxLength="62"
						minLength="10"
						required
					/>

					<div className="flex gap-6 flex-wrap">
						<div className="flex gap-2">
							<input
								type="checkbox"
								name="sell"
								id="sell"
								className="w-5"
								onChange={handleChange}
								checked={formData.type === 'sell'}
							/>
							<label htmlFor="sell">Sell</label>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								name="rent"
								id="rent"
								className="w-5"
								onChange={handleChange}
								checked={formData.type === 'rent'}
							/>
							<label htmlFor="rent">Rent</label>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								name=""
								id="parking"
								className="w-5"
								onChange={handleChange}
								value={formData.parking}
							/>
							<label htmlFor="parking">Parking spot</label>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								name=""
								id="furnished"
								className="w-5"
								onChange={handleChange}
								value={formData.furnished}
							/>
							<label htmlFor="furnished">Furnished</label>
						</div>
						<div className="flex gap-2">
							<input
								type="checkbox"
								name=""
								id="offer"
								className="w-5"
								onChange={handleChange}
								value={formData.offer}
							/>
							<label htmlFor="offer">Offer</label>
						</div>
					</div>
					<div className="flex flex-wrap gap-6">
						<div className="flex items-center gap-2">
							<input
								className="p-3 border-gray-300 rounded-lg"
								type="number"
								name="badrooms"
								id="badrooms"
								min="1"
								max="10"
								required
								onChange={handleChange}
								value={formData.badrooms}
							/>
							<label htmlFor="badrooms">Badrooms</label>
						</div>
						<div className="flex items-center gap-2">
							<input
								className="p-3 border-gray-300 rounded-lg"
								type="number"
								name="bathrooms"
								id="bathrooms"
								min="1"
								max="10"
								required
								onChange={handleChange}
								value={formData.bathrooms}
							/>
							<label htmlFor="bathrooms">Bathrooms</label>
						</div>
						<div className="flex items-center gap-2">
							<input
								className="p-3 border-gray-300 rounded-lg"
								type="number"
								name="regularPrice"
								id="regularPrice"
								min="50"
								max="100000"
								required
								onChange={handleChange}
								value={formData.regularPrice}
							/>
							<label
								htmlFor="regularPrice"
								className="flex flex-col items-center"
							>
								<p>Regular price</p>

								<span className="text-xs">
									{formData.type === 'rent'
										? '($ / month)'
										: ''}
								</span>
							</label>
						</div>
						{formData.offer && (
							<div className="flex items-center gap-2">
								<input
									className="p-3 border-gray-300 rounded-lg"
									type="number"
									name="discountPrice"
									id="discountPrice"
									min="0"
									max="10000"
									required
									onChange={handleChange}
									value={formData.discountPrice}
								/>
								<label
									htmlFor="discountPrice"
									className="flex flex-col items-center"
								>
									<p>Discounted price</p>
									<span className="text-xs">
										{formData.type === 'rent'
											? '($ / month)'
											: ''}
									</span>
								</label>
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-col flex-1 gap-4">
					<p className="font-semibold">
						Images:
						<span className="font-normal text-grey-600 ml-2">
							The first image will be the cover (max 6)
						</span>
					</p>
					<div className="flex gap-4">
						<input
							onChange={(e) => setFiles(e.target.files)}
							className="p-3 border border-gray-300 rounded w-full"
							type="file"
							id="images"
							accept="image/*"
							multiple
						/>
						<button
							disabled={uploading}
							onClick={handleImageSubmit}
							type="button"
							className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
						>
							{uploading ? 'Uploading...' : 'Upload'}
						</button>
					</div>
					<p className="text-red-700 text-sm">
						{imageUploadError && imageUploadError}
					</p>
					{formData.imageUrls.length > 0 &&
						formData.imageUrls.map((url, index) => (
							<div
								key={url}
								className="flex justify-between p-3 border items-center"
							>
								<img
									src={url}
									alt="image"
									className="w-20 h-20 object-contain rounded-lg"
								/>
								<button
									onClick={() => handleRemoveImage(index)}
									type="button"
									className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 "
								>
									Delete
								</button>
							</div>
						))}
					<button
						disabled={loadingSubmit || uploading}
						className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
					>
						{loadingSubmit ? 'Updating...' : 'Update listing'}
					</button>
					{errorSubmit && (
						<p className="text-red-700 text-sm">{errorSubmit}</p>
					)}
				</div>
			</form>
		</main>
	)
}
