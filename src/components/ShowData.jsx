import React from 'react'

const ShowData = ({label,title}) => {
  return (
    <div>
        <p className="text-sm">{label}</p>
        <p className="font-semibold">{title}</p>
    </div>
  )
}

export default ShowData