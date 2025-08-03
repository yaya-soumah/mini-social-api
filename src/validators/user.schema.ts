import { z } from 'zod'

export const updateProfileSchema = z.object({
  username: z.string().min(3).optional(),
  bio: z.string().max(300).optional(),
  avatar: z.string().url().optional(),
})

export const updateUserPasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

export const RoleSchema = z.object({
  role: z.enum(['admin', 'user'], { message: 'role must be admin or user' }),
})
