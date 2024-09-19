<script lang="ts">
import Loader from 'lucide-svelte/icons/loader'

export let isRecording: boolean
export let isGenerating: boolean
</script>

{#if isRecording}
	<div
		class="flex items-center space-x-2 my-4 p-2 bg-red-100 border border-red-400 rounded"
	>
		<div class="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
		<span class="text-red-500 font-semibold">Recording in progress...</span>
	</div>
{/if}

{#if isGenerating}
	<div
		class="flex items-center space-x-2 my-4 p-2 bg-yellow-100 border border-yellow-400 rounded"
	>
		<Loader class="w-4 h-4 text-yellow-500 animate-spin" />
		<span class="text-yellow-500 font-semibold">Generating notes...</span>
	</div>
{/if}
