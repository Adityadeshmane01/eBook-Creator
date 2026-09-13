import { useState } from "react";
import { ArrowLeft, GripVertical, Plus, Sparkles, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const ChapterSidebar = ({
  book,
  chapters = book?.chapters || [],
  selectedChapterIndex,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onGenerateOutline,
  isGeneratingOutline,
  onGenerateChapterContent,
  isGenerating,
  onReorderChapters,
}) => {
  const navigate = useNavigate();
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (event, index) => {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  };

  const handleDrop = (event, targetIndex) => {
    event.preventDefault();
    const sourceIndex = Number(event.dataTransfer.getData("text/plain"));
    if (Number.isNaN(sourceIndex) || sourceIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const reordered = [...chapters];
    const [movedChapter] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, movedChapter);
    onReorderChapters(reordered, targetIndex);
    setDraggedIndex(null);
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-4">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate("/dashboard")}>
          Back to dashboard
        </Button>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">Chapters</p>
            <h2 className="mt-1 truncate font-semibold text-gray-900" title={book?.title}>Book outline</h2>
          </div>
          <Button size="sm" variant="secondary" icon={Sparkles} onClick={onGenerateOutline} isLoading={isGeneratingOutline} aria-label="Generate outline">
            AI
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {chapters.map((chapter, index) => (
          <div
            key={chapter._id || `${index}-${chapter.title}`}
            draggable
            onDragStart={(event) => handleDragStart(event, index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, index)}
            onDragEnd={() => setDraggedIndex(null)}
            className={`group flex items-start gap-2 rounded-xl border p-3 transition ${
              selectedChapterIndex === index ? "border-violet-300 bg-violet-50" : "border-transparent hover:border-gray-200 hover:bg-gray-50"
            } ${draggedIndex === index ? "opacity-50" : ""}`}
          >
            <GripVertical className="mt-1 h-4 w-4 shrink-0 cursor-grab text-gray-400 active:cursor-grabbing" aria-hidden="true" />
            <button type="button" onClick={() => onSelectChapter(index)} className="min-w-0 flex-1 text-left">
              <span className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-violet-700 shadow-sm">{index + 1}</span>
                <span className="truncate text-sm font-medium text-gray-800">{chapter.title || `Chapter ${index + 1}`}</span>
              </span>
              <span className="mt-1 block truncate text-xs text-gray-500">{chapter.description || "No description"}</span>
            </button>
            {onGenerateChapterContent && (
              <button type="button" onClick={() => onGenerateChapterContent(index)} className="rounded p-1 text-violet-500 hover:bg-violet-100" aria-label={`Generate content for chapter ${index + 1}`}>
                <Sparkles className={`h-3.5 w-3.5 ${isGenerating && selectedChapterIndex === index ? "animate-pulse" : ""}`} />
              </button>
            )}
            <button type="button" onClick={() => onDeleteChapter(index)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label={`Delete chapter ${index + 1}`}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 p-3">
        <Button variant="secondary" icon={Plus} onClick={onAddChapter} className="w-full">
          New chapter
        </Button>
      </div>
    </aside>
  );
};

export default ChapterSidebar;
