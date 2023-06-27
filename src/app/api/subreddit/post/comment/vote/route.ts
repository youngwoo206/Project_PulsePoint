import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentVoteValidator } from "@/lib/validators/vote"
import {z} from 'zod'


export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { commentId, voteType } = CommentVoteValidator.parse(body)
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', {status: 401})
        }

        //check if user already voted
        const existingVote = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId,
            }
        })

        if (existingVote) {
            // where user already voted with same type, voting again will delete the vote
            if (existingVote.type === voteType) {
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id
                        }
                    }
                })
                return new Response('Vote removed successfully')
            }
            // where user already voted with different type, voting will change the vote
            else {
                await db.commentVote.update({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id
                        }
                    },
                    data: {
                        type: voteType
                    }
                })
            }

            return new Response('Vote Registered')
        }

        // If there's no existing vote, creating new vote object
        await db.commentVote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                commentId
            }
        })
        return new Response('Vote Registered')
    } 
        catch (error) {
            if (error instanceof z.ZodError) {
                return new Response('Invalid request data', {status: 422})
            }

            return new Response('Unable to register vote', {status: 500})
    }
}