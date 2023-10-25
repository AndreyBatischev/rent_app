import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import About from './pages/about'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Footer from './components/Footer'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'

export default function App() {
	return (
		<div className="min-h-screen flex flex-col">
			<BrowserRouter>
				<Header />
				<div className="flex-grow">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/sign-in" element={<SignIn />} />
						<Route path="/sign-up" element={<SignUp />} />
						<Route path="/about" element={<About />} />
						<Route
							path="/listing/:listingId"
							element={<Listing />}
						/>
						<Route element={<PrivateRoute />}>
							<Route path="/profile" element={<Profile />} />
							<Route
								path="/create-listing"
								element={<CreateListing />}
							/>
							<Route
								path="/update-listing/:listingId"
								element={<UpdateListing />}
							/>
						</Route>
					</Routes>
				</div>
				<Footer />
			</BrowserRouter>
		</div>
	)
}
