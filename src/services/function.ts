export function calculateSkillScores(studentData: any) {
    // Tính điểm lập trình
    const programmingSubjects = [
        ...getSubjectsFromCategory(studentData, "Kiến thức cơ sở khối ngành"),
        ...getSubjectsFromCategory(studentData, "Kiến thức cơ sở ngành"),
        ...getSubjectsFromCategory(studentData, "Kiến thức ngành"),
        ...getSubjectsFromCategory(studentData, "Kiến thức tự chọn")
    ];
    const programmingScore = calculateAverageScore(programmingSubjects, studentData.programming);

    // Tính điểm thuyết trình
    const presentationSubjects = [
        getSubjectByName(studentData, "Kỹ năng mềm và tinh thần khởi nghiệp"),
        getSubjectByName(studentData, "Phân tích và thiết kế hệ thống thông tin"),
        getSubjectByName(studentData, "Quản trị hệ thống thông tin"),
        getSubjectByName(studentData, "Quản lý dự án công nghệ thông tin")
    ].filter(Boolean);
    const presentationScore = calculateAverageScore(presentationSubjects, studentData.presentation);

    // Tính điểm làm báo cáo
    const reportingSubjects = [
        ...getPoliticalSubjects(studentData),
        getSubjectByName(studentData, "Quản lý dự án công nghệ thông tin"),
        getSubjectByName(studentData, "Phân tích và thiết kế hệ thống thông tin")
    ].filter(Boolean);
    const reportingScore = calculateAverageScore(reportingSubjects, studentData.reporting);

    // Tính điểm nghiên cứu
    const researchSubjects = [
        getSubjectByName(studentData, "Quản trị hệ thống thông tin"),
        getSubjectByName(studentData, "Mạng máy tính"),
        getSubjectByName(studentData, "Công nghệ phần mềm"),
        getSubjectByName(studentData, "Linux và phần mềm mã nguồn mở"),
        getSubjectByName(studentData, "Nguyên lý hệ điều hành"),
        getSubjectByName(studentData, "Kiến trúc máy tính")
    ].filter(Boolean);
    const researchScore = calculateAverageScore(researchSubjects, studentData.research);

    return {
        programming: programmingScore,
        presentation: presentationScore,
        reporting: reportingScore,
        research: researchScore
    };
}

function getSubjectsFromCategory(data: any, categoryName: string) {
    const category = data.data
        .find((item: any) => item.displayName === "Giáo dục chuyên nghiệp")
        ?.children
        .find((child: any) => child.displayName === categoryName);
    
    return category?.listProgramSubject || [];
}

function getPoliticalSubjects(data: any) {
    return data.data
        .find((item: any) => item.displayName === "Giáo dục đại cương")
        ?.children
        .find((child: any) => child.displayName === "Lý luận chính trị")
        ?.listProgramSubject || [];
}

function getSubjectByName(data: any, subjectName: string) {
    for (const category of data.data) {
        if (category.children) {
            for (const child of category.children) {
                const subject = child.listProgramSubject?.find(
                    (s: any) => s.displaySubjectName === subjectName
                );
                if (subject) return subject;
            }
        }
    }
    return null;
}

// Tính trung bình cộng điểm của các môn học
function calculateAverageScore(subjects: any[], selfAssessment: number) {
    // Nếu đã học môn đấy và có điểm trên hệ thống
    const validSubjects = subjects.filter(s => s?.subjectMark !== null);
    if (validSubjects.length === 0) return selfAssessment || 0;
    
    const avgSubjectScore = validSubjects.reduce((sum, s) => sum + s.subjectMark, 0) / validSubjects.length;
    return (avgSubjectScore + (selfAssessment || 0)) / 2;
}