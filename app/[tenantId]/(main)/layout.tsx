"use client";
import "../../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BranchProvider } from "@/providers/branch-provider";
import { SettingsProvider } from "@/providers/settings-provider";

export default function TenantLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	
	return (
		<SettingsProvider>
			<SidebarProvider>
				<div className="w-full min-w-full">
					{children}
				</div>
			</SidebarProvider>
		</SettingsProvider>
	);
}
