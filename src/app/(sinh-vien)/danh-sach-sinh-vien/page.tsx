"use client"
import Loading from "@/components/Loading";
import useSessionStorage from "@/hooks/useSessionStorage";
import { person } from "@/types/data";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
    const [data, setData] = useState<person[]>([]);
    const router = useRouter();
    const [admin, ] = useSessionStorage('admin', null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    useEffect(() => {
        if(!admin){
            router.push('/');
        }
        const getData = async () => {
            await axios.get('/api/get-data')
            .then((res) => {
                setData(res.data);
            }).finally(() => {
                setLoading(false);
            });
        }
        getData();
    }, [router, reload]);

    if(loading){
        return <Loading />
    }

    const handleDelete = async (id: string) => {
        await axios.post('/api/delete-student', { username: id })
        .then(() => {
            setReload(!reload);
        });
    }

    return (  
        <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 pt-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">Tên</th>
                                    <th className="h-12 px-4 max-md:hidden text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">Email</th>
                                    <th className="h-12 px-4 max-md:hidden text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">Mã sinh viên</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">Giới tính</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {data && Object.entries(data).map(([key, value]) => {
                                    const personValue = value as person;
                                    return (
                                        <tr key={key} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">
                                                {personValue.fullName}
                                            </td>
                                            <td className="p-4 align-middle max-md:hidden [&amp;:has([role=checkbox])]:pr-0 font-medium">
                                                {personValue.email}
                                            </td>
                                            <td className="p-4 align-middle max-md:hidden [&amp;:has([role=checkbox])]:pr-0 font-medium">
                                                {key}
                                            </td>
                                            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">
                                                {personValue.gender}
                                            </td>
                                            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">
                                                <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(key)}>Xóa</button>
                                            </td>
                                        </tr>
                                    );
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;