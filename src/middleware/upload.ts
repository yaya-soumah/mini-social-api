import path from 'path'
import fs from 'fs'

import multer from 'multer'

import { AppError } from '../utils/app-error'

// Ensure upload folder exists
const uploadDir = path.resolve('uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir)
  },
  filename: (_req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) cb(null, true)
    else cb(new AppError('Only .jpeg, .png, .webp files are allowed!'))
  },
})
