"use client"
import Sidebar from "@/components/Sidebar";
import useSessionStorage from "@/hooks/useSessionStorage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [, setToken] = useSessionStorage('token', null);
    const [, setMsv] = useSessionStorage('msv', '');
    const [, setAdmin] = useSessionStorage<any>('admin', null);
    const handleLogout = () => {
        setToken(null);
        setMsv('');
        setAdmin(null);
        router.push('/');
    }
    const [dropdownOpen, setDropdownOpen] = useState(false);
    return (
    <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar open={open} setOpen={setOpen} />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <button onClick={() => setOpen(!open)} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 sm:hidden" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r6:" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left h-5 w-5"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg><span className="sr-only">Toggle Menu</span></button>
                <nav aria-label="breadcrumb" className="hidden md:flex">
                    <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
                        <li className="inline-flex items-center gap-1.5">
                            <Link className="transition-colors hover:text-foreground" href="#">Đại học Thủy Lợi</Link>
                        </li>
                        <li role="presentation" aria-hidden="true" className="[&amp;>svg]:size-3.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"></path></svg>
                        </li>
                        <li className="inline-flex items-center gap-1.5">
                            <Link className="transition-colors hover:text-foreground" href="#">Hệ thống chia nhóm - Cụm 2</Link>
                        </li>
                    </ol>
                </nav>
                <div className="relative ml-auto flex-1 grow-0">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 overflow-hidden rounded-full" type="button" id="radix-:r9:" aria-haspopup="menu" aria-expanded="false" data-state="closed">
                        <Image alt="Avatar" width="36" height="36" src="/tlu.svg" className="overflow-hidden rounded-full" />
                    </button>
                    {dropdownOpen && <div className="absolute top-full bg-white right-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                        <div onClick={handleLogout} className="relative hover:opacity-70 cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            Đăng xuất
                        </div>
                    </div>}
                </div>
            </header>
            <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
                {children}
            </main>
        </div>
    </main>
    );
}
