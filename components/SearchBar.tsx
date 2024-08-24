import React from 'react'

function SearchBar() {

    return (
        <div className='w-44 h-10 border-[#D7D7D7] border-2 rounded-lg py-2 px-4 flex text-[#667085] font-semibold items-center'>
            <img src="/magnifier.png" className='mr-2 scale-75' alt="search bar" />
            Search Users
        </div>
    )
}

export default SearchBar
