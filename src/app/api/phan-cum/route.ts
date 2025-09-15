import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';
import { Group, person } from "@/types/data";
import { calculateSkillScores } from "@/services/function";


const FILE_PATH = path.join(process.cwd(), 'data.json');
const RESULT_PATH = path.join(process.cwd(), 'result.json');

function assignGroupsBySkills(students: any[], groups: any[], allData: any, minMembersPerGroup: number) {
    // Sắp xếp sinh viên theo điểm kỹ năng tổng hợp
    const studentScores = students.map(studentId => ({
        id: studentId,
        fullName: allData[studentId].fullName,
        gender: allData[studentId].gender,
        scores: calculateSkillScores(allData[studentId])
    }))
    .sort((a, b) => {
        const totalScoreA = Object.values(a.scores).reduce((sum, score) => sum + score, 0);
        const totalScoreB = Object.values(b.scores).reduce((sum, score) => sum + score, 0);
        return totalScoreB - totalScoreA;
    });

    // Reset groups
    groups.forEach(group => group.members = []);

    const totalStudents = studentScores.length;
    const minTotalNeeded = groups.length * minMembersPerGroup;

    // Kiểm tra xem có đủ sinh viên để phân bố không
    if (totalStudents < minTotalNeeded) {
        throw new Error("Không đủ sinh viên để phân bố tối thiểu 4 người/nhóm");
    }

    studentScores.forEach((student, index) => {
        // Tìm nhóm phù hợp nhất
        const bestGroupMatch = groups.map((group, groupIndex) => {
            const topic = group.topic.toLowerCase();
            // Mặc định trọng số điểm lập trình cho mọi nhóm là 40%
            let matchScore = student.scores.programming * 0.4;

            if (topic.includes('kinh doanh')) {
                matchScore += student.scores.presentation * 0.3 + 
                              student.scores.research * 0.2 + 
                              student.scores.reporting * 0.1;
            } else if (topic.includes('tìm kiếm')) {
                matchScore += student.scores.research * 0.3 + 
                              student.scores.presentation * 0.2 + 
                              student.scores.reporting * 0.1;
            } else {
                matchScore += student.scores.presentation * 0.3 + 
                              student.scores.research * 0.2 + 
                              student.scores.reporting * 0.1;
            }

            return {
                groupIndex,
                matchScore,
                currentMembers: group.members.length,
                genderBalance: group.members.filter((m: any) => m.gender === student.gender).length
            };
        })
        .sort((a, b) => 
            b.matchScore - a.matchScore || 
            a.currentMembers - b.currentMembers ||
            a.genderBalance - b.genderBalance
        )[0];
        // Nhóm có điểm phù hợp cao hơn được ưu tiên trước rồi đến nhóm ít thành viên nhất và giới tính cân đối

        // Thêm sinh viên vào nhóm
        groups[bestGroupMatch.groupIndex].members.push({
            msv: student.id,
            name: student.fullName,
            gender: student.gender,
            score: Object.values(student.scores).reduce((sum, score) => sum + score, 0),
            programming: student.scores.programming,
            presentation: student.scores.presentation,
            reporting: student.scores.reporting,
            research: student.scores.research
        });
    });

    // Kiểm tra và điều chỉnh số lượng thành viên
    groups.forEach(group => {
        group.averageScore = group.members.reduce((sum: number, member: any) => sum + member.score, 0) / group.members.length;
    });

    return groups;
}


export async function POST(request: Request) {
    if (!fs.existsSync(FILE_PATH)) {
        return NextResponse.json({ message: "Chưa có dữ liệu của bất kì ai!" }, { status: 404 });
    }
    try{
        const params = await request.json();
        const { data, numberGroup, numberMember, topics, check } = params;
        if (fs.existsSync(RESULT_PATH)) {
            fs.unlinkSync(RESULT_PATH);
        }

        if(check){
            const result = JSON.stringify(data, null, 2);
            fs.writeFileSync(RESULT_PATH, result, 'utf-8');
            const groups = JSON.parse(result);
            return NextResponse.json({ message: 'Cập nhật kết quả thành công.', groups }, { status: 200 });
            
        }
        const rawData = fs.readFileSync(FILE_PATH, 'utf-8');
        const allData: Record<string, person> = JSON.parse(rawData);
        const studentKeys = Object.keys(allData);

        if (studentKeys.length === 0) {
            return NextResponse.json({ message: "Chưa có dữ liệu của bất kì ai!" }, { status: 400 });
        }

        const availableTopics = topics.filter((t: any) => t.value !== "");
        const groups: Group[] = Array.from({ length: numberGroup }, (_, i) => ({
            id: i + 1,
            name: `Nhóm ${i + 1}`,
            topic: availableTopics[i % availableTopics.length].value,
            members: []
        }));

        const sortedGroups = assignGroupsBySkills(studentKeys, groups, allData, numberMember);

        const result = JSON.stringify(sortedGroups, null, 2);
        fs.writeFileSync(RESULT_PATH, result, 'utf-8');

        const response = NextResponse.json({ message:'Phân nhóm thành công, vui lòng kiểm tra lại kết quả.', groups: sortedGroups }, { status: 200 });
        const baseApi = '*';
        response.headers.set('Access-Control-Allow-Origin', baseApi);

        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'Lỗi không xác định từ máy chủ.' }, { status: 500 });
        }
    }
}