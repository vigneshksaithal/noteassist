<script lang="ts">
import { Button } from "$lib/components/ui/button"
import * as Card from "$lib/components/ui/card"
import Highlight from "@highlight-ai/app-runtime"
import { onMount } from "svelte"

let currentTranscript = ""
let notes: Note[] = []
let isRecording = false
let audioInterval: number | null = null

onMount(async () => {
	await Highlight.appStorage.whenHydrated()
	const storedNotes = Highlight.appStorage.get("notes")
	if (storedNotes) {
		notes = JSON.parse(storedNotes)
	}
})

const startRecording = async () => {
	isRecording = true
	currentTranscript = ""
	const a = await Highlight.user.getAudio(true)
	console.log("audio transcript", a)
	audioInterval = setInterval(async () => {
		const audio = await Highlight.user.getAudio(true)
		if (typeof audio === "string" && audio.trim()) {
			currentTranscript += `${audio} `
		}
	}, 1000)
}

const stopRecording = async () => {
	isRecording = false
	if (audioInterval !== null) {
		clearInterval(audioInterval)
		audioInterval = null
	}
	if (currentTranscript.trim()) {
		const note = await generateNote(currentTranscript)
		const newNote: Note = {
			id: crypto.randomUUID(),
			title: note.title,
			content: note.content,
			createdAt: new Date(),
		}
		notes = [...notes, newNote]
		await saveNotes()
		currentTranscript = ""
	}
}

const generateNote = async (transcript: string) => {
	const SYSTEMPROMPT = `
			You are a helpful assistant who needs to generate notes for given text.
			Remove unrelated content like sponsorships, ads, or anything that is not related to the main topic.
			Generate a JSON object with the format {title: string, content: string}.
			Do not include any additional text or markdown formatting.
		`

	const MESSAGES = [
		{
			role: "system" as const,
			content: SYSTEMPROMPT,
		},
		{
			role: "user" as const,
			content: transcript,
		},
	]

	const textPrediction = Highlight.inference.getTextPrediction(MESSAGES)

	let jsonOutput = ""
	for await (const chunk of textPrediction) {
		console.log("Incoming chunk:", chunk)
		jsonOutput += chunk
	}

	jsonOutput = jsonOutput.replace(/^```|```$/g, "")
	const parsedOutput = JSON.parse(jsonOutput)
	return { title: parsedOutput.title, content: parsedOutput.content }
}

const saveNotes = async () => {
	Highlight.appStorage.set("notes", JSON.stringify(notes))
}

const deleteNote = (id: string) => {
	notes = notes.filter((note) => note.id !== id)
	saveNotes()
}
</script>

<!-- Navbar -->
<div class="flex justify-between items-center py-2">
	<h1 class="text-2xl font-bold">NoteAssist</h1>
	{#if !isRecording}
		<Button on:click={startRecording}>
			Start
		</Button>
	{:else}
		<Button variant="destructive" on:click={stopRecording}>Stop</Button>
	{/if}
</div>

{#if isRecording}
	<div class="flex justify-center items-center my-4 space-x-2">
		<div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
		<div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
		<div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
	</div>
{/if}

<section class="grid grid-cols-2 gap-4">
	{#if notes.length === 0}
		<Card.Root class="mx-auto">
			<Card.Header>
				<Card.Title class="text-lg font-bold">How to use NoteAssist</Card.Title>
			</Card.Header>
			<Card.Content>
				<p>1. Click the "Start" button to begin recording.</p>
				<p>2. Speak clearly into your microphone.</p>
				<p>3. Click "Stop" when you're done.</p>
				<p>4. Your note will be automatically generated and saved.</p>
			</Card.Content>
		</Card.Root>
	{:else}
		{#each notes as { id, title, content }}
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-lg font-bold">{title}</Card.Title>
				</Card.Header>
				<Card.Content class="max-h-96 overflow-y-auto">
					{@html content}
				</Card.Content>
				<Card.Footer class="flex justify-end">
					<Button variant="destructive" on:click={() => deleteNote(id)}>Delete</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	{/if}
</section>
