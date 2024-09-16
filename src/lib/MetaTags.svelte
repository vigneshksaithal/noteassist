<script lang="ts">
/**
 * !TODO: Add META data
 */
export let title = ''
export let description = ''
export let keywords = '' // !TODO: Add keywords, separated by commas
export let url = ''
export let ogImage = ''
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="codeclippy.aithal.dev" />
	<meta property="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	<!-- Canonical URL -->
	<link rel="canonical" href={url} />
</svelte:head>
