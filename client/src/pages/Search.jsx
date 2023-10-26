import React from 'react'

export default function Search() {
	return (
		<div className="flex flex-col md:flex-row">
			<div className="p-7 border-b-2 md:border-b-0 md:border-r-2 md:min-h-screen">
				<form className="flex flex-col gap-8">
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
							/>
							<label htmlFor="all">Rent & Sale</label>
						</div>
						<div className="flex  gap-2">
							<input
								type="checkbox"
								id="rent"
								name="rent"
								className="w-5"
							/>
							<label htmlFor="rent">Rent</label>
						</div>
						<div className="flex  gap-2">
							<input
								type="checkbox"
								id="sale"
								name="sale"
								className="w-5"
							/>
							<label htmlFor="sale">Sale</label>
						</div>
						<div className="flex  gap-2">
							<input
								type="checkbox"
								id="offer"
								name="offer"
								className="w-5"
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
							/>
							<label htmlFor="parking">Parking</label>
						</div>
						<div className="flex  gap-2">
							<input
								type="checkbox"
								id="furnished"
								name="furnished"
								className="w-5"
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
						>
							<option value="">Latest</option>
							<option value="">Price high to low</option>
							<option value="">Price low to high</option>
							<option value="">Oldest</option>
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
			<div className="">
				<h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
					Listing results:
				</h1>
			</div>
		</div>
	)
}
