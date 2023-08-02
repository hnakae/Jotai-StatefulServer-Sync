import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises"; //nodejs api
import { join } from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes); //now do what you want with buffer :D

  const path = join("./", "public", file.name);
  await writeFile(path, buffer);
  console.log(`open ${path} to see the uploaded file`);

  return NextResponse.json({ success: true });
}
