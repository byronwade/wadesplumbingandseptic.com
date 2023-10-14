import { supabase } from "../../../utils/supabase";

export default async function Posts() {
	const { data: posts } = await supabase.from("tips").select();
	console.log(posts);
	return (
		<>
			<h1>This is the admin page</h1>
		</>
	);
}
