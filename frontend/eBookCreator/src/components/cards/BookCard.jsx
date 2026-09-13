import { BASE_URL } from "../../utils/apiPaths";
import { Edit, Trash2 } from "lucide-react";

const BookCard = ({ book, onOpen, onDelete }) => {
  const coverImageUrl = book.coverImage
    ? `${BASE_URL}/backend${book.coverImage}`.replace(/([^:]\/)\/+/, "$1")
    : "";

  return (
    <article className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100/70">
      <button type="button" onClick={() => onOpen(book._id)} className="block w-full text-left">
        <div className="relative aspect-[16/25] overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={`${book.title} cover`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(event) => { event.currentTarget.style.display = "none"; }}
            />
          ) : null}

          <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm" title="Edit book">
              <Edit className="h-4 w-4" aria-hidden="true" />
            </span>
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => { event.stopPropagation(); onDelete(book); }}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); onDelete(book); } }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm hover:text-red-600"
              title="Delete book"
              aria-label={`Delete ${book.title}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/85 via-black/50 to-transparent px-4 pb-4 pt-14 text-white">
            <h2 className="line-clamp-2 text-sm font-semibold leading-tight">{book.title}</h2>
            <p className="mt-1 truncate text-xs text-gray-200">{book.author}</p>
          </div>
        </div>
      </button>
    </article>
  );
};

export default BookCard
