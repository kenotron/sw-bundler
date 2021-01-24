import { square } from "./square.js";

const root = document.createElement("div");
root.innerHTML = `${square(15)}`;
document.body.appendChild(root);
