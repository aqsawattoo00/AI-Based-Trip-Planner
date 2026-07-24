
import React from "react"

const InputField = React.forwardRef(function({type, id, placeholder, error, ...rest}, ref){
    return(
        <div className="relative">
            <input 
                type={type} 
                id={id} 
                placeholder={placeholder}
                {...rest} 
                ref={ref}
                className={`
                    w-full px-5 py-4
                    bg-white dark:bg-gray-800
                    border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                    rounded-xl
                    text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-400
                    focus:outline-none focus:ring-2
                    ${error ? 'focus:ring-red-500/30 focus:border-red-500' : 'focus:ring-pink-500/30 focus:border-pink-500 dark:focus:border-pink-400'}
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                `}
            />
            
            {error && (
                <div className="mt-2 flex items-center gap-2">
                    {/* <svg 
                        className="w-4 h-4 text-red-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                            clipRule="evenodd" 
                        />
                    </svg> */}
                    <span className="text-sm text-red-600 dark:text-red-400">
                        {error}
                    </span>
                </div>
            )}
        </div>
    )
})

export default React.memo(InputField)