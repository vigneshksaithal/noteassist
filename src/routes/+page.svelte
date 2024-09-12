<script lang="ts">
import { Button } from "$lib/components/ui/button"
import * as Card from "$lib/components/ui/card"
import Highlight from "@highlight-ai/app-runtime"
import { onMount } from "svelte"

let currentNote: Note = {
	id: "",
	title: "",
	content: "",
	createdAt: new Date(),
}
let currentTranscript = ""
let notes: Note[] = []
let isRecording = false
let audioInterval: number | null = null

onMount(async () => {
	console.log("ON MOUNT")

	currentNote = {
		id: "",
		title: "",
		content: "",
		createdAt: new Date(),
	}
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
		notes = [
			...notes,
			{ id: "", title: "", content: note, createdAt: new Date() },
		]
		Highlight.appStorage.set("notes", JSON.stringify(notes))
		currentTranscript = ""
	}
}

const generateNote = async (transcript: string) => {
	const SYSTEMPROMPT = `
			You are a helpful assistant who needs to generate notes for given text.
			Remove unrelated content like sponsorhips, ads, or anything that is not related to the main topic.
			The notes should be in markdown format.
			Generate only the notes, dont add "I am a AI assistant" or anything like that.
			Don't give any other text than the notes.
			Just give the notes in the markdown format thats it.
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

	let note = ""
	for await (const chunk of textPrediction) {
		console.log("Incoming chunk:", chunk)
		note += chunk
	}

	return note
}
</script>

<h1 class="text-2xl font-bold">NoteAssist</h1>
{#if !isRecording}
	<Button
		on:click={() => {
			currentTranscript = "";
			currentNote = {
				id: "",
				title: "",
				content: "",
				createdAt: new Date(),
			};
			startRecording();
		}}
	>
		Start Noting...
	</Button>
{:else}
	<Button on:click={stopRecording}>Stop noting</Button>
{/if}

<section class="grid grid-cols-2 gap-4">
	{#each notes as { title, content }}
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-lg font-bold">{title}</Card.Title>
			</Card.Header>
			<Card.Content>
				{@html content}
			</Card.Content>
		</Card.Root>
	{/each}
</section>
