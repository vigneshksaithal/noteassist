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
			<Card.Title tag="h2">{title}</Card.Title>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" size="icon">
						<span class="sr-only">Open menu</span>
						<EllipsisVerticalIcon size="18" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item on:click={deleteNote}>
						<Trash2 size="16" class="mr-2" />
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
