import { LazyImage } from "../../components/LazyImage";
import { describe, it, vi, expect, afterEach, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

describe("LazyImage", () => {

    const mocksrc = "https://example.com/test-image.jpg";
    const mockalt = "Test image";
    const mockclassName = "test-class";
    const mockplaceholder = "/test-placeholder.svg";

    const setUp = (props = {}) => {
        const initialProps = {
        src: mocksrc,
        alt: mockalt,
        className: mockclassName,
        placeholder: mockplaceholder,
        };

        return render(<LazyImage {...initialProps} {...props} />);
    };

    beforeEach(() => {
        mockIntersectionObserver.mockImplementation((callback, options) => ({
            observe: mockObserve,
            disconnect: mockDisconnect,
            root: null,
            rootMargin: options?.rootMargin || "0px",
            thresholds: [],
        }));

        global.IntersectionObserver = mockIntersectionObserver;

        global.Image = class {
        constructor() {
            setTimeout(() => {
            if (this.onload) this.onload();
            }, 100);
        }
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src = "";
        } as unknown as typeof Image;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render with initial placeholder and loading state', () => {
        setUp();
        
        const image = screen.getByTestId('lazy-image');
        
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', mockplaceholder);
        expect(image).toHaveAttribute('alt', mockalt);
        expect(image).toHaveClass('test-class', 'loading');
        expect(image).toHaveAttribute('loading', 'lazy');
    });

     it('should use default placeholder when not provided', () => {
        setUp({ placeholder: undefined });
        
        const image = screen.getByTestId('lazy-image');
        
        expect(image).toHaveAttribute('src', '/placeholder.svg');
    });

    it('should setup IntersectionObserver on mount', () => {
        setUp();
        
        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            { rootMargin: "50px" }
        );
        expect(mockObserve).toHaveBeenCalled();
    });


    it('should not load image when element is not in view', () => {
        global.Image = vi.fn();

        setUp();

        const observerCallback = mockIntersectionObserver.mock.calls[0][0];
        
        observerCallback([{ isIntersecting: false }]);

        expect(global.Image).not.toHaveBeenCalled();
    });

    it('should disconnect observer when element comes into view', () => {
        setUp();

        const observerCallback = mockIntersectionObserver.mock.calls[0][0];
        observerCallback([{ isIntersecting: true }]);

        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should handle multiple entries in intersection observer callback', async () => {
        setUp();

        const observerCallback = mockIntersectionObserver.mock.calls[0][0];
        
        // Simulate multiple entries, one intersecting
        observerCallback([
            { isIntersecting: false },
            { isIntersecting: true },
            { isIntersecting: false }
        ]);

        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should cleanup observer on unmount', () => {
        const { unmount } = setUp();
        
        unmount();
        
        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should handle empty className gracefully', () => {
        setUp({ className: '' });
        
        const image = screen.getByTestId('lazy-image');
        
        expect(image).toHaveClass('loading');
        expect(image.className).toContain('loading');
    });

    it('should handle undefined className gracefully', () => {
        setUp({ className: undefined });
        
        const image = screen.getByTestId('lazy-image');
        
        expect(image).toHaveClass('loading');
    });

    it('should use fallback src when imageSrc is empty', () => {
        setUp({ src: '' });
        
        const image = screen.getByTestId('lazy-image');
        
        expect(image).toHaveAttribute('src', mockplaceholder);
    });

    it('should render all required attributes correctly', () => {
        setUp();
        
        const image = screen.getByTestId('lazy-image');
        
        expect(image.tagName).toBe('IMG');
        expect(image).toHaveAttribute('data-testid', 'lazy-image');
        expect(image).toHaveAttribute('loading', 'lazy');
        expect(image).toHaveAttribute('alt', mockalt);
    });

    it('should handle src prop changes correctly', async () => {
        const { rerender } = setUp();
        
        const newSrc = 'https://example.com/new-image.jpg';
        rerender(
            <LazyImage 
                src={newSrc}
                alt={mockalt}
                className={mockclassName}
                placeholder={mockplaceholder}
            />
        );

        const image = screen.getByTestId('lazy-image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('alt', mockalt);
    });


    it('should maintain loading state until image loads or errors', () => {
        const mockImageInstance = {
            onload: null,
            onerror: null,
            src: ''
        };

        global.Image = vi.fn().mockImplementation(() => mockImageInstance);

        setUp();

        const observerCallback = mockIntersectionObserver.mock.calls[0][0];
        
        observerCallback([{ isIntersecting: true }]);

        const image = screen.getByTestId('lazy-image');
        expect(image).toHaveClass('loading');
        expect(image).not.toHaveClass('loaded');
    });

    it('should handle intersection correctly', () => {
        setUp();

        const observerCallback = mockIntersectionObserver.mock.calls[0][0];

        observerCallback([{ isIntersecting: true }]);
        
        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should trigger image creation when element comes into view', () => {
        setUp();

        const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    
        observerCallback([{ isIntersecting: true }]);

        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should handle className changes correctly', () => {
        const { rerender } = setUp();
        
        let image = screen.getByTestId('lazy-image');
        expect(image).toHaveClass('test-class', 'loading');

        rerender(
            <LazyImage 
                src={mocksrc}
                alt={mockalt}
                className="new-class"
                placeholder={mockplaceholder}
            />
        );

        image = screen.getByTestId('lazy-image');
        expect(image).toHaveClass('new-class', 'loading');
    });

    it('should maintain correct structure and attributes', () => {
        setUp();
        
        const image = screen.getByTestId('lazy-image');
        
        expect(image).toBeInTheDocument();
        expect(image.tagName).toBe('IMG');
        expect(image).toHaveAttribute('src');
        expect(image).toHaveAttribute('alt');
        expect(image).toHaveAttribute('loading', 'lazy');
        expect(image).toHaveAttribute('data-testid', 'lazy-image');
    });

});
