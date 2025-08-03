import { z } from 'zod'

export const FollowSchema = z.object({
  followerId: z.number({ message: 'followerId is required' }),
  followingId: z.number({ message: 'followingId is required' }),
})

export type FollowType = z.infer<typeof FollowSchema>
