import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MainPageSection from '../MainPageSection/MainPageSection';
import FacebookPlugin from '../FacebookPlugin/FacebookPlugin';
import QuestionsContainer from '../QuestionsContainer/QuestionsContainer';
import MoviesContainer from '../MoviesContainer/MoviesContainer';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import CalendarCard from '../CalendarCard/CalendarCard';
import Intro from '../Intro/Intro';
import Story from '../Story/Story';
import MainVideo from '../MainVideo/MainVideo';
import Article from '../Article/Article';
import Place from '../Place/Place';
import Api from '../../utils/api';

export default function MainPage({
  mainData,
  handleCalendarCardClick,
  handleDeleteEvent,
  handleRegisterSubmit,
}) {
  const currentUser = useContext(CurrentUserContext);
  const [userEvent, setUserEvent] = useState(null);

  useEffect(() => {
    if (mainData) {
      Api.getEvents()
        .then((data) => {
          setUserEvent(data.sort((a, b) => new Date(b.startAt) - new Date(a.startAt))[0]);
        })
        .catch((err) => {
          console.log(`Error: MainPage get events ${err}`);
        });
    }
  }, [mainData]);

  return (
    <MainPageSection className="mainpage">
      <MainPageSection className="mainpage__intro">
        {currentUser && userEvent ? (
          <CalendarCard
            event={userEvent}
            handleCalendarCardClick={handleCalendarCardClick}
            handleRegisterSubmit={handleRegisterSubmit}
            handleDeleteEvent={handleDeleteEvent}
          />
        ) : (
          <Intro />
        )}
        {/* <Intro /> */}
        <Story history={mainData?.history} isStoryPage={false} />
      </MainPageSection>
      <MainPageSection className="mainpage__blocks">
        <Place place={mainData?.place} size="big" />
      </MainPageSection>
      <MainPageSection className="mainpage__block">
        <Article article={mainData?.articles[0]} />
      </MainPageSection>
      <MainPageSection className="mainpage__block">
        <MoviesContainer movies={mainData?.movies} />
      </MainPageSection>
      <MainPageSection className="mainpage__blocks">
        <MainVideo video={mainData?.video} />
      </MainPageSection>
      <MainPageSection className="mainpage__blocks-col">
        <FacebookPlugin />
        <QuestionsContainer questions={mainData?.questions} place="main" />
      </MainPageSection>
      <MainPageSection className="mainpage__block">
        <Article article={mainData?.articles[1]} />
      </MainPageSection>
    </MainPageSection>
  );
}

MainPage.propTypes = {
  mainData: PropTypes.objectOf(PropTypes.any),
  handleCalendarCardClick: PropTypes.func.isRequired,
  handleDeleteEvent: PropTypes.func.isRequired,
  handleRegisterSubmit: PropTypes.func.isRequired,
};

MainPage.defaultProps = {
  mainData: {},
};
