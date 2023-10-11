import { supabase } from "../../../utils/supabase";

export default async function Posts() {
	const { data: posts } = await supabase.from("posts").select();
	console.log(posts);
	return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}
