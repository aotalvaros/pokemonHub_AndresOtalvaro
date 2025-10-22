import "./styles/validationPopup.css"

interface ValidationPopupProps {
  isOpen: boolean
  message: string
  onClose: () => void
}

export default function ValidationPopup({ isOpen, message, onClose }: ValidationPopupProps) {
  if (!isOpen) return null

  return (
    <div className="validation-popup-overlay" onClick={onClose}>
      <div className="validation-popup" onClick={(e) => e.stopPropagation()}>
        <div className="validation-popup-header">
          <h3>Error de Validación</h3>
          <button className="validation-popup-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="validation-popup-content">
          <div className="validation-icon">⚠️</div>
          <p>{message}</p>
        </div>
        <div className="validation-popup-footer">
          <button className="validation-popup-button" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
