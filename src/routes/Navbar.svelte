<script lang="ts">
import { Button } from '$lib/components/ui/button'
import Mic from 'lucide-svelte/icons/mic'
import MicOff from 'lucide-svelte/icons/mic-off'

export let isRecording: boolean
export let startRecording: () => void
export let stopRecording: () => Promise<void>
</script>

<nav class="flex justify-between items-center mb-8 max-w-xl mx-auto">
	<h1 class="text-2xl font-bold">Your Notes</h1>
	<Button
		on:click={isRecording ? stopRecording : startRecording}
		variant={isRecording ? 'destructive' : 'default'}
	>
		{#if isRecording}
			<MicOff size="16" class="mr-2" />
			Stop
		{:else}
			<Mic size="16" class="mr-2" />
			Start
		{/if}
	</Button>
</nav>
