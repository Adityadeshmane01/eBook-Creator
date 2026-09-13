import { ArrowLeft, ArrowRight, BookOpen, Hash, Lightbulb, Palette, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import InputField from "../ui/InputField";
import Modal from "../ui/Modal";
import SelectField from "../ui/SelectField";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateBookModal = ({ isOpen, onClose, onCreate, isLoading }) => {
  const initialFormData = { title: "", subtitle: "", author: "", topic: "", description: "", style: "Informative", numChapters: 5 };
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [chapters, setChapters] = useState([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setFormData(initialFormData);
    setChapters([]);
    onClose();
  };

  const handleChange = ({ target }) => setFormData((current) => ({ ...current, [target.name]: target.value }));

  const handleGenerateOutline = async (event) => {
    event.preventDefault();
    const topic = formData.topic.trim() || formData.title.trim();
    if (!topic) {
      toast.error("Add a book title or topic before generating an outline.");
      return;
    }

    setIsGeneratingOutline(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE, {
        topic,
        description: formData.description.trim(),
        style: formData.style,
        numChapters: Number(formData.numChapters),
      });
      setChapters(data.outline || []);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to generate the outline.");
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleChapterChange = (index, field, value) => {
    setChapters((current) => current.map((chapter, chapterIndex) => chapterIndex === index ? { ...chapter, [field]: value } : chapter));
  };

  const handleAddChapter = () => {
    setChapters((current) => [...current, { title: `Chapter ${current.length + 1}`, description: "" }]);
  };

  const handleDeleteChapter = (index) => {
    setChapters((current) => current.filter((_, chapterIndex) => chapterIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!chapters.length) {
      toast.error("Add at least one chapter before creating your eBook.");
      return;
    }
    await onCreate({
      title: formData.title.trim() || formData.topic.trim(),
      subtitle: formData.subtitle.trim() || formData.description.trim() || formData.topic.trim(),
      author: formData.author.trim() || "AI eBook Creator",
      chapters,
    });
  };

  const renderProgress = () => (
    <div className="mt-5 flex items-center gap-2" aria-label={`Step ${step} of 2`}>
      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step >= 1 ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-500"}`}>
        {step > 1 ? "✓" : "1"}
      </div>
      <div className={`h-0.5 flex-1 ${step > 1 ? "bg-violet-600" : "bg-gray-200"}`} />
      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step === 2 ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-500"}`}>2</div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create an eBook" size="lg">
        <p className="-mt-1 text-sm font-semibold text-violet-600">New project</p>
        {renderProgress()}

        {step === 1 ? (
          <form onSubmit={handleGenerateOutline} className="mt-6 space-y-4">
            <div className="rounded-xl bg-violet-50 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-violet-800"><Sparkles className="h-4 w-4" /> AI outline generator</div><p className="mt-1 text-xs leading-5 text-violet-700">Describe your idea and the AI will create a starting outline you can edit.</p></div>
            <InputField label="Book title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter your book title..." icon={BookOpen} required />
            <InputField label="Number of chapters" name="numChapters" type="number" min="1" max="20" value={formData.numChapters} onChange={handleChange} placeholder="5" icon={Hash} required />
            <InputField label="Topic (optional)" name="topic" value={formData.topic} onChange={handleChange} placeholder="Specific topic for AI generation..." icon={Lightbulb} />
            <SelectField label="Writing style" name="style" value={formData.style} onChange={handleChange} icon={Palette} options={["Informative", "Storytelling", "Casual", "Professional", "Humorous"]} required />
            <InputField label="Author (optional)" name="author" value={formData.author} onChange={handleChange} placeholder="Author name" />
            <label className="block text-sm font-medium text-gray-700">Description<textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="What should the book cover?" className="mt-2 w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15" /></label>
            <div className="flex justify-end gap-3 pt-3"><Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button><Button type="submit" icon={ArrowRight} isLoading={isGeneratingOutline}>{isGeneratingOutline ? "Generating..." : "Generate outline"}</Button></div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Review Chapters</h3>
              <span className="text-sm text-gray-500">{chapters.length} chapters</span>
            </div>
            <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
              {chapters.length === 0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center rounded-xl bg-gray-50 px-6 text-center">
                  <BookOpen className="h-10 w-10 text-gray-300" />
                  <p className="mt-3 text-sm text-gray-500">No chapters yet. Add one to get started.</p>
                </div>
              ) : chapters.map((chapter, index) => (
                <div key={`${index}-${chapter.title}`} className="group rounded-xl border border-gray-200 p-4 transition hover:border-gray-300">
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">{index + 1}</div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <input value={chapter.title} onChange={(event) => handleChapterChange(index, "title", event.target.value)} placeholder="Chapter title" className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm font-medium outline-none focus:border-violet-500" aria-label={`Chapter ${index + 1} title`} />
                      <textarea value={chapter.description} onChange={(event) => handleChapterChange(index, "description", event.target.value)} placeholder="Brief description of what this chapter covers..." rows="2" className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 outline-none focus:border-violet-500" aria-label={`Chapter ${index + 1} description`} />
                    </div>
                    <button type="button" onClick={() => handleDeleteChapter(index)} className="h-fit rounded-lg p-2 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100" aria-label={`Delete chapter ${index + 1}`} title="Delete chapter"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="secondary" icon={Plus} onClick={handleAddChapter}>Add chapter</Button>
            <div className="flex justify-between gap-3 border-t border-gray-100 pt-5"><Button type="button" variant="ghost" icon={ArrowLeft} onClick={() => setStep(1)}>Back</Button><Button type="submit" isLoading={isLoading}>{isLoading ? "Creating..." : "Create eBook"}</Button></div>
          </form>
        )}
    </Modal>
  );
};

export default CreateBookModal
