<script>
    import Demo from './demo/Demo.svelte';
    import HeroSection from '$lib/components/HeroSection.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<HeroSection 
    title="Most Trustable Legal AI" 
    subtitle="for Next-Generation Legal Practice" 
    button="→ Try Now" 
    goto="/chat"
/>
<Demo />
<Footer />