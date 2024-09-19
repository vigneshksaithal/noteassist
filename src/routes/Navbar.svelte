<script lang="ts">
import { Button } from '$lib/components/ui/button'
import Mic from 'lucide-svelte/icons/mic'
import MicOff from 'lucide-svelte/icons/mic-off'

export let isRecording: boolean
export let startRecording: () => void
export let stopRecording: () => Promise<void>
</script>

<div class="flex justify-between items-center pb-4">
	<h1 class="text-2xl font-bold">Notes</h1>
	<Button
		on:click={isRecording ? stopRecording : startRecording}
		variant={isRecording ? 'destructive' : 'default'}
		class="flex items-center gap-2"
	>
		{#if isRecording}
			<MicOff size="16" />
			Stop
		{:else}
			<Mic size="16" />
			Start
		{/if}
	</Button>
</div>
