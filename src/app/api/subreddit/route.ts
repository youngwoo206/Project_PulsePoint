import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
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
        const { name } = SubredditValidator.parse(body)

        //checks if subreddit exists by comparing name to existing subreddits
        const subredditExists = await db.subreddit.findFirst({
            where: {
                name,
            }
        })
        if (subredditExists) {
            return new Response('Subreddit already exists', {status: 409})
        }

        //creates new subreddit with name and creator id
        const subreddit = await db.subreddit.create({
            data: {
                name,
                creatorId: session.user.id
            }
        })

        //subscribes creator to newly created subreddit
        await db.subscription.create({
            data: {
                userId: session.user.id,
                subredditId: subreddit.id,
            }
        })

        return new Response(subreddit.name)

    } catch (error) {
        //if error is zoderror (subredditValidator)
        if (error instanceof z.ZodError) {
            return new Response(error.message, {status: 422})
        }

        return new Response('Unable to create new subreddit', {status: 500})
    }
}