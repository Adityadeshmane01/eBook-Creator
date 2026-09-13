import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bold, BookOpen, ChevronDown, Clock3, Download, Eye, FileText, Heading2, Italic, Maximize2, Menu, Minimize2, Save, Sparkles, Upload } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import ChapterSidebar from "../components/editor/ChapterSidebar";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

const renderInlineMarkdown = (text, keyPrefix) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={`${keyPrefix}-${index}`}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={`${keyPrefix}-${index}`}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={`${keyPrefix}-${index}`} className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.9em]">{part.slice(1, -1)}</code>;
    return <span key={`${keyPrefix}-${index}`}>{part}</span>;
  });
};

const renderMarkdown = (content) => (content || "Nothing written yet.").split("\n").map((line, index) => {
  if (line.startsWith("# ")) return <h1 key={index} className="text-2xl font-bold text-gray-900">{renderInlineMarkdown(line.slice(2), index)}</h1>;
  if (line.startsWith("## ")) return <h2 key={index} className="text-xl font-semibold text-gray-900">{renderInlineMarkdown(line.slice(3), index)}</h2>;
  if (line.startsWith("- ")) return <p key={index} className="pl-4">&#8226; {renderInlineMarkdown(line.slice(2), index)}</p>;
  return <p key={index}>{line ? renderInlineMarkdown(line, index) : " "}</p>;
});

const EditorPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const coverInputRef = useRef(null);
  const [book, setBook] = useState(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [editorMode, setEditorMode] = useState("edit");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`);
        setBook(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load this eBook.");
        navigate("/dashboard", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId, navigate]);

  const updateChapter = (field, value, chapterIndex = selectedChapterIndex) => {
    setBook((current) => ({ ...current, chapters: current.chapters.map((item, index) => index === chapterIndex ? { ...item, [field]: value } : item) }));
  };

  const saveBook = async () => {
    setIsSaving(true);
    try {
      const { data } = await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`, book);
      setBook(data);
      toast.success("Changes saved.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const addChapter = () => {
    setBook((current) => ({ ...current, chapters: [...current.chapters, { title: `Chapter ${current.chapters.length + 1}`, description: "", content: "" }] }));
    setSelectedChapterIndex(book.chapters.length);
    setIsSidebarOpen(false);
  };

  const deleteChapter = (index) => {
    if (book.chapters.length <= 1) return toast.error("An eBook must have at least one chapter.");
    setBook((current) => ({ ...current, chapters: current.chapters.filter((_, chapterIndex) => chapterIndex !== index) }));
    setSelectedChapterIndex((current) => Math.max(0, Math.min(current, book.chapters.length - 2)));
  };

  const reorderChapters = (chapters, nextIndex) => {
    setBook((current) => ({ ...current, chapters }));
    setSelectedChapterIndex(nextIndex);
  };

  const generateChapter = async (chapterIndex = selectedChapterIndex) => {
    const target = book.chapters[chapterIndex];
    setIsGenerating(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.AI.GENERATE_CHAPTER_CONTENT, { chapterTitle: target.title, chapterDescription: target.description, style: "Informative" });
      updateChapter("content", data.content, chapterIndex);
      toast.success("Chapter content generated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate chapter content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateOutline = async () => {
    setIsGeneratingOutline(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE, { topic: book.title, description: book.subtitle, style: "Informative", numChapters: book.chapters.length || 5 });
      setBook((current) => ({ ...current, chapters: data.outline.map((item) => ({ title: item.title, description: item.description, content: "" })) }));
      setSelectedChapterIndex(0);
      toast.success("Book outline generated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate the outline.");
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const exportBook = async (format) => {
    setIsExporting(true);
    setIsExportMenuOpen(false);
    try {
      const { data } = await axiosInstance.get(`${API_PATHS.EXPORT[format]}/${bookId}/${format.toLowerCase()}`, { responseType: "blob" });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${book.title || "ebook"}.${format === "PDF" ? "pdf" : "docx"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success(`${format} export downloaded.`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to export as ${format}.`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCoverUpload = async ({ target }) => {
    const file = target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("cover", file);
    try {
      const { data } = await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_COVER}/${bookId}`, formData);
      setBook(data);
      toast.success("Cover updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload cover. Use a JPG, PNG, WebP, GIF, BMP, or AVIF image under 10 MB.");
    } finally {
      target.value = "";
    }
  };

  const insertMarkdown = (prefix, suffix = "", block = false) => {
    const input = contentRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selectedText = chapter.content.slice(start, end);
    let replacement;
    let selectionStart;
    let selectionEnd;

    if (block) {
      const lineStart = chapter.content.lastIndexOf("\n", start - 1) + 1;
      const lineEndIndex = chapter.content.indexOf("\n", end);
      const lineEnd = lineEndIndex === -1 ? chapter.content.length : lineEndIndex;
      const selectedLines = chapter.content.slice(lineStart, lineEnd).split("\n");
      const formattedLines = selectedLines.map((line) => line.startsWith(prefix) ? line.slice(prefix.length) : `${prefix}${line}`);
      replacement = formattedLines.join("\n");
      selectionStart = lineStart;
      selectionEnd = lineStart + replacement.length;
      updateChapter("content", `${chapter.content.slice(0, lineStart)}${replacement}${chapter.content.slice(lineEnd)}`);
    } else {
      const text = selectedText || "text";
      replacement = `${prefix}${text}${suffix}`;
      selectionStart = start + prefix.length;
      selectionEnd = selectionStart + text.length;
      updateChapter("content", `${chapter.content.slice(0, start)}${replacement}${chapter.content.slice(end)}`);
    }

    requestAnimationFrame(() => {
      input.focus({ preventScroll: true });
      input.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  if (isLoading) return <DashboardLayout><div className="flex min-h-[70vh] items-center justify-center text-sm text-gray-500">Loading editor...</div></DashboardLayout>;
  if (!book) return null;
  const chapter = book.chapters[selectedChapterIndex] || { title: "", description: "", content: "" };
  const coverImageUrl = book.coverImage ? `${BASE_URL}/backend${book.coverImage}`.replace(/([^:]\/)\/+/, "$1") : "";
  const wordCount = (chapter.content || "").trim() ? chapter.content.trim().split(/\s+/).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const completion = Math.min(100, Math.round((wordCount / 1200) * 100));
  const rootClass = isFullscreen ? "editor-workspace fixed inset-0 z-50 flex flex-col" : "editor-workspace flex min-h-[calc(100vh-4rem)] flex-col";

  return (
    <DashboardLayout>
      <div className={rootClass}>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => navigate("/dashboard")} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Back to dashboard"><ArrowLeft className="h-5 w-5" /></button><div className="min-w-0"><h1 className="truncate text-sm font-semibold text-gray-900">{book.title}</h1><p className="text-xs text-gray-500">Editing: {chapter.title}</p></div></div>
          <div className="flex items-center gap-2"><div className="relative"><Button variant="secondary" size="sm" icon={Download} onClick={() => setIsExportMenuOpen((open) => !open)} isLoading={isExporting}>Export <ChevronDown className="h-4 w-4" /></Button>{isExportMenuOpen && <div className="absolute right-0 z-20 mt-2 w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"><button type="button" onClick={() => exportBook("PDF")} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50">PDF</button><button type="button" onClick={() => exportBook("DOC")} className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50">DOCX</button></div>}</div><Button size="sm" icon={Save} onClick={saveBook} isLoading={isSaving}>Save Changes</Button><button type="button" onClick={() => setIsSidebarOpen(true)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden" aria-label="Open chapters"><Menu className="h-5 w-5" /></button></div>
        </header>
        <div className="flex min-h-0 flex-1">
          <div className={`fixed inset-0 z-40 lg:static lg:block lg:w-72 ${isSidebarOpen ? "block" : "hidden"}`}><div className="absolute inset-0 bg-black/30 lg:hidden" onClick={() => setIsSidebarOpen(false)} /><div className="relative h-full w-80 max-w-[90vw] bg-white lg:w-full"><ChapterSidebar book={book} chapters={book.chapters} selectedChapterIndex={selectedChapterIndex} onSelectChapter={(index) => { setSelectedChapterIndex(index); setIsSidebarOpen(false); }} onAddChapter={addChapter} onDeleteChapter={deleteChapter} onReorderChapters={reorderChapters} onGenerateOutline={generateOutline} isGeneratingOutline={isGeneratingOutline} onGenerateChapterContent={(index) => { setSelectedChapterIndex(index); generateChapter(index); }} isGenerating={isGenerating} /></div></div>
          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className="border-b border-gray-200 bg-white px-4 pt-4 sm:px-8"><div className="mx-auto flex max-w-5xl items-center gap-1"><button type="button" onClick={() => setActiveTab("editor")} className={`rounded-t-lg px-4 py-3 text-sm font-semibold ${activeTab === "editor" ? "border-b-2 border-violet-600 text-violet-700" : "text-gray-500"}`}>Editor</button><button type="button" onClick={() => setActiveTab("details")} className={`rounded-t-lg px-4 py-3 text-sm font-semibold ${activeTab === "details" ? "border-b-2 border-violet-600 text-violet-700" : "text-gray-500"}`}>Book Details</button></div></div>
            <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
              {activeTab === "details" ? <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-xl font-bold text-gray-900">Book Details</h2><div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr]"><div><div className="group relative aspect-3/4 overflow-hidden rounded-xl bg-violet-100">{coverImageUrl && <img src={coverImageUrl} alt={`${book.title} cover`} className="h-full w-full object-cover" />}<button type="button" onClick={() => coverInputRef.current?.click()} className="absolute inset-x-2 bottom-2 rounded-lg bg-white/90 px-3 py-2 text-xs font-medium opacity-0 shadow-sm transition group-hover:opacity-100"><Upload className="mr-1 inline h-3.5 w-3.5" />Change cover</button></div><input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" /></div><div className="space-y-4"><InputField label="Book title" name="title" value={book.title} onChange={({ target }) => setBook((current) => ({ ...current, title: target.value }))} /><InputField label="Subtitle" name="subtitle" value={book.subtitle} onChange={({ target }) => setBook((current) => ({ ...current, subtitle: target.value }))} /><InputField label="Author" name="author" value={book.author} onChange={({ target }) => setBook((current) => ({ ...current, author: target.value }))} /></div></div></section> : <>
                <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700"><span className="h-2 w-2 rounded-full bg-orange-400" />Chapter {selectedChapterIndex + 1} of {book.chapters.length}</div><h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">{chapter.title || `Chapter ${selectedChapterIndex + 1}`}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{chapter.description || "Shape the next section of your story, one clear idea at a time."}</p></div><div className="flex items-center gap-2"><div className="flex rounded-xl border border-gray-200 bg-white/80 p-1 shadow-sm"><button type="button" onClick={() => setEditorMode("edit")} className={`rounded-lg px-3 py-1.5 text-sm ${editorMode === "edit" ? "bg-gray-900 font-semibold text-white" : "text-gray-500"}`}><FileText className="mr-1 inline h-4 w-4" />Edit</button><button type="button" onClick={() => setEditorMode("preview")} className={`rounded-lg px-3 py-1.5 text-sm ${editorMode === "preview" ? "bg-gray-900 font-semibold text-white" : "text-gray-500"}`}><Eye className="mr-1 inline h-4 w-4" />Preview</button></div><button type="button" onClick={() => setIsFullscreen((value) => !value)} className="rounded-xl bg-white/80 p-2 text-gray-500 shadow-sm hover:bg-white" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>{isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}</button><Button icon={Sparkles} onClick={() => generateChapter()} isLoading={isGenerating}>{isGenerating ? "Generating..." : "Generate with AI"}</Button></div></div>
                <div className="grid grid-cols-3 gap-3"><div className="editor-stat rounded-xl px-4 py-3"><div className="flex items-center gap-2 text-gray-500"><FileText className="h-4 w-4" /><span className="text-xs font-medium">Words</span></div><p className="mt-1 text-lg font-bold text-gray-900">{wordCount.toLocaleString()}</p></div><div className="editor-stat rounded-xl px-4 py-3"><div className="flex items-center gap-2 text-gray-500"><Clock3 className="h-4 w-4" /><span className="text-xs font-medium">Read time</span></div><p className="mt-1 text-lg font-bold text-gray-900">{readingMinutes} min</p></div><div className="editor-stat rounded-xl px-4 py-3"><div className="flex items-center gap-2 text-gray-500"><BookOpen className="h-4 w-4" /><span className="text-xs font-medium">Draft goal</span></div><p className="mt-1 text-lg font-bold text-gray-900">{completion}%</p></div></div>
                <input value={chapter.title} onChange={({ target }) => updateChapter("title", target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-lg font-semibold text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15" placeholder="Chapter title" />
                <div className="editor-canvas overflow-hidden rounded-2xl border border-gray-200/80 bg-white">{editorMode === "edit" && <div className="flex flex-wrap items-center justify-between border-b border-gray-200 bg-[#fbfaf8] px-3 py-2"><div className="flex items-center gap-1"><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => insertMarkdown("**", "**")} className="rounded-lg p-2 hover:bg-gray-200" aria-label="Bold" title="Bold"><Bold className="h-4 w-4" /></button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => insertMarkdown("*", "*")} className="rounded-lg p-2 hover:bg-gray-200" aria-label="Italic" title="Italic"><Italic className="h-4 w-4" /></button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => insertMarkdown("## ", "", true)} className="rounded-lg p-2 hover:bg-gray-200" aria-label="Heading" title="Heading"><Heading2 className="h-4 w-4" /></button><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => insertMarkdown("- ", "", true)} className="rounded-lg px-2 py-1 text-sm hover:bg-gray-200" aria-label="List" title="List">List</button></div><span className="text-xs text-gray-400">Markdown supported</span></div>}{editorMode === "edit" ? <textarea ref={contentRef} value={chapter.content} onChange={({ target }) => updateChapter("content", target.value)} className="min-h-112 w-full resize-y border-0 bg-white p-6 text-[15px] leading-8 text-gray-700 outline-none focus:ring-0 sm:p-8" placeholder="Write your chapter in Markdown, or generate it with AI..." /> : <div className="min-h-28rem whitespace-pre-wrap p-6 text-[15px] leading-8 text-gray-700 sm:p-8">{renderMarkdown(chapter.content)}</div>}</div>
              </>}
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditorPage;
