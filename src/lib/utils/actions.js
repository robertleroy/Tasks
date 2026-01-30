export function clickOutside(node, enabled = true) {
  const handleClick = (event) => {
    if (enabled && node && !node.contains(event.target)) {

      /************* EXCEPTION!!! *************/
      const clickedButton = event.target.closest(".addingListToggle");
      if (clickedButton) {
        return; // Skip outclick for button or its children
      }

      node.dispatchEvent(new CustomEvent("outclick", { detail: event }));
    }
  };

  // Small delay to avoid triggering on the same click that mounted the element
  const timeout = setTimeout(() => {
    document.addEventListener("click", handleClick, true);
  }, 0);

  return {
    update(newEnabled) {
      enabled = newEnabled;
    },
    destroy() {
      clearTimeout(timeout);
      document.removeEventListener("click", handleClick, true);
    },
  };
}
/*

<button onclick={() => isOpen = true}>Open</button>

{#if isOpen}
  <div use:clickOutside={isOpen} onoutclick={() => isOpen = false}>
    Modal content
  </div>
{/if}
end clickOutside*/

