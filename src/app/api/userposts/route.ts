import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

export async function GET(req: Request) {
    const url = new URL(req.url)

    const session = await getAuthSession()

    let followedCommunitiesIds: string[] = []

    if (session) {
        const followedCommunities = await db.subscription.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                subreddit: true
            }
        })

        followedCommunitiesIds = followedCommunities.map(
            ({subreddit}) => subreddit.id
        )
    }

    try {
        const {userid, limit, page } = z.object({
            limit: z.string(),
            page: z.string(),
            userid: z.string().nullish().optional(),
        }).parse({
            userid: url.searchParams.get('userid'),
            limit: url.searchParams.get('limit'),
            page: url.searchParams.get('page')
        })

        let whereClause = {}

        if (userid) {
            whereClause = {
                user: {
                    id: userid
                }
            }
        } else if (session) {
            whereClause = {
                user: {
                    id: userid
                }
            }
        }

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                subreddit: true,
                votes: true,
                author: true,
                comments: true
            },
            where: whereClause
        })

        return new Response(JSON.stringify(posts))
        
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request data', {status: 422})
        }

        return new Response('Unable to fetch posts', {status: 500})
    }
}