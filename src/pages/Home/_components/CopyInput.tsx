import React, { useState } from "react";
import { Button, CopyIcon, PasteIcon } from "@components/ui";
import CodeEditor from "@uiw/react-textarea-code-editor";
import rehypePrism from "rehype-prism-plus";
import { languages } from "@constants";

type Language = (typeof languages)[number];

export const CopyInput = () => {
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleShortenCode = async () => {
    try {
      setLoading(true);
      const encodedCode = encodeURIComponent(code);
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodedCode}`
      );

      const result = await response.text();
      setShortUrl(result);
      alert("URL shortened successfully!");
    } catch (error) {
      alert("Could not shorten the URL.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (shortUrl) {
      try {
        await navigator.clipboard.writeText(shortUrl);
        alert("Shortened URL copied to clipboard!");
      } catch (error) {
        alert("Unable to copy URL.");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="rounded bg-[#2f2f2f] border border-[#313131]">
        <div className="bg-[#2f2f2f] z-10 sticky top-0 flex items-center justify-between py-2 px-4">
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={handleShortenCode}
              disabled={loading}
            >
              {loading ? "Shortening..." : <CopyIcon />}
              <span>Generate Short Link</span>
            </button>
            <button
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={handleCopyToClipboard}
              disabled={!shortUrl}
            >
              <PasteIcon />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
        <CodeEditor
          value={code}
          language="js"
          rehypePlugins={[rehypePrism]}
          placeholder="Paste your JS code here."
          onChange={(evn) => setCode(evn.target.value)}
          padding={15}
          className="bg-[#0d0d0d]"
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace",
          }}
        />
      </div>
      {shortUrl && (
        <div className="mt-4 text-sm text-gray-400">
          <span>Shortened URL:</span>
          <a
            href={shortUrl}
            target="_blank"
            className="text-indigo-500 ml-2"
            rel="noreferrer"
          >
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
};
