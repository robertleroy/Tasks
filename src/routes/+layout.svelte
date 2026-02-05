<script>
  import { onMount, tick, page, dev, enhance, invalidateAll, goto, config, store, clickOutside, swipe } from "$lib";
  import { dev_icon, favicon, circles } from "$lib/assets";
  import { ConfirmBtn, Icon, ListSidebar, MenuToggle } from "$lib/components";
  import "./app.css";

  let { data, children } = $props();

  let currentList = $derived(page.data.list);
  let appWidth = $state(0);
  let showSidebar = $state(true);
  let addingList = $state(false);

  $effect(() => {
    if (appWidth > 600) {
      showSidebar = true;
    }
    if (appWidth < 600) {
      showSidebar = false;
    }
  });

  onMount(() => {
    const dataset_theme = document.documentElement.dataset.theme;

    if (dataset_theme) {
      store.darkmode = dataset_theme === "dark";
      return;
    }
    const browserPrefDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    store.darkmode = browserPrefDark;
    set_theme(store.darkmode);
  });

  function set_theme(isDark = false) {
    const exp = 60 * 60 * 24 * 365; /*** 1yr ***/
    const val = isDark ? "dark" : "light";

    document.cookie = `${config.cookieNames.theme}=${val}; max-age=${exp}; path=/; 
    secure=true,
    httpOnly=true,
    SameSite=lax`;
    document.documentElement.dataset.theme = val;
  }
</script>

<svelte:head>
  <title>{config.appname}{dev ? " : dev" : ""}</title>
  {#key store.darkmode}
    <link rel="icon" href={dev ? dev_icon : favicon} />
  {/key}
</svelte:head>

<div class="app" bind:clientWidth={appWidth}>
  <header>
    <div class="inner">
      {#if data?.user}
        <div class="titlebar">
          <button
            class="unset sidebarToggleBtn"
            title="toggle sidebar"
            onclick={() => {
              showSidebar = !showSidebar;
            }}
          >
            <MenuToggle toggled={showSidebar} />
          </button>

          <div class="brand">
            <a href="/">
              <span class="title">{config.appname} </span>
              {#if dev}
                <span> : {appWidth}</span>
              {/if}
            </a>
          </div>
        </div>

        <div class="featurebar">
          <!-- spacer for now -->
        </div>

        <div class="settings">
          <button
            class="unset"
            title="settings"
            id="settings_anchor"
            popovertarget="settings_target"
          >
            <Icon name="settings" />
          </button>
        </div>
      {/if}
    </div>
  </header>

  <main use:swipe
    onswipe={(e) => {
    const {pointerType,direction} = e.detail;
    if (appWidth < 600) {
      if (direction === "right" && showSidebar === false) {
        showSidebar = true
      } else if (direction === "left" && showSidebar === true) {
        showSidebar = false
      }
    }
  }}
  >
    <aside class:hideSidebar={!showSidebar}>
      <div class="sidebar">
        {#if data?.user}

          <button class="addNewListBtn link"
            onclick={async () => {
              goto("/#newListName");
              await tick();
              if (appWidth < 600 && showSidebar === true) {
                showSidebar=false;
              }              
          }}>
            <Icon name="add" />
          </button>

          <div class="featurenav">
            <nav class="index">
              <ListSidebar lists={data.lists} 
                onnav={() => {
                  if (appWidth < 600) {
                    showSidebar=false;
                  }
                }}/> 
            </nav>
          </div>
        {/if}
      </div>
      <!-- sidebar -->
    </aside>

    <section class="router">
      <div class="inner">
        <div class="page">
          {@render children()}
        </div>
      </div>
    </section>
  </main>
  <!-- row -->

  <footer>
    <div class="inner">
      <!-- <span>{store?.notice}</span> -->
    </div>
  </footer>

  <!-- #region Settings Popover -->
  <div id="settings_target" popover>
    <a
      href="/account"
      class="unset"
      onclick={() => {
        if (appWidth < 600 && showSidebar === true) {
          showSidebar = false;
        }
        const settings_target = document.getElementById("settings_target");
        settings_target.hidePopover();
      }}>account</a
    >

    <button
      class="unset"
      onclick={() => {
        store.darkmode = !store.darkmode;
        set_theme(store.darkmode);
      }}
    >
      {store.darkmode ? "dark" : "light"} theme
    </button>

    <hr />

    <form
      method="POST"
      action="/?/logout"
      use:enhance={() => {
        const user_target = document.getElementById("settings_target");
        user_target.hidePopover();
        return async ({ result, update }) => {
          const username = data.user.username;
          if (result.type === "success" && result.data?.loggedout) {
            store.notice = `logged out: ${username}`;
          }
          await update({ reset: true });
        };
      }}
    >
      <button class="unset"> log out </button>
    </form>
  </div>
  <!-- #endregion Settings Popover -->
</div>

<!-- app -->

<style>
</style>
