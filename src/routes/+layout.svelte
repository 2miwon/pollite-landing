<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Navbar />
	{@render children()}
	<!-- <Footer /> -->
</ParaglideJS>

<style>
  html {
    font-family: 'Pretendard Variable', sans-serif;
  }
</style>