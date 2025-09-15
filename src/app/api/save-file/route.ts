import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';
import { calculateSkillScores } from "@/services/function";


const FILE_PATH = path.join(process.cwd(), 'data.json');

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const { username, data } = body;
        if (!username) {
            return NextResponse.json({ message: 'Thiễu mã sinh viên rồi bạn ơi!' }, { status: 400 });
        }

        if(!data){
            return NextResponse.json({ message: 'Thiễu dữ liệu rồi bạn ơi!' }, { status: 400 });
        }

        let existingData: Record<string, object> = {};
        let json = JSON.parse(data);

        if (fs.existsSync(FILE_PATH)) {
            const fileContent = fs.readFileSync(FILE_PATH, 'utf-8');
            existingData = JSON.parse(fileContent);
        }

        if (existingData[username]) {
            delete existingData[username];
        }
        json = { ...json, scores: calculateSkillScores(json) };
        existingData[username] = json;
        fs.writeFileSync(FILE_PATH, JSON.stringify(existingData, null, 2));

        const response = NextResponse.json({ message: 'Lưu thông tin thành công, vào trang danh sách nhóm để biết mình nhóm nào nhé 🎉🎉🎉🎉.', data: json }, { status: 200 });
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