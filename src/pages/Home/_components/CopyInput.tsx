import { useSearchParams } from "react-router-dom";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState, useEffect } from "react";
import rehypePrism from "rehype-prism-plus";

export const CopyInput = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [code, setCode] = useState<string>(""); // Editor content
  const [isCodeLoadedFromURL, setIsCodeLoadedFromURL] = useState(false);
  const [shortenedURL, setShortenedURL] = useState<string | null>(null); // Short URL

  // Load code from URL on component mount
  useEffect(() => {
    const queryCode = searchParams.get("code");
    if (queryCode) {
      setCode(decodeURIComponent(queryCode));
      setIsCodeLoadedFromURL(true);
    }
  }, [searchParams]);

  // Generate a shareable link (shortens URL via API)
  const generateAndCopyLink = async () => {
    const encodedCode = encodeURIComponent(code);
    const shareableLink = `${window.location.origin}?code=${encodedCode}`;

    // Use TinyURL API for URL shortening
    try {
      const response = await fetch(
        `https://api.tinyurl.com/create?api_token=YOUR_TINYURL_API_TOKEN`, // Replace with your API token
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: shareableLink }),
        }
      );
      const data = await response.json();
      if (data.data?.tiny_url) {
        setShortenedURL(data.data.tiny_url);
        navigator.clipboard.writeText(data.data.tiny_url);
        alert("Shortened link copied to clipboard!");
      } else {
        throw new Error("Failed to shorten URL");
      }
    } catch (error) {
      console.error("Error generating short URL:", error);
      alert("Failed to generate a short URL. Link copied instead.");
      navigator.clipboard.writeText(shareableLink);
    }
  };

  // Copy the current code to clipboard
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(code).then(
      () => alert("Code copied to clipboard!"),
      () => alert("Failed to copy code.")
    );
  };

  // Clear the code editor
  const clearCode = () => {
    setCode("");
    setSearchParams({}); // Clear query params from the URL
    setIsCodeLoadedFromURL(false);
    setShortenedURL(null); // Clear any shortened URL
  };

  return (
    <div className="p-4">
      <div className="rounded bg-[#2f2f2f] border border-[#313131]">
        <div className="bg-[#2f2f2f] sticky top-0 flex items-center justify-between py-2 px-4">
          {!isCodeLoadedFromURL ? (
            <button
              onClick={generateAndCopyLink}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Generate & Copy Link
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={copyCodeToClipboard}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Copy Code
              </button>
              <button
                onClick={generateAndCopyLink}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Share Code
              </button>
              <button
                onClick={clearCode}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Clear Code
              </button>
            </div>
          )}
        </div>

        {/* Show shortened link if available */}
        {shortenedURL && (
          <div className="bg-gray-800 text-white text-sm px-4 py-2">
            Shortened Link:{" "}
            <a
              href={shortenedURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              {shortenedURL}
            </a>
          </div>
        )}

        <CodeEditor
          value={code}
          language="js"
          rehypePlugins={[
            [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
          ]}
          placeholder="Paste your code here."
          onChange={(evn) => setCode(evn.target.value)}
          padding={15}
          className="bg-[#0d0d0d]"
          style={{
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
          readOnly={false}
        />
      </div>
    </div>
  );
};
