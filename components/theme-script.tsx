/**
 * Apply the stored color scheme before first paint, and toggle it with `d`.
 * Unset storage keeps the dark default. Only an explicit "system" value
 * follows the OS. The hotkey used to be a React island on every page.
 */
const boot = `(function(){try{var t=localStorage.getItem("theme");var dark=t==="light"?false:t==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches:true;document.documentElement.classList.toggle("dark",dark);}catch(e){document.documentElement.classList.add("dark")}function typing(el){if(!el||el.nodeType!==1)return false;if(el.isContentEditable)return true;var n=el.tagName;return n==="INPUT"||n==="TEXTAREA"||n==="SELECT"||!!el.closest("input, textarea, select, [contenteditable='true']")}document.addEventListener("keydown",function(e){if(e.metaKey||e.ctrlKey||e.altKey)return;if((e.key||"").toLowerCase()!=="d")return;if(typing(e.target))return;e.preventDefault();var next=document.documentElement.classList.contains("dark")?"light":"dark";document.documentElement.classList.toggle("dark",next==="dark");try{localStorage.setItem("theme",next)}catch(err){}})})()`

export function ThemeScript() {
	return <script dangerouslySetInnerHTML={{ __html: boot }} />
}
