<script lang="ts">
import { Button } from '$lib/components/ui/button'
import * as Card from '$lib/components/ui/card'
import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
import EllipsisVerticalIcon from 'lucide-svelte/icons/ellipsis-vertical'
import Trash2 from 'lucide-svelte/icons/trash-2'

export let id: string
export let title: string
export let content: string
export let onDelete: (id: string) => void

const deleteNote = () => {
	onDelete(id)
}
</script>

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
					<DropdownMenu.Item class="flex justify-between" on:click={deleteNote}>
						<span>Delete</span>
						<Trash2 size="16" />
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
