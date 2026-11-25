/**
 * Apply the stored or system color scheme before first paint. next-themes did
 * this too, but pulled a client provider into every page's JS. The `d` hotkey
 * still toggles `html.dark` and `localStorage.theme`.
 */
const boot = `(function(){try{var t=localStorage.getItem("theme");var dark=t==="dark"||((t==="system"||t==null)&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);}catch(e){document.documentElement.classList.add("dark")}})()`

export function ThemeScript() {
	return <script dangerouslySetInnerHTML={{ __html: boot }} />
}
