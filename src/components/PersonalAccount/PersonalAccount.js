import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Button from '../Button/Button';
import PersonalAccountCardStory from '../PersonalAccountCardStory/PersonalAccountCardStory';
import PopupStoryFriendship from '../PopupStoryFriendship/PopupStoryFriendship';
import './PersonalAccount.css';
import { profileStory } from '../../utils/serverApiTestConfig';
import CalendarCardProfile from '../CalendarCardProfile/CalendarCardProfile';
import Api from '../../utils/api';
import PopupCities from '../PopupCities/PopupCities';

const PersonalAccount = ({ onLogout, handleCalendarCardClick }) => {
  const [events, setEvents] = useState([]);
  // const [months, setMonths] = useState([]);
  useEffect(() => {
    Api.getEvents()
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => {
        console.log(`Error: Calendar get events ${err}`);
      });
  }, []);
  // Получаем данные календаря

  const [isPopupCitiesOpen, setIsPopupCitiesOpen] = useState(false);
  const [isPopupStoryOpen, setisPopupStoryOpen] = useState(false);
  const [storiesData, setStoriesData] = useState([]);

  useEffect(() => {
    setStoriesData(profileStory);
  }, []);
  const openPopupStory = () => {
    setisPopupStoryOpen(true);
  };
  const openPopupCities = () => {
    setIsPopupCitiesOpen(true);
  };
  const closePopup = () => {
    setisPopupStoryOpen(false);
    setIsPopupCitiesOpen(false);
  };
  const handlerSubmitDeletePopup = (cardId) => {
    const newArr = storiesData.filter((story, id) => id !== cardId);
    setStoriesData(newArr);
  };

  return (
    <section className="personal-account content">
      <div className="personal-account__buttons">
        <Button
          className="personal-account__feedback-btn personal-account__text"
          onClick={openPopupCities}
        >
          Изменить ваш город
        </Button>
        <Button
          className="personal-account__feedback-btn personal-account__text"
          onClick={onLogout}
        >
          Выйти
        </Button>
      </div>
      <div className="personal-account__events">
        <h2 className="personal-account__title">У вас нет записи на мероприятия</h2>
        <div className="personal-account__event">
          {events.map(
            (event) =>
              event.booked && (
                <CalendarCardProfile
                  event={event}
                  handleCalendarCardClick={handleCalendarCardClick}
                />
              )
          )}
        </div>
      </div>
      <div className="personal-account__add-meet">
        <Button
          className="button button_color_blue button_type_round"
          type="button"
          onClick={openPopupStory}
        />
        <Button className="button personal-account__meet-text" onClick={openPopupStory}>
          Добавить встречу
        </Button>
      </div>
      {isPopupStoryOpen ? (
        <PopupStoryFriendship
          closePopup={closePopup}
          storiesData={storiesData}
          setStoriesData={setStoriesData}
        />
      ) : (
        storiesData.map((story, id) => (
          <PersonalAccountCardStory
            cardStory={story}
            key={`${story}`}
            cardId={id}
            openPopup={openPopupStory}
            handlerSubmitDeletePopup={handlerSubmitDeletePopup}
          />
        ))
      )}
      {isPopupCitiesOpen ? <PopupCities onClose={closePopup} isOpen /> : ''}
    </section>
  );
};

export default PersonalAccount;

PersonalAccount.propTypes = {
  onLogout: PropTypes.func.isRequired,
  handleCalendarCardClick: PropTypes.func,
};

PersonalAccount.defaultProps = {
  handleCalendarCardClick: () => {},
};
