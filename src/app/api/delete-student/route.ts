import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';


const FILE_PATH = path.join(process.cwd(), 'data.json');

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const { username } = body;

        const fileContent = fs.readFileSync(FILE_PATH, 'utf-8');
        let existingData = JSON.parse(fileContent);

        if (!existingData[username]) {
            throw new Error(`Mã sinh viên ${username} không tồn tại.`);
        }

        delete existingData[username];
        fs.writeFileSync(FILE_PATH, JSON.stringify(existingData, null, 2));

        const response = NextResponse.json({ message: `Xóa mã sinh viên ${username} thành công 🎉🎉🎉🎉.` }, { status: 200 });
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