import {error, redirect} from "@sveltejs/kit";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

/** @type {import('./$types').PageServerLoad} */
export async function load({params}) {

    const slug = params.slug;
    const link = await prisma.links.findFirst(
        {
            where: {
                validUntil: {
                    gte: new Date()
                },
                shortened: slug
            },
            select: {
                original: true,
                expireOnView: true
            },
        }
    );

    if (link) {
        if (link.expireOnView) {
            // remove link in database once clicked on
            await prisma.links.delete({
                where: {
                    shortened: slug
                }
            });

            // remove links that have expired in db
            await prisma.links.deleteMany({
                where: {
                    validUntil: {
                        lte: new Date()
                    }
                }
            });

        }
        throw redirect(302, link.original);
    }
    return {}
}