import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const FILE_PATH = path.join(process.cwd(), "result.json");

export async function GET() {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            return NextResponse.json({ message: "Tạm thời chưa có kết quả!" }, { status: 400 });
        }

        const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
        const existingData = JSON.parse(fileContent);

        return NextResponse.json(existingData);
    
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: "Tạm thời chưa có kết quả" }, { status: 500 });
        } else {
            return NextResponse.json({ message: "Lỗi không xác định từ máy chủ." }, { status: 500 });
        }
    }
}
