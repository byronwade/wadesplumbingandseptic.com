"use client";
import { SWRConfig } from "swr";
import { RecoilRoot } from "recoil";
export const Provider = ({ children }) => {
	return (
		<RecoilRoot>
			<SWRConfig>{children}</SWRConfig>
		</RecoilRoot>
	);
};
