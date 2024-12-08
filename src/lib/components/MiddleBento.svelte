<script>
    export let title;
    export let opacity;
    export let background;
    export let opacityDown = false;
    export let pulseAnimation = false;
</script>

<div
    class="flex flex-col w-full h-1/2 px-[30px] py-[20px] rounded-3xl shadow-inner bg-white bg-opacity-80"
    class:opacity-30={$opacityDown}
    class:animate-pulse={$opacityDown}
    >
    <p class="font-light text-md">AI 답변</p> 
</div>