import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Card } from '@folio/stripes-erm-components';
import { Accordion, Badge, Icon, Layout, MultiColumnList } from '@folio/stripes/components';

export default class Organizations extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      attachedLicenceId: PropTypes.string,
      orgs: PropTypes.arrayOf(
        PropTypes.shape({
          org: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string.isRequired,
            orgsUuid: PropTypes.string,
          }).isRequired,
          role: PropTypes.shape({
            label: PropTypes.string.isRequired,
          }).isRequired,
        }),
      ),
    }).isRequired,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    organizations: PropTypes.object,
    open: PropTypes.bool,
  };

  renderOrgList = () => {
    const { organizations } = this.props;
    const interpunct = ' · ';
    return (
      <React.Fragment>
        {organizations && organizations.map(o => {
          const interfaces = get(o, ['org', 'interfaces'], []);
          return (
            o.org ?
              <Card
                data-test-organizations-org
                key={`${o.org.id}-${o.role.value}`}
                header={
                  <span className="my-card-header">
                    {
                      o.org.orgsUuid ?
                        <span>
                          <Link to={`/organizations/view/${o.org.orgsUuid}`}>
                            {o.org.name}
                          </Link>
                          {interpunct}
                          {o.role.label}
                        </span>
                        : o.org.name
                    }
                  </span>
                }
              >
                {interfaces && interfaces.length ?
                  <MultiColumnList
                    contentData={interfaces}
                    visibleColumns={['name', 'uri', 'username', 'password', 'type']}
                    columnMapping={{
                      name: <FormattedMessage id="ui-agreements.interface.name" />,
                      uri: <FormattedMessage id="ui-agreements.interface.uri" />,
                      username: <FormattedMessage id="ui-agreements.interface.username" />,
                      password: <FormattedMessage id="ui-agreements.interface.password" />,
                      type: <FormattedMessage id="ui-agreements.interface.type" />,
                    }}
                    columnWidths={{
                      name: 150,
                      uri: 250,
                      username: 130,
                      password: 130,
                      type: 150,
                    }}
                  /> : <FormattedMessage id="ui-agreements.interface.notFound" />}
              </Card> : null
          );
        })}
      </React.Fragment>
    );
  }

  renderOrganizations = () => {
    const { orgs } = this.props.agreement;
    if (!orgs || !orgs.length) return <FormattedMessage id="ui-agreements.organizations.agreementHasNone" />;
    return this.renderOrgList();
  }

  renderBadge = () => {
    const count = get(this.props.agreement, ['orgs', 'length']);
    return count !== undefined ? <Badge>{count}</Badge> : <Icon icon="spinner-ellipsis" width="10px" />;
  }

  render() {
    return (
      <Accordion
        id={this.props.id}
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        label={<FormattedMessage id="ui-agreements.agreements.organizations" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Layout className="padding-bottom-gutter">
          {this.renderOrganizations()}
        </Layout>
      </Accordion>
    );
  }
}
