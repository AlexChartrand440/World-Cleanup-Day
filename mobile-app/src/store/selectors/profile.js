import { createSelector } from 'reselect';

//import { selectors as trashpileSelector } from '../trashpile';

import { COUNTRY_LIST, USER_ROLES } from '../../shared/constants';

const stateSelector = state => state.profile;

export const profileSelector = createSelector(stateSelector, state => state.profile);


export const getProfile = createSelector(profileSelector, profile => profile.entity);

export const isProfileLoading = createSelector(
  profileSelector,
  profile => profile.loading,
);

export const getProfileError = createSelector(
  profileSelector,
  profile => profile.error,
);

export const isProfileUpdating = createSelector(
  profileSelector,
  profile => profile.updating,
);

export const getUserProfileId = createSelector(
  getProfile,
  profile => (profile ? profile.id : undefined),
);

export const isOwnTrashpoint = createSelector(
  getUserProfileId,
  // trashpileSelector.getMarkerCreatorId,
  (userProfileId, markerCreatorId) => userProfileId === markerCreatorId,
);

export const getProfileCountry = createSelector(getProfile, (profile) => {
  if (!profile || !profile.country) {
    return undefined;
  }
  return COUNTRY_LIST.find(c => c.code === profile.country);
});

export const getRole = createSelector(getProfile, (profile) => {
  if (!profile) {
    return undefined;
  }
  return profile.role;
});

export const isLeader = createSelector(getRole, role => role === USER_ROLES.LEADER);

export const isSuperAdmin = createSelector(
  getRole,
  role => role === USER_ROLES.SUPERADMIN,
);

// export const getCachedLocation = () => undefined;
