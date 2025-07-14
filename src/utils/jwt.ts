import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  '61408b2ebc9e25c54b1b3dd162bebf067fc26a942a9a14b08628d6de30607c7b'
const REFRESH_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  '95becf9fedfdc5c08c4ee69706d6ad701bd84fb54df9a5500e9a62ac967bdc0c'

const ACCESS_TOKEN_EXPIRES_IN = '1d'
const REFRESH_TOKEN_EXPIRES_IN = '7d'

export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN })
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET)
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET)
}
