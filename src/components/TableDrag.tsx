import { Group, Member } from "@/types/data";
import React, { useState } from "react";

function TableDrag({groups, setGroups, admin}: {groups: Group[], setGroups: (groups: Group[]) => void, admin: string | null}) {
    const [draggedMember, setDraggedMember] = useState<Member | null>(null);
    const [dragSourceGroup, setDragSourceGroup] = useState(null);

    const handleDragStart = (member: any, groupId: any) => {
        setDraggedMember(member);
        setDragSourceGroup(groupId);
    };
    
    const handleDragOver = (e: any, groupId: any) => {
        e.preventDefault();
        const row = e.target.closest('tr');
        if (row) {
          row.classList.add('bg-blue-50');
        }
    };
    
    const handleDragLeave = (e: any) => {
        e.preventDefault();
        const row = e.target.closest('tr');
        if (row) {
          row.classList.remove('bg-blue-50');
        }
    };

    const handleDrop = (e:any, targetGroupId: number) => {
        e.preventDefault();
        if (!draggedMember || targetGroupId === dragSourceGroup) return;
    
        const newGroups = groups.map(group => {
          if (group.id === dragSourceGroup) {
            return {
              ...group,
              members: group.members.filter(m => m.msv !== draggedMember.msv)
            };
          }
          if (group.id === targetGroupId) {
            return {
              ...group,
              members: [...group.members, draggedMember]
            };
          }
          return group;
        });
    
        setGroups(newGroups);
        setDraggedMember(null);
        setDragSourceGroup(null);
    
        const rows = document.querySelectorAll('tr');
        rows.forEach(row => row.classList.remove('bg-blue-50'));
    };
    
    return (  
    <table className="w-full border-collapse bg-white">
        <thead className="sticky top-0 bg-gray-50">
        <tr>
            <th className="border px-4 py-2 text-left font-medium">Nhóm</th>
            <th className="border px-4 py-2 text-left font-medium" style={{ width: '600px', maxWidth: '600px' }}>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">Đề tài</div>
            </th>
            <th className="border px-4 py-2 text-left font-medium">MSV</th>
            <th className="border px-4 py-2 text-left font-medium">Thành viên</th>
            <th className="border px-4 py-2 text-left font-medium">Giới tính</th>
        </tr>
        </thead>
        <tbody>
        {groups.map((group) => (
        <React.Fragment key={group.id}>
            {group.members.length > 0 ? 
                group.members.map((member, index) => (
                <tr
                    key={`${group.id}-${member.msv}`}
                    draggable={admin ? true : false}
                    onDragStart={() => handleDragStart(member, group.id)}
                    onDragOver={(e) => handleDragOver(e, group.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, group.id)}
                    className={`hover:bg-gray-50${admin ? ' cursor-move' : ''}`}
                >
                    {index === 0 && (
                    <>
                        <td className="border px-4 py-2 text-center" rowSpan={group.members.length}>
                            <span className="text-blue-600">{group.name} - ĐTB: {group.averageScore?.toFixed(2)}</span>
                        </td>
                        <td className="border px-4 py-2" rowSpan={group.members.length}>
                            {group.topic}
                        </td>
                    </>
                    )}
                    <td className="border px-4 py-2">{member.msv}</td>
                    <td className="border px-4 py-2">{member.name} - {member.score?.toFixed(2)}</td>
                    <td className="border px-4 py-2">
                    <span className={member.gender === "Nam" ? "text-blue-600" : "text-pink-600"}>
                        {member.gender}
                    </span>
                    </td>
                </tr>
                ))
                : 
                <tr
                key={`${group.id}-empty`}
                onDragOver={(e) => handleDragOver(e, group.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, group.id)}
                className="hover:bg-gray-50"
                >
                <td className="border px-4 py-2 text-center">
                    <span className="text-blue-600">{group.name}</span>
                </td>
                <td className="border px-4 py-2">{group.topic}</td>
                <td className="border px-4 py-2" colSpan={3}>
                    <div className="text-center text-gray-500">{admin ? 'Kéo thành viên vào đây' : 'Không có ai trong nhóm này'}</div>
                </td>
                </tr>
            }
            </React.Fragment>
        ))}
        </tbody>
    </table>
    );
}

export default TableDrag;