import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

export default function Search() {
	const navigate = useNavigate()
	const [sidebardata, setSidebardata] = useState({
		searchTerm: '',
		type: 'all',
		parking: false,
		furnished: false,
		offer: false,
		sort: 'created_at',
		order: 'desc',
	})

	const [loading, setLoading] = useState(false)
	const [listings, setListings] = useState([])

	console.log('listings', listings)

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search)
		const searchTermFromUrl = urlParams.get('searchTerm')
		const typeFromUrl = urlParams.get('type')
		const parkingFromUrl = urlParams.get('parking')
		const furnishedFromUrl = urlParams.get('furnished')
		const offerFromUrl = urlParams.get('offer')
		const sortFromUrl = urlParams.get('sort')
		const orderFromUrl = urlParams.get('order')

		if (
			searchTermFromUrl ||
			typeFromUrl ||
			parkingFromUrl ||
			furnishedFromUrl ||
			offerFromUrl ||
			sortFromUrl ||
			orderFromUrl
		) {
			setSidebardata({
				searchTerm: searchTermFromUrl || '',
				type: typeFromUrl || 'all',
				parking: parkingFromUrl === 'true' ? true : false,
				furnished: furnishedFromUrl === 'true' ? true : false,
				offer: offerFromUrl === 'true' ? true : false,
				sort: sortFromUrl || 'created_at',
				order: orderFromUrl || 'desc',
			})
		}

		const fetchListings = async () => {
			try {
				setLoading(true)
				const searchQuery = urlParams.toString()
				const res = await fetch(`/api/listing/get?${searchQuery}`)
				const data = await res.json()

				setListings(data)
				setLoading(false)
			} catch (error) {
				console.log(error)
			}
		}

		fetchListings()
	}, [location.search])

	const handleChange = (e) => {
		const { id, value, checked } = e.target

		if (id === 'all' || id === 'rent' || id === 'sell') {
			setSidebardata({ ...sidebardata, type: id })
		}

		if (id === 'searchTerm') {
			setSidebardata({ ...sidebardata, searchTerm: value })
		}

		if (id === 'parking' || id === 'furnished' || id === 'offer') {
			setSidebardata({
				...sidebardata,
				[id]: checked || checked === 'true' ? true : false,
			})
		}

		if (id === 'sort_order') {
			const sort = value.split('_')[0] || 'created_at'
			const order = value.split('_')[1] || 'desc'
			setSidebardata({ ...sidebardata, sort, order })
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const urlParams = new URLSearchParams()
		urlParams.set('searchTerm', sidebardata.searchTerm)
		urlParams.set('type', sidebardata.type)
		urlParams.set('parking', sidebardata.parking)
		urlParams.set('furnished', sidebardata.furnished)
		urlParams.set('offer', sidebardata.offer)
		urlParams.set('sort', sidebardata.sort)
		urlParams.set('order', sidebardata.order)
		const searchQuery = urlParams.toString()

		navigate(`/search?${searchQuery}`)
	}

	return (
		<div className="flex flex-col md:flex-row">
			<div className="p-7 border-b-2 md:border-b-0 md:border-r-2 md:min-h-screen">
				<form onSubmit={handleSubmit} className="flex flex-col gap-8">
					<div className="flex items-center gap-2">
						<label
							htmlFor="searchTerm"
							className="whitespace-nowrap font-semibold"
						>
							Search term:
						</label>
						<input
							type="text"
							name="searchTerm"
							id="searchTerm"
							placeholder="Search..."
							className="border rounded-lg p-3 w-full"
							value={sidebardata.searchTerm}
							onChange={handleChange}
						/>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<label className="font-semibold">Type:</label>
						<div className="flex  gap-2">
							<input
								type="checkbox"
								id="all"
								name="all"
								className="w-5"
								onChange={handleChange}
								checked={sidebardata.type === 'all'}
							/>
							<label htmlFor="all">Rent & Sale</label>
						</div>
						<div className="flex  gap-2">
							<input
								type="checkbox"
								id="rent"
								name="rent"
								className="w-5"
								onChange={handleChange}
								checked={sidebardata.type === 'rent'}
							/>
							<label htmlFor="rent">Rent</label>
						</div>
						<div className="flex  gap-2">
							<input
								type="checkbox"
								id="sell"
								name="sell"
								className="w-5"
								onChange={handleChange}
								checked={sidebardata.type === 'sell'}
							/>
							<label htmlFor="sell">Sale</label>
						</div>
						<div className="flex  gap-2">
							<input
								type="checkbox"
								id="offer"
								name="offer"
								className="w-5"
								onChange={handleChange}
								checked={sidebardata.offer}
							/>
							<label htmlFor="offer">Offer</label>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<label className="font-semibold">Amenities:</label>
						<div className="flex  gap-2">
							<input
								type="checkbox"
								id="parking"
								name="parking"
								className="w-5"
								onChange={handleChange}
								checked={sidebardata.parking}
							/>
							<label htmlFor="parking">Parking</label>
						</div>
						<div className="flex  gap-2">
							<input
								type="checkbox"
								id="furnished"
								name="furnished"
								className="w-5"
								onChange={handleChange}
								checked={sidebardata.furnished}
							/>
							<label htmlFor="furnished">Furnished</label>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<label htmlFor="sort_order" className="font-semibold">
							Sort by:
						</label>
						<select
							name="sort_order"
							id="sort_order"
							className="border rounded-lg p-3"
							onChange={handleChange}
							defaultValue={'createdAt_desc'}
						>
							<option value="createdAt_desc">Latest</option>
							<option value="createdAt_asc">Oldest</option>
							<option value="regularPrice_desc">
								Price high to low
							</option>
							<option value="regularPrice_asc">
								Price low to high
							</option>
						</select>
					</div>
					<button
						type="submit"
						className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
					>
						Search
					</button>
				</form>
			</div>
			<div className="flex-1">
				<h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
					Listing results:
				</h1>
				<div className="p-7 flex flex-wrap gap-4">
					{!loading && listings.length === 0 && (
						<p className="text-xl text-slate-700">
							No listing found
						</p>
					)}
					{loading && (
						<p className="text-xl text-slate-700 text-center w-full">
							Loading...
						</p>
					)}
					{!loading &&
						listings &&
						listings.map((listing) => (
							<ListingItem key={listing._id} listing={listing} />
						))}
				</div>
			</div>
		</div>
	)
}
