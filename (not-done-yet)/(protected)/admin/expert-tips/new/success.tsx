import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Success({ data }) {
	console.log(data);
	return (
		<Alert className="bg-green text-white mb-4 border-green-700">
			<AlertTitle>{data.content}</AlertTitle>
			<AlertDescription>
				Link: <Link href={data.link}>{data.link}</Link>
			</AlertDescription>
		</Alert>
	);
}
