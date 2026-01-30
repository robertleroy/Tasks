<script>
  import { icons } from "$lib/components/icons";
  import { Icon, CopyBar } from "$lib/components";

  let title = $state("Icons");
  let { data } = $props();
  let selectedIcon = $state(icons[30]);
  let fs = $state(1.5);
</script>

<section>
  <div class="header">
    <h2 class="">
      {title}
    </h2>

    <input type="number" bind:value={fs} min="1" max="4" step="0.5" />
  </div>

  <div class="flex">
    {#each icons as icon}
      <button
        class="unset"
        style:font-size="{fs}em"
        title={icon.tags[0]}
        onclick={() => {
          selectedIcon = icon;
        }}
      >
        <Icon name={icon.tags[0]} />
      </button>
    {/each}
  </div>

  <hr />

  <div class="selectedIcon">
    {#if selectedIcon}
      <div class="selectedName">
        <span>{selectedIcon.tags[0]}</span>
        <Icon name={selectedIcon.tags[0]} />
      </div>

      <div class="block">
        <CopyBar title={selectedIcon.tags[0]} style="padding-top: 0; margin-bottom: 0.5rem; " />
        <pre>&lt;svg xmlns="http://www.w3.org/2000/svg" viewBox={selectedIcon.viewbox};&gt;
  {selectedIcon.vectors}
&lt;/svg&gt;</pre>
      </div>
    {/if}
  </div>
</section>

<style>
  section {
    max-width: 720px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0 1ch;
    margin-bottom: 2rem;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
    gap: 1em 2em;
    button {
      place-items: center;
      height: 1.5em;
      width: 1.5em;
    }
  }

  hr {
    margin: 3rem 0;
  }

  .selectedName {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0 1ch;
    /* color: var(--fg-muted); */

    font-size: var(--h3);
  }

  :global(section .flex button) {
    outline: 1px solid hsl(0 0 50 / 0.2) !important;
  }
  .block {
    padding: 1rem;
    border-radius: 0.5rem;
    width: clamp(400px, 100% 700px);
    background: light-dark(hsl(210 30 93), hsl(210 10 8));
    box-shadow: 3px 3px 6px hsl(0 0 0 / 0.3);
  }
</style>
