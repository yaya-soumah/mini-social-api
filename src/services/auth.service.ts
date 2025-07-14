import bcrypt from 'bcrypt'
import { UserRepository } from '../repositories/user.repository.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import { AppError } from '../utils/app-error.js'
import logger from '../config/logger.js'

export async function registerUser(
  data: {
    username: string
    email: string
    password: string
  },
  userRole: string
) {
  const hashed = await bcrypt.hash(data.password, 10)
  const user = await UserRepository.createUser({
    username: data.username,
    email: data.email,
    password: hashed,
    role: userRole,
  })
  const accessToken = signAccessToken({ id: user.id, role: user.role })
  const refreshToken = signRefreshToken({ id: user.id, role: user.role })
  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, username: user.username },
  }
}

export async function loginUser(email: string, password: string) {
  const data = await UserRepository.findUserByEmail(email)
  if (!data) throw new AppError('Invalid email', 400)

  const match = await bcrypt.compare(password, data.password)
  if (!match) throw new AppError('Invalid password', 400)
  const accessToken = signAccessToken({ id: data.id, role: data.role })
  const refreshToken = signRefreshToken({ id: data.id, role: data.role })

  const { password: ps, ...user } = data.get({ plain: true })
  return { accessToken, refreshToken, user }
}
export async function refresh(refreshToken: string) {
  try {
    const decode = verifyRefreshToken(refreshToken) as { id: string; role: 'user' | 'admin' }
    const newToken = signAccessToken({ id: decode.id, role: decode.role })
    return { newToken }
  } catch (err) {
    throw new AppError('Invalid refresh token', 400)
  }
}
