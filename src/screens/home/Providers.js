import React, { Component } from 'react';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import { AppView, AppText, AppList } from '../../common';

import NoOrdersList from './NoOrdersList';
// import OrderItem from '../../components/orderItem/OrderItem';
import { API_ENDPOINT_FOOD_SERVICE } from '../../utils/Config';
import { ProviderCard } from '../../components';

class InProgress extends Component {
  state = {
    totalCount: 0,
  };

  renderList = () => {
    const { currentUser, activePage, index } = this.props;

    if (activePage !== index) return null;

    return (
      <>
        <AppList
          flatlist
          flex
          stretch
          marginTop={10}
          apiRequest={{
            url: `${API_ENDPOINT_FOOD_SERVICE}providers`,

            responseResolver: response => ({
                data: response.data.data,
                pageCount: response.data.pageCount,
              }),

            onError: error => {
              console.log(JSON.parse(JSON.stringify(error)));
              I18n.t('ui-error-happened');
            },
          }}
          data={this.state.data}
          rowRenderer={data => <ProviderCard data={data} />}
          noResultsComponent={<NoOrdersList />}
          refreshControl={this.props.homeList}
        />
      </>
    );
  };

  render() {
    return (
      <AppView flex stretch backgroundColor="#F2F2F2">
        {this.renderList()}
      </AppView>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  acceptedOrdersList: state.list.acceptedOrders,
});

export default connect(mapStateToProps)(InProgress);
