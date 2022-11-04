import {PrismaClient} from "@prisma/client";
import type {Action, Actions, PageServerLoad} from "./$types"
import {randomUUID} from "crypto";

const prisma = new PrismaClient();


/** @type {import('./$types').Actions} */
const registerUrl: Action = async ({request}) => {

    // await prisma.links.create({
    //     data: {
    //         shortened: randomUUID().slice(0, 6),
    //         original: "https://www.google.com",
    //         validUntil: new Date(),
    //         expireOnView: true
    //      }
    //  })

    const data = await request.formData();
    const link = data.get('link');
    const expireOnView:boolean = data.get('expireOnView') === 'on';

    const expireOnDate = data.get('expireOnDate');


    console.log({link, expireOnView, expireOnDate});

    // create url link validation regex
    const urlRegex = new RegExp("https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)")
    const urlsanshttpRegex = new RegExp("(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)")
    const urlsanshttpwwwRegex = new RegExp("[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)")


    // validate link
    if (!link) {
        // return error
        return {
            status: 400,
            body: {
                error: 'Link is Required'
            }
        }
    }

    const stdRegex = urlRegex.test(link.toString());
    const sanshttpRegex = urlsanshttpRegex.test(link.toString());
    const sanshttpwwwRegex = urlsanshttpwwwRegex.test(link.toString());

    if (!stdRegex && !sanshttpRegex && !sanshttpwwwRegex) {
        return {
            status: 400,
            body: {
                error: 'Link is not valid',
                regexes: {
                    std: stdRegex,
                    sanshttp: sanshttpRegex,
                    sanshttpwww: sanshttpwwwRegex,
                }
            }
        }
    } else if (!expireOnDate) {
        return {
            status: 400,
            body: {
                error: 'Date is Required'
            }
        }
    }

    let url: string;
    if (stdRegex){
        url = link.toString();
    } else if (sanshttpRegex) {
        url = "https://" + link.toString();
    } else {
        url = "https://www." + link.toString();
    }

    console.log(url)

    const shortened = randomUUID().slice(0, 4);
    await prisma.links.create({
        data: {
            shortened: shortened,
            original: url,
            validUntil: new Date(expireOnDate.toString()),
            expireOnView: expireOnView
        }
    });

    return {
        status: 200,
        body: {
            shortened: shortened
        }
    };
}

export const actions: Actions = {registerUrl};