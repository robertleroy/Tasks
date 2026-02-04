export 	let store = $state({
  darkmode: false,  
  selectedList: null,
  listChange: false,
  notice: null,
  lists: [
    { 
      id: "54916f",
      name: "Tasks", 
      items: [
        { id: "bea0c6", checked: false, name: "Complete responsive layout" },
        { id: "adeb2c", checked: true, name: "Test 360px viewport" },
        { id: "5610b8", checked: false, name: "Add mobile-first CSS" },
        { id: "e41d30", checked: true, name: "Review US screen stats" },
        { id: "04b673", checked: false, name: "Fix Moto G Power display" },
        { id: "377a4a", checked: false, name: "Deploy mobile version" }
      ]
    },
    { 
      id: "b60f00",
      name: "Shopping", 
      items: [
        { id: "1c4c4e", name: "Milk", checked: false },
        { id: "5655af", name: "Eggs", checked: true },
        { id: "bfe74d", name: "Bread", checked: false },
        { id: "fb6151", name: "Apples", checked: true },
        { id: "ee06d2", name: "Chicken", checked: false },
        { id: "5509d3", name: "Rice", checked: true },
        { id: "207fc2", name: "Cheese", checked: false },
        { id: "cc680f", name: "Coffee", checked: true }
      ]
    },
  ],
});


export function swipe(node) {
	let startX = 0, 
			startY = 0,
			endX = 0, 
			endY = 0,
			timeStart = null,
			detail = clearDetail();
	const swipeThreshold = 50,
				notEnoughTime = 10,
				timeThreshold = 300;
	node.style.touchAction = "none";

	function setTimeDown() { timeStart = Date.now(); }
	function clearDetail() { return { pointerType: "", direction: "" }}
	function handleSwipe(e) {
	  let timeDiff = Date.now() - timeStart;
	  const diffX = endX - startX;
	  const diffY = endY - startY;
	  timeStart = null;
		detail.pointerType = e.pointerType;

		if (timeDiff < notEnoughTime || timeDiff > timeThreshold) return;
		if (Math.abs(diffX) < swipeThreshold && Math.abs(diffY) < swipeThreshold) return;
		
		if (Math.abs(diffX) > Math.abs(diffY)) {
	    /* Horizontal swipe *********** */
			if (diffX > 0) detail.direction = "right";
			else detail.direction = "left";
	  } else {
	    /* Vertical swipe *********** */
			if (diffY > 0) detail.direction = "down";
			else detail.direction = "up";
	  }
		node.dispatchEvent(new CustomEvent("swipe", {detail}));	
		detail = clearDetail();
	}

	$effect(() => {
		node.addEventListener("pointerdown", (e) => {
			startX = e.clientX;
			startY = e.clientY;
			setTimeDown();
		});
		node.addEventListener("pointerup", (e) => {
			endX = e.clientX;
			endY = e.clientY;
			handleSwipe(e);
		});

		return {
			destroy() {
				node.removeEventListener("pointerdown", handleSwipe);
				node.removeEventListener("pointerup", handleSwipe);
			}
		}
	});
}
/*
<script>  
  import { swipe } from "$lib";
</script>

<div class="swiper" use:swipe 
	onswipe={(e) => {
    const {pointerType,direction} = e.detail;
    console.log("swipe",pointerType,direction);
  }}>Swipe Me
</div>

*/