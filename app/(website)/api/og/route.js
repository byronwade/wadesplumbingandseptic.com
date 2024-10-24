/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
export const runtime = "edge";

export async function GET(req) {
	try {
		// Get searchParams
		const { searchParams } = new URL(req.url);

		// Define default values
		const title = searchParams.get("title")?.slice(0, 100) || "Minimal blog";
		const link = searchParams.get("link") || "https://www.wadesplumbingandseptic.com/";
		const description = (searchParams.get("description")?.slice(0, 200) || "This is a description...") + "...";

		// Create image response
		const imageResponse = new ImageResponse(
			(
				<div tw="flex flex-col bg-black h-full w-full">
					<div tw="flex flex-col p-4 align-center">
						<img tw="absolute top-25 left-25" alt="Vercel" height={100} width={100} src="https://www.wadesplumbingandseptic.com/WadesLogo.png" />
						<div tw="flex flex-col space-y-6 mt-60 left-25 absolute">
							<div tw="text-white text-[60px] w-[1000px]">{title}</div>
							<div tw="text-white text-base mt-2 w-[1000px]">{description}</div>
						</div>
					</div>
					<div tw="text-white text-base absolute bottom-10 right-10">{link}</div>
				</div>
			),
			{
				width: 1200,
				height: 640,
			}
		);

		return new Response(await imageResponse.blob());
	} catch (error) {
		console.error("Error:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
