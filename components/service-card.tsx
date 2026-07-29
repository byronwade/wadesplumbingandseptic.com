import type { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import type { ContentDocument } from "@/lib/content"
import { getServiceImage } from "@/lib/service-images"

export function ServiceCard({ service }: { service: ContentDocument }) {
	const href = `/service-offerings/${service.slug}` as Route
	const image = getServiceImage(service.category, service.image)

	return (
		<Card className="group flex h-full flex-col overflow-hidden transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/35">
			<Link
				className="relative block aspect-[16/9] overflow-hidden bg-muted"
				href={href}
				prefetch
				tabIndex={-1}
			>
				<Image
					alt=""
					className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
					fill
					quality={65}
					sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
					src={image}
				/>
			</Link>
			<CardHeader>
				<Badge className="w-fit" tone="muted">
					{service.category}
				</Badge>
				<CardTitle className="mt-3 transition-colors group-hover:text-primary">
					<Link href={href} prefetch>
						{service.title}
					</Link>
				</CardTitle>
				<CardDescription>{service.description}</CardDescription>
			</CardHeader>
			<CardContent className="mt-auto">
				<Link
					className="inline-flex items-center gap-2 text-sm font-extrabold text-primary"
					href={href}
					prefetch
				>
					Learn more
					<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
				</Link>
			</CardContent>
		</Card>
	)
}
