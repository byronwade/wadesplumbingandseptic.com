import { officeHoursBootScript } from "@/lib/office-hours"

/** One copy of the office-hours updater for every `data-office-hours` node. */
export function OfficeHoursScript() {
	return (
		<script dangerouslySetInnerHTML={{ __html: officeHoursBootScript() }} />
	)
}
