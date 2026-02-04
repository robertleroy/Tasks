<script>
  import { invalidate } from '$app/navigation';
  import { onMount , tick, enhance, invalidateAll, goto, store } from "$lib";
  import { SortableList, ConfirmBtn, Icon } from "$lib/components";
  import { crossfade, fade, slide } from 'svelte/transition';
  import { afterNavigate } from '$app/navigation';

  let { data } = $props();
  let inputs = $state({});
  let isAdding = $state(false);
  let currentList = $derived(data?.list);
  let addNewItemForm = $state();

  let activeItems = $derived(data.items.filter((item) => !item.checked).toSorted((a, b) => a.activePosition - b.activePosition));

  let checkedItems = $derived(data.items.filter((item) => item.checked).toSorted((a, b) => a.checkedPosition - b.checkedPosition));

  async function updateItem(item) {
    const response = await fetch("/api/items", {
      method: "PATCH",
      body: JSON.stringify({
        id: item.id,
        name: item.name,
        checked: item.checked,
      }),
    });
    if (response.ok) {
      await invalidateAll();
    }
  }

  async function deleteItem(id) {
    await fetch("/api/items", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    await invalidateAll();
  }

  async function handleItemOrderChange(updatedItems, listType) {

    const updates = updatedItems.map((item, index) => {
      if (listType === "active") {
        return { id: item.id, activePosition: index, checkedPosition: index };
      } else {
        return { id: item.id, checkedPosition: index };
      }
    });


    const response = await fetch("/api/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "items",
        updates,
      }),
    });
  

    if (response.ok) {
      await invalidateAll(); 
      console.log("Database updated successfully");
    } else {
      console.error("Database update failed");
    }
  }

  async function createNextItem(currentItem) {
    if (isAdding) return;
    isAdding = true;

    const response = await fetch("/api/items", {
      method: "POST",
      body: JSON.stringify({
        listId: currentList.id,
        afterPosition: currentItem.activePosition,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const newId = result.id;

      await invalidateAll();
      await tick();
      inputs[newId]?.focus();
    }
    isAdding = false;
  }

  async function updateListName(newName) {
    // Only update if the name actually changed

    const res = await fetch("/api/lists", {
      method: "PATCH",
      body: JSON.stringify({
        id: currentList.id,
        name: newName,
      }),
    });

    if (res.ok) {
      await invalidateAll();
    }
  }

  async function deleteList() {
    const res = await fetch("/api/lists", {
      method: "DELETE",
      body: JSON.stringify({ id: currentList.id }),
    });

    if (res.ok) goto("/");
  }

  onMount(async () => {
    
    if (data?.items.length === 0) {
      addNewItemForm.requestSubmit();

    }
  });
</script>

<div class="header">
  <div class="listName">
    {#if currentList}
      <input
        type="text"
        class="editbox"
        value={currentList.name}
        onchange={(e) => updateListName(e.target.value)}
        onkeydown={(e) => {
          if (e.key === "Enter") e.target.blur();
        }}
      />

      <div style="font-size: 1rem;">
        <ConfirmBtn title="delete list" txt2="delete list" warning="true" onconfirm={deleteList} />        
      </div>

    {/if}
  </div>
</div>


<section class="activeList">
  <SortableList items={activeItems} onOrderChange={(ids) => handleItemOrderChange(ids, "active")}>
    {#each activeItems as item (item.id)}
      <div class="listItem" data-id={item.id}
        transition:slide={{ duration: store.listChange ? 0 : 300 }}>
        <div class="drag-handle">
          <Icon name="drag-handle-md" />
        </div>

        <input
          type="checkbox"
          checked={item.checked}
          onchange={(e) => {
            item.checked = e.target.checked;
            updateItem(item);
          }}
        />

        {#key item?.checked}
          <input
            type="text"
            class="editbox"
            bind:this={inputs[item.id]}
            class:strike={item.checked}
            value={item.name ?? ""}
            onchange={(e) => {
              if (item.name !== e.target.value) {
                item.name = e.target.value;
                updateItem(item);
              }
            }}
            onkeydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                createNextItem(item);
              }
            }}
            placeholder="list item.."
          />
        {/key}

        <ConfirmBtn
          title="delete item"
          txt2="delete item"
          warning="true"
          onconfirm={() => {
            deleteItem(item.id);
          }}
        />
      </div>
    {/each}
  </SortableList>

  <div class="addNewItem">
    <form
      bind:this={addNewItemForm}
      method="POST"
      action="?/addItem"
      use:enhance={({ formElement }) => {
        return async ({ result, update }) => {
          if (result.type === "success") {
            const newId = result.data.id;
            await update();
            inputs[newId].focus();
          }
        };
      }}
    >
      <button class="unset" type="submit">
        <Icon name="add-sm" />

        <span style="font-style: italic;">add item</span>
      </button>
    </form>
  </div>
</section>

{#if checkedItems.length > 0}
  <section class="checkedList">
    <hr />
    <SortableList items={checkedItems} onOrderChange={(ids) => handleItemOrderChange(ids, "checked")}>
      {#each checkedItems as item (item.id)}
        <div class="listItem" data-id={item.id}
          transition:slide={{ duration: store.listChange ? 0 : 300 }}>
          <div class="drag-handle">
            <Icon name="drag-handle-md" />
          </div>

          <input
            type="checkbox"
            checked={item.checked}
            onchange={(e) => {
              item.checked = e.target.checked;
              updateItem(item);
            }}
          />
          <span class="strike">{item.name}</span>

          <ConfirmBtn
            title="delete item"
            txt2="delete item"
            warning="true"
            onconfirm={() => {
              deleteItem(item.id);
            }}
          />
        </div>
      {/each}
    </SortableList>
  </section>
{/if}

<style>
  .header {
    .listName {
      font-size: var(--h3);
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;

      input.editbox {
        font-size: inherit;
      }
    }
  }
  .listItem {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    padding: 4px 0;

    .strike {
      text-decoration: line-through;
    }
    [type="checkbox"] {
      /* font-size: 1.25em; */
      --cb-size: 1.125rem;
      &::before,
      &::after {
        /* top: 0.25em; */
        top: 0.1875em;
      }
    }
  }
  .activeList {
    margin-block: 1rem;
    input[type="text"] {
      flex: 1;
    }
  }
  .checkedList {
    margin-block: 1rem;
    span {
      padding: 0 1ch;
      flex: 1;
      color: var(--fg-muted) !important;
    }
    hr {
      margin-block: 2rem;
    }
  }
  .addNewItem {
    font-size: inherit;
    margin: 1rem 0;
    opacity: 0.8;

    span {
      font-size: 0.875em;
    }

    button.unset {
      display: flex;
      align-items: center;
      gap: 0 1ch;
      width: fit-content;
      padding: 0;
    }
  }
</style>
