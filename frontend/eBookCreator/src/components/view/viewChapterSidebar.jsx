import { GripVertical, Plus, Sparkles, Trash2 } from "lucide-react";
import Button from "../ui/Button";

const ViewChapterSidebar = ({ chapters = [], selectedChapterIndex, onSelectChapter, onAddChapter, onDeleteChapter, onReorderChapters, onGenerateOutline, isGeneratingOutline }) => {
	const moveChapter = (index, direction) => {
		const nextIndex = index + direction;
		if (nextIndex < 0 || nextIndex >= chapters.length) return;
		const reordered = [...chapters];
		[reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
		onReorderChapters(reordered, nextIndex);
	};

	return (
		<aside className="flex h-full w-full flex-col border-r border-gray-200 bg-white">
			<div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
				<div><p className="text-xs font-semibold uppercase tracking-wider text-violet-600">Chapters</p><h2 className="mt-1 font-semibold text-gray-900">Book outline</h2></div>
				<div className="flex items-center gap-1"><Button size="sm" variant="secondary" icon={Sparkles} onClick={onGenerateOutline} isLoading={isGeneratingOutline} aria-label="Generate outline">AI</Button><Button size="sm" variant="secondary" icon={Plus} onClick={onAddChapter} aria-label="Add chapter">Add</Button></div>
			</div>
			<div className="flex-1 space-y-2 overflow-y-auto p-3">
				{chapters.map((chapter, index) => (
					<div key={chapter._id || `${index}-${chapter.title}`} className={`group flex items-start gap-2 rounded-xl border p-3 transition ${selectedChapterIndex === index ? "border-violet-300 bg-violet-50" : "border-transparent hover:border-gray-200 hover:bg-gray-50"}`}>
						<button type="button" onClick={() => onSelectChapter(index)} className="flex min-w-0 flex-1 items-start gap-2 text-left">
							<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-violet-700 shadow-sm">{index + 1}</span>
							<span className="min-w-0"><span className="block truncate text-sm font-medium text-gray-800">{chapter.title || `Chapter ${index + 1}`}</span><span className="mt-1 block truncate text-xs text-gray-500">{chapter.description || "No description"}</span></span>
						</button>
						<div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
							<button type="button" onClick={() => moveChapter(index, -1)} className="rounded p-1 text-gray-400 hover:bg-white hover:text-gray-700" aria-label="Move chapter up"><GripVertical className="h-3.5 w-3.5" /></button>
							<button type="button" onClick={() => onDeleteChapter(index)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete chapter"><Trash2 className="h-3.5 w-3.5" /></button>
						</div>
					</div>
				))}
			</div>
		</aside>
	);
};

export default ViewChapterSidebar;
