export interface UserType {
  id?: number
  username: string
  email: string
  password: string
  role?: 'user' | 'admin'
}

export interface UserResponseType {
  id?: number
  email?: string
  username?: string
  bio?: string
  avatar?: string
  role?: 'user' | 'admin'
}
