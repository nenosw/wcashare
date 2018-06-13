import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import DocumentsCollection from '../../../api/Documents/Documents';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';
import BlankState from '../../components/BlankState/BlankState';

const StyledDocuments = styled.div`
  table tbody tr td {
    vertical-align: middle;
  }
`;

const handleRemove = (documentId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('documents.remove', documentId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
      }
    });
  }
};

const Users = ({
  loading, userList,
}) => (!loading ? (
  <StyledDocuments>
    <div className="page-header clearfix">
      <h4 className="pull-left">Clients</h4>
    </div>
    {userList.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Created</th>
            <th>Roles</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {userList.map(({
            _id, createdAt, updatedAt, emails, profile, roles
          }) => (
            <tr key={_id}>
              <td>{emails[0].address}</td>
              <td>{profile.name.first} {profile.name.last}</td>
              <td>{monthDayYearAtTime(createdAt)}</td>
              <td>{roles.join(" ")}</td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => history.push(`${match.url}/${_id}`)}
                  block
                >
                  View
                </Button>
              </td>
              <td>
                <Button
                  bsStyle="danger"
                  onClick={() => handleRemove(_id)}
                  block
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <BlankState
        icon={{ style: 'solid', symbol: 'file-alt' }}
        title="There are no Users!"
        subtitle="How is that even possible, you shouldnt be able to see this!"
        action={{
          style: 'success',
          onClick: () => history.push(`${match.url}/new`),
          label: 'Create a User',
        }}
      />}
  </StyledDocuments>
) : <Loading />);

Users.propTypes = {
  userList: PropTypes.array,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('userList');
  return {
  	loading: !subscription.ready(),
    userList: Meteor.users.find().fetch(),
  };
})(Users);
