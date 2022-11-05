<script lang="ts">
    import type {ActionData} from "$lib/types";
    import {onMount} from "svelte";
    import {enhance} from '$app/forms';

    let url: string;
    onMount(() => {
        url = window.location.host;
    });

    export let form: ActionData;


</script>

<div class="flex flex-col h-screen w-screen bg-red-200 justify-center bg-gray-600">

    {#if !(form)}
        <h1 class="text-center text-4xl text-white">Create a Short link</h1>

        <div class="p-4">
            <form class="flex flex-col p-6 mx-auto" use:enhance action="?/registerUrl"
                  method="POST">

                <input class="hidden" name="url" id="url" type="text" value={url}>

                <div class="mx-auto bg-white p-3 rounded-xl" >

                    <div class="p-3">
                        <label class="p-2 m-3" for="original">Long Link</label>
                        <input autocomplete="false" class="p-2 m-3 ml-4 placeholder:text-gray-900 text-gray-900 min-w-[250px] max-w-[90vw] border-gray-400 border-2" required
                               id="original" type="text" name="link" placeholder="https://www.google.com" >
                    </div>

                    <div class="p-3 ">
                        <label class="p-2 m-3" for="expireOnView">Expire On Viewing</label>
                        <input class="p-2 m-3" id="expireOnView" type="checkbox" name="expireOnView">
                    </div>

                    <div class="p-3">
                        <label class="p-2 m-3" for="expireOnDate">Expiry Date</label>
                        <input class="p-2 m-3 ml-4 placeholder:text-gray-400 text-gray-900 border-gray-400 border-2" id="expireOnDate" required type="date" name="expireOnDate">
                    </div>

                </div>
                <button class="bg-red-600 border-2 border-red-900 rounded-xl text-white font-medium w-fit p-5 mx-auto mt-7">Submit</button>

            </form>
        </div>

    {:else}
        {#if (Number(form.status) === 400)}
            <h1 class="text-center text-4xl text-white">An Error Occurred</h1>


            <div class="text-red-500 text-2xl text-center p-5">
                {form.body.error}
            </div>

            <div class="bg-red-800 text-white font-medium w-fit p-4 rounded-lg mx-auto pt-6 border-2 border-red-900">
                <a href="/">Generate Another URL</a>
            </div>
        {:else}
            <h1 class="text-center text-4xl text-white">Your Shortened Link</h1>

            <div class="text-white text-center font-semibold text-3xl py-10">
                <p id="final_url">{form.body.shortened}</p>
            </div>
            <div class="bg-red-800 w-fit p-4 text-white font-medium rounded-lg mx-auto pt-6 border-2 border-red-900">
                <a href="/">Generate Another URL</a>
            </div>

        {/if}
    {/if}


</div>


<style>
</style>