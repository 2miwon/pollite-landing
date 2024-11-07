<script>
    import Demo from './demo/Demo.svelte';
    import HeroSection from '$lib/components/HeroSection.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<HeroSection 
    title="Most Trustable Legal AI" 
    subtitle="for Next-Generation Legal Practice" 
    button="자세히 알아보기" 
    goto_section="next" 
/>
<Demo />
<Footer />