"use client";
import React, { useEffect, useState } from "react";
import feather from "feather-icons";
import { EditorContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import History from "@tiptap/extension-history";
import { Node, mergeAttributes, Command } from "@tiptap/core";

// Extend the Commands interface to include the custom command
declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		youtube: {
			/**
			 * Custom command to insert a YouTube iframe.
			 */
			setYouTube: (options: { src: string }) => ReturnType;
		};
	}
}

const YouTube = Node.create({
	name: "youtube",

	addAttributes() {
		return {
			src: {
				default: null,
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'iframe[src*="youtube.com"]',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ["iframe", mergeAttributes(HTMLAttributes, { frameborder: 0, allowfullscreen: "true" })];
	},

	addCommands() {
		return {
			setYouTube: (options: any): Command => {
				return ({ tr, commands }) => {
					if (!tr.selection || !tr.selection.empty) {
						return false;
					}
					const { from, to } = tr.selection;
					return commands.insertContentAt(
						{ from, to },
						{
							type: this.name,
							attrs: options,
						}
					);
				};
			},
		};
	},
});

const MenuBar = ({ editor, toggleHtmlMode, isHtmlMode }) => {
	useEffect(() => {
		feather.replace();
	}, []);

	if (!editor) {
		return null;
	}

	const insertImage = () => {
		const url = prompt("Enter image URL");
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};

	const insertLink = () => {
		const url = prompt("Enter URL");
		const text = prompt("Enter text for the link", "default text");
		if (url) {
			editor.chain().focus().extendMarkRange("link").setLink({ href: url }).insertContent(text).run();
		}
	};

	const insertTable = () => {
		editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
	};

	const insertYouTubeVideo = () => {
		const url = prompt("Enter YouTube video URL");

		if (url) {
			editor.chain().focus().setYouTube({ src: url }).run();
		}
	};

	return (
		<div className="flex flex-wrap gap-2 p-2 bg-white border-b border-black rounded-t-md">
			<button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""}>
				<i data-feather="bold" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""}>
				<i data-feather="italic" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={editor.isActive("code") ? "is-active" : ""}>
				<i data-feather="code" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive("paragraph") ? "is-active" : ""}>
				<i data-feather="type" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""}>
				<i data-feather="list" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "is-active" : ""}>
				<i data-feather="list" className="w-5 h-5"></i>
			</button>
			<button onClick={insertLink}>
				<i data-feather="link" className="w-5 h-5"></i>
			</button>
			<button onClick={insertImage}>
				<i data-feather="image" className="w-5 h-5"></i>
			</button>
			<button onClick={insertTable}>
				<i data-feather="grid" className="w-5 h-5"></i>
			</button>
			<button onClick={insertYouTubeVideo}>
				<i data-feather="video" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
				<i data-feather="corner-up-left" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
				<i data-feather="corner-up-right" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().setColor("#958DF1").run()} className={editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : ""}>
				<i data-feather="feather" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? "is-active" : ""}>
				<i data-feather="underline" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}>
				<i data-feather="align-left" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}>
				<i data-feather="align-center" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}>
				<i data-feather="align-right" className="w-5 h-5"></i>
			</button>
			<button onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}>
				<i data-feather="align-justify" className="w-5 h-5"></i>
			</button>
			<button onClick={toggleHtmlMode} className={isHtmlMode ? "is-active" : ""}>
				<i data-feather={isHtmlMode ? "eye" : "code"} className="w-5 h-5"></i>
			</button>
		</div>
	);
};

export default function TipTap({ onContentChange }) {
	const [isHtmlMode, setIsHtmlMode] = useState(false);
	const [htmlContent, setHtmlContent] = useState("");

	const editor = useEditor({
		extensions: [
			Document,
			Paragraph,
			Text,
			Bold,
			Italic,
			YouTube,
			Link,
			Image,
			Underline,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Table.configure({ resizable: true }),
			TableRow,
			TableHeader,
			TableCell,
			TextStyle, // Make sure TextStyle is included in your extensions
			Color.configure({ types: ["textStyle"] }), // Correct configuration for Color
			Heading,
			BulletList,
			OrderedList,
			ListItem,
			Code,
			CodeBlock,
			Blockquote,
			HardBreak,
			HorizontalRule,
			History,
		],
		editorProps: {
			attributes: {
				class: "prose prose-sm sm:prose p-5 focus:outline-none bg-white rounded-b-md w-full !max-w-full",
			},
		},
		content: `
		<h2>Hi there,</h2>
		<p>this is a <em>basic</em> example of <strong>tiptap</strong>.</p>
	  `,
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			setHtmlContent(html);
			onContentChange(html);
		},
	});

	useEffect(() => {
		if (editor && isHtmlMode) {
			editor.commands.setContent(htmlContent);
		}
	}, [isHtmlMode, htmlContent, editor]);

	const toggleHtmlMode = () => {
		setIsHtmlMode(!isHtmlMode);
	};

	if (!editor) {
		return <div>Loading editor...</div>;
	}

	return (
		<div className="w-full flex flex-col rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-white">
			<MenuBar editor={editor} toggleHtmlMode={toggleHtmlMode} isHtmlMode={isHtmlMode} />
			{isHtmlMode ? <textarea className="appearance-none border-none p-6 m-0 bg-transparent text-base leading-normal text-black placeholder-gray-500 focus:outline-none focus:ring-0" value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)} onBlur={() => setIsHtmlMode(false)} /> : <EditorContent editor={editor} />}
		</div>
	);
}
