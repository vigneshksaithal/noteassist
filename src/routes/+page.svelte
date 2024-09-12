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
	Highlight.appStorage.delete("notes")

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
			{
				id: "",
				title: note.title,
				content: note.content,
				createdAt: new Date(),
			},
		]
		Highlight.appStorage.set("notes", JSON.stringify(notes))
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

	const parsedOutput = JSON.parse(jsonOutput)
	return { title: parsedOutput.title, content: parsedOutput.content }
}
</script>

<!-- Navbar -->
<div class="flex justify-between items-center">
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
		Start
	</Button>
{:else}
	<Button on:click={stopRecording}>Stop</Button>
{/if}
</div>

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
