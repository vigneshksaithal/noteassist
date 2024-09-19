declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Note {
		id: string
		title: string
		content: string
		createdAt: Date
	}
}

export type { }
