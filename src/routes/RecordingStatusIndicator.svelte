<script lang="ts">
import Loader from 'lucide-svelte/icons/loader'

export let isRecording: boolean
export let isGenerating: boolean
</script>

{#if isRecording || isGenerating}
	<div
		class="flex items-center space-x-2 my-4 p-2 rounded w-full"
		class:bg-red-100={isRecording}
		class:border-red-400={isRecording}
		class:bg-yellow-100={isGenerating}
		class:border-yellow-400={isGenerating}
	>
		{#if isRecording}
			<div class="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
			<span class="text-red-500 font-semibold">Recording in progress...</span>
		{:else}
			<Loader class="w-4 h-4 text-yellow-500 animate-spin" />
			<span class="text-yellow-500 font-semibold">Generating notes...</span>
		{/if}
	</div>
{/if}
