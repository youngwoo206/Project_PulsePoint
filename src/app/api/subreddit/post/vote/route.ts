import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { PostVoteValidator } from "@/lib/validators/vote"
import { CachedPost } from "@/types/redis"
import {z} from 'zod'

//controls when caching begins
const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { postId, voteType } = PostVoteValidator.parse(body)
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', {status: 401})
        }

        //fetches post for caching 
        const post = await db.post.findUnique({
            where: {
                id: postId
            },
            include: {
                author: true,
                votes: true,
            }
        })
        if (!post) {
            return new Response('Post not found', {status: 404})
        }

        //check if user already voted
        const existingVote = await db.vote.findFirst({
            where: {
                userId: session.user.id,
                postId,
            }
        })

        if (existingVote) {
            // where user already voted with same type, voting again will delete the vote
            if (existingVote.type === voteType) {
                await db.vote.delete({
                    where: {
                        userId_postId: {
                            postId,
                            userId: session.user.id
                        }
                    }
                })
                return new Response('Vote removed successfully')
            }
            // where user already voted with different type, voting will change the vote
            else {
                await db.vote.update({
                    where: {
                        userId_postId: {
                            postId,
                            userId: session.user.id
                        }
                    },
                    data: {
                        type: voteType
                    }
                })
            }
            //recounting votes
            const votesAmt = post.votes.reduce((acc, vote) => {
                if (vote.type === "UP") return acc + 1
                if (vote.type === "DOWN") return acc - 1
                return acc
            }, 0)

            if (votesAmt >= CACHE_AFTER_UPVOTES) {
                const cachePayload: CachedPost = {
                    id: post.id,
                    title: post.title,
                    authorUsername: post.author.username ?? '',
                    content: JSON.stringify(post.content),
                    currentVote: voteType,
                    createdAt: post.createdAt
                }
            
                await redis.hset(`post:${postId}`, cachePayload)
            }

            return new Response('Vote Registered')
        }

        // If there's no existing vote, creating new vote object
        await db.vote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                postId
            }
        })

        //recounting votes
        const votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1
            if (vote.type === "DOWN") return acc - 1
            return acc
        }, 0)

        if (votesAmt >= CACHE_AFTER_UPVOTES) {
            const cachePayload: CachedPost = {
                id: post.id,
                title: post.title,
                authorUsername: post.author.username ?? '',
                content: JSON.stringify(post.content),
                currentVote: voteType,
                createdAt: post.createdAt
            }
            await redis.hset(`post:${postId}`, cachePayload)
        }
        return new Response('Vote Registered')

    } 
        catch (error) {
            if (error instanceof z.ZodError) {
                return new Response('Invalid request data', {status: 422})
            }

            return new Response('Unable to register vote', {status: 500})
    }
}