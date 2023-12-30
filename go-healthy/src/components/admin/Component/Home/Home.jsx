import React from 'react';
import ItemLists from '../ItemLists/ItemLists';

import ProgressBar from '../ProgressBar/ProgressBar';
import Sidebar from '../Sidebar/Sidebar';
import TableList from '../Product/Product';
import './Home.scss';

function Home() {
    return (
        <div className="home">
            <div className="home_sidebar">
                <Sidebar />
            </div>

            <div className="home_main">
            
                <div className="bg_color" />

                <div className="home_items">
                    <ItemLists type="user" />
                    <ItemLists type="admin" />
                    <ItemLists type="orders" />
                    <ItemLists type="products" />
                    <ItemLists type="delivery" />
                </div>

                
            </div>
        </div>
    );
}

export default Home;
