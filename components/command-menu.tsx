"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { FileText, Home, MapPin, Moon, Phone, Sun, Wrench } from "lucide-react"
import type { ComponentType } from "react"

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	companyNavigation,
	primaryNavigation,
	resourceNavigation,
	siteConfig,
} from "@/lib/site"

const iconByHref: Record<string, ComponentType<{ className?: string }>> = {
	"/": Home,
	"/services": Wrench,
	"/expert-tips": FileText,
	"/service-areas": MapPin,
}

export function CommandMenuDialog({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const router = useRouter()
	const { resolvedTheme, setTheme } = useTheme()

	const runCommand = (command: () => void) => {
		onOpenChange(false)
		command()
	}

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput placeholder="Search pages and actions..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Navigate">
					{primaryNavigation.map((item) => {
						const Icon = iconByHref[item.href] ?? FileText
						return (
							<CommandItem
								key={item.href}
								value={item.label}
								onSelect={() => runCommand(() => router.push(item.href))}
							>
								<Icon className="size-4" />
								{item.label}
							</CommandItem>
						)
					})}
				</CommandGroup>
				<CommandGroup heading="Company">
					{companyNavigation.map((item) => (
						<CommandItem
							key={item.href}
							value={item.label}
							onSelect={() => runCommand(() => router.push(item.href))}
						>
							<FileText className="size-4" />
							{item.label}
						</CommandItem>
					))}
				</CommandGroup>
				<CommandGroup heading="Resources">
					{resourceNavigation.map((item) => (
						<CommandItem
							key={item.href}
							value={item.label}
							onSelect={() => runCommand(() => router.push(item.href))}
						>
							<FileText className="size-4" />
							{item.label}
						</CommandItem>
					))}
				</CommandGroup>
				<CommandGroup heading="Actions">
					<CommandItem
						value="Call Wade's"
						onSelect={() =>
							runCommand(() => {
								window.location.href = siteConfig.phoneHref
							})
						}
					>
						<Phone className="size-4" />
						Call {siteConfig.phone}
					</CommandItem>
					<CommandItem
						value="Toggle theme"
						onSelect={() =>
							runCommand(() =>
								setTheme(resolvedTheme === "dark" ? "light" : "dark"),
							)
						}
					>
						{resolvedTheme === "dark" ? (
							<Sun className="size-4" />
						) : (
							<Moon className="size-4" />
						)}
						Toggle theme
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	)
}
