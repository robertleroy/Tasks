export 	let store = $state({
  darkmode: false,  
  selectedList: null,
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