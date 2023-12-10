import { Button } from "@/components/ui/button";
import { DataTable } from "../../components/DataTable";
import Link from "next/link";

export default function ExpertTips() {
	return (
		<div className="flex flex-col w-full h-full p-6">
			<div className="flex flex-row">
				<h1 className="text-2xl">Expert Tips</h1>
				<Link href="/admin/expert-tips/new" className="ml-2">
					<Button size="sm" className="bg-black text-white">
						Add New
					</Button>
				</Link>
			</div>
			<div className="w-full h-full relative">
				<DataTable />
			</div>
		</div>
	);
}
