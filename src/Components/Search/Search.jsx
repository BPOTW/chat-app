import "./Search.css"
import showMore from "../../assets/plus.svg"
import showLess from "../../assets/minus.svg"
import Search_icon from "../../assets/search.svg"
import Send from "../../assets/send.svg"
import { useState } from "react";
import { handleSendRequest, searchForId } from "../../Utils/SocketServices";
import { JoinedRoomId_G, SearchId_result_G, UserName_G } from "../../Utils/Store"

export default function Search() {
    const [collapseSearch, setCollapseSearch] = useState(false);
    const [searchInput, setsearchInput] = useState('');

    const userName = UserName_G((state) => state.userName);
    const id = SearchId_result_G((state) => state.id);
    const available = SearchId_result_G((state) => state.available);
    const { joinedRoomId, setjoinedRoomId } = JoinedRoomId_G((state) => state);

    function CollapseSearch() {
        setCollapseSearch(!collapseSearch);
    }

    function handleInputSearch(e) {
        setsearchInput(e.target.value)
    }

    function handleIdSearch(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            searchForId(searchInput);
        }
    }


    return (
        <>
            <div className='titles-div' onClick={CollapseSearch}>
                <h2 className="search-title settings-titles" >Search</h2>
                <img src={collapseSearch ? showMore : showLess} width={16} alt="" />
            </div>
            <div className={`search-div ${collapseSearch ? 'collapse-search' : 'show-search'}`} >
                <div className="search-bar" role="search">
                    <div className="search-icon"><img src={Search_icon} alt="" /></div>
                    <input
                        className="search-input"
                        type="search"
                        placeholder="Search friends..."
                        onChange={handleInputSearch}
                        onKeyDown={handleIdSearch}
                    />
                </div>
                {available ? (
                    <div className='searchResult textBox-div'>
                        {id}
                        <img
                            src={Send}
                            width={20}
                            className='sendRequest-icon'
                            onClick={() => handleSendRequest(userName, id, joinedRoomId)}
                            alt="Send Request"
                        />
                    </div>
                ) : (
                    
                    id !== "" ? (
                        <div className='searchResult textBox-div'>
                            ID Not Found
                        </div>
                    ) : (
                        <div></div>
                    )
                )}
            </div>
        </>
    )
}