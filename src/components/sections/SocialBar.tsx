"use client";
import { useState, useCallback } from "react";
import { FacebookShareButton, TwitterShareButton, RedditShareButton, LinkedinShareButton } from "react-share";
import { usePathname } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiLink } from "react-icons/hi2";
import { RiFacebookCircleFill, RiTwitterFill, RiLinkedinBoxFill, RiRedditFill } from "react-icons/ri";

export default function SocialBar() {
	const [isCopied, setIsCopied] = useState(false);
	const pathname = usePathname();
	const url = `https://wadesplumbingandseptic.com${pathname}`;

	const handleCopyLink = useCallback(() => {
		navigator.clipboard.writeText(url);
		setIsCopied(true);
		toast.success("Link copied to clipboard!");
	}, [url]);

	return (
		<>
			<ToastContainer className="!top-32" />
			<aside aria-label="Share social media">
				<div className="space-x-1">
					<FacebookShareButton url={url} className="!inline-flex !items-center !p-2 !text-sm !font-medium !text-center !text-gray-500 !bg-white !rounded hover:!bg-gray-100 focus:!ring-4 focus:!outline-none" type="button">
						<RiFacebookCircleFill className="w-6 h-6 text-gray-500 dark:text-gray-400" />
					</FacebookShareButton>
					<TwitterShareButton url={url} className="!inline-flex !items-center !p-2 !text-sm !font-medium !text-center !text-gray-500 !bg-white !rounded hover:!bg-gray-100 focus:!ring-4 focus:!outline-none" type="button">
						<RiTwitterFill className="w-6 h-6 text-gray-500 dark:text-gray-400" />
					</TwitterShareButton>
					<RedditShareButton url={url} className="!inline-flex !items-center !p-2 !text-sm !font-medium !text-center !text-gray-500 !bg-white !rounded hover:!bg-gray-100 focus:!ring-4 focus:!outline-none" type="button">
						<RiRedditFill className="w-6 h-6 text-gray-500 dark:text-gray-400" />
					</RedditShareButton>
					<LinkedinShareButton url={url} className="!inline-flex !items-center !p-2 !text-sm !font-medium !text-center !text-gray-500 !bg-white !rounded hover:!bg-gray-100 focus:!ring-4 focus:!outline-none" type="button">
						<RiLinkedinBoxFill className="w-6 h-6 text-gray-500 dark:text-gray-400" />
					</LinkedinShareButton>
					<button onClick={handleCopyLink} className="!inline-flex !items-center !p-2 !text-sm !font-medium !text-center !text-gray-500 !bg-white !rounded hover:!bg-gray-100 focus:!ring-4 focus:!outline-none" type="button">
						<HiLink className="w-6 h-6 text-gray-500 dark:text-gray-400" />
					</button>
				</div>
			</aside>
		</>
	);
}
