import { db } from '@/lib/db'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q')
  const sub = url.searchParams.get('s')

  if (!q || !sub) return new Response('Invalid query', { status: 400 })

  const results = await db.subscription.findMany({
    where: {
        subreddit: {
          id: sub
      },
        userName: {
          startsWith: q
        }
    },
    include: {
      user: true,
      subreddit: {
        include: {
          Moderation: {
            where: {
              subredditId: sub
            }
          }
        }
      }
    },
    take: 5
  })

  return new Response(JSON.stringify(results))
}