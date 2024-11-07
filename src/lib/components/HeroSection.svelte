<script lang="ts">
    export let title = "Most Trustable Legal AI";
    export let subtitle = "for Next-Generation Legal Practice";
    export let button = "자세히 알아보기";
    export let goto_section = "next";

    function scrollToSection(event: MouseEvent) {
        const section = document.getElementById(goto_section);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
    }
</script>

<div class="relative w-screen h-screen flex flex-col items-center justify-center bg-[url('/image/landing/justitia-2638601_1920.png')] bg-no-repeat bg-center bg-cover font-pretendard">
    <div class="absolute inset-0 bg-black bg-opacity-70"></div>

    <div class="w-full flex flex-col lg:items-start justify-center z-10 gap-[30px] md:px-[40px]">
        <h1 class="md:text-8xl text-3xl font-bold text-white text-center">{title}</h1>
        <h2 class="md:text-4xl text-xl font-bold text-white text-center md:pl-[20px]">{subtitle}</h2>
    </div>
    <div class="absolute w-full bottom-0 mb-[100px] flex flex-col items-center justify-center z-10">
        <button class="bg-white text-text font-bold py-2 px-4 rounded-full" on:click={scrollToSection}>
            {button}
        </button>
    </div>
</div>
