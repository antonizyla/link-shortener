<script lang="ts">
    import Button from "$lib/Button.svelte";
    import type {ActionData} from "./$types";
    import {onMount} from "svelte";

    let url: string;
    onMount(() => {
        url = window.location.host;
    });

    export let form: ActionData;

</script>

<div class="flex flex-col h-screen w-screen bg-red-200 justify-center text-white bg-gray-600">

    <h1 class="text-center text-4xl">Create a Short link</h1>

    <div class="items-center">
        <form class="flex flex-col w-screen p-5 text-lg items-center" action="?/registerUrl" method="POST">

            <div class="">
                <div class="p-4">
                    <label class="px-2 mr-3" for="link">Your Link</label>
                    <input class="text-gray-800 px-4 h-10 rounded-md border-2 placeholder-gray-800 border-blue-600" id="link" name="link"
                           placeholder="www.your-link.com" autocomplete="off" type="text" required>
                </div>

                {#if (form)}
                    {#if (form.status == 400)}
                        <div class="text-red-500 text-center">
                            {form.body.error}
                        </div>
                    {:else}
                        <div class="text-white text-center font-semibold text-2xl">
                            <p id="final_url">https://{url}/{form.body.shortened}</p>
                        </div>
                        <Button>
                            Copy
                        </Button>
                    {/if}
                {/if}

                <div class="p-4">
                    <label class="px-2" for="expireOnView">Expire On View</label>
                    <input class="px-2" id="expireOnView" type="checkbox" name="expireOnView">
                </div>

                <div class="p-4">
                    <label class="px-2" for="expireOnDate">Expire On Date (GMT)</label>
                    <input class=" text-gray-800 border-2 border-blue-600 p-1 rounded-md mx-3 px-3 h-10" id="expireOnDate"
                           type="datetime-local" name="expireOnDate" required>
                </div>

                <div class="p-4 text-center">
                    <!--        <Button type="submit">Generate Short URL</Button>-->
                    <Button type="submit">Generate Short URL</Button>
                </div>
            </div>
        </form>
    </div>
</div>

<style>
</style>