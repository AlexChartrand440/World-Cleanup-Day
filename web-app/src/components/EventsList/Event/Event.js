import React, { Component } from 'react';
import * as moment from 'moment';
import classnames from 'classnames';
import {
  LocationIcon24px,
  GroupIcon24px,
  userpicHolder,
} from '../../../components/common/Icons';
import './Event.css';

export class Event extends Component {

  render() {
    const {
      avatar,
      title,
      author,
      location,
      numberOfParticipants,
      maxNumberOfParticipants,
      date
    } = this.props;
    const eventStatus = moment(date).isBefore(moment()) ?
    'Past' : 'Upcoming';
    return (
      <div>
        <div className="Event-item">
          <div className="Event-avatar">
            <img src={avatar || userpicHolder} alt="event-avatar" />
          </div>
          <div className="Event-details">
            <div className="Event-details-part1">
              <p className="Event-title Event-info">{title}</p>
              <p className="Event-creator Event-info">
                <GroupIcon24px />
                <span>{author}</span>
              </p>
              <p className={
                classnames('Event-status', 'Event-info', eventStatus)}
              >
                {eventStatus}
              </p>
              <p className="Event-location Event-info">
                <LocationIcon24px />
                <span>{location}</span>
              </p>
            </div>
            <div className="Event-details-part2">
              <p className="Event-fill Event-info">
                {`${numberOfParticipants}/${maxNumberOfParticipants}`}
              </p>
              <p className="Event-date Event-info">
                {moment(date).format('l')}
              </p>
            </div>
          </div>
        </div>
        <div className="Event-divider" />
      </div>
    );
  }
}
