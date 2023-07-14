import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditModerationValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        //checks to see if user is logged in
        if (!session?.user) {
            return new Response('Unauthorized', {status: 401})
        }

        //gets response, validates payload with validator
        const body = await req.json()
        const { userId, subredditId } = SubredditModerationValidator.parse(body)

        //checks if subreddit exists by comparing name to existing subreddits
        const subreddit = await db.subreddit.findFirst({
            where: {
                id: subredditId,
            }
        })

        if (!subreddit) {
            return new Response('Subreddit does not exist', {status: 409})
        }

        //checks if user is already a moderator
        const modstatus = await db.moderation.findFirst({
            where: {
                userId,
                subredditId,
            }
        })

        if (modstatus) {
            return new Response('User is already a moderator', {status: 410})
        }

        //gives creator moderation privileges
        await db.moderation.create({
            data: {
                userId: session.user.id,
                subredditId: subreddit.id 
            }
        })

        return new Response('Success')

    } catch (error) {
        //if error is zoderror (subredditValidator)
        if (error instanceof z.ZodError) {
            return new Response(error.message, {status: 422})
        }

        return new Response('Unable to create new subreddit', {status: 500})
    }
}