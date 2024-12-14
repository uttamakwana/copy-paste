import { useSearchParams } from "react-router-dom";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState, useEffect } from "react";
import rehypePrism from "rehype-prism-plus";
import toast, { Toaster } from "react-hot-toast";
import rehypeRewrite from "rehype-rewrite";

export const CopyInput = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [code, setCode] = useState<string>(""); // Editor content
  const [isCodeLoadedFromURL, setIsCodeLoadedFromURL] = useState(false);
  const [status, setStatus] = useState<"idle" | "copied" | "loading">("idle");

  useEffect(() => {
    const queryCode = searchParams.get("code");
    if (queryCode) {
      setCode(decodeURIComponent(queryCode));
      setIsCodeLoadedFromURL(true);
    }
  }, [searchParams]);

  const generateAndCopyLink = async () => {
    if (!code) {
      toast.error("Editor is empty. Write some code first!");
      return;
    }

    setStatus("loading");
    const encodedCode = encodeURIComponent(code);
    const shareableLink = `https://pasteify.netlify.app/?code=${encodedCode}`;
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Link copied to clipboard!");
      setStatus("idle");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy the link!");
      setStatus("idle");
    }
  };

  const copyCodeToClipboard = () => {
    if (!code) {
      toast.error("Editor is empty. Write some code first!");
      return;
    }

    navigator.clipboard.writeText(code).then(
      () => {
        toast.success("Code copied to clipboard!");
        setStatus("copied");
      },
      () => {
        toast.error("Failed to copy code.");
        setStatus("idle");
      }
    );
  };

  const clearCode = () => {
    setCode("");
    setSearchParams({});
    setIsCodeLoadedFromURL(false);
    setStatus("idle");
    toast.success("Editor cleared!");
  };

  return (
    <div className="p-4">
      <Toaster />
      <div className="rounded bg-[#2f2f2f] border border-[#313131]">
        <div className="sticky top-0 z-10">
          <div className="bg-[#2f2f2f] flex items-center justify-between py-2 px-4">
            {!isCodeLoadedFromURL ? (
              <button
                onClick={generateAndCopyLink}
                disabled={!code || status === "loading"}
                className={`${
                  !code || status === "loading"
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-indigo-600"
                } text-white px-4 py-2 rounded`}
              >
                {status === "loading"
                  ? "Generating..."
                  : "Generate & Copy Link"}
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={copyCodeToClipboard}
                  disabled={!code}
                  className={`${
                    !code ? "bg-gray-500 cursor-not-allowed" : "bg-green-600"
                  } text-white px-4 py-2 rounded`}
                >
                  Copy Code
                </button>
                <button
                  onClick={generateAndCopyLink}
                  disabled={!code || status === "loading"}
                  className={`${
                    !code || status === "loading"
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-indigo-600"
                  } text-white px-4 py-2 rounded`}
                >
                  {status === "loading" ? "Sharing..." : "Share Code"}
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
          <div className="flex justify-between items-center bg-[#1f1f1f] px-4 py-2 text-gray-300">
            <span>{code.length} characters</span>
            {status === "copied" && (
              <span className="text-green-400">Code copied!</span>
            )}
          </div>
        </div>
        <CodeEditor
          value={code}
          language="js"
          placeholder="Please enter JS code."
          onChange={(evn) => setCode(evn.target.value)}
          rehypePlugins={[
            [rehypePrism, { ignoreMissing: true }],
            [
              rehypeRewrite,
              {
                rewrite: (
                  node: {
                    properties: { className: string[] };
                    type: string;
                    value: string;
                  },
                  index: number,
                  parent: {
                    children: string | unknown[];
                    properties: { className: string[] };
                  }
                ) => {
                  if (node.properties?.className?.includes("code-line")) {
                    if (index === 0 && node.properties?.className) {
                      node.properties.className.push("demo01");
                      // console.log("~~~", index, node.properties?.className);
                    }
                  }
                  if (
                    node.type === "text" &&
                    node.value === "return" &&
                    parent.children.length === 1
                  ) {
                    parent.properties.className.push("demo123");
                  }
                },
              },
            ],
          ]}
          padding={15}
          className="bg-[#0d0d0d]"
          style={{
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
        />
        {/* <CodeEditor
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
        /> */}
      </div>
    </div>
  );
};
