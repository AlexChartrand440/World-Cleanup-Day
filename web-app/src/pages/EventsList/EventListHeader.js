import React from 'react';
import { connect } from 'react-redux';
import { LocationIcon, MinimizeIcon } from '../../components/common/Icons';
import { selectors } from '../../reducers/events';

const EventListHeader = ({
  onMinimizeClick,
  eventId,
  eventTitle,
  history,
}) => {

  return (
    <div className="EventsList-header">
      {
        !eventId ?
          <LocationIcon /> :
          <button
            className="EventsList-header-back"
            onClick={() => history.goBack()}
          >
            { '<' }
          </button>
      }
      {
        !eventId ?
          <input
            className="EventsList-header-searchbar"
            type="text"
            placeholder="Search location"
          /> :
          <span className="EventsList-header-title">{eventTitle}</span>
      }
      <div
        className="EventsList-header-minimize"
        onClick={() => onMinimizeClick()}
      >
        <MinimizeIcon />
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  eventTitle: selectors.getEventTitle(state, Number(ownProps.eventId) - 1 || 0),
});

export default connect(mapStateToProps)(EventListHeader);
