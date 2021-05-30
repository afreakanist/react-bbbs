import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Content from '../Content/Content';
import Api from '../../utils/api';
import './App.css';

import CurrentUserContext from '../../contexts/CurrentUserContext';
import AuthPopup from '../AuthPopup/AuthPopup';
import PopupMeet from '../PopupMeet/PopupMeet';
import PopupConfirmRegister from '../PopupConfirmRegister/PopupConfirmRegister';
import PopupRegisterSuccess from '../PopupRegisterSuccess/PopupRegisterSuccess';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import PopupPlaces from '../PopupPlaces/PopupPlaces';
import PopupCities from '../PopupCities/PopupCities';

function App() {
  const [events, setEvents] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [unauthСity, setUnauthСity] = useState('');
  const [mainData, setMainData] = useState(null);
  const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);
  const [isConfirmRegisterModalOpened, setIsConfirmRegisterOpened] = useState(false);
  const [isRegisterSuccessModalOpened, setIsRegisterSuccessModalOpened] = useState(false);
  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);
  const [isPlacePopupOpened, setIsPlacePopupOpened] = useState(false);
  const [selectedCalendarCard, setSelectedCalendarCard] = useState(null);
  const [selectedConfirmCalendarCard, setSelectedConfirmCalendarCard] = useState(null);
  const [cities, setCities] = useState([]);
  const history = useHistory();

  useEffect(() => {
    Api.getCities()
      .then((cittiesData) => {
        setCities(cittiesData);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, []);

  const updateCity = (city) => {
    if (currentUser) {
      Api.updateUserInfo({
        city,
        id: currentUser.id,
        user: currentUser.user,
      })
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((err) => console.log(err));
    } else {
      setUnauthСity(city);
    }
  };
  // Выбираем город пользователя !

  const openAuthModal = () => {
    setIsAuthModalOpened(true);
  };

  const closeAllModal = () => {
    setIsAuthModalOpened(false);
    setIsConfirmRegisterOpened(false);
    setIsRegisterSuccessModalOpened(false);
    setIsPlacePopupOpened(false);
    setSelectedCalendarCard(null);
    setIsPopupCitiesOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jwt');
    Api.removeAuthHeader();
    // localStorage.removeItem('jwtRefresh');
    history.push('/');
  };
  const handleSubmitAuth = (userName, password) => {
    Api.login({ userName, password })
      .then((data) => {
        if (data.refresh && data.access) {
          Api.setAuthHeader(data.access);
          localStorage.setItem('jwt', data.access);
          // localStorage.setItem('jwtRefresh', data.refresh);
          Promise.all([Api.getUserInfo(), Api.getEvents()]).then(([userData, eventsData]) => {
            setCurrentUser({ userName, ...userData });
            setEvents(eventsData);
            closeAllModal();
          });
        }
      })
      .catch((err) => {
        console.log(`Error ошибка: ${err}`);
      });
  };

  const openPopupCities = () => {
    setIsPopupCitiesOpen(true);
  };

  const handleCalendarCardClick = (calendarCard) => {
    setSelectedCalendarCard(calendarCard);
  };

  const handleRegisterSubmit = (calendarCard) => {
    setSelectedConfirmCalendarCard(calendarCard);
    setIsConfirmRegisterOpened(true);
  };

  const handleConfirmRegisterSubmit = (calendarCard) => {
    Api.updateEvent(calendarCard)
      .then((data) => {
        setEvents(events.map((e) => (e.id === data.id ? data : e)));
        //  setIsRegisterSuccessModalOpened(true);
        closeAllModal();
      })
      .catch((err) => {
        console.log(`Error ошибка: ${err}`);
      });
  };

  const handleDeleteEvent = (calendarCard) => {
    Api.updateEvent(calendarCard)
      .then((data) => {
        setEvents(events.map((e) => (e.id === data.id ? data : e)));
        //  setIsRegisterSuccessModalOpened(true);
        closeAllModal();
      })
      .catch((err) => {
        console.log(`Error ошибка: ${err}`);
      });
  };

  const handleRecommentdPlace = () => {
    setIsPlacePopupOpened(true);
  };

  useEffect(() => {
    // const jwt = localStorage.getItem('jwt');
    // if (jwt) {
    //   Api.setAuthHeader(jwt);
    //   setCurrentUser(userName);
    // }

    Api.getMain()
      .then((data) => {
        setMainData(data);
      })
      .catch((err) => {
        console.log(`Error: ошибка ${err}`);
      });
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <ScrollToTop />
      <Header openAuthModal={openAuthModal} />
      <Content
        mainData={mainData}
        openAuthModal={openAuthModal}
        onLogout={logout}
        handleCalendarCardClick={handleCalendarCardClick}
        handleRegisterSubmit={handleRegisterSubmit}
        handleDeleteEvent={handleDeleteEvent}
        onRecommendPlace={handleRecommentdPlace}
        events={events}
        cities={cities}
        updateCity={updateCity}
        openPopupCities={openPopupCities}
        unauthСity={unauthСity}
      />
      <Footer />

      {isAuthModalOpened && (
        <AuthPopup closeAuthModal={closeAllModal} submitModal={handleSubmitAuth} />
      )}
      {selectedCalendarCard && (
        <PopupMeet
          closeModal={closeAllModal}
          selectedCalendarCard={selectedCalendarCard}
          handleRegisterSubmit={handleConfirmRegisterSubmit}
          handleDeleteEvent={handleDeleteEvent}
        />
      )}
      {isConfirmRegisterModalOpened && (
        <PopupConfirmRegister
          closeModal={closeAllModal}
          selectedConfirmCalendarCard={selectedConfirmCalendarCard}
          handleConfirmRegisterSubmit={handleConfirmRegisterSubmit}
        />
      )}
      {isPlacePopupOpened && <PopupPlaces onClose={closeAllModal} />}
      {isRegisterSuccessModalOpened && <PopupRegisterSuccess closeModal={closeAllModal} />}
      {isPopupCitiesOpen && (
        <PopupCities
          onClose={closeAllModal}
          updateCity={updateCity}
          cities={cities}
          currentUser={currentUser}
        />
      )}
    </CurrentUserContext.Provider>
  );
}

export default App;
