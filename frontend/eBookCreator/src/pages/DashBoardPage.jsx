import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BookOpen, Plus } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import BookCard from "../components/cards/BookCard";
import CreateBookModal from "../components/modals/CreateBookModal";
import { useAuth } from "../context/useAuth";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const BookCardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="aspect-video w-full rounded-t-2xl bg-gray-200" />
    <div className="space-y-3 p-5">
      <div className="h-5 w-3/4 rounded bg-gray-200" />
      <div className="h-4 w-1/2 rounded bg-gray-200" />
      <div className="h-3 w-1/3 rounded bg-gray-200" />
    </div>
  </div>
);

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
        setBooks(data);
      } catch {
        toast.error("Failed to fetch your eBooks.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      await axiosInstance.delete(`${API_PATHS.BOOKS.DELETE_BOOK}/${bookToDelete._id}`);
      setBooks((current) => current.filter((book) => book._id !== bookToDelete._id));
      toast.success("eBook deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete the eBook.");
    } finally {
      setBookToDelete(null);
    }
  };

  const handleCreateBook = async (bookData) => {
    setIsCreating(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.BOOKS.CREATE_BOOK, bookData);
      setBooks((current) => [data, ...current]);
      handleBookCreated(data._id);
      toast.success("eBook created.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create the eBook.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateBookClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleBookCreated = (bookId) => {
    setIsCreateModalOpen(false);
    navigate(`/editor/${bookId}`);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl p-6 lg:p-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-violet-600">Welcome back{user?.name ? `, ${user.name}` : ""}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">Your eBooks</h1>
            <p className="mt-2 text-sm text-gray-600">Create, edit, and manage all your AI-generated eBooks.</p>
          </div>

          <Button
            className="whitespace-nowrap"
            onClick={handleCreateBookClick}
            icon={Plus}
          >
            New eBook
          </Button>
        </div>
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => <BookCardSkeleton key={index} />)}
          </div>
        ) : books.length === 0 ? (
          <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
              <BookOpen className="h-8 w-8 text-violet-400" />
            </div>
            <h2 className="text-lg font-medium text-gray-900">No eBooks found</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">You haven&apos;t created any eBooks yet. Get started by creating your first one.</p>
            <Button className="mt-6" icon={Plus} onClick={handleCreateBookClick}>Create your first eBook</Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{books.map((book) => <BookCard key={book._id} book={book} onOpen={(id) => navigate(`/editor/${id}`)} onDelete={setBookToDelete} />)}</div>
        )}
      </div>
      <CreateBookModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateBook} isLoading={isCreating} />
      {bookToDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4" role="dialog" aria-modal="true"><div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-lg font-semibold text-gray-900">Delete this eBook?</h2><p className="mt-2 text-sm text-gray-600">This will permanently remove “{bookToDelete.title}”.</p><div className="mt-6 flex justify-end gap-3"><Button variant="secondary" onClick={() => setBookToDelete(null)}>Cancel</Button><Button variant="danger" onClick={handleDeleteBook}>Delete</Button></div></div></div>}
    </DashboardLayout>
  );
};

export default DashboardPage;