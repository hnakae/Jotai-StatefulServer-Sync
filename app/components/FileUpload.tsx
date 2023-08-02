"use client";
import { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState<File>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="wrapper">
        <form onSubmit={onSubmit}>
          <input
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <input type="submit" value="Upload" />
        </form>
      </div>
    </>
  );
};

export default FileUpload;
