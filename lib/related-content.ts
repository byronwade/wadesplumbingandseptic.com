import "server-only"

import { toArchiveItem, type ArchiveItem } from "@/lib/archive"
import { getCollection, type ContentDocument } from "@/lib/content"
import {
	rankDocuments,
	seedFromDocument,
	tokenize,
	type RelatedSeedDocument,
} from "@/lib/related-score"

export type RelatedContent = {
	posts: ArchiveItem[]
	services: ArchiveItem[]
}

function toPostItem(post: RelatedSeedDocument): ArchiveItem {
	return toArchiveItem(post, `/${post.slug}`, post.category ?? "Expert Tips")
}

function toServiceItem(service: RelatedSeedDocument): ArchiveItem {
	return toArchiveItem(
		service,
		`/service-offerings/${service.slug}`,
		service.category ?? "Plumbing",
	)
}

export async function getRelatedForPost(
	post: ContentDocument,
	limits: { posts?: number; services?: number } = {},
): Promise<RelatedContent> {
	const [posts, services] = await Promise.all([
		getCollection("posts"),
		getCollection("services"),
	])
	const seed = seedFromDocument(post)
	const exclude = new Set([post.slug])

	return {
		posts: rankDocuments(seed, posts, "post", limits.posts ?? 3, exclude).map(
			toPostItem,
		),
		services: rankDocuments(
			seed,
			services,
			"service",
			limits.services ?? 3,
			exclude,
		).map(toServiceItem),
	}
}

export async function getRelatedForService(
	service: ContentDocument,
	limits: { posts?: number; services?: number } = {},
): Promise<RelatedContent> {
	const [posts, services] = await Promise.all([
		getCollection("posts"),
		getCollection("services"),
	])
	const seed = seedFromDocument(service)
	const exclude = new Set([service.slug])

	return {
		posts: rankDocuments(seed, posts, "post", limits.posts ?? 3, exclude).map(
			toPostItem,
		),
		services: rankDocuments(
			seed,
			services,
			"service",
			limits.services ?? 3,
			exclude,
		).map(toServiceItem),
	}
}

export async function getRelatedForTopic(
	topic: {
		label: string
		description?: string
		categories?: string[]
		tags?: string[]
		keywords?: string[]
		excludeSlugs?: string[]
	},
	limits: { posts?: number; services?: number } = {},
): Promise<RelatedContent> {
	const [posts, services] = await Promise.all([
		getCollection("posts"),
		getCollection("services"),
	])

	const synthetic: RelatedSeedDocument = {
		slug: `__topic__${topic.label}`,
		title: topic.label,
		description: topic.description ?? topic.label,
		content: [topic.label, ...(topic.keywords ?? [])].join(" "),
		category: topic.categories?.[0],
		tags: [...(topic.tags ?? []), ...(topic.keywords ?? [])],
	}
	const seed = seedFromDocument(synthetic)
	const exclude = new Set(topic.excludeSlugs ?? [])

	if (topic.categories?.length) {
		for (const category of topic.categories) {
			for (const token of tokenize(category)) seed.tokens.add(token)
		}
	}

	return {
		posts: rankDocuments(seed, posts, "post", limits.posts ?? 3, exclude).map(
			toPostItem,
		),
		services: rankDocuments(
			seed,
			services,
			"service",
			limits.services ?? 3,
			exclude,
		).map(toServiceItem),
	}
}
