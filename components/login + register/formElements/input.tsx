import React from 'react'

interface InputProps {
    type: string
    name: string
    id: string
    placeholder: string
    required: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FormInput({ type, name, id, placeholder, required, onChange }: InputProps) {
    return (
        <>
            <label
                htmlFor={`${id}`}
                className='text-xl font-semibold focus:outline-none '
            >
                {name}*
            </label>
            <input
                className='bg-black border rounded-md placeholder-zinc-500 p-2 transition-all duration-500 focus:outline-4 focus:scale-x-105 '
                type={type}
                name={name}
                id={id}
                placeholder={placeholder}
                required={required}
                onChange={onChange}
            />
        </>

    )
}
