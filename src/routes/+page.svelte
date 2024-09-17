<script lang="ts">
import { Button } from '$lib/components/ui/button'
import * as Card from '$lib/components/ui/card'
import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
import Highlight from '@highlight-ai/app-runtime'
import { EllipsisVerticalIcon } from 'lucide-svelte'
import Info from 'lucide-svelte/icons/info'
import Loader from 'lucide-svelte/icons/loader'
import Mic from 'lucide-svelte/icons/mic'
import MicOff from 'lucide-svelte/icons/mic-off'
import Trash2 from 'lucide-svelte/icons/trash-2'
import { onMount } from 'svelte'

let currentTranscript = ''
let notes: Note[] = []
let isRecording = false
let isGenerating = false
let audioInterval: ReturnType<typeof setInterval> | null = null

onMount(async () => {
	await Highlight.appStorage.whenHydrated()
	const storedNotes = Highlight.appStorage.get('notes')
	if (storedNotes) {
		notes = JSON.parse(storedNotes, (key, value) => {
			if (key === 'createdAt') return new Date(value)
			return value
		})
	}
})

const startRecording = async () => {
	isRecording = true
	currentTranscript = ''
	const a = await Highlight.user.getAudio(true)
	console.log('audio transcript', a)
	audioInterval = setInterval(async () => {
		const audio = await Highlight.user.getAudio(true)
		if (typeof audio === 'string' && audio.trim()) {
			currentTranscript += `${audio} `
		}
	}, 1000)
}

const stopRecording = async (): Promise<void> => {
	isRecording = false
	if (audioInterval !== null) {
		clearInterval(audioInterval)
		audioInterval = null
	}
	if (currentTranscript.trim()) {
		try {
			isGenerating = true
			const note = await generateNote(currentTranscript)
			notes = [note, ...notes]
			await saveNotes()
			currentTranscript = ''
		} catch (error) {
			console.error('Error generating note:', error)
		} finally {
			isGenerating = false
		}
	}
}

const generateNote = async (transcript: string): Promise<Note> => {
	const SYSTEMPROMPT = `
		You are a helpful assistant who needs to generate notes for given text.
		Remove unrelated content like sponsorships, ads, or anything that is not related to the main topic.
		Generate a JSON object with the format {title: string, content: string}.
		Do not include any additional text or markdown formatting.
	`

	const MESSAGES = [
		{ role: 'system' as const, content: SYSTEMPROMPT },
		{ role: 'user' as const, content: transcript },
	]

	const textPrediction = Highlight.inference.getTextPrediction(MESSAGES)

	let jsonOutput = ''
	for await (const chunk of textPrediction) {
		jsonOutput += chunk
	}

	jsonOutput = jsonOutput.replace(/```(?:json)?/g, '').trim()
	try {
		const parsedOutput = JSON.parse(jsonOutput)
		if (
			typeof parsedOutput.title !== 'string' ||
			typeof parsedOutput.content !== 'string'
		) {
			throw new Error('Invalid JSON structure')
		}
		return {
			id: crypto.randomUUID(),
			title: parsedOutput.title,
			content: parsedOutput.content,
			createdAt: new Date(),
		}
	} catch (error) {
		console.error('Failed to parse JSON:', jsonOutput)
		return {
			id: crypto.randomUUID(),
			title: 'Error: Failed to generate note',
			content: 'There was an error processing the audio. Please try again.',
			createdAt: new Date(),
		}
	}
}

const saveNotes = async (): Promise<void> => {
	Highlight.appStorage.set('notes', JSON.stringify(notes))
}

const deleteNote = (id: string): void => {
	notes = notes.filter((note) => note.id !== id)
	saveNotes()
}
</script>

<!-- Navbar -->
<div class="flex justify-between items-center pb-4">
	<h1 class="text-2xl font-bold">Notes</h1>
	<Button
		on:click={isRecording ? stopRecording : startRecording}
		variant={isRecording ? 'destructive' : 'default'}
		class="flex items-center gap-2"
	>
		{#if isRecording}
			<MicOff class="w-4 h-4" />
			Stop
		{:else}
			<Mic class="w-4 h-4" />
			Start
		{/if}
	</Button>
</div>

<!-- Recording indicator -->
{#if isRecording}
	<div
		class="flex items-center space-x-2 my-4 p-2 bg-red-100 border border-red-400 rounded"
	>
		<div class="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
		<span class="text-red-500 font-semibold">Recording in progress...</span>
	</div>
{/if}

<!-- Generating notes indicator -->
{#if isGenerating}
	<div
		class="flex items-center space-x-2 my-4 p-2 bg-yellow-100 border border-yellow-400 rounded"
	>
		<Loader class="w-4 h-4 text-yellow-500 animate-spin" />
		<span class="text-yellow-500 font-semibold">Generating notes...</span>
	</div>
{/if}

<section class="grid grid-cols-2 gap-6">
	{#if notes.length === 0}
		<!-- How to use NoteAssist -->
		<Card.Root class="mx-auto">
			<Card.Header>
				<Card.Title class="text-lg font-bold flex items-center gap-2">
					<Info class="w-5 h-5" />
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
				<p>
					4. Your note will be automatically generated and saved in NoteAssist.
				</p>
			</Card.Content>
		</Card.Root>
	{:else}
		<!-- Notes -->
		{#each notes as { id, title, content }}
			<Card.Root>
				<Card.Header>
					<div class="flex justify-between items-center">
						<Card.Title class="text-lg font-bold">{title}</Card.Title>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button
									builders={[builder]}
									variant="ghost"
									size="icon"
									class="h-8 w-8 p-0"
								>
									<span class="sr-only">Open menu</span>
									<EllipsisVerticalIcon size="18" />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								<DropdownMenu.Item on:click={() => deleteNote(id)}>
									<Trash2 size="16" class="mr-3" />
									<span>Delete</span>
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="max-h-96 overflow-y-auto">
						{@html content}
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	{/if}
</section>
