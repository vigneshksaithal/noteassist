# NoteAssist

NoteAssist is a web application that allows users to record audio and automatically generate notes from the transcript. It leverages AI to process the audio input and create structured notes, making it easier to capture important information from videos or lectures.

## Features

- **Audio Recording**: Start and stop audio recording with a simple button click.
- **Automatic Note Generation**: Transcripts are processed to generate structured notes in JSON format.
- **Storage**: Notes are saved in local storage for easy retrieval.
- **User-Friendly Interface**: Intuitive UI with recording indicators and note display.

## Technologies Used

- **Svelte**: A modern JavaScript framework for building user interfaces.
- **SvelteKit**: A framework for building Svelte applications with routing and server-side rendering.
- **TypeScript**: A superset of JavaScript that adds static types.
- **TailwindCSS**: A utility-first CSS framework for styling.
- **Highlight AI**: Used for audio processing and note generation.

## Installation

To get started with NoteAssist, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd noteassist
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Run the development server**:

   ```bash
   pnpm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`.

## Usage

1. Click the "Start" button to begin recording your audio.
2. Play the video or lecture you want to take notes on.
3. Click "Stop" when you're done recording.
4. Your notes will be automatically generated and displayed.

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the developers of Svelte, SvelteKit, and TailwindCSS for their amazing frameworks.
- Special thanks to Highlight AI for providing the audio processing capabilities.
