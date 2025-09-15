"use client"
import useSessionStorage from "@/hooks/useSessionStorage";
import { list, Option, person, SelectedValues } from "@/types/data";
import axios from "axios";
import { useState } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function Page() {
    const MySwal = withReactContent(Swal);
    const [token, ] = useSessionStorage('token', null);
    const [msv, ] = useSessionStorage('msv', '');
    const [data, setData] = useState<person | null>(null);
    const [selectedValues, setSelectedValues] = useState<SelectedValues>({
        programming: null,
        presentation: null,
        reporting: null,
        research: null
    });
    const option: Option[] = [
        { value: 2.5, label: "Yếu" },
        { value: 5, label: "Trung bình" },
        { value: 7.5, label: "Khá" },
        { value: 10, label: "Tốt" }
    ];

    const handleSelectChange = (name: keyof SelectedValues, value: string) => {
        setSelectedValues(prev => ({
          ...prev,
          [name]: value === "null" ? null : parseFloat(value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(Object.values(selectedValues).includes(null)){
            MySwal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng chọn đầy đủ thông tin.',
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

        const response = await axios.get('https://sinhvien1.tlu.edu.vn/education/api/users/getCurrentUser', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const fullName = response.data.displayName;
        const emailAdress = response.data.email;
        const address = response.data.birthPlace;
        const gender = response.data.person.gender === "M" ? "Nam" : "Nữ";
        await axios.get('https://sinhvien1.tlu.edu.vn/education/api/studentsubjectmark/checkFinishedEducationProgramOfStudent/tree/studentId/113',{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then( async (res) => {
            const allData = res.data.content;
            const newArray: list[] = [];
            allData.forEach((item: list) => {
                newArray.push({
                displayName: item.displayName,
                children: item.children?.map((children) => ({
                    displayName: children.displayName,
                    children: children.children?.map((subchildren) => ({
                    displayName: subchildren.displayName,
                    listProgramSubject: subchildren.listProgramSubject?.map((listProgramSubject) => ({
                        charMark: listProgramSubject.charMark,
                        subjectMark: listProgramSubject.subjectMark,
                        displaySubjectName: listProgramSubject.displaySubjectName,
                    })) ?? []
                    })),
                    listProgramSubject: children.listProgramSubject?.map((listProgramSubject) => ({
                    charMark: listProgramSubject.charMark,
                    subjectMark: listProgramSubject.subjectMark,
                    displaySubjectName: listProgramSubject.displaySubjectName,
                    })) ?? null
                })) ?? [],
                listProgramSubject: item.listProgramSubject?.map((listProgramSubject) => ({
                    charMark: listProgramSubject.charMark,
                    subjectMark: listProgramSubject.subjectMark,
                    displaySubjectName: listProgramSubject.displaySubjectName,
                })) ?? null
                });
            });

            const json = {
                fullName: fullName,
                email: emailAdress,
                address: address,
                gender: gender,
                programming: selectedValues.programming,
                presentation: selectedValues.presentation,
                reporting: selectedValues.reporting,
                research: selectedValues.research,
                data: newArray
            }
            const jsonString = JSON.stringify(json);
            await axios.post('/api/save-file', {
                username: msv,
                data: jsonString
            }).then((res) => {
                setData(res.data.data);
                MySwal.fire(
                    'Thành công',
                    res.data.message,
                    'success'
                )
            }).catch((err) => {
                MySwal.fire(
                    'Thất bại',
                    err.response.data.message,
                    'error'
                );
            });
        }).catch(() => {
            MySwal.fire(
                'Thất bại',
                'Lỗi khi lấy thông tin từ trường, vui lòng thử lại sau.',
                'error'
            );
        });
    };

    const RecursiveRenderer = ({ node }: {node: list}) => {
        return (
          <div className="ml-4 border-l pl-4 border-gray-300 mt-2">
            <h4 className="font-semibold text-lg">{node.displayName}</h4>
            {node.listProgramSubject && (
              <ul className="list-disc pl-6 mt-2">
                {node.listProgramSubject.map((subject, index) => (
                  <li key={index}>
                    <strong>{subject.displaySubjectName}</strong>{" "}
                    {subject.subjectMark !== null
                      ? `- Điểm: ${subject.subjectMark} (${subject.charMark})`
                      : "- Chưa có điểm"}
                  </li>
                ))}
              </ul>
            )}
            {node.children && node.children.length > 0 && (
              <div className="mt-2">
                {node.children.map((child, index) => (
                  <RecursiveRenderer key={index} node={child} />
                ))}
              </div>
            )}
          </div>
        );
    };

    return (  
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                        Khả năng <span className="text-gray-500 text-sm">(Sinh viên điền thông tin đúng theo khả năng bản thân)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lập trình <span className="text-red-500">*</span>
                            </label>
                            <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange('programming', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="null">Lựa chọn</option>
                                {option.map((item) => (
                                    <option key={item.value} value={item.value}>
                                    {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thuyết trình <span className="text-red-500">*</span>
                            </label>
                            <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange('presentation', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="null">Lựa chọn</option>
                                {option.map((item) => (
                                    <option key={item.value} value={item.value}>
                                    {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Làm báo cáo <span className="text-red-500">*</span>
                        </label>
                        <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange('reporting', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="null">Lựa chọn</option>
                            {option.map((item) => (
                                <option key={item.value} value={item.value}>
                                {item.label}
                                </option>
                            ))}
                        </select>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm hiểu & Nghiên cứu <span className="text-red-500">*</span>
                        </label>
                        <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange('research', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="null">Lựa chọn</option>
                            {option.map((item) => (
                                <option key={item.value} value={item.value}>
                                {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sở thích
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="null">Lựa chọn</option>
                            <option value="Nông nghiệp">Nông nghiệp</option>
                            <option value="Tài chính">Tài chính</option>
                            <option value="Tài chính">Bất động sản</option>
                            <option value="Tài chính">Giáo dục</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Gửi thông tin
                    </button>
                </div>
            </form>
        </div>
        {data && <div className="min-h-screen ">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
                <div className="space-y-2">
                    <p><strong>Họ và tên:</strong> {data.fullName}</p>
                    <p><strong>Email:</strong> {data.email}</p>
                    <p><strong>Địa chỉ:</strong> {data.address}</p>
                    <p><strong>Giới tính:</strong> {data.gender}</p>
                </div>
                <h2 className="text-xl font-semibold mt-6 mb-4">Điểm số trung bình</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <p><strong>Lập trình:</strong> {data.scores?.programming}</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <p><strong>Thuyết trình:</strong> {data.scores?.presentation}</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <p><strong>Báo cáo:</strong> {data.scores?.reporting}</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <p><strong>Nghiên cứu:</strong> {data.scores?.research}</p>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-4">Danh sách môn học</h2>
                <div className="space-y-4">
                {data.data.map((item, index: number) => (
                    <RecursiveRenderer key={index} node={item} />
                ))}
                </div>
            </div>
        </div>}
        <div className="p-6 pt-0"></div>
    </div>
    );
}

export default Page;