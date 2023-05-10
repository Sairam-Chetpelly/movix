import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { fetchDataFromApi } from './utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { getApiConfiguration, getGenres } from './store/homeSlice';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Details from './pages/details/Detalis';
import SearchResult from './pages/searchResult/SearchResult';
import Explore from './pages/explore/Explore';
import PageNotFound from './pages/404/PageNotFound';


function App() {

  const dispatch = useDispatch()
  const { url } = useSelector((state) => state.home);
  // console.log(url)

  useEffect(() => {
    testapi();
    genressCall();
  }, [])

  function testapi() {
    fetchDataFromApi('/configuration').then((resp) => {
      // console.log(resp);

      const url = {
        backdrop: resp.images.secure_base_url + "original",
        poster: resp.images.secure_base_url + "original",
        profile: resp.images.secure_base_url + "original",
      }

      dispatch(getApiConfiguration(url));
    })
  }

  const genressCall = async () => {
    let promises = []
    let endPoints = ["tv", "movie"]
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`))
    })

    const data = await Promise.all(promises);
    // console.log(data);
    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });
    // console.log(allGenres);
    dispatch(getGenres(allGenres));
  }

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' Component={Home} />
          <Route path='/:mediaType/:id' Component={Details} />
          <Route path='/search/:query' Component={SearchResult} />
          <Route path='/explore/:mediaType' Component={Explore} />
          <Route path='*' Component={PageNotFound} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </>
  )
}

export default App
