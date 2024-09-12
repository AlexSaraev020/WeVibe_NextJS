import React from 'react'
import ShinyButton from '../buttons/shiny-button'
interface FormProps {
    register?: boolean
}
export default function Form({ register }: FormProps) {
    return (
        <form className='w-10/12 md:w-3/12 border flex flex-col items-center justify-center bg-black py-10 z-10'>
            <h2 className='text-3xl md:text-4xl mb-10'>{register ? 'Register' : 'Login'}</h2>

            <div className='w-full flex flex-col justify-center items-center gap-4'>
                {register &&
                    <div className='w-9/12 flex flex-col gap-1'>
                        <label
                            htmlFor="username"
                            className='text-xl font-semibold'
                        >
                            Username
                        </label>
                        <input
                            className='bg-black border rounded-md placeholder-zinc-500 p-2'
                            type="text"
                            name="username"
                            id="username"
                            placeholder='Enter your username'
                            required
                        />
                    </div>
                }
                <div className='w-9/12 flex flex-col gap-1'>
                    <label
                        htmlFor="email"
                        className='text-xl font-semibold'
                    >
                        Email
                    </label>
                    <input
                        className='bg-black border rounded-md placeholder-zinc-500 p-2'
                        type="email"
                        name="email"
                        id="email"
                        placeholder='Enter your email'
                        required
                    />
                </div>
                <div className='w-9/12 flex flex-col gap-1'>
                    <label
                        htmlFor="password"
                        className='text-xl font-semibold'
                    >
                        Password
                    </label>
                    <input
                        className='bg-black border rounded-md placeholder-zinc-500 p-2'
                        type="password"
                        name="password"
                        id="password"
                        placeholder='Enter your password'
                        required
                    />
                </div>
                <ShinyButton text={register ? 'Register' : 'Login'} />
            </div>
        </form>
    )
}
