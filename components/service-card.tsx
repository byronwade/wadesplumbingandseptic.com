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
		<Card className="group hover:border-primary/35 flex h-full flex-col overflow-hidden transition-[border-color,transform] duration-200 hover:-translate-y-0.5">
			<Link
				aria-label={`View ${service.title}`}
				className="bg-muted relative block aspect-[16/9] overflow-hidden"
				href={href}
				prefetch={false}
				tabIndex={-1}
			>
				<Image
					alt={
						service.imageAlt ?? `${service.title}, Wade's Plumbing & Septic`
					}
					className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
					fill
					quality={60}
					sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
					src={image}
				/>
			</Link>
			<CardHeader>
				<Badge className="w-fit" tone="muted">
					{service.category}
				</Badge>
				<CardTitle className="group-hover:text-primary mt-3 transition-colors">
					<Link href={href} prefetch={false}>
						{service.title}
					</Link>
				</CardTitle>
				<CardDescription>{service.description}</CardDescription>
			</CardHeader>
			<CardContent className="mt-auto">
				<Link
					className="text-primary inline-flex items-center gap-2 text-sm font-extrabold"
					href={href}
					prefetch={false}
				>
					Learn more
					<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
				</Link>
			</CardContent>
		</Card>
	)
}
