
export function focus(node) {
  node.focus();
  return {
    update() {},
    destroy() {}
  };
}
/* 
import { focus } from "$lib";
<input type="text" {@attach focus}>
*/

