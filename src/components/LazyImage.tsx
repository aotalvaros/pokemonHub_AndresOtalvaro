import type React from "react"
import { useState, useEffect, useRef } from "react"

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, placeholder = "/placeholder.svg" }) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder)
  const [isLoading, setIsLoading] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: "50px",
      },
    )

    observer.observe(imgRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isInView) return

    const img = new Image()
    img.src = src

    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }

    img.onerror = () => {
      setImageSrc(placeholder)
      setIsLoading(false)
    }
  }, [isInView, src, placeholder])

  return (
    <img
      ref={imgRef}
      src={imageSrc || "/placeholder.svg"}
      alt={alt}
      className={`${className} ${isLoading ? "loading" : "loaded"}`}
      loading="lazy"
      data-testid="lazy-image"
    />
  )
}
