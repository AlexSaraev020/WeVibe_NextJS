import React from 'react'

interface tooltipProps {
    text: string
}

export default function Tooltip({ text }: tooltipProps) {
    return (
        <div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 border-2 w-max px-2 py-1 text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
        >
            {text}
        </div>
    )
}
