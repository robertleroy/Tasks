# Tasks


    A multilist tasks app 
        persisted to a sqLite database..
            ..served over a Tailscale network


## Deployment Stack Summary

The app is a multilist tasks app (checklists)
- **SvelteKit** (latest/v5)
  - **Svelte 5 & Runes** used wherever posible
    - styling: standard CSS/Svelte transitions
  - **SortableJS**: drag-and-drop 
    - list and item management
  - **Lucia** based custom auth/ protected routes
    - serverside useing cookies, locals & hooks
  - **Drizzle-orm**
    - sqlite:libsql
  - Stand alone app using **@sveltejs/adapter-node**
- **Raspberry Pi 4 8gb** 
  - **Samsung T7**: original standard 1T
    - boot load & storage.
  - **Docker**: Node.js 20 (Alpine Linux via Docker)
    - Port Mapping: Host 3002 → Container 3000
  - **Github**: repository
  - **Portainer**: stack/container management
    - deployed from **github**
  - **Tailscale**: access via private mesh VPN



---

<br>

```sh
git add . && git commit -m "Fixe reorder persistance for lists"
git push
```