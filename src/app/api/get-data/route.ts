import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const FILE_PATH = path.join(process.cwd(), "data.json");

export async function GET() {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            return NextResponse.json({ message: "Không có dữ liệu nào để hiển thị!" }, { status: 404 });
        }

        const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
        const existingData = JSON.parse(fileContent);

        return NextResponse.json(existingData, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: "Lỗi không xác định từ máy chủ." }, { status: 500 });
        }
    }
}
