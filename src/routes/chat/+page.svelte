<script>
    import { Label, Input, ButtonGroup } from 'flowbite-svelte';
    import { SearchOutline } from 'flowbite-svelte-icons';
    let history = [
        "가장 최근에 상법 개정된",
        "dummydummydummydummydummydummydummydummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
        "dummydummydummydummydummydummydummy",
    ];
    let test = false;
    let question = "";
</script>

<div class="flex flex-col bg-gradient-to-tr from-lime-50 via-sky-100 to-red-50 h-screen">
    <div
        class="font-pretendard flex flex-row items-center justify-center m-[80px] gap-[25px] overflow-auto"
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
                <div class="font-light text-md text-start">Question</div>
            </div>
            <div
                class="flex flex-col w-full h-full gap-[15px]"
            > 
                <div class="flex flex-row w-full rounded-full h-[50px]">
                    <Input
                        type="text"
                        placeholder="질문을 입력해주세요"
                        bind:value={question}
                        on:keydown={(e) => e.key === 'Enter' && console.log(question)}
                        class="flex w-full h-full px-[30px] py-[20px] rounded-full border-none outline-none bg-white"
                        >
                        <SearchOutline slot="right" class="mr-2 text-blue-600"></SearchOutline>
                    </Input>
                </div>
                <div class="flex flex-col w-full h-full gap-[20px]">
                    <div
                        class="flex w-full h-1/2 px-[30px] py-[20px] rounded-3xl shadow-inner bg-white bg-opacity-80"
                        class:opacity-30={test}
                        >
                        <p class="font-light text-md">AI 답변</p>
                    </div>
                    <div
                        class="flex w-full h-1/2 gap-[20px]"
                    >
                        <div
                            class="flex w-3/5 h-full flex-col items-start justify-start px-[30px] py-[20px] rounded-3xl shadow-inner bg-white bg-opacity-80"
                            class:opacity-30={test}
                            >
                            <p class="font-light text-md">제안이유</p>
                        </div>

                        <div
                            class="flex w-2/5 h-full flex-col items-start justify-start px-[30px] py-[20px] rounded-3xl shadow-inner bg-white bg-opacity-80"
                            class:opacity-30={test}
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
                class="flex w-full h-full px-[20px] rounded-3xl shadow-inner bg-black bg-opacity-5"
                class:opacity-30={test}
                > 
            </div>
        </div>
    </div>
</div>