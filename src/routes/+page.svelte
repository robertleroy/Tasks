<script>
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { store } from "$lib";
  let title = $state("Tasks");
  let { data, form } = $props();
</script>

<div class="listsLandingPage">
  <div class="header">
    <div class="h2">{title}</div>

    <div class="newListForm">
      <form
        method="POST"
        action="?/createList"
        use:enhance={() => {
          return async ({ result, update }) => {
            if (result.type === "success") {
              const id = result.data.id;

              await goto(`/${id}`);
            }
            update();
          };
        }}
      >
        <input type="text" id="newListName" name="name" placeholder="new list name.." required />
        <button type="submit">add list</button>
      </form>

      {#if form?.message}
        <div class="error">{form.message}</div>
      {/if}
    </div>
  </div>

  <div class="body">
    <div class="placeholder">no list selected..</div>
  </div>
</div>

<style>
  .listsLandingPage {
    --vertical-align: top;
    display: grid;
    grid-template-rows: var(--header-height) 1fr;
    height: 100%;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem 0.25rem;
    flex-wrap: wrap;

    .h2 {
      font-weight: bolder;
      flex: 1;
    }

    .newListForm {
      /* margin-block: 0.5rem; */
      form {
        display: contents;
      }
      input {
        width: 10rem;
        min-width: 4rem;
      }
      .error {
        color: tomato;
        margin-block: 1rem;
        font-size: 0.875em;
        text-align: right;
        font-style: italic;
      }
    }
  }

  .placeholder {
    color: var(--fg-muted);
    font-style: italic;
    margin: 4rem;
    width: fit-content;
  }
</style>
