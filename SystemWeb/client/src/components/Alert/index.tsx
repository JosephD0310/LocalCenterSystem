import { faCircleCheck, faCircleXmark, faCircleInfo, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type AlertProps = {
  object: string
  content: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const typeStyles = {
  success: 'bg-green-100 text-green-800 border-green-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
}


const typeIcons = {
  success: faCircleCheck,
  error: faCircleXmark,
  info: faCircleInfo,
  warning: faTriangleExclamation,
}

function Alert({ object, content, type }: AlertProps) {
  return (
    <div
      className={`flex flex-row gap-5 items-center border-l-4 rounded-md p-4 mb-4 text-2xl ${typeStyles[type]}`}
      role="alert"
    >
      <FontAwesomeIcon icon={typeIcons[type]} />
      <div>
        <p><span className="font-bold">{object}</span> - {content}</p>
        <p className="text-xl text-gray-500 mt-2">2 phút trước</p>
      </div>
    </div>
  )
}

export default Alert
