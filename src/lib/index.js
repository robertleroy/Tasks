  export { onMount, tick } from "svelte";
  export { page } from "$app/state";
  export { dev } from "$app/environment";
  export { invalidateAll, goto } from "$app/navigation";
  export { enhance } from "$app/forms";

  
  export const config = {
  appname: "Tasks",
  cookieNames: {    
    theme: "tasks_theme",
    session: "tasks_session",
  },
  // routes: [
  //   { name: "Home", path: "/" },
  //   { name: "Icons", path: "/icons" },
  //   { name: "Lists", path: "/lists" },
  //   { name: "About", path: "/about" },
  // ],
}

export * from "./store.svelte.js";
export * from "./utils/functions";
export { clickOutside } from "./utils/actions";
export { focus } from "./utils/attachments";
