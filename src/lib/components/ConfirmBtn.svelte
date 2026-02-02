<script>
  import { Icon } from "$lib/components";
  let { txt1=null, txt2="🗙", warning=false, onconfirm, ...attr } = $props();
  let pending = $state(false);


	function clickOutside(node) {
		const handleClick = (event) => {
			if (!node.contains(event.target)) 
				node.dispatchEvent(new CustomEvent('outclick'));
		};
		document.addEventListener('click', handleClick, true);
	
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
		}};
	}
</script>   
<!-- <div class=""></div> -->
  
<button use:clickOutside class="unset" {...attr}
	class:warning={warning && pending} 
	onclick={() => {
		if (pending) onconfirm();
		pending = !pending;
	}}
	onoutclick={() => pending = false}>
  <!-- {pending ? txt2 : txt1} -->
   {#if pending}
   {txt2}
   {:else}
   <Icon name="cancel_sm" />
   {/if}
</button>

<style>
	.warning {
		color: hsl(from tomato h s l / 0.8);
		text-shadow: 0 0 12px hsl(from tomato h s l / 0.3);
    box-shadow: none;
	}
</style>

<!-- 
import { ConfirmBtn } from "$lib/components";

<ConfirmBtn 
  txt1="delete" 
  txt2="confirm delete" 
  warning=true
  onconfirm={(msg) => {
    console.log("onconfirm", msg);
}}/>
-->