import { Button } from "@/components/ui/button";

export default function ContentHeader() {
	return (
		<div className="bg-gray-50 flex flex-row w-full justify-between border-b border-gray-100 p-2 sticky top-[32px] z-10">
			<h1 className="text-2xl font-bold">New Expert Tip</h1>
			<div className="space-x-2">
				<span className="text-xs">Auto Saved 32 seconds ago</span>
				<Button type="submit" size="sm" className="bg-black text-white">
					Save
				</Button>
			</div>
		</div>
	);
}
