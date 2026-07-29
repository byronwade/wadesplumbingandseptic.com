import type { Route } from "next"
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

export function ServiceCard({ service }: { service: ContentDocument }) {
	const href = `/service-offerings/${service.slug}` as Route

	return (
		<Card className="group hover:border-primary/40 flex h-full flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
			<CardHeader>
				<Badge className="w-fit">{service.category}</Badge>
				<CardTitle className="group-hover:text-primary mt-3 transition-colors">
					<Link href={href}>{service.title}</Link>
				</CardTitle>
				<CardDescription>{service.description}</CardDescription>
			</CardHeader>
			<CardContent className="mt-auto">
				<Link
					className="text-primary inline-flex items-center gap-2 text-sm font-black"
					href={href}
				>
					Learn more
					<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
				</Link>
			</CardContent>
		</Card>
	)
}
