<script lang="ts">
    import { writable } from 'svelte/store';
    import { Input } from 'flowbite-svelte';
    import { SearchOutline, BrainOutline, MessageCaptionOutline, DotsHorizontalOutline } from 'flowbite-svelte-icons';
    import { marked } from 'marked';

    let history: string[] = [];
    let init = writable(true);
    let ai_loading = writable(false);
    let search_loading = writable(false);
    let question = "";
    let answer = "";
    $: markdown = marked(answer);

    let answer_flag = writable(false);
    $: answer_flag.set(answer == "");

    let reason = "";
    $: reason = parseReason(raw_content);
    let reason_flag = writable(false);
    $: reason_flag.set(reason == "");

    let proposer = "";
    $: proposer = parseProposer(raw_content);
    let proposer_flag = writable(false);
    $: proposer_flag.set(proposer == "");
    
    let title = "";
    let bill_no = "";
    let date = "";
    
    let raw_content = "";
    
    let content: string[] = [];
    $: content = parseContent(raw_content);
    let content_flag = writable(false);
    $: content_flag.set(content.length == 0);

    let error_flag = writable(false);

    function parseReason(content: string) {
        let startIndex = content.indexOf('제안이유 및 주요내용');
        const endIndex = content.search(/의\s*안\s*번\s*호/);
        if (startIndex !== -1 && endIndex !== -1) {
            return content.slice(startIndex+11, endIndex);
        } else if (startIndex == -1) {
            startIndex = content.indexOf('제안이유');
            return content.slice(startIndex+4, endIndex);
        } else {
            return "";
        }
    }

    function parseProposer(content: string) {
        let startIndex = content.indexOf('발의자');
        const endIndex = content.indexOf('인)');
        if (startIndex !== -1 && endIndex !== -1) {
            let proposerText = content.slice(startIndex+4, endIndex).trim();
            proposerText = proposerText.replace(/([가-힣]{3,3})(?=[가-힣]{3,3})/g, '$1, ');
            const proposerNames = proposerText.match(/[\uAC00-\uD7A3]+/g); // 한글 이름만 추출
            return proposerNames ? proposerNames.join(', ').replace(', 의원', ' 의원') : proposerText;
        } else {
            return "";
        }
    }

    function parseContent(content: string) {
        let startIndex = content.indexOf('3 법률');
        if (startIndex !== -1 ) {
            const sliced = content.slice(startIndex+6+title.length, );
            return sliced.split('.');
        } else {
            startIndex = content.indexOf('3 ');
            if (startIndex !== -1) {
                const sliced = content.slice(startIndex+2+title.length, );
                return sliced.split('.');
            } else {
                return [];
            }
        }
    }

    function searchLock() {
        return $ai_loading || $search_loading;
    }

    function initialize() {
        question = "";
        answer = "";
        markdown = marked(answer);
        answer_flag.set(answer == "");
        reason = "";
        reason_flag.set(reason == "");
        proposer = "";
        proposer_flag.set(proposer == "");
        title = "";
        bill_no = "";
        date = "";
        raw_content = "";
        content = [];
        content_flag.set(content.length == 0);
        error_flag.set(false);
    }

    async function search(question: string) {
        if (!question || $ai_loading || $search_loading) return; 
        history = [question, ...history];
        initialize();
        ai_loading.set(true);
        search_loading.set(true);
        console.log('Searching:', question);
        try {
            const response = await fetch('/api/embed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });
            if (response.ok) {
                const embeded = await response.json();
                const searchResults = await fetch('/api/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ embeded })
                });
                if (searchResults.ok) {
                    const searchData = await searchResults.json();
                    console.log('Query embedded');
                    console.log(searchData);
                    title = searchData.title;
                    bill_no = searchData.bill_no;
                    date = searchData.date;
                    raw_content = searchData.content;
                    search_loading.set(false);

                    const response = await fetch('/api/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ question, content: raw_content})
                    });
                    if (response.ok) {
                        console.log('Content generated');
                        const data = await response.json();
                        answer = data
                        ai_loading.set(false);
                    } else {
                        console.error('Failed to generate content');
                    }
                } else {
                    console.error('Failed to search');
                    search_loading.set(false);
                    ai_loading.set(false);
                }
            } else {
                console.log('Failed to embed query');
                const searchResults = await fetch(`/api/search?keyword=${question}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (searchResults.ok) {
                    const searchData = await searchResults.json();
                    console.log('Query embedded');
                    console.log(searchData);
                    title = searchData.title;
                    bill_no = searchData.bill_no;
                    date = searchData.date;
                    raw_content = searchData.content;
                    search_loading.set(false);

                    const response = await fetch('/api/generate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ question, content: raw_content})
                    });
                    if (response.ok) {
                        console.log('Content generated');
                        const data = await response.json();
                        answer = data
                        ai_loading.set(false);
                    } else {
                        console.error('Failed to generate content');
                    }
                } else {
                    console.error('Failed to search');
                    error_flag.set(true);
                }
            }
        } catch (error) {
            console.error('Error embedding query:', error);
        } finally {
            ai_loading.set(false);
            search_loading.set(false);
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
                            class="text-x s text-start break-words line-clamp-3 text-black"
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
                        disabled={searchLock()}
                        bind:value={question}
                        on:keydown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                e.stopPropagation();
                                search(question);
                            }
                        }}
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
                        class="flex flex-col w-full h-1/2 max-h-dvh px-[30px] py-[20px] gap-[10px] rounded-3xl shadow-inner bg-white bg-opacity-80 break-words overflow-scroll"
                        class:opacity-30={$answer_flag}
                        class:animate-pulse={$ai_loading}
                        >
                        <p class="font-light text-md">AI 답변</p> 
                        <p class="font-extralight text-sm leading-relaxed overflow-y-auto overflow-x-hidden overscroll-auto">
                            {@html markdown}
                        </p>
                    </div>
                    <div
                        class="flex w-full h-1/2 max-h-dvh gap-[20px]"
                    >
                        <div
                            class="flex flex-col w-3/5 px-[30px] py-[20px] gap-[10px] rounded-3xl shadow-inner bg-white bg-opacity-80 break-words overflow-scroll"
                            class:opacity-30={$reason_flag}
                            class:animate-pulse={$search_loading}
                            >
                            <p class="font-light text-md">제안이유</p>
                            <p class="font-extralight text-sm leading-relaxed overflow-y-auto overflow-x-hidden overscroll-auto">
                                {reason}
                            </p>
                        </div>

                        <div
                            class="flex w-2/5 h-full flex-col items-start justify-start px-[30px] py-[20px] gap-[10px] rounded-3xl shadow-inner bg-white bg-opacity-80 break-words overflow-scroll"
                            class:opacity-30={$proposer_flag}
                            class:animate-pulse={$search_loading}
                            >
                            <p class="font-light text-md">발의자</p>
                            <p class="font-extralight text-sm leading-relaxed overflow-y-auto overflow-x-hidden overscroll-auto">
                                {proposer}
                            </p>
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
            {#if $error_flag}
                <div
                    class="flex flex-col justify-center w-full h-full px-[30px] py-[20px] gap-[15px] rounded-3xl shadow-inner bg-black bg-opacity-70 overflow-y-auto overflow-x-hidden break-words"
                >
                    <h1 class="font-semibold text-lg items-center text-center text-white">검색 결과가 없습니다.</h1>
                </div>
            {:else}
                <div
                    class="flex flex-col w-full h-full px-[30px] py-[20px] gap-[15px] rounded-3xl shadow-inner bg-black bg-opacity-5 overflow-y-auto overflow-x-hidden break-words"
                    class:opacity-30={$content_flag}
                    class:animate-pulse={$search_loading}
                    class:bg-opacity-90={$error_flag}
                    > 
                        <h2 class="font-extralight text-xs text-start">bill_no. {bill_no}</h2>
                    <h1 class="font-semibold text-lg items-center text-center">{title}</h1>
                    <h2 class="font-light text-xs text-end">{date}</h2>
                    <div class="flex flex-col gap-[10px] font-extralight text-sm leading-relaxed">
                        {#each content as c}
                            <p>{c}</p>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>