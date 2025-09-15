"use client"
import CardGroup from "@/components/CardGroup";
import Loading from "@/components/Loading";
import Select from "@/components/Select";
import TableDrag from "@/components/TableDrag";
import useSessionStorage from "@/hooks/useSessionStorage";
import { Group } from "@/types/data";
import axios from "axios";
import { Inbox, Plus, Search, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function Page() {
    const [token, ] = useSessionStorage('token', null);
    const router = useRouter();
    const [groups, setGroups] = useState<Group[]>([]);
    const MySwal = withReactContent(Swal);
    const [admin, ] = useSessionStorage('admin', null);
    const [isMounted, setIsMounted] = useState(false);
    const [topics, setTopics] = useState([
        { id: 1, value: 'Hệ thống kinh doanh thông minh cho nông nghiệp: Phát triển một ứng dụng di động giúp nông dân quản lý mùa vụ, theo dõi tình trạng cây trồng và cung cấp dự báo thời tiết dựa trên dữ liệu lớn và trí tuệ nhân tạo, từ đó tối ưu hóa quy trình sản xuất.' },
        { id: 2, value: 'Hệ thống quản lý tài chính thông minh cho cá nhân: Xây dựng một ứng dụng quản lý chi tiêu cá nhân có tính năng phân tích tài chính, lập kế hoạch ngân sách tự động và nhắc nhở thanh toán hóa đơn để giúp người dùng theo dõi và cải thiện tình hình tài chính của mình.' },
        { id: 3, value: 'Hệ thống tìm kiếm mặt bằng cho thuê thông minh: Tạo một nền tảng trực tuyến cho phép người dùng tìm kiếm mặt bằng cho thuê với các bộ lọc thông minh như vị trí, giá cả, diện tích và loại hình kinh doanh, đồng thời tích hợp đánh giá từ người thuê trước đó.' },
        { id: 4, value: 'Hệ thống đào tạo thông minh cho sinh viên: Phát triển một nền tảng học trực tuyến sử dụng trí tuệ nhân tạo để cá nhân hóa lộ trình học tập cho sinh viên, cung cấp tài liệu học tập phù hợp và theo dõi tiến độ học tập của từng người dùng.' }
    ]);
    const [numberMember, setNumberMember] = useState(4);
    const [numberGroup, setNumberGroup] = useState(4);
    useEffect(() => {
        if(!token){
            router.push('/');
        }else{
            const getResult = async () => {
                await axios.get('/api/get-result').then((res) => {
                    setGroups(res.data);
                }).catch((err) => {
                    console.log(err.response.data.message);
                });
            }

            getResult();
        }
        setIsMounted(true);
    }, [router])

    if(!isMounted) return <Loading />;
    
    const optionsNumber = [2, 3, 4, 5, 6];

    const handleCluster = async (check : boolean) => {
        if(topics.length === 0){
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Vui lòng nhập ít nhất 1 đề tài cho nhóm.',
            });
            return;
        }

        MySwal.fire({
            title: 'Đang xử lý...',
            text: 'Vui lòng chờ trong giây lát.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        await axios.post('/api/phan-cum',{
            data: groups,
            numberGroup: numberGroup,
            numberMember: numberMember,
            topics: topics,
            check
        })
        .then((res) => {
            MySwal.fire({
                icon: 'success',
                title: 'Phân nhóm thành công',
                text: res.data.message,
            });
            setGroups(res.data.groups);
            setTopics([]);
        }).catch((err) => {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response.data.message,
            });
        });
    }

    const addTopic = () => {
        if (topics.length < 4) {
          setTopics([...topics, { id: topics.length + 1, value: '' }]);
        }
    };

    const handleChangeNumberMember = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNumberMember(parseInt(e.target.value));
    };

    const handleChangeNumberGroup = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNumberGroup(parseInt(e.target.value));
    };
   
    return (  
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col p-6 min-h-[90vh]">
                <div className="flex max-md:flex-col max-sm:items-center mb-2 max-sm:text-center">
                    <h2 className="text-xl font-bold text-gray-700 uppercase">
                        Danh sách các nhóm
                    </h2>
                    <form className="relative md:ml-auto max-md:mt-2 flex-1 md:grow-0 max-w-sm">
                        <Search className="lucide lucide-search absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
                        <input type="search" className="flex h-10 border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]" placeholder="Tìm kiếm..." name="q" />
                    </form>
                </div>

                {admin && <div className="p-5 border border-black rounded-lg space-y-6 relative mt-8 mb-10">
                    <h2 className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 text-xl font-semibold">
                        CẤU HÌNH CHIA NHÓM
                    </h2>
      
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div>
                            <label className="block mb-2">
                                Số lượng nhóm <span className="text-red-500">*</span>
                            </label>
                            <Select value={numberGroup} handle={handleChangeNumberGroup} options={optionsNumber} />
                        </div>
                        <div>
                            <label className="block mb-2">
                                Số thành viên tối thiểu trong nhóm <span className="text-red-500">*</span>
                            </label>
                            <Select value={numberMember} handle={handleChangeNumberMember} options={optionsNumber} />
                        </div>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={addTopic}
                            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                            <Plus size={20} />
                            <span className="ml-1">Thêm đề tài</span>
                        </button>
                        {topics.map((topic, index) => (
                        <div key={topic.id} className="mt-4">
                            <label className="block mb-2">
                                Đề tài {index + 1} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative w-full min-w-[200px]">
                                <textarea
                                    value={topic.value}
                                    onChange={(e) => {
                                        const newTopics = [...topics];
                                        newTopics[index].value = e.target.value;
                                        setTopics(newTopics);
                                    }}
                                    placeholder=" "
                                    className="peer h-full min-h-[50px] w-full resize-none rounded-[7px] border border-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0"
                                    />
                                <label className="before:content[' '] text-gray-500 after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Nhập thông tin
                                </label>
                            </div>
                        </div>
                        ))}
                    </div>

                    <div className="flex justify-center pt-4">
                        <button 
                            className="flex items-center gap-2 w-fit px-4 py-2 bg-[#4267B2] text-white rounded hover:bg-[#365899] transition-colors"
                            onClick={() => handleCluster(false)}
                            >
                            <UsersRound size={20} />
                            <span className="font-medium">CHIA NHÓM</span>
                        </button>
                    </div>
                </div>}

                {admin && groups.length != 0 && <div className="max-sm:mx-auto mb-4">
                    <button 
                        className="flex items-center gap-2 w-fit px-4 py-2 bg-[#4267B2] text-white rounded hover:bg-[#365899] transition-colors"
                        onClick={() => handleCluster(true)}
                        >
                        <UsersRound size={20} />
                        <span className="font-medium">Lưu kết quả</span>
                    </button>
                </div>}


                {groups.length == 0 ? (<div className="flex flex-col flex-grow items-center justify-center p-8 text-gray-500">
                    <div className="mb-4">
                        <Inbox size={48} className="text-gray-400" />
                    </div>
                    <p className="text-center text-sm">
                        Hiện tại chưa có dữ liệu. Vui lòng đợi Admin chia nhóm
                    </p>
                </div>) 
                :<>
                <div className="flex-1 overflow-auto sm:hidden">
                    <CardGroup groups={groups} />
                </div>

                <div className="hidden sm:flex flex-1 overflow-hidden">
                    <div className="w-full overflow-y-auto">
                        <TableDrag groups={groups} setGroups={setGroups} admin={admin} />
                    </div>
                </div>
                </>}
            </div>
        </div>
    );
}

export default Page;