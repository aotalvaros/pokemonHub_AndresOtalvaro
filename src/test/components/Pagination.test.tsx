import Pagination from '../../components/Pagination';
import { describe, it, vi, expect, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Pagination", () => {
    const mockcurrentPage = 1;
    const mocktotalPages = 1;
    const mockonPageChange = vi.fn()

    const setUp = (props = {}) => {
        const initialProps = {
            currentPage: mockcurrentPage,
            totalPages: mocktotalPages,
            onPageChange: mockonPageChange,
        };

        return render(<Pagination {...initialProps} {...props} />);
    };

     const mockScrollTo = vi.fn();

    beforeEach(() => {
        Object.defineProperty(window, 'scrollTo', {
            value: mockScrollTo,
            writable: true
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render with basic navigation buttons', () => {
        setUp();
        
        expect(screen.getByTestId('first-page-btn')).toBeInTheDocument();
        expect(screen.getByTestId('prev-page-btn')).toBeInTheDocument();
        expect(screen.getByTestId('next-page-btn')).toBeInTheDocument();
        expect(screen.getByTestId('last-page-btn')).toBeInTheDocument();
    });

    it('should disable first and previous buttons on first page', () => {
        setUp({ currentPage: 1, totalPages: 5 });
        
        expect(screen.getByTestId('first-page-btn')).toBeDisabled();
        expect(screen.getByTestId('prev-page-btn')).toBeDisabled();
        expect(screen.getByTestId('next-page-btn')).not.toBeDisabled();
        expect(screen.getByTestId('last-page-btn')).not.toBeDisabled();
    });

    it('should disable next and last buttons on last page', () => {
        setUp({ currentPage: 5, totalPages: 5 });
        
        expect(screen.getByTestId('first-page-btn')).not.toBeDisabled();
        expect(screen.getByTestId('prev-page-btn')).not.toBeDisabled();
        expect(screen.getByTestId('next-page-btn')).toBeDisabled();
        expect(screen.getByTestId('last-page-btn')).toBeDisabled();
    });

    it('should render all page numbers when totalPages <= 4', () => {
        setUp({ currentPage: 2, totalPages: 4 });
        
        expect(screen.getByTestId('page-btn-1')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-2')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-3')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-4')).toBeInTheDocument();
    });

    it('should show ellipsis for large page counts', () => {
        setUp({ currentPage: 5, totalPages: 10 });
        
        expect(screen.getByTestId('page-btn-1')).toBeInTheDocument();
        expect(screen.getByTestId('ellipsis-1')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-10')).toBeInTheDocument();
    });

    it('should call onPageChange when clicking first page button', () => {
        setUp({ currentPage: 3, totalPages: 5 });
        
        fireEvent.click(screen.getByTestId('first-page-btn'));
        
        expect(mockonPageChange).toHaveBeenCalledWith(1);
        expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it('should call onPageChange when clicking previous page button', () => {
        setUp({ currentPage: 3, totalPages: 5 });
        
        fireEvent.click(screen.getByTestId('prev-page-btn'));
        
        expect(mockonPageChange).toHaveBeenCalledWith(2);
        expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it('should call onPageChange when clicking next page button', () => {
        setUp({ currentPage: 3, totalPages: 5 });
        
        fireEvent.click(screen.getByTestId('next-page-btn'));
        
        expect(mockonPageChange).toHaveBeenCalledWith(4);
        expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it('should call onPageChange when clicking last page button', () => {
        setUp({ currentPage: 3, totalPages: 5 });
        
        fireEvent.click(screen.getByTestId('last-page-btn'));
        
        expect(mockonPageChange).toHaveBeenCalledWith(5);
        expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it('should call onPageChange when clicking specific page button', () => {
        setUp({ currentPage: 1, totalPages: 5 });
        
        fireEvent.click(screen.getByTestId('page-btn-3'));
        
        expect(mockonPageChange).toHaveBeenCalledWith(3);
        expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it('should not call onPageChange when clicking current page', () => {
        setUp({ currentPage: 3, totalPages: 5 });
        
        fireEvent.click(screen.getByTestId('page-btn-3'));
        
        expect(mockonPageChange).not.toHaveBeenCalled();
        expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it('should not call onPageChange when clicking disabled buttons', () => {
        setUp({ currentPage: 1, totalPages: 5 });
        
        fireEvent.click(screen.getByTestId('first-page-btn'));
        fireEvent.click(screen.getByTestId('prev-page-btn'));
        
        expect(mockonPageChange).not.toHaveBeenCalled();
        expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it('should handle single page correctly', () => {
        setUp({ currentPage: 1, totalPages: 1 });
        
        expect(screen.getByTestId('first-page-btn')).toBeDisabled();
        expect(screen.getByTestId('prev-page-btn')).toBeDisabled();
        expect(screen.getByTestId('next-page-btn')).toBeDisabled();
        expect(screen.getByTestId('last-page-btn')).toBeDisabled();
        
        expect(screen.getByTestId('page-btn-1')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-1')).toHaveClass('active');
    });

    it('should handle two pages correctly', () => {
        setUp({ currentPage: 1, totalPages: 2 });
        
        expect(screen.getByTestId('page-btn-1')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-2')).toBeInTheDocument();
        expect(screen.queryByTestId('ellipsis-1')).not.toBeInTheDocument();
    });


    it('should show correct pages when current page is near end', () => {
        setUp({ currentPage: 9, totalPages: 10 });
        
        expect(screen.getByTestId('page-btn-1')).toBeInTheDocument();
        expect(screen.getByTestId('ellipsis-1')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-8')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-9')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-10')).toBeInTheDocument();
    });

    it('should have correct aria-labels for accessibility', () => {
        setUp({ currentPage: 3, totalPages: 5 });
        
        expect(screen.getByTestId('first-page-btn')).toHaveAttribute('aria-label', 'Primera página');
        expect(screen.getByTestId('prev-page-btn')).toHaveAttribute('aria-label', 'Página anterior');
        expect(screen.getByTestId('next-page-btn')).toHaveAttribute('aria-label', 'Página siguiente');
        expect(screen.getByTestId('last-page-btn')).toHaveAttribute('aria-label', 'Última página');
        expect(screen.getByTestId('page-btn-3')).toHaveAttribute('aria-label', 'Página 3');
    });

    it('should render ellipsis with correct styling', () => {
        setUp({ currentPage: 5, totalPages: 10 });
        
        const ellipsis = screen.getByTestId('ellipsis-1');
        expect(ellipsis).toHaveClass('pagination-ellipsis');
        expect(ellipsis).toHaveTextContent('...');
    });

    it('should handle large page numbers correctly', () => {
        setUp({ currentPage: 50, totalPages: 100 });
        
        expect(screen.getByTestId('page-btn-1')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-100')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-50')).toHaveClass('active');
    });

    it('should maintain consistent behavior with rapid clicks', () => {
        setUp({ currentPage: 3, totalPages: 10 });
        
        // Rapid clicks should all work
        fireEvent.click(screen.getByTestId('next-page-btn'));
        fireEvent.click(screen.getByTestId('next-page-btn'));
        fireEvent.click(screen.getByTestId('prev-page-btn'));
        
        expect(mockonPageChange).toHaveBeenCalledTimes(3);
        expect(mockScrollTo).toHaveBeenCalledTimes(3);
    });

    it('should handle exact boundary conditions for ellipsis display', () => {
        // Test the exact condition where ellipsis should appear
        setUp({ currentPage: 4, totalPages: 10 });
        
        expect(screen.getByTestId('page-btn-1')).toBeInTheDocument();
        expect(screen.queryByTestId('ellipsis-1')).not.toBeInTheDocument(); // Should not show ellipsis yet
        
        setUp({ currentPage: 5, totalPages: 10 });
        expect(screen.getByTestId('ellipsis-1')).toBeInTheDocument(); // Now should show ellipsis
    });



})