<script lang="ts">
import Highlight from '@highlight-ai/app-runtime'
import { onMount } from 'svelte'
import InstructionCard from './InstructionCard.svelte'
import Navbar from './Navbar.svelte'
import NoteCard from './NoteCard.svelte'
import RecordingStatusIndicator from './RecordingStatusIndicator.svelte'

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

<section class="max-w-xl mx-auto">
	<Navbar {isRecording} {startRecording} {stopRecording} />

	<RecordingStatusIndicator {isRecording} {isGenerating} />

	{#if notes.length === 0}
		<InstructionCard />
	{:else}
		<section class="grid grid-cols-1 gap-8">
			{#each notes as { id, title, content }}
				<NoteCard {id} {title} {content} onDelete={deleteNote} />
			{/each}
		</section>
	{/if}
</section>
