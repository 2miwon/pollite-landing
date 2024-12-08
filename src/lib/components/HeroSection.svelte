<script lang="ts">
    export let title;
    export let subtitle;
    export let button;
    export let goto_section = "next";
    export let goto;

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
        <a 
            class="bg-white text-text text-xl font-bold py-2 px-4 rounded-full w-[150px] h-[55px] text-center justify-center items-center flex"
            href={goto}
            >
            {button}
        </a>
    </div>
</div>
