import Listing from "../models/listingModel.js"
import User from "../models/userModel.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const updateUser = async (req, res, next) => {
    const { username, email, avatar } = req.body
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'Access to update user denied'))
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username,
                email,
                password: req.body.password,
                avatar
            }
        }, { new: true })

        const { password, ...rest } = updatedUser._doc
        res.status(200).json({ ...rest })

    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'Access to delete user denied'))

    try {
        const deleteProfile = await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json('User delete saccess')
    } catch (error) {
        next(error)
    }
}

export const getUserListings = async (req, res, next) => {

    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id })
            res.status(200).json(listings)
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorHandler(401, 'Access to listings denied'))
    }

}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) return next(errorHandler(404, 'User not found'))

        const { password: pass, ...rest } = user._doc

        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }

}