import type React from "react"
import "./styles/pagination.css"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5 
    const sidePages = 2 

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    pages.push(1)

    let startPage = Math.max(2, currentPage - sidePages)
    let endPage = Math.min(totalPages - 1, currentPage + sidePages)

    if (currentPage <= sidePages + 2) {
      endPage = showPages - 1
    }

    if (currentPage >= totalPages - sidePages - 1) {
      startPage = totalPages - showPages + 2
    }

    if (startPage > 2) {
      pages.push("...")
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages - 1) {
      pages.push("...")
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn pagination-nav"
        onClick={() => handlePageClick(1)}
        disabled={currentPage === 1}
        aria-label="Primera página"
      >
        «
      </button>

      <button
        className="pagination-btn pagination-nav"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        ‹
      </button>

      <div className="pagination-numbers">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            )
          }

          return (
            <button
              key={page}
              className={`pagination-btn pagination-number ${currentPage === page ? "active" : ""}`}
              onClick={() => handlePageClick(page as number)}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        className="pagination-btn pagination-nav"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Página siguiente"
      >
        ›
      </button>

      <button
        className="pagination-btn pagination-nav"
        onClick={() => handlePageClick(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Última página"
      >
        »
      </button>
    </div>
  )
}

export default Pagination
