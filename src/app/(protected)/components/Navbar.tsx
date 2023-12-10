import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
	return (
		<div className="dark:bg-black dark:text-white fixed flex flex-row w-full text-center items-center justify-between h-[32px] top-0 z-20 px-1">
			<div className="flex flex-row">
				<Image className="hover:bg-gray-100 dark:hover:bg-black-200 p-1" src="/WadesLogo.webp" alt="logo" width={28} height={28} />
				<div className="flex flex-row text-sm items-center ml-1">
					<Link className="hover:bg-gray-100 dark:hover:bg-black-200 px-2 py-1" href="https://www.wadesplumbingandseptic.com">
						My Website
					</Link>
					<Link className="hover:bg-gray-100 dark:hover:bg-black-200 px-2 py-1" href="/">
						New Post
					</Link>
				</div>
			</div>
			<div className="flex flex-row ml-3">
				<Link href="/" className="text-sm hover:bg-gray-100 dark:hover:bg-black-200 px-2 py-1 flex flex-row">
					Hi, Byron Wade
					<Avatar className="h-5 w-5 ml-2">
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</Link>
			</div>
		</div>
	);
}
