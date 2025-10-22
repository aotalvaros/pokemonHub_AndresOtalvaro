import type React from "react"
import "./styles/skeletonCard.css"

export const SkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-number"></div>
      <div className="skeleton-image-container">
        <div className="skeleton-image"></div>
      </div>
      <div className="skeleton-name"></div>
    </div>
  )
}

export default SkeletonCard
