"use client"

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

export function HomeFaq({
	faqs,
}: {
	faqs: Array<{ question: string; answer: string }>
}) {
	return (
		<Accordion type="single" collapsible>
			{faqs.map((faq, index) => (
				<AccordionItem key={faq.question} value={`faq-${index}`}>
					<AccordionTrigger>{faq.question}</AccordionTrigger>
					<AccordionContent>{faq.answer}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}
