/**
 * Apply the stored color scheme before first paint. Unset storage keeps the
 * dark default (same as next-themes defaultTheme). Only an explicit "system"
 * value follows the OS. The `d` hotkey still toggles `html.dark`.
 */
const boot = `(function(){try{var t=localStorage.getItem("theme");var dark=t==="light"?false:t==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches:true;document.documentElement.classList.toggle("dark",dark);}catch(e){document.documentElement.classList.add("dark")}})()`

export function ThemeScript() {
	return <script dangerouslySetInnerHTML={{ __html: boot }} />
}
