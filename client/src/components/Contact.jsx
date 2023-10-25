import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({ listing }) {
	const [landLord, setLandLord] = useState(null)
	const [message, setMessage] = useState('')

	const onChange = (e) => {
		setMessage(e.target.value)
	}

	useEffect(() => {
		const fetchLandLord = async () => {
			try {
				const res = await fetch(`/api/user/${listing.userRef}`)

				const data = await res.json()

				if (data.success === false) {
					console.log('error fetchLandLord', data)
					return
				}

				setLandLord(data)
			} catch (error) {
				console.log(error)
			}
		}

		fetchLandLord()
	}, [listing.userRef])

	return (
		<div>
			{landLord && (
				<div className="flex flex-col gap-2">
					<p className="font-semibold">
						Contact <span className="">{landLord.username}</span>{' '}
						for{' '}
						<span className="">{listing.name.toLowerCase()}</span>
					</p>
					<textarea
						name="message"
						id="message"
						rows="3"
						value={message}
						onChange={onChange}
						placeholder="Enter your message here..."
						className="w-full border p-3 rounded-lg mt-2"
					></textarea>

					<Link
						to={`mailto:${landLord.email}?subject=Regarding${listing.name}&body=${message}`}
						className="bg-slate-700 text-white text-center rounded-lg uppercase hover:opacity-95 p-3"
					>
						Send message
					</Link>
				</div>
			)}
		</div>
	)
}
