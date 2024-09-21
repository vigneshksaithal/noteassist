<script lang="ts">
import Loader from 'lucide-svelte/icons/loader'

export let isRecording: boolean
export let isGenerating: boolean
</script>

{#if isRecording || isGenerating}
	<div
		class="flex items-center space-x-2 my-4 p-2 rounded w-full"
		class:bg-danger={isRecording}
		class:border-destructive={isRecording}
		class:bg-warning={isGenerating}
		class:border-warning={isGenerating}
	>
		{#if isRecording}
			<div class="w-4 h-4 rounded-full animate-pulse bg-primary"></div>
			<span class="text-primary font-semibold">Recording in progress...</span>
		{:else}
			<Loader class="w-4 h-4 text-primary animate-spin" />
			<span class="text-primary font-semibold">Generating notes...</span>
		{/if}
	</div>
{/if}
