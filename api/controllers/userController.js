import User from "../models/userModel.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.send('hello ')
}

export const updateUser = async (req, res, next) => {
    const { username, email, avatar } = req.body
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'Access dinied'))
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