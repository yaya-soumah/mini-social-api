import { z } from 'zod'

export const createPostSchema = z.object({
  content: z.string().max(280).min(2).optional(),
  mediaUrl: z.string().optional(),
})

export const updatePostSchema = z.object({
  content: z.string().min(2).max(280),
})
