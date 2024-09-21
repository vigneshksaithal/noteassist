<script lang="ts">
import * as Card from '$lib/components/ui/card'
</script>

<Card.Root
	class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xl"
>
	<Card.Header>
		<Card.Title tag="h2" class="text-2xl">How to use Video 2 Notes?</Card.Title>
	</Card.Header>
	<Card.Content>
		<ol class="list-decimal list-inside space-y-4">
			<li>
				Make sure you have given Highlight and this app the permission to use
				audio.
			</li>
			<li>Click the <b>Start</b> button to begin recording.</li>
			<li>
				Go watch/play the video you want to take notes on. It may be YouTube,
				Zoom, etc.
			</li>
			<li>Then come back to this app and click "Stop" when you're done.</li>
			<li>Your note will be automatically generated and saved.</li>
		</ol>
	</Card.Content>
</Card.Root>
