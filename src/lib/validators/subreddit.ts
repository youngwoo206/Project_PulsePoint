import { z } from 'zod'

export const SubredditValidator = z.object({
    name: z.string().min(3).max(21),
})

export const SubredditSubscriptionValidator = z.object({
    subredditId: z.string()
})

export const SubredditModerationValidator = z.object({
    userId: z.string(),
    subredditId: z.string()
})

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>

export type SubscribeToSubredditPayload = z.infer<typeof SubredditSubscriptionValidator>

export type AddModeratorPayload = z.infer<typeof SubredditModerationValidator>