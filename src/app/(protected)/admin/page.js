import { supabase } from "../../../utils/supabase";

export default async function Posts() {
	const { data: posts } = await supabase.from("tips").select();
	console.log(posts);
	return (
		<>
			<div className="flex flex-row">
				<div className="flex flex-col w-1/5">
					<h1 className="text-3xl font-bold">Menu</h1>
				</div>
				<div className="flex flex-col">
					<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">button</button>
				</div>
			</div>
		</>
	);
}
