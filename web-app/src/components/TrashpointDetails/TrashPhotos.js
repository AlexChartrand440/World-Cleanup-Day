import React from 'react';
import Dropzone from 'react-dropzone';
import Swiper from 'react-id-swiper';
import { noop } from '../../shared/helpers';
import { CloseIcon } from '../common/Icons';
import './TrashPhotos.css';

const swiperOptions = (if1slide, if2slides) => {
  if (if1slide) {
    return {
      slidesPerView: 1,
      centeredSlides: true,
    };
  }
  if (if2slides) {
    return {
      slidesPerView: 2,
      centeredSlides: false,
      spaceBetween: 40,
    };
  }
  return {
    slidesPerView: 2,
    centeredSlides: false,
    spaceBetween: 40,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };
};

const TrashPhotos = ({ photos, canEdit, onAddClick, onDeleteClick }) =>
  (<div className="TrashPhotos">
    <span className="TrashPhotos-title">Trash photos</span>
    <div className="TrashPhotos-images-container">
      {onAddClick &&
        <div
          style={{
            cursor: 'pointer',
          }}
        >
          <Dropzone
            style={{
              width: '121px',
              height: '86px',
              border: '2px dashed #a4c7f0',
              backgroundColor: '#f6f8f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '10px',
              marginRight: '10px',
            }}
            multiple={false}
            onDrop={onAddClick}
            accept="image/*"
          >
            <div
              style={{
                fontSize: '14px',
                color: '#a4c7f0',
                margin: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
              }}
            >
              <p style={{ textAlign: 'center' }}>Add photos</p>
            </div>
          </Dropzone>
        </div>}
      {
        onAddClick ?
        photos.map((photo, index) =>
          (<div key={photo} className="TrashPhotos-img-container-create">
            <img src={photo} alt="" />
            {canEdit &&
              <button onClick={() => onDeleteClick(index)}>
                <CloseIcon />
              </button>}
          </div>),
        ) :
        <Swiper {...swiperOptions(photos.length === 1, photos.length === 2)}>
          {photos.map((photo, index) =>
            (<div key={photo} className="TrashPhotos-img-container">
              <img src={photo} alt="" />
              {canEdit &&
                <button onClick={() => onDeleteClick(index)}>
                  <CloseIcon />
                </button>}
            </div>),
          )}
        </Swiper>
      }
    </div>
  </div>);

TrashPhotos.defaultProps = {
  photos: [],
  onDeleteClick: () => noop,
  onAddClick: null,
  canEdit: false,
};
export default TrashPhotos;
