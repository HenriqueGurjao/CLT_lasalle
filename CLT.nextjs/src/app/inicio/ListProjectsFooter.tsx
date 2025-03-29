import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ListProjectsFooterProps {
  pagesNumber: number;
  currentPage: number;
  setPagesNumber: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  customizePagesNumber: (value: string) => void;
  currentPageSize: number;
}

export const ListProjectsFooter = ({
  currentPage,
  pagesNumber,
  setCurrentPage,
  setPagesNumber,
  customizePagesNumber,
  currentPageSize,
}: ListProjectsFooterProps) => {
  // const [pagesNumber, setPagesNumber] = useState<number>(20);
  // const [currentPage, setCurrentPage] = useState<number>(10);
  const pageLimit = 5;

  const generateVisiblePages = () => {
    if (pagesNumber <= pageLimit) {
      return Array.from({ length: pagesNumber }, (_, i) => i + 1);
    }

    const firstPages = [1, 2];
    const lastPages = [pagesNumber - 1, pagesNumber];
    const middlePages = [];

    if (currentPage - 2 > 2) {
      middlePages.push("...");
    }

    const startPage = Math.max(3, currentPage - 2);
    const endPage = Math.min(pagesNumber - 2, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      middlePages.push(i);
    }

    if (currentPage + 2 < pagesNumber - 2) {
      middlePages.push("...");
    }

    return [...firstPages, ...middlePages, ...lastPages];
  };

  const visiblePages = generateVisiblePages();

  return (
    <footer className="bg-gray-300 rounded-b-md flex justify-between">
      <ul className="flex overflow-x-auto rounded-b-md">
        <li>
          <button
            className={`px-2 py-2 text-gray-800 ${
              currentPage != 1 && "hover:text-yellow-600 hover:bg-blue-200"
            } ${currentPage === 1 && "bg-gray-300 text-white"}`}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            aria-label="Primeira página"
          >
            &laquo;
          </button>
        </li>
        {visiblePages.map((page, index) => (
          <li key={index}>
            <button
              className={`px-2 py-2 text-gray-800 hover:text-yellow-600 hover:bg-blue-200 ${
                page === currentPage && "bg-gray-400 text-white"
              }`}
              onClick={() => page !== "..." && setCurrentPage(Number(page))}
              disabled={page === "..." || page === currentPage}
              aria-label={`Página ${page}`}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            className={`px-2 py-2 text-gray-800 ${
              currentPage === pagesNumber && "bg-gray-300 text-white"
            } ${
              currentPage != pagesNumber &&
              "hover:text-yellow-600 hover:bg-blue-200"
            }`}
            onClick={() => setCurrentPage(pagesNumber)}
            disabled={currentPage === pagesNumber}
            aria-label="Ultima pagina"
          >
            &raquo;
          </button>
        </li>
      </ul>
      <div className="pr-10 flex items-center justify-center">
        <span className="whitespace-nowrap">Itens por pagina:</span>
        <Select onValueChange={customizePagesNumber} value={String(currentPageSize)}>
          <SelectTrigger className="w-full bg-zinc-100 h-7">
            <SelectValue placeholder="Itens por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Itens por Página</SelectLabel>
              {[5, 20, 40, 60].map((items) => (
                <SelectItem key={items} value={String(items)}>
                  {items}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </footer>
  );
};
