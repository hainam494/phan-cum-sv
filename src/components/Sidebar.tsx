"use client"
import useSessionStorage from "@/hooks/useSessionStorage";
import { House, PencilLine, UsersRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}
  

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
    const pathname = usePathname();
    const [admin, ] = useSessionStorage('admin', null);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setOpen(false);
        setIsMounted(true);
    }, [pathname]);

    if(!isMounted) return null;
    return (  
        <>
        {open && <div onClick={() => setOpen(!open)} className="fixed inset-0 z-40 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"></div>}
        <aside className={`fixed inset-y-0 left-0 z-50 ${open ? 'p-6 shadow-lg' : ''} w-4/5 sm:w-14 flex-col border-r bg-background duration-300 transition-transform ease-in-out ${open ? 'transform-none' : '-translate-x-full'} sm:translate-x-0`}>
            <nav className="sm:flex flex-col items-center sm:gap-4 px-2 sm:py-5 grid gap-6 max-sm:text-lg max-sm:font-medium">
                <Link className="group w-20 h-20 flex sm:h-9 sm:w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base" href="#">
                    <Image width={12} height={12} src="/tlu.svg" className="h-full w-full transition-all group-hover:scale-110" alt="Logo" />
                </Link>
                {admin && <Link className={`flex max-sm:gap-4 px-2 sm:h-9 sm:w-9 items-center sm:justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${pathname == '/danh-sach-sinh-vien' ? ' bg-accent text-black py-2' : ''}`} data-state="closed" href="/danh-sach-sinh-vien">
                    <House />
                    <span className={`${open ? 'block' : 'hidden'} sm:hidden`}>Danh sách sinh viên</span>
                </Link>}
                <Link className={`flex max-sm:gap-4 px-2 sm:h-9 sm:w-9 items-center sm:justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${pathname == '/danh-sach-nhom' ? ' bg-accent text-black py-2' : ''}`} data-state="delayed-open" href="/danh-sach-nhom" aria-describedby="radix-:r3:">
                    <UsersRound />
                    <span className={`${open ? 'block' : 'hidden'} sm:hidden`}>Danh sách nhóm</span>
                </Link>
                <Link className={`flex max-sm:gap-4 px-2 sm:h-9 sm:w-9 items-center sm:justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${pathname == '/sinh-vien' ? ' bg-accent text-black py-2' : ''}`} data-state="delayed-open" href="/sinh-vien" aria-describedby="radix-:r3:">
                    <PencilLine />
                    <span className={`${open ? 'block' : 'hidden'} sm:hidden`}>Thông tin sinh viên</span>
                </Link>
            </nav>
            {open && <button onClick={() => setOpen(!open)} type="button" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X />
                <span className="sr-only">Close</span>
            </button>}
        </aside>
        </>
    );
}

export default Sidebar;