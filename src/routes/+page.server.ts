import {PrismaClient} from "@prisma/client";
import type {Action, Actions, PageServerLoad} from "./$types"
import {randomUUID} from "crypto";

const prisma = new PrismaClient();


const testAction: Action = async ({request}) => {
    return {
        status: 200,
        body: {
            message: request
        }
    }
}

/** @type {import('./$types').Actions} */
const registerUrl: Action = async ({request}) => {

    const data = await request.formData();
    const link = data.get('link');
    const expireOnView:boolean = data.get('expireOnView') === 'on';
    const expireOnDate = data.get('expireOnDate');
    const base = data.get('url');

    // create url link validation regex
    const urlRegex = new RegExp("https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)")
    const urlsanshttpRegex = new RegExp("(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)")
    const urlsanshttpwwwRegex = new RegExp("[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)")


    if (!link) {
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
            }
        }
    } else if (!expireOnDate) {
        return {
            status: 400,
            body: {
                error: 'Date is Required',
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
            shortened: "https://www." + base + "/" + shortened,
            original: url
        }
    };
}

export const actions: Actions = {
    registerUrl
};
