<script lang="ts">
import * as Card from '$lib/components/ui/card'
import InfoIcon from 'lucide-svelte/icons/info'
</script>

<Card.Root class="mx-auto">
	<Card.Header>
		<Card.Title class="text-lg font-bold flex items-center gap-2">
			<InfoIcon size="16" />
			How to use NoteAssist
		</Card.Title>
	</Card.Header>
	<Card.Content>
		<p>1. Click the "Start" button to begin recording.</p>
		<p>
			2. Watch/ Play the video you want to take notes on. It may be YouTube,
			Zoom, etc.
		</p>
		<p>3. Click "Stop" when you're done.</p>
		<p>4. Your note will be automatically generated and saved in NoteAssist.</p>
	</Card.Content>
</Card.Root>
