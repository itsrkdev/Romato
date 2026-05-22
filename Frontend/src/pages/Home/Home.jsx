import React, { useContext, useState } from 'react'
import "./Home.css"
import Header from '../../componants/Header/Header'
import ExploreMenu from '../../componants/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../componants/FoodDisplay/FoodDisplay'
import AppDownload from '../../componants/AppDownload/AppDownload'
import { storeContext } from '../../context/StoreContext.jsx'


export default function Home() {
  const { url } = useContext(storeContext);
  const [category, setCategory] = useState('All');
  //  console.log(category);

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory } url={url}/>
      <FoodDisplay category={category} />
      <AppDownload/>

    </div>
  )
}

