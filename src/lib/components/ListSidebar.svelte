<script>
  import { SortableList } from '$lib/components';
  import { slide } from 'svelte/transition';
  import Icon from './Icon.svelte';
  import { store } from "$lib";
  
  let { lists=[], detailPath="/", onnav } = $props();

  let sortedItems = $derived(lists.toSorted((a, b) => a.position - b.position));

  async function handleListOrderChange(updatedItems) {

    const updates = updatedItems.map((item, index) => {
      return { id: item.id, position: index };
    });
    
    const response = await fetch('/api/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'lists',
        updates,
      })
    });

    lists = lists;

    if (response.ok) {
        console.log("Database updated successfully");
    } else {
        console.error("Database update failed");
    }
  }
</script>

<SortableList items={lists} onOrderChange={(ids) => handleListOrderChange(ids)}>
  {#each sortedItems as list (list.id)}
    <div class="row" data-id={list.id}
      transition:slide>
      <div class="drag-handle"><Icon name="drag-handle-md"/></div>
      <a href="/{list.id}"
        onclick={() => {
          store.listChange = true;
          setTimeout(() => store.listChange = false, 50);
          onnav();
        }}>{list.name}</a>
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