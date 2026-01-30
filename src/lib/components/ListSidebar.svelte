<script>
  import { SortableList } from '$lib/components';
  import Icon from './Icon.svelte';
  
  let { lists=[], detailPath="/" } = $props();

  let sortedItems = $derived(lists.toSorted((a, b) => a.position - b.position));

  async function handleReorder(updatedItems) {
    const payload = updatedItems.map(i => ({ id: i.id, position: i.position }));
    
    console.log("Sending new order to API:", payload);

    const response = await fetch('/api/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'lists',
        updates: payload
      })
    });

    if (response.ok) {
        console.log("Database updated successfully");
    } else {
        console.error("Database update failed");
    }
  }
</script>

<SortableList bind:items={lists} onOrderChange={handleReorder}>
  {#each sortedItems as list (list.id)}
    <div class="row" data-id={list.id}>
      <div class="drag-handle">⋮⋮</div>
      <a href="/{list.id}">{list.name}</a>
    </div>
  {/each}
</SortableList>

<style>
  .row {
    display: flex;
    align-items: center;
    gap: 0 0.25rem;
  }
</style>