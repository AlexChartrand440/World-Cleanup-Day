import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  TextInput
} from 'react-native';
import { FormInput } from 'react-native-elements';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { SimpleLineIcons } from '@expo/vector-icons';


import { Divider } from '../../components/Divider';
import { COUNTRIES_HASH } from '../../shared/countries';
import { withNavigationHelpers } from '../../services/Navigation';
import { operations as teamsOperations } from '../../reducers/teams';


import {
  selectors as userSels,
} from '../../reducers/user';

import {
  operations as teamsOps,
  selectors as teamsSels,
} from '../../reducers/teams';

import styles from './styles';

class Teams extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: undefined,
      teams: []
    };
  }

  componentWillMount() {
    this.props.clearTeams();
  }

  getFilteredTeams = async () => {
    const { search } = this.state;
    const { teams, fetchTeams } = this.props;

    if (search && search.length > 2) {
      const teams = await fetchTeams(search);
      this.setState({ teams });
    }
  };

  handleSearchChanged = (search) => {
    this.setState({ search });
  };

  handleTeamPress = team => {
    this.props.navigation.navigate('TeamProfile', { team });
  };

  render() {
    const { t, teams, loading } = this.props;
    const { search } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            onChangeText={this.handleSearchChanged}
            value={search}
            placeholder={t('label_text_search_placeholder')}
            maxLength={10}
            autoCorrect={false}
            underlineColorAndroid={'#fff'}
          />
          <TouchableOpacity style={styles.searchButton}
                            onPress={this.getFilteredTeams}>
            <SimpleLineIcons name={'magnifier'} size={16} color={'#3E8EDE'}/>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {loading
            ? <View style={styles.loadingContainer}>
              <ActivityIndicator/>
            </View>
            : <View style={styles.container}>
              {(teams && teams.length > 0) ? <ScrollView>
                  {teams.map(team => (
                    <View key={team.id}>
                      <TouchableHighlight
                        onPress={() => this.handleTeamPress(team)}
                        activeOpacity={0.7}
                        underlayColor="transparent"
                        key={team.id}>
                        <View style={styles.teamContainer}>
                          <View style={styles.teamIconContainer}>
                            <Image style={styles.teamIconImage}
                                   source={{ uri: team.image }}
                            />
                          </View>
                          <View style={styles.teamContentContainer}>
                            <View style={styles.teamTitleContainer}>
                              <Text style={styles.teamTitle}>
                                {team.name}
                              </Text>
                            </View>
                            <View style={styles.teamNameContainer}>
                              <Text style={styles.teamName}>
                                {team.CC ? COUNTRIES_HASH[team.CC] : t('label_text_global_team')}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.teamChevronContainer}>
                            <Image
                              style={styles.teamChevron}
                              source={require('../../assets/images/icon_menu_arrowforward.png')}
                            />
                          </View>
                        </View>
                      </TouchableHighlight>
                      <Divider/>
                    </View>
                  ))}
                </ScrollView> :
                <View style={styles.defaultContainer}>
                  <Text
                    style={styles.defaultTextHeader}>{t('label_text_search_for_a_team')}</Text>
                  <Text
                    style={styles.defaultTextDescription}>{t('label_text_work_together')}</Text>
                </View>}
            </View>
          }
        </View>
      </View>
    );
  }
}

const mapState = (state) => {
  return {
    team: userSels.getProfileTeam(state),
    teams: teamsSels.teamsSelector(state),
    loading: teamsSels.loadingSelector(state),
  };
};
const mapDispatch = {
  fetchTeams: teamsOperations.fetchTeams,
  clearTeams: teamsOperations.clearTeams,
};

export default compose(
  connect(mapState, mapDispatch),
  withNavigationHelpers(),
  translate(),
)(Teams);
