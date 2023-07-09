import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { DeletePostValidator } from "@/lib/validators/post"
import { z } from "zod"

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', {status:401})
        }

        const body = await req.json()

        const { id } = DeletePostValidator.parse(body)

        await db.post.delete({
            where: {
                id: id
            }
        })
        
        return new Response("OK")
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request data', {status: 422})
        }

        return new Response('Unable to post at this time', {status: 500})
    }
}