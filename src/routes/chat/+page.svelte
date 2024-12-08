<script lang="ts">
    import { writable } from 'svelte/store';
    import { Label, Input, ButtonGroup } from 'flowbite-svelte';
    import { SearchOutline, BrainOutline, MessageCaptionOutline, DotsHorizontalOutline } from 'flowbite-svelte-icons';
    import { marked } from 'marked';

    let history: string[] = [];
    let init = writable(true);
    let loading = writable(false);
    let question = "";
    let answer = "";
    $: markdown = marked(answer);
    $: console.log(markdown);
    let answer_flag = writable(false);
    $: answer_flag.set(answer == "");
    let reason = "";
    let reason_flag = writable(false);
    $: reason_flag.set(reason == "");
    let proposer = "";
    let proposer_flag = writable(false);
    $: proposer_flag.set(proposer == "");
    let bill = "ㅇㄴㅇ";
    let bill_flag = writable(false);
    $: bill_flag.set(bill == "");

    async function search(question: string) {
        // return; // none
        if (!question || $loading) return;  
        history = [question, ...history];
        init.set(false);
        loading.set(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });
            if (response.ok) {
                console.log('Content generated');
                const data = await response.json();
                answer = data
            } else {
                console.error('Failed to generate content');
            }
        } catch (error) {
            console.error('Error generating content:', error);
        } finally {
            loading.set(false);
        }
    }
</script>

<svelte:head>
  <title>AI Law Chat</title>
</svelte:head>

<div class="flex flex-col bg-gradient-to-tr from-lime-50 via-sky-100 to-red-50 h-screen w-screen">
    <div
        class="font-pretendard flex flex-row h-full items-center justify-center m-[80px] gap-[25px] overflow-auto"
    >
        <div
            class="flex w-1/5 h-full flex-col items-center justify-center gap-[10px]"
        >
            <div class="w-full pl-[20px] items-start justify-start">
                <div class="font-light text-md text-start text-[#a5b4fc]">History</div>
            </div>
            <div
                class="flex flex-col w-full h-full px-[20px] py-[30px] rounded-3xl shadow-lg bg-white opacity-50 overflow-x-hidden overflow-y-auto gap-[30px]"
            > 
                {#each history as h}
                    <div class="flex w-full items-center justify-start">
                        <button
                            class="text-x s text-start break-words line-clamp-3"
                            on:click={() => question = h}
                        >{h}</button>
                    </div>
                {/each}
            </div>
        </div>

        <div
            class="flex w-2/5 h-full flex-col items-center justify-center gap-[10px]"
        >
            <div class="w-full pl-[20px] items-start justify-start">
                <div class="font-light text-md text-start">질문</div>
            </div>
            <div
                class="flex flex-col w-full h-full gap-[15px]"
            > 
                <div class="flex flex-row w-full rounded-full h-[50px]">
                    <Input
                        type="text"
                        placeholder="질문을 입력해주세요"
                        bind:value={question}
                        on:keydown={(e) => e.key === 'Enter' && search(question)}
                        class="flex w-full h-full px-[50px] pl-[50px] py-[20px] rounded-full border-none outline-none bg-white"
                        >
                        <BrainOutline slot="left" class="ml-1 text-blue-600"/>
                        <button
                            slot="right"
                            on:click={() => search(question)}
                            >
                            <SearchOutline 
                                class="mr-2 text-blue-600"
                                />
                        </button>
                    </Input>
                </div>
                <div class="flex flex-col w-full h-full gap-[20px]">
                    <div
                        class="flex flex-col w-full h-1/2 px-[30px] py-[20px] gap-[10px] rounded-3xl shadow-inner bg-white bg-opacity-80 break-words overflow-scroll"
                        class:opacity-30={$answer_flag}
                        class:animate-pulse={$loading}
                        >
                        <p class="font-light text-md">AI 답변</p> 
                        <p class="font-extralight text-sm leading-relaxed overflow-y-auto overflow-x-hidden">
                            {@html markdown}
                        </p>
                    </div>
                    <div
                        class="flex w-full h-1/2 gap-[20px]"
                    >
                        <div
                            class="flex w-3/5 h-full flex-col items-start justify-start px-[30px] py-[20px] rounded-3xl shadow-inner bg-white bg-opacity-80"
                            class:opacity-30={$reason_flag}
                            class:animate-pulse={$loading}
                            >
                            <p class="font-light text-md">제안이유</p>
                        </div>

                        <div
                            class="flex w-2/5 h-full flex-col items-start justify-start px-[30px] py-[20px] rounded-3xl shadow-inner bg-white bg-opacity-80"
                            class:opacity-30={$proposer_flag}
                            class:animate-pulse={$loading}
                            >
                            <p class="font-light text-md">발의자</p>
                        </div>
                    </div>
                    <!-- <div
                        class="flex w-full h-1/3 px-[20px] rounded-3xl bg-black bg-opacity-10"
                    >

                    </div> -->
                </div>
            </div>
        </div>
        <div
            class="flex w-2/5 h-full flex-col items-center justify-center gap-[10px]"
        >
            <div class="w-full pl-[20px] items-start justify-start">
                <div class="font-light text-md text-start">법안 원문</div>
            </div>
            <div
                class="flex flex-col w-full h-full px-[30px] py-[20px] rounded-3xl shadow-inner bg-black bg-opacity-5 overflow-y-auto overflow-x-hidden break-words"
                class:opacity-30={$bill_flag}
                > 
                {bill}
            </div>
        </div>
    </div>
</div>