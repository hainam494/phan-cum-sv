import { Group } from "@/types/data";

function CardGroup({ groups }: { groups: Group[] }) {
    return (  
        <>
        {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6 mx-4">
                <div className="bg-gray-50 p-4 rounded-t-lg border border-b-0">
                    <h3 className="text-blue-600 font-medium">{group.name} - ĐTB: {group.averageScore?.toFixed(2)}</h3>
                    <p className="text-gray-600 text-sm mt-1">{group.topic}</p>
                </div>
                <div className="border rounded-b-lg">
                {group.members.map((member, memberIndex) => (
                    <div 
                    key={memberIndex} 
                    className="p-4 border-b last:border-b-0 flex justify-between items-center"
                    >
                    <div>
                        <p className="font-medium">{member.name} - {member.score?.toFixed(2)}</p>
                        <p className="text-gray-500 text-sm">{member.msv}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                        member.gender === "Nam" ? "text-blue-600" : "text-pink-600"
                    }`}>
                        {member.gender}
                    </span>
                    </div>
                ))}
                </div>
            </div>
        ))}
        </>
    );
}

export default CardGroup;